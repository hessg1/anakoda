<template>
  <v-container>
    <h1>Test</h1>
    <p>Token: <input v-model="midata.token" size="64" /></p>
    <p>Input: <v-btn small light @click="input=null">(set null)</v-btn><br />
      <v-textarea rows="1" box auto-grow v-model="input"></v-textarea></p>
    <v-tabs>
      <v-tab>
        MidataService
      </v-tab>
      <v-tab-item>
        1.1 - 1.4 <v-btn small @click="midata.getData(input)">getData('{{input}}')</v-btn><br />
        <br />
        1.5 - 1.11 <v-btn small @click="testSaveData(input)">test saveData()</v-btn> (input in method)<br />
        <br />
        1.12 - 1.17 <v-btn small @click="testBundle(input)">test bundle()</v-btn> (input in method)<br />
        <br />
        1.18 <v-btn small @click="midata.logout()">logout()</v-btn><br />
        <br />
        1.19 - 1.25<v-btn small @click="testPrepare()">prepareData()</v-btn><br />
      </v-tab-item>
      <v-tab>
        ResourceService
      </v-tab>
      <v-tab-item>
        2.1 - 2.10 <v-btn small @click="testEatingHabit()">test EatingHabit()</v-btn> (input in method)<br />
        2.11 - 2.18 <v-btn small @click="testSleepPattern()">test SleepPattern()</v-btn> (input in method)<br />
        2.19 - 2.22 <v-btn small @click="testResources()">test other resources</v-btn> (input in method)<br />
      </v-tab-item>
      <v-tab>
        SnomedService
      </v-tab>
      <v-tab-item>
        3.1 - 3.15 <v-btn small @click="testSnomed()">test SnomedService dictionary lookup</v-btn> (input in method, results on console)<br />
        3.16 - 3.20 <v-btn small @click="testFiltered()">test getFiltered()</v-btn> (input in method, results on console)<br />
        3.21 - 3.28 <v-btn small @click="testFilteredProp()">test getFilteredProp()</v-btn> (input in method, results on console)<br />
      </v-tab-item>
    </v-tabs>





  </v-container>
</template>

<script>
/*
This version of the script is for testing anakoda 0.1 (version after sprint 1)
date: 26.03.2019
*/
import MidataService from '@/services/MidataService';
import SnomedService from '@/services/SnomedService';
import { EatingHabit, SleepPattern, Complaint, Headache, Diagnosis, Condition } from '@/services/ResourceService';
const sct = new SnomedService(); // initialisieren des snomedservices

