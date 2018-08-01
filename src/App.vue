<template>
  <div id="app">
    <router-link tag="div" to="/search" class="search-btn-wrapper">
      <span class="fa fa-search search-btn"></span>
    </router-link>
    <div class="tabs">
      <span class="tab" @click="showFavTab" :class="{active: tabFav}">收藏</span>
      <span class="tab" @click="showPlayedTab" :class="{active: !tabFav}">最近播放</span>
    </div>

    <song-list :list="favSongs" :songs="favSongs" v-show="tabFav"></song-list>
    <song-list :list="defaultSongs" :songs="playedSongs" v-show="!tabFav"></song-list>
   
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
import Player from './components/Player'
import SongList from './components/SongList'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Player,
    SongList
  },
  data () {
    return {
      tabFav: true,
      curTabSongs: []
    }
  },
  mounted () {

    let playedSongs = JSON.parse(window.localStorage.getItem('playedSongs'))
    let favSongs = JSON.parse(window.localStorage.getItem('favSongs'))
    let defaultSongs = JSON.parse(window.localStorage.getItem('defaultSongs'))
    if(playedSongs != null) this.setPlayedSongs(playedSongs)
    if(favSongs != null) this.setFavSongs(favSongs)
    if(defaultSongs != null) this.setDefaultSongs(defaultSongs)

    this.showFavTab()
  },
  computed: {
    ...mapGetters([
      'favSongs',
      'defaultSongs',
      'playedSongs'
    ])
  },
  methods: {
    showFavTab () {
      // this.curTabSongs = this.favSongs
      this.tabFav = true
    },
    showPlayedTab () {
      // this.curTabSongs = this.playedSongs
      this.tabFav = false
    },
    ...mapMutations([
      'setFavSongs',
      'setPlayedSongs',
      'setDefaultSongs'
    ])
  }
}
</script>


<style lang="scss">
// @;
body {
  margin: 0;
}
ul {
  padding: 0;
}
li {
  list-style: none;
}
.go-back-btn {
  font-size: 30px;
}
.bold {
  font-weight: bolder;
}

/* transitions */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity .6s ease;
}
.fade-leave {

}
.fade-leave-active {
  transition: opacity .6s ease;
  opacity: 0;
}

.slide-l-enter {
  opacity: 0;
  transform: translateX(220px);
  transition: all .6s ease;
}
.slide-l-enter-active {
  transition: all .6s ease;
  transform: translateX(0px);
}
.slide-l-leave {
  transform: translateX(0px);
}
.slide-l-leave-active {
  transform: translateX(220px);
  transition: all .6s ease;
  opacity: 0;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.search-btn-wrapper {
  
  .search-btn {
    margin: 20px;
    display: inline-block;
    color: #5b7086;
  }
}


.tabs {
  .tab {
    color: #5b7086;
    font-weight: bold;
  }
  .tab.active {
    border-bottom: 3px solid #2c3e50;
    padding: 5px 20px;
    margin: 20px;
    color: #2c3e50;
  }
}

ul.song-list {
  text-align: left;
  padding-left: 10px;
  list-style: none;

  li {
    img.song-cover {
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }
    .song-detail {
      display: inline-block;
      vertical-align: middle;
      padding: 8px 15px;
      
      .name {
        font-weight: bold;
      }
      .artist {
        font-size: 13px;
      }
    }
  }
}

</style>

