import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import MidataService from '@/services/MidataService';

Vue.config.productionTip = false

const midataService = new MidataService();
var patient = "";

Object.defineProperties(Vue.prototype, {
  $midataService: {
    get: function() {
      return midataService;
    }
  }
});

Object.defineProperties(Vue.prototype, {
  $patient: {
    get: function() {
      return patient;
    },
    set: function(pat){
      patient = pat;
    }
  }
});



new Vue({
  data: {
  },
  router,
  render: h => h(App)
}).$mount('#app')
