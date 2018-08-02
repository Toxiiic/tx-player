<template>
    <transition name="slide-l">

    <div class="search-view">
        <div style="text-align:left">
            <span @click="goBack" class="fa fa-angle-left go-back-btn"></span>
            <input class="search-input" type="text" v-model="queryStr">
        </div>
        <!-- 建议：歌手 -->
        <div v-if="searchSuggest.artists != undefined">
            <div class="result-title">Singer</div>
            <router-link to="/artist" class="result-singer">
                <img :src="searchSuggest.artists[0].picUrl" alt="">
                <div class="name">{{searchSuggest.artists[0].name}}</div>            
            </router-link>
        </div>
        <!-- 建议：专辑 -->
        <div v-if="searchSuggest.albums != undefined"
            >
            <div class="result-title">Album</div>
            <div class="result-album">
                <div class="name">{{searchSuggest.albums[0].name}}</div>
                <div class="date">{{new Date(searchSuggest.albums[0].publishTime)}}</div>
            </div>
        </div>
        <!-- 搜索结果列表 -->
        <div v-if="searchSongs.length > 0">
            <div class="result-title" style="margin-bottom: -20px;">Songs</div>
            <song-list :list="defaultSongs" :songs="searchSongs"></song-list>
        </div>
        <!-- <ul>
            <li v-for="(song, index) in searchSongs" :key="index" @click="playSong(song)">
                <div>{{song.name}}</div>
                <div>{{song.artists[0].name}}</div>
            </li>
        </ul> -->
        
    </div>
    </transition>

</template>

<script>
import axios from 'axios'
import SongList from '../components/SongList'
import { mapGetters, mapMutations } from 'vuex'

export default {
    data () {
        return {
            queryStr: '',
            searchSuggest: {},
            searchSongs: []
        }
    },
    components: {
        SongList
    },
    watch: {
        queryStr (newVal) {
            axios.get('http://localhost:3000/search?keywords='+newVal).then(res => {
                if(res.data.result == undefined || res.data.result.songCount==0) {
                    this.searchSongs = []
                } else {
                    this.searchSongs = res.data.result.songs
                }
            })
            axios.get('http://localhost:3000/search/suggest?keywords='+newVal).then(res => {
                if(res.data.result == undefined) {
                    this.searchSuggest = {}
                } else {
                    this.searchSuggest = res.data.result
                    console.log(this.searchSuggest)
                }
            })
        }
    },
    computed: {
        ...mapGetters([
            'playedSongs',
            'defaultSongs'
        ])
    },
    methods: {
        viewSinger () {
            // this.$router.push()
        },
        viewAlbum () {

        },
        goBack () {
            this.$router.go(-1)
        },
        ...mapMutations([
            'setPlaying',
            'addPlayedSong',
            'setCurIndexAndList',
            'setFullscreen'
        ])
    }
}
</script>

<style lang="scss">
@import "@/common/common.scss";

.search-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    height: 100%;
    text-align: left;

    .fa-angle-left {
        font-size: 26px;
        width: 10%;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
    }

    .search-input {
        vertical-align: middle;
        background: #f2f2f5;
        color: inherit;
        font-family: inherit;
        border-radius: 100px;
        box-sizing: border-box;
        width: 81%;
        margin: 6px;
        border: none;
        font-size: 15px;
        padding: 8px 14px;
    }

    .result-title {
        padding: 8px 20px;
        font-size: 12px;
        font-weight: bold;
        margin-top: 15px;
        color: $color-active;
    }
    .result-singer {
        padding-left: 20px;

        img {
            width: 80px;
            vertical-align: middle;
        }
        .name {
            display: inline-block;
            color: $color-dark;
            font-weight: bold;
            padding-left: 20px;
            vertical-align: middle;
        }
    }
    .result-album {
        padding-left: 20px;
        .name {
            font-weight: bold;
        }
        .date {

        }
    }
}
</style>
