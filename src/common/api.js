import axios from 'axios'


export function getMusicUrlById (songId) {
    return axios.get('http://localhost:3000/music/url?id=' + songId)
}

export function getAlbumById (albumId) {
    return axios.get('http://localhost:3000/album?id=' + albumId)
}

export function getLyricBySongId (songId) {
    return axios.get('http://localhost:3000/lyric?id=' + songId)
}