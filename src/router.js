import Vue from 'vue'
import Router from 'vue-router'

import Search from './views/Search.vue'
import Artist from './views/Artist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/search',
      component: Search,
    },
    {
      path: '/artist',
      component: Artist
    }
  ]
})
