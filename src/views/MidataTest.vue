<template>
  <v-container>
    <h1>MIDATA</h1>
    <p>Teste vom MIDATA-Service.</p>
    <v-btn v-if="midata.token == ''" @click="auth()">klick do zum verbinde</v-btn>
    <v-btn v-if="midata.token != ''" @click="getData()">Date lade (siehe Konsole)</v-btn><br />
    <v-btn v-if="midata.token != ''" @click="saveResource()">einzelni Ressource speichere</v-btn>
    <v-btn v-if="midata.token != ''" @click="saveBundle()">es Bundle speichere</v-btn><br /><br />
    <v-btn v-if="midata.token != ''" @click="midata.logout()">logout</v-btn><br />
    <v-btn @click="snomed()">test snomed (console)</v-btn>
  </v-container>
</template>

<script>
import MidataService from '@/services/MidataService';
import SnomedService from '@/services/SnomedService';
import { EatingHabit, SleepPattern, Complaint } from '@/services/ResourceService';

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
    snomed(){
      const sct = new SnomedService(); // initialisieren des snomedservices
      console.log(sct.getEnglish(73905001)); // gibt den englischen Begriff des Codes 73905001 aus
      console.log(sct.getCode("Flimmersehen"));  // gibt den SCT Code von "Flimmersehen" aus
      let test = sct.getFilteredProp(x => x.category == "EatingHabit", "code"); // gibt ein Array der Codes der Kategorie "EatingHabit" aus
      console.log(test);
      test = sct.getFilteredProp(x => x == x, "en") // Auflistung aller englischen Begriffe
      console.log(test);
      test = sct.getFiltered(x => x.category == "Headache") // gibt ein Array aller _objekte_ der Kategorie Headache zurück
      console.log(test);
    },

    auth(){
      this.midata.requestAuth("http://localhost:8080/midatatest/");
    },

    getData(){
      this.midata.getData("Patient");
    },

    saveResource(){
      let myObservation = new Complaint("2019-01-01T08:30:00+01:00", "2019-01-01T12:30:00+01:00", 8, 73905001);
      console.log(myObservation);
      this.midata.saveData(myObservation)
      .then(x=>{
        console.log("saved: " + x);
      })
      .catch(err=>{
        console.log("error saving: " + err);
      });

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
