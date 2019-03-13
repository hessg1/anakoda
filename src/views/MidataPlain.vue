<template>
  <v-container>
    <h1>MIDATA</h1>
    <p>Teste vom MIDATA-Service.</p>
    <v-btn @click="auth()">klick do zum verbinde</v-btn>
    <v-btn  @click="getData()">und do zum Date lade (siehe Konsole)</v-btn>
  </v-container>
</template>

<script>
import MidataService from '@/services/MidataService';

export default {
  name: 'midata-plain',
  components: {

  },

  data() {
    return {
      midata: ""
    }
  },

  methods: {
    auth(){
      this.midata.requestAuth("http://localhost:8080/midataplain/");
    },

    getData(){
      this.midata.getData("Patient");
    },

    // logs a string to the console and to a log history array


  },
  // mounted() is executed when the component is mounted
  mounted(){

    if(this.midata == "") {
      console.log("no midata, create midata");
      this.midata = new MidataService("https://test.midata.coop/fhir", "migrEnTest");
    }

    if(window.location.search){
      console.log("we have a searchstring, we going to fetch");
      this.midata.fetchToken();
    }
    else {
      console.log("parameters undefined");
    }
  }
}
</script>
