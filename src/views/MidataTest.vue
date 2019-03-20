<template>
  <v-container>
    <h1>MIDATA</h1>
    <p>Teste vom MIDATA-Service.</p>
    <v-btn v-if="midata.token == ''" @click="auth()">klick do zum verbinde</v-btn>
    <v-btn v-if="midata.token != ''" @click="getData()">Date lade (siehe Konsole)</v-btn><br />
    <v-btn v-if="midata.token != ''" @click="saveResource()">einzelni Ressource speichere</v-btn>
    <v-btn v-if="midata.token != ''" @click="saveBundle()">es Bundle speichere</v-btn><br /><br />
    <v-btn v-if="midata.token != ''" @click="midata.logout()">logout</v-btn>
  </v-container>
</template>

<script>
import MidataService from '@/services/MidataService';
import { EatingHabit, SleepPattern } from '@/services/ResourceService';

export default {
  name: 'midata-test',
  components: {

  },

  data() {
    return {
      midata: ""
    }
  },

  methods: {
    auth(){
      this.midata.requestAuth("http://localhost:8080/midatatest/");
    },

    getData(){
      this.midata.getData("Patient");
    },

    saveResource(){
      let myObservation = new EatingHabit("2019-03-19", "289141003");
      try{
        this.midata.saveData(myObservation);
      }
      catch(err){
        console.log(err);
      }
    },

    saveBundle(){
      let myBundle = this.midata.bundle([
        new EatingHabit("2005-05-17", "289141003"),
        new SleepPattern(new Date().toISOString().substring(0,11) + "00:11:20+01:00" , new Date().toISOString().substring(0,19) + "+01:00", 9)
      ]);

      console.log("save bundle:");
      console.log(myBundle);

      try{
        this.midata.saveData(myBundle);
      }
      catch(err){
        console.log(err);
      }
    }


  },
  // mounted() is executed when the component is mounted
  mounted(){

    if(this.midata == "") {
      console.log("no midata, create midata");
      this.midata = new MidataService("https://test.midata.coop/fhir/", "migrEnTest");
    }

    if(window.location.search){
      this.midata.fetchToken();
    }
    else {
      console.log("parameters undefined");
    }
  }
}
</script>
