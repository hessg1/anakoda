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
      this.midata.requestAuth("http://localhost:8080/midatatest/");
    },

    getData(){
      this.midata.getData("Patient");
    },

    saveResource(){
      let myObservation = new EatingHabit("2019-03-19", "289141003");
      myObservation = new SleepPattern(new Date().toISOString().substring(0,11) + "00:15:20+01:00" , new Date().toISOString().substring(0,19) + "+01:00", 9);
      try{
        this.midata.saveData(myObservation);
      }
      catch(err){
        console.log(err);
      }
    },

    saveBundle(){
      let myBundle = {"resourceType":"Bundle","type":"transaction","id":"bundle-transaction","entry":[{"request":{"method":"POST","url":"Observation"},"resource":{"resourceType":"Observation","status":"preliminary","code":{"coding":[{"system":"http://loinc.org","code":"65554-8","display":"How many hours and minutes does it take for you to become fully awake from regular sleep, after first opening your eyes in the morning [PhenX]"}]},"category":[{"coding":[{"system":"http://hl7.org/fhir/observation-category","display":"Survey","code":"survey"}]}],"effectivePeriod":{"start":"2019-03-10T22:10:00+01:00","end":"2019-03-11T06:30:00+01:00"},"component":[{"code":{"coding":[{"system":"http://snomed.info/sct","code":"248254009","display":"Sleep pattern finding"}]},"valueQuantity":{"value":"8"}}]}},{"request":{"method":"POST","url":"Observation"},"resource":{"resourceType":"Observation","status":"preliminary","code":{"coding":[{"system":"http://snomed.info/sct","code":"364645004","display":"Eating feeding / drinking observable"}]},"category":[{"coding":[{"system":"http://hl7.org/fhir/observation-category","display":"Survey","code":"survey"}]}],"effectiveDateTime":"2019-03-11T20:30:00+01:00","valueCodeableConcept":{"coding":[{"system":"http://snomed.info/sct","code":"289141003","display":"Eats regularly"}]}}},{"request":{"method":"POST","url":"Observation"},"resource":{"resourceType":"MedicationStatement","status":"active","taken":"y","category":{"coding":[{"system":"http://hl7.org/fhir/medication-statement-category","display":"Patient Specified","code":"patientspecified"}]},"medicationCodeableConcept":{"coding":[{"system":"http://midata.coop\\t","code":"Medication Name","display":"Dafalgan 500mg"}]},"effectiveDateTime":"2019-03-11T20:30:00+01:00","dosage":[{"doseQuantity":{"value":"1"}}]}}]};


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
