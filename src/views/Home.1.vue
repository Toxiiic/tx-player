<template>
  <div class="home">
    <img src="http://p1.music.126.net/ty7gKwQUmAtXbEBmMiIKYg==/18517974836974093.jpg">
    <!-- <audio src="http://m10.music.126.net/20180721211404/eb277f87a1a312aaa7e8090208e309b9/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3" autoplay></audio> -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
