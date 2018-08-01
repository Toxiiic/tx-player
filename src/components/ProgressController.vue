<template>
    
    <div class="progress-controller"
        @mousemove="onMouseMoveHandler"
        @mouseup="onMouseUpHandler">
        <div class="bar-bg"
            @mousedown="onMouseDownHandler">
            <div class="bar" :style="{width: progress+'%'}"
                 ></div>
            <div class="handler"
                :style="{left: progress+'%'}" ></div>
        </div>
    </div>

</template>
<script>
export default {
    props: [
        'currentTime',
        'duration'
    ],
    data () {
        return {
            draggingHandler: false,
            draggingProgress: 0
        }
    },
    computed: {
        progress: {
            get: function () {
                if(!this.draggingHandler) {
                    return this.currentTime / this.duration * 100
                } else {
                    return this.draggingProgress
                }
            }
        }
    },
    methods: {
        onMouseDownHandler (e) {
            this.draggingHandler = true
            this.draggingProgress = e.x / window.innerWidth * 100
            console.log('down')
        }, 
        onMouseMoveHandler (e) {
            console.log('move')
            if (this.draggingHandler) {
                this.draggingProgress = e.x / window.innerWidth * 100
            }
        }, 
        onMouseUpHandler (e) {
            if(this.draggingHandler) {
                this.draggingHandler = false
                this.$emit('timeChange', this.draggingProgress * this.duration / 100)
                console.log('up')
            }
        }
    },
}
</script>

<style lang="scss" scoped>

    .progress-controller {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: -1;

        .bar-bg {
            background: #e9eaef;
            bottom: 120px;
            position: absolute;
            width: 100%;

            .bar {
                height: 5px;
                // width: 30%;
                background: #273e52;
            }
            .handler {
                height: 15px;
                background: #273e52;
                position: absolute;
                width: 3px;
                top: -5px;
                // left: 30%;
            }
        }
    }
</style>


