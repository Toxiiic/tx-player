<template>
    <ul class="song-list">
        <li v-for="(song, index) in songs"
            :key="index"
            @click="clickSongListItem(song)"
            :class="itemActiveClass(song)">
            <img class="song-cover"
                v-show="song.picUrl!=undefined && showCover"
                :src="song.picUrl"
                alt="">
            <div class="song-detail">
                <div class="name">{{song.name}}</div>
                <div class="artist">{{song.artists[0].name}}</div>
            </div>
        </li>
    </ul>
</template>

<script>
import { getMusicUrlById, getAlbumById } from '../common/api'
import { mapActions, mapGetters } from 'vuex';

export default {

    props: {
        songs: {
            required: true
        },
        list: {
            required: true
        },
        showCover: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters([
            'playedSongs',
            'defaultSongs',
            'curSong'
        ]),
    },
    methods: {
        clickSongListItem (song) {
            
            getMusicUrlById(song.id).then(res => {
                let url = res.data.data[0].url

                getAlbumById(song.album.id).then(res => {
                    let picUrl = res.data.album.picUrl

                    let songObj = {
                        url,
                        picUrl,
                        id: song.id,
                        name: song.name,
                        album: song.album,
                        artists: song.artists
                    }

                    this.playSong({
                        song: songObj,
                        list: this.list
                    })
                })
                
            })
        },
        itemActiveClass (song) {
            if(this.curSong != undefined) {
                return {active: song.id == this.curSong.id}
            }
            return ''
        },
        ...mapActions([
            'playSong'
        ])
    }
}
</script>

<style lang="scss">
    @import "@/common/common.scss";

    li.active {
        color: $color-active;
    }
</style>