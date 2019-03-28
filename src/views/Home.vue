<template>
  <v-container>
    <v-img
      :src="require('../assets/logo.png')"
      class="my-3"
      contain
      height="250"
    ></v-img>
    <p class="subheading font-weight-regular">
      Willkommen zu anakoda - Analyse von Kopfschmerz-Daten
    </p>
    <p>
    <v-btn v-if="midata == '' || !midata.isReady()" @click="auth()">MIDATA login</v-btn>
    <v-btn flat v-else @click="midata.logout()">MIDATA logout</v-btn>
    </p>
  </v-container>
</template>

<script>
  import MidataService from '@/services/MidataService';

  export default {
    name: 'home',
    components: {
    },

    data() {
      return {
        midata: "",
        name: ""
      }
    },
    methods: {
      auth(){
        this.midata.requestAuth("http://localhost:8080/");
      }
    },
    // mounted() is executed when the component is mounted
    mounted(){

      if(this.midata == "") {
        console.log("no midata, create midata");
        this.midata = new MidataService();
      }

      // check if we got any parameters from MIDATA
      if(window.location.search){
        this.midata.fetchToken();
      }
    }
  }
</script>
