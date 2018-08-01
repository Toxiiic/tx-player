<template>
  <div class="player" v-if="curIndex != -1">

    <!-- fullscreen -->
    <transition name="fade">
      <div class="fullscreen-player" v-show="fullscreen">
        <!-- 播放列表 -->
        <transition name="fade">
          <div class="cur-list-wrapper" @click="toggleCurList" v-show="showingCurList">
            <div class="cur-list" @click.stop>
              <div class="bold title">播放列表</div>
              <song-list :list="defaultSongs" :songs="curList" :show-cover="false"></song-list>
            </div>
          </div>
        </transition>

        <progress-controller
          :currentTime="currentTime"
          :duration="duration"
          @timeChange="onTimeChange"></progress-controller>

        <!-- fullscreen switch -->
        <div>
          <span class="switch-fs fa fa-chevron-circle-down" @click="setFullscreen(false)"></span>
        </div>

        <!-- album cover -->
        <transition name="fade">
          <div v-show="!showingLyric" @click="showingLyric=true">
            <img class="album-cover" :src="curSong.picUrl">
          </div>
        </transition>

        <!-- lyric -->
        <transition name="fade">
          <LyricPanel v-show="showingLyric" @click="showingLyric=false"
            :currentTime="currentTime"
            :lrcs="lrcs" ></LyricPanel>
        </transition>

        <!-- main info -->
        <div class="main-info">
          <div>
            <span class="name">{{curSong.name}}</span>
            <span class="fav-btn fa"
              @click="onClickToggleCurSongFav"
              :class="{'fa-heart-o': !isCurSongFavFake, 'fa-heart': isCurSongFavFake}"></span>
          </div>
          <div class="artists">{{curSong.artists[0].name}}</div>
        </div>

        <!-- controllers -->
        <div class="contollers">
          <span class="fa fa-list-ol"
            @click="toggleCurList"></span>
          <span class="fa fa-step-backward"></span>
          <span class="fa fa-play"
            @click="togglePlaying"
            :class="{'fa-pause': playing, 'fa-play': !playing}"></span>
          <span class="fa fa-step-forward"></span>
          <span class="fa"
            :class="'fa-'+this.seqMode"
            @click="toggleSeqMode"></span>
        </div>
      </div>
    </transition>

    <!-- mini -->
    <transition name="fade">
      <div class="mini" v-show="!fullscreen" @click="setFullscreen(true)">
          <img class="album-cover" :src="curSong.picUrl">
          <div class="detail">
            <div class="name">{{curSong.name}}</div>
            <div class="artist">{{curSong.artists[0].name}}</div>
          </div>
          <div>

          </div>
      </div>
    </transition>

    <audio ref="audio" :src="curSong.url" autoplay @timeupdate="onTimeUpdate"></audio>
  </div>
</template>

<script>
/**
 * 渲染完成前拿不到audio，无法得到长度
 * 渲染完成后音频加载前依然得不到长度
*/
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import ProgressController from './ProgressController'
import SongList from './SongList'
import LyricPanel from './LyricPanel'
import axios from 'axios'
import {getLyricBySongId} from '../api/api'

const SeqMode = {
  Single: 'repeat',
  Sequently: 'sort-amount-desc',
  Randomly: 'random'
}

