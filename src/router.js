import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history', // muss für deployment evtl. ausgeschaltet werden
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Impressum.vue')
    },
    {
      path: '/yourdata',
      name: 'yourdata',
      component: () => import(/* webpackChunkName: "yourdata" */'./views/YourData.vue')
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */'./views/Dashboard.vue')
    },

    // important: the following entry has to be commented for productive build

    {
      path: '/test',
      name: 'test',
      component: () => import(/* webpackChunkName: "test" */'./views/Test.vue')
    }
  ]
})
