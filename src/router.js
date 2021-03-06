import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history', // muss für deployment evtl. ausgeschaltet werden
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
      path: '/yourday',
      name: 'yourday',
      component: () => import(/* webpackChunkName: "yourday" */'./views/YourDay.vue')
    },

    {
      path: '/yoursymptoms',
      name: 'yoursymptoms',
      component: () => import(/* webpackChunkName: "yoursymptoms" */'./views/YourSymptoms.vue')
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */'./views/Dashboard.vue')
    },

    {
      path: '/dataview',
      name: 'dataview',
      component: () => import(/* webpackChunkName: "dataview" */'./views/Dataview.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */'./views/Settings.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import(/* webpackChunkName: "feedback" */'./views/Evaluation.vue')
    },

    // important: the following entry has to be commented for productive build
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: () => import(/* webpackChunkName: "test" */'./views/Test.vue')
    // }
  ]
})
