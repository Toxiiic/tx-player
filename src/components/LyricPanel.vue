
<template>
    <div class="lyric-panel" @click="$emit('click')">
        <ul :style="lyricListStyle">
            <li :class="{active: curLrcIndex==index}" v-for="(lrc, index) in lrcs" :key="index">{{lrc.text}}</li>
        </ul>
    </div>
</template>

<script>

export default {
    props: [
        'lrcs',
        'currentTime'
    ],
    data () {
        return {
            curLrcIndex: 0
        }
    },
    watch: {
        /* 要保证：当前时间介于当前歌词和下句歌词时间之间；否则，沿着超出的方向找到这个时间 */
        currentTime (curTime) {
            //最后一项也不准向后判断
            while(this.curLrcIndex + 1 < this.lrcs.length && curTime > this.lrcs[this.curLrcIndex + 1].time) {
                this.curLrcIndex ++
            }
            //第一项不准进入
            while(this.curLrcIndex > 0 && curTime < this.lrcs[this.curLrcIndex].time) {
                this.curLrcIndex --
            }
        }
    },
    computed: {
        /* 计算属性的使用时机：依赖于响应式数据的值，计算得出 */
        lyricListStyle () {
            return {
                transform: `translateY(${270 - 36*this.curLrcIndex}px)`
            }
        }
    },
    methods: {
    }
}
</script>

<style lang="scss">
.lyric-panel {
    height: 70%;
    overflow: hidden;
    position: absolute;
    width: 100%;
    background: white;
    top: 0;
    
    ul {
        transition: transform .6s ease;

        li {
            
            list-style: none;
            font-size: 15px;
            padding: 8px;

            &.active {
                font-weight: bold;
            }
        }
    }
}
</style>