export default {
  name: 'midata-test',
  components: {

  },

  data() {
    return {
      midata: "",
      input: "",
      error: "(see console)"
    }
  },

  methods: {

    // utility method for testing midata service
    testBundle(){
      let complaint = new Complaint("2019-01-01T08:30:00+01:00", "2019-01-01T12:30:00+01:00", 2, 248626009);
      let condition = new Condition("2019-02-01T08:30:00+01:00", "2019-02-01T12:30:00+01:00", 102894008);
      let headache = new Complaint("2019-01-01T08:30:00+01:00", "2019-01-01T12:30:00+01:00", 8, 162309007, 29624005);

      console.log("1.12: bundle with valid input (3 resources):");
      try{
        console.log(this.midata.bundle([complaint, condition, headache]));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
      console.log("\n\n");

      console.log("1.13: bundle with valid input (1 resource in array):");
      try{
          console.log(this.midata.bundle([complaint]));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
      console.log("\n\n");

      console.log("1.14: bundle with invalid input (null):");
      try{
        console.log(this.midata.bundle(null));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
      console.log("\n\n");

      console.log("1.15: bundle with invalid input (empty array):");
      try{
        console.log(this.midata.bundle([]));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
      console.log("\n\n");

      console.log("1.16: bundle with invalid input (string):");
      try{
        console.log(this.midata.bundle("resource"));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
      console.log("\n\n");

      console.log("1.17: bundle with invalid input (1 resource, not in array):");
      try{
        console.log(this.midata.bundle(complaint));
      }
      catch(err){
        console.log("error caugth:")
        console.log(err)
      }
    },

    // utility method for testing midata service
    testSaveData(){
      let resource = new Complaint("2019-01-01T08:30:00+01:00", "2019-01-01T12:30:00+01:00", 2, 248626009);
      let bundle = this.midata.bundle([resource, new Condition("2019-02-01T08:30:00+01:00", "2019-02-01T12:30:00+01:00", 102894008)]);

      console.log("try resource:")
      this.midata.saveData(resource)
        .then(res => {
          console.log("saving resource OK");
          console.log(res);
        })
        .catch(err => {
          console.log("saving resource not OK");
          console.log(err);
        });

      console.log("try bundle:")
      this.midata.saveData(bundle)
        .then(res => {
          console.log("saving bundle OK");
          console.log(res);
        })
        .catch(err => {
          console.log("saving bundle not OK");
          console.log(err);
        });

      console.log("try saving null")
      this.midata.saveData(null)
        .then(res => {
          console.log("saving null OK");
          console.log(res);
        })
        .catch(err => {
          console.log("saving null not OK");
          console.log(err);
        });

      console.log("try saving string")
      this.midata.saveData("resource")
        .then(res => {
          console.log("saving string OK");
          console.log(res);
        })
        .catch(err => {
          console.log("saving string not OK");
          console.log(err);
        });

    },

    // utility method for testing midata service
    testPrepare(){
      let that = this;
      this.midata.getData("Patient")
      .then(res =>{
        that.tester("1.19: Aufruf mit Patient-Bundle, erwarte OK", function(){
          return that.midata.prepareData(res);
        });
      });

      this.midata.getData("Observation").then(res =>{
        that.tester("1.20: Aufruf mit Observation-Bundle, erwarte OK", function(){
          return that.midata.prepareData(res);
        });
      });

      this.midata.getData("Patient")
      .then(res =>{
        that.tester("1.21: Aufruf mit einzelner Patient-Ressource, erwarte OK", function(){
          return that.midata.prepareData(res.entry[0]);
        });
      });

      this.midata.getData("Observation")
      .then(res =>{
        that.tester("1.22: Aufruf mit einzelner Observation-Ressource, erwarte OK", function(){
          return that.midata.prepareData(res.entry[0]);
        });
      });

      this.tester("1.23: Aufruf mit null, erwarte Fehler", function(){
        return that.midata.prepareData(null);
      });

      this.tester("1.24: Aufruf mit String, erwarte Fehler", function(){
        return that.midata.prepareData("Patient");
      });

      this.tester("1.25: Aufruf mit undefined, erwarte Fehler", function(){
        return that.midata.prepareData(undefined);
      });
    },



    // utility method for testing ResourceService
    testEatingHabit(){
      this.tester("2.1 valid date and valid code", function(){
        return new EatingHabit(new Date().toISOString(), 225526009)
      });

      this.tester("2.2 date and code both null", function(){
        return new EatingHabit(null, null)
      });

      this.tester("2.3 valid date and any number as code", function(){
        return new EatingHabit(new Date().toISOString(), 2260030309)
      });

      this.tester("2.4 alid date and valid code as string", function(){
        return new EatingHabit(new Date().toISOString(), "225526009")
      });

      this.tester("2.5 valid date and invalid string as code", function(){
        return new EatingHabit(new Date().toISOString(), "Hotdog")
      });

      this.tester("2.6 string as date, valid code", function(){
        return new EatingHabit("Hotdog", 225526009)
      });

      this.tester("2.7 number as date, valid code", function(){
        return new EatingHabit(20180909, 225526009)
      });

      this.tester("2.8 non-ISO date, valid code", function(){
        return new EatingHabit("03.03.2019", 225526009)
      });

      this.tester("2.9 date object and valid code", function(){
        return new EatingHabit(new Date(), 225526009)
      });

      this.tester("2.10 date undefined and valid code", function(){
        return new EatingHabit(undefined, 225526009)
      });
    },

    // utility method for testing ResourceService
    testSleepPattern(){
      this.tester("2.11 valid dates and valid quality", function(){
        return new SleepPattern("2018-10-10T21:30:00+01:00", "2018-10-11T08:00:00+01:00", 8)
      });

      this.tester("2.12 valid dates and invalid quality", function(){
        return new SleepPattern("2018-10-10T21:30:00+01:00", "2018-10-11T08:00:00+01:00", 18)
      });

      this.tester("2.13 twisted dates and valid quality", function(){
        return new SleepPattern("2018-10-11T08:00:00+01:00", "2018-10-10T21:30:00+01:00", 8)
      });

      this.tester("2.14 dates null, valid quality", function(){
        return new SleepPattern(null, null, 8)
      });

      this.tester("2.15 valid dates, null quality", function(){
        return new SleepPattern("2018-10-10T21:30:00+01:00", "2018-10-11T08:00:00+01:00", null)
      });

      this.tester("2.16 date objects as date, valid quality", function(){
        return new SleepPattern(new Date("2018-10-10T21:30:00"), new Date("2018-10-11T08:00:00") , 9)
      });

      this.tester("2.17 valid dates, undefined quality", function(){
        return new SleepPattern("2018-10-10T21:30:00+01:00", "2018-10-11T08:00:00+01:00" , undefined)
      });

      this.tester("2.18 one date as string, one as date, valid quality", function(){
        return new SleepPattern(new Date("2018-10-10T21:30:00"), "2018-10-11T08:00:00+01:00" , 8)
      });

    },

    testResources(){
      this.tester("Complaint resource", function(){
        return new Complaint("2018-10-10T21:30:00", "2018-10-11T08:00:00+01:00" , 8, 409668002)
      });

      this.tester("Condition resource", function(){
        return new Condition("2018-10-10T21:30:00", "2018-10-11T08:00:00+01:00" , 276319003)
      });

      this.tester("Headache resource", function(){
        return new Headache("2018-10-10T21:30:00", "2018-10-11T08:00:00+01:00" , 8, 162308004, 162301005)
      });

      this.tester("Diagnosis resource", function(){
        return new Diagnosis("2018-10-10", 37796009)
      });
    },


    testSnomed(){

      this.tester("3.1 english - valid code", function(){
        return sct.getEnglish(73905001);
      });

      this.tester("3.2 english - valid code as string", function(){
        return sct.getEnglish("73905001");
      });

      this.tester("3.3 english - invalid code", function(){
        return sct.getEnglish("7390501201");
      });

      this.tester("3.4 english - null", function(){
        return sct.getEnglish(null);
      });

      this.tester("3.5 english - undefined", function(){
        return sct.getEnglish(undefined);
      });

      this.tester("3.6 german - valid code", function(){
        return sct.getGerman(73905001);
      });

      this.tester("3.7 german - valid code as string", function(){
        return sct.getGerman("73905001");
      });

      this.tester("3.8 german - invalid code", function(){
        return sct.getGerman("7390501201");
      });

      this.tester("3.9 german - null", function(){
        return sct.getGerman(null);
      });

      this.tester("3.10 german - undefined", function(){
        return sct.getGerman(undefined);
      });

      this.tester("3.11 code - valid german input", function(){
        return sct.getCode("Flimmersehen");
      });

      this.tester("3.12 code - valid english input", function(){
        return sct.getCode("sees flickering lights");
      });

      this.tester("3.13 code - invalid english input", function(){
        return sct.getCode("saturday night fever");
      });

      this.tester("3.14 english to code to english", function(){
        let term = "Vomiting";
        let code = sct.getCode(term);
        let match = term == sct.getEnglish(code);
        return term + " and " + code + " are the same: " + match;
      });

      this.tester("3.15 code to german to code", function(){
        let code = 248626009;
        let term = sct.getGerman(code);
        let match = code == sct.getCode(term);
        return term + " and " + code + " are the same: " + match;
      });

      // console.log(sct.getEnglish(73905001)); // gibt den englischen Begriff des Codes 73905001 aus
      // console.log(sct.getCode("Flimmersehen"));  // gibt den SCT Code von "Flimmersehen" aus
      // let test = sct.getFilteredProp(x => x.category == "EatingHabit", "code"); // gibt ein Array der Codes der Kategorie "EatingHabit" aus
      // console.log(test);
      // test = sct.getFilteredProp(x => x == x, "en") // Auflistung aller englischen Begriffe
      // console.log(test);
      // test = sct.getFiltered(x => x.category == "Headache") // gibt ein Array aller _objekte_ der Kategorie Headache zurück
      // console.log(test);
    },

    testFiltered(){
      this.tester("3.16 getFiltered - valid filter", function(){
        return sct.getFiltered(x => (x.category == "Headache"));
      });

      this.tester("3.17 getFiltered - always false filter", function(){
        return sct.getFiltered(x => (x != x));
      });

      this.tester("3.18 code - input null", function(){
        return sct.getFiltered(null);
      });

      this.tester("3.19 code - input undefined", function(){
        return sct.getFiltered(undefined);
      });

      this.tester("3.20 code - input string", function(){
        return sct.getFiltered("Category");
      });
    },

    testFilteredProp(){
      this.tester("3.21 getFilteredProp - valid filter", function(){
        return sct.getFilteredProp(x => (x.category == "Headache"), "en");
      });

      this.tester("3.22 getFilteredProp - always false filter", function(){
        return sct.getFilteredProp(x => (x != x), "en");
      });

      this.tester("3.23 getFilteredProp - filter null", function(){
        return sct.getFilteredProp(null, "en");
      });

      this.tester("3.24 getFilteredProp - filter undefined", function(){
        return sct.getFilteredProp(undefined, "en");
      });

      this.tester("3.25 getFilteredProp - filter string", function(){
        return sct.getFilteredProp("Category", "en");
      });

      this.tester("3.26 getFilteredProp - null prop", function(){
        return sct.getFilteredProp(x => (x.category == "Headache"), null);
      });

      this.tester("3.27 getFilteredProp -  undefined prop", function(){
        return sct.getFilteredProp(x => (x.category == "Headache"), undefined);
      });

      this.tester("3.28 getFilteredProp - wrong prop", function(){
        return sct.getFilteredProp(x => (x.category == "Headache"), "english");
      });
    },

    /*
    Function for testing other functions, printed on the console.
    parameters:  - title: the title printed to the console
                 - funct: the function to be tested (result printed on console)
    author:      hessg1
    version      2019-03-26
    */
    tester(title, funct){
      console.log(title);
      try{
        let temp = funct();
        console.log("OK!");
        console.log(temp);
      }
      catch(err){
        console.log("error caught:");
        console.log(err);
      }
      console.log("\n\n");
    },

  },
  // mounted() is executed when the component is mounted
  mounted(){
    // link this.midata to app-wide midataService
    this.midata = this.$midataService;
    // fallback, if something went wrong
    if(this.midata == "" || this.midata == null) {
      this.midata = new MidataService();
    }

  }
}
</script>

<style> *{ text-transform: none !important; } </style>