export default {
  name: 'player',
  data () {
    return {
      currentTime: 0,
      duration: 0,
      lrcs: [],
      showingLyric: false,
      isCurSongFavFake: false,
      showingCurList: false,
      seqMode: SeqMode.Single
    }
  },
  components: {
    ProgressController,
    LyricPanel,
    SongList
  },
  computed: {
    ...mapGetters([
      'curSong',
      'playing',
      'curIndex',
      'fullscreen',
      'isCurSongFav',
      'curList',
      'defaultSongs'
    ])
  },
  methods: {
    toggleCurList () {
      this.showingCurList = !this.showingCurList
    },
    toggleSeqMode () {
      //找到当前播放模式下标，+1后取余长度就是新的
      let curModeIndex = Object.values(SeqMode).indexOf(this.seqMode)
      this.seqMode = Object.values(SeqMode)[(curModeIndex + 1) % Object.keys(SeqMode).length]
    },
    onTimeUpdate () {
      this.currentTime = this.$refs.audio.currentTime
      //如果已经结束了，但是并没有暂停，那就调用audio播放，否则不会播放
      //但也会导致最终停止时自动开始play
      if(this.$refs.audio.ended && this.playing) {
        this.$refs.audio.play()
      }
    },
    onTimeChange (newTime) {
      this.$refs.audio.currentTime = newTime
    },
    toggleShowingLyric () {
      this.showingLyric = !this.showingLyric
    },
    onClickToggleCurSongFav () {
      this.toggleCurSongFav()
      //收藏假象
      this.isCurSongFavFake = ! this.isCurSongFavFake
    },
    parseSecond (lrcTime) {
        return lrcTime.substr(0, 2) * 60
            + lrcTime.substr(3, 2) * 1
            + lrcTime.substr(6, 3) * .001
    },
    ...mapMutations ([
      'setCurSong',
      'setFullscreen'
    ]),
    ...mapActions ([
      'togglePlaying',
      'toggleCurSongFav'
    ])
  },
  watch: {
    /* 只要playing为true，就播放 */
    playing (newVal) {
      if(this.$refs.audio) {
        newVal ? this.$refs.audio.play() : this.$refs.audio.pause()
      }
    },
    curSong () {
      //写在watch里确保这个player show了
      //nextTick确保页面渲染完了，可以$ref.audio
      //ondurationchange确保audio.duration可以拿到
      let player = this
      this.$nextTick(function(){
        this.$refs.audio.ondurationchange = function () {
          player.duration = this.duration
        }
      })
      //加载歌词
      getLyricBySongId(this.curSong.id).then(res => {
        this.lrcs = []

        res.data.lrc.lyric.split('\n').forEach(rowString => {
          if(rowString.includes(']')) {
            this.lrcs.push({
              // time: this.parseSecond(rowString.substr(1, 9)),
              // text: rowString.slice(11)
              time: this.parseSecond(rowString.split(']')[0].slice(1)),
              text: rowString.split(']')[1].trim()
            })
          }
        });
        console.log(this.lrcs)
      })
    },
    isCurSongFav (newVal) {
      this.isCurSongFavFake = newVal
    }
  }
}
</script>


<style lang="scss">
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  height: 100%;
  width: 100%;

  .cur-list-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    background: #00000050;

    .cur-list {
      border-radius: 10px;
      background: white;
      height: 70%;
      position: absolute;
      bottom: 0;
      width: 100%;

      .title {
        padding: 15px 23px 0;
        text-align: left;
      }
    }
  }

  .switch-fs {
    color: black;
    opacity: .5;
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 25px;
    z-index: 10;
  }

  .album-cover {
    width: 100%;
  }

  .main-info {
    text-align: left;
    font-family: inherit;
    padding: 15px;

    .name {
      font-weight: bolder;
      font-size: 22px;
    }
    .fav-btn {
      float: right;
      font-size: 22px;
      margin-right: 34px;
    }
    .artists {
      font-size: 14px;
    }
  }

  .contollers {
    position: fixed;
    width: 100%;
    bottom: 45px;
    
    .fa {
      width: 18%;
      font-size: 21px;
    }
    .fa-play {
      font-size: 26px;
    }
  }
  
}


.mini {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    border-top: 1px solid #ecebef;
    text-align: left;

    .album-cover {
      width: 60px;
      vertical-align: middle;
    }
    .detail {
      padding: 0 10px;
      vertical-align: middle;
      display: inline-block;

      .name {
        font-weight: bold;
      }
      .artist {

      }
    }
}



</style>
