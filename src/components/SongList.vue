<template>
    <ul class="song-list">
        <li v-for="(song, index) in songs" :key="index" @click="clickSongListItem(song)">
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
            'defaultSongs'
        ])
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
        ...mapActions([
            'playSong'
        ])
    }
}
</script>
