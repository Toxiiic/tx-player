<template>
    <transition name="slide-l">

    <div class="search-view">
        <div>
            <span @click="goBack" class="fa fa-angle-left go-back-btn"></span>
            <input class="search-input" type="text" v-model="queryStr">
        </div>
        <!-- 建议：歌手 -->
        <div v-if="searchSuggest.artists != undefined">
            <div>Singer</div>
            <router-link to="/artist">
                <img :src="searchSuggest.artists[0].picUrl" alt="">
                <div>{{searchSuggest.artists[0].name}}</div>            
            </router-link>
        </div>
        <!-- 建议：专辑 -->
        <div v-if="searchSuggest.albums != undefined">
            <div>Album</div>
            <div>
                <div>{{searchSuggest.albums[0].name}}</div>
                <div>{{new Date(searchSuggest.albums[0].publishTime)}}</div>
            </div>
        </div>
        <!-- 搜索结果列表 -->
        <div v-if="searchSongs.length > 0">
            <div>Songs</div>
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
        // playSong (song) {
        //     // this.$router.push('/player')

        //     axios.get('http://localhost:3000/music/url?id=' + song.id).then(res => {
        //         let url = res.data.data[0].url

        //         axios.get('http://localhost:3000/album?id=' + song.album.id).then(res => {
        //             let picUrl = res.data.album.picUrl

        //             let curSong = {
        //                 url,
        //                 picUrl,
        //                 id: song.id,
        //                 name: song.name,
        //                 album: song.album,
        //                 artists: song.artists
        //             }

        //             this.addPlayedSong(curSong)
        //             this.setPlaying(true)

        //             // this.setCurSong(curSong)
        //             this.setCurIndexAndList({
        //                 list: this.playedSongs,
        //                 index: 0
        //             });

        //             this.setFullscreen(true);
        //         })
                
        //     })

        // },
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
.search-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    height: 100%;

    

    .search-input {
        background: #f2f2f5;
        color: inherit;
        font-family: inherit;
        border-radius: 100px;
        box-sizing: border-box;
        width: 80%;
        margin: 6px;
        border: none;
        font-size: 15px;
        padding: 8px 14px;
    }
}
</style>
