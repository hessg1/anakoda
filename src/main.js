import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import MidataService from '@/services/MidataService';

Vue.config.productionTip = false

const midataService = new MidataService();

Object.defineProperties(Vue.prototype, {
  $midataService: {
    get: function() {
      return midataService;
    }
  }
})


new Vue({
  data: {
  },
  router,
  render: h => h(App)
}).$mount('#app')
