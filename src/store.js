import Vue from 'vue'
import Vuex from 'vuex'
import { stringify } from 'postcss';

Vue.use(Vuex)

const storage = window.localStorage


export default new Vuex.Store({
  state: {
    playing: false,
    fullscreen: false,
    // curSong: {},
    curList: [],
    curIndex: -1,
    toRemoveFavSongIndex: -1,

    favSongs: [],
    defaultSongs: [],
    playedSongs: [],
  },

  mutations: {
    setPlaying: (state, playing) => state.playing = playing,
    setFullscreen: (state, fullscreen) => state.fullscreen = fullscreen,
    setCurIndex: (state, index) => state.curIndex = index,
    setCurList: (state, list) => state.curList = list,
    setToRemoveFavSongIndex: (state, index) => state.toRemoveFavSongIndex = index, //待取消收藏index

    setFavSongs: (state, songs) => state.favSongs = songs,
    unshiftFavSong: (state, song) => state.favSongs.unshift(song),
    spliceFavSong: (state, index) => state.favSongs.splice(index, 1),
    
    setDefaultSongs: (state, songs) => state.defaultSongs = songs,
    unshiftDefaultSong: (state, song) => state.defaultSongs.unshift(song),
    spliceDefaultSong: (state, index) => state.defaultSongs.splice(index, 1),

    setPlayedSongs: (state, songs) => state.playedSongs = songs,
    unshiftPlayedSong: (state, song) => state.playedSongs.unshift(song),
    splicePlayedSong: (state, index) => state.playedSongs.splice(index, 1)
  },

  actions: {
    togglePlaying: ({commit, state}) => commit('setPlaying', !state.playing),

    playSong ({commit, state}, payload) {
      /* playedSongs */
      //如果当前列表有这首歌，那要先删掉
      let playedIndex = state.playedSongs.findIndex((song, index) => song.id == payload.song.id)
      if(playedIndex > -1) {
        commit('splicePlayedSong', playedIndex)
      }
      //有或没有都要加在最开始
      commit('unshiftPlayedSong', payload.song)
      storage.setItem('playedSongs', JSON.stringify(state.playedSongs))


      /* 根据当前是哪个播放列表，设置list和index */
      let newIndex = -1
      if(payload.list == state.defaultSongs) {
        //defaultSongs: 
        //如果没有这首歌，就加上，index为0
        //如果已有，index改为现在的index
        let defaultIndex = state.defaultSongs.findIndex((song) => song.id == payload.song.id)
        if(defaultIndex == -1) {
          commit('unshiftDefaultSong', payload.song)
          storage.setItem('defaultSongs', JSON.stringify(state.defaultSongs))
          newIndex = 0
        } else {
          newIndex = defaultIndex
        }
      } else if (payload.list == state.favSongs) {
        //favSongs:
        //肯定有这首歌，找到index，设置为index
        newIndex = state.favSongs.findIndex((song) => song.id == payload.song.id)
      }

      commit('setCurList', payload.list)
      commit('setCurIndex', newIndex)
      commit('setFullscreen', true)
      commit('setPlaying', true)

      /* 如果有待取消收藏，这时取消 */
      if(state.toRemoveFavSongIndex > -1) {
        commit('spliceFavSong', state.toRemoveFavSongIndex)
        commit('setToRemoveFavSongIndex', -1)
      }
    },

    addFavSong ({commit}, song) {
      commit('unshiftPlayedSong', song)
    },
    toggleCurSongFav ({commit, state, getters}) {
      if(getters.isCurSongFav) {
        /** 如果是取消收藏，那就等换歌时再从列表中去掉 */
        let index = state.favSongs.findIndex((song) => song.id == getters.curSong.id)
        state.toRemoveFavSongIndex = index
      } else {
        /**
         * 如果是取消收藏后又变成收藏，那就把待取消收藏index去掉
         * 如果是直接收藏，那就正常添加到列表
         */
        if(state.toRemoveFavSongIndex > -1) {
          state.toRemoveFavSongIndex = -1
        } else {
          commit('unshiftFavSong', getters.curSong)
        }
      }

      //save
      window.localStorage.setItem('favSongs', JSON.stringify(state.favSongs))
    }
  },

  getters: {
    // curSong: state => state.curSong,
    playing: state => state.playing,
    fullscreen: state => state.fullscreen,
    curIndex: state => state.curIndex,
    curList: state => state.curList,

    favSongs: state => state.favSongs,
    defaultSongs: state => state.defaultSongs,
    playedSongs: state => state.playedSongs,

    curSong: state => state.curList[state.curIndex],

    isCurSongFav (state, getters) {
      if(getters.curSong != undefined) {
        return state.favSongs.some((song) => song.id == getters.curSong.id)
      }
    }
  }

})