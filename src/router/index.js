import Vue from 'vue'
import Router from 'vue-router'
import baseMap from '@/pages/baseMap/BaseMap'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'baseMap',
      component: baseMap
    }
  ]
})
