<template>
  <v-container
  fluid
  grid-list-lg>

  <v-layout row wrap>
    <v-flex xs12 v-if="loading">
      <v-card color="primary" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">Verbindung mit MIDATA...</div>
          </div>
        </v-card-title>
      </v-card>
      <v-progress-linear :indeterminate="true"></v-progress-linear>
    </v-flex>
    <v-flex xs12 v-if="(midata == '' || !midata.isReady()) && !loading">
      <v-card color="primary" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">Anmelden</div>
            <span>Bitte melde dich bei MIDATA an, damit du anakoda verwenden kannst.</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat dark @click="auth()">MIDATA login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card  class="primary--text">
        <v-card-title primary-title>
          <v-layout row wrap>
          <v-flex xs12 md6>
            <div class="headline">Hallo<span v-if="name!=''">, {{name}}!</span></div>
            <span>Herzlich Willkommen bei anakoda. Aktuell kannst du Daten erfassen und einsehen.
              Wir arbeiten daran, dir so schnell wie möglich erste
               Analysen deiner Kopfschmerz-Daten geben zu können.<br>Bis dahin ist
               es wichtig, dass du regelmässig Daten erfasst. Nur so können wir
               dir später eine möglichst detaillierte Analyse bieten.</span>
          </v-flex>
          <v-flex xs12 md6>
              <v-img
              :src="require('../assets/logo.png')"
              class="my-3"
              contain
              height="150"
              ></v-img>
          </v-flex>
        </v-layout>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card color="#e5f9e0" class="primary--text">
        <v-card-title primary-title>
          <div>
            <div class="headline"><v-icon color="primary">description</v-icon>
              Daten einsehen</div>
            <span>Lasse dir all deine Daten anzeigen, unabhängig mit welcher Applikation du sie abgespeichert hast.</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" to="/dataview">Meine Daten</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card color="#e5f9e0" class="primary--text">
        <v-card-title primary-title>
          <div>
            <div class="headline"><v-icon color="primary">today</v-icon>
              Alltägliche Einträge erfassen</div>
            <span>Um herauszufinden ob dein alltägliches Wohlbefinden einen Einfluss
              auf deine Kopfschmerzen hat, kannst du es hier mit nur wenigen
              Klicks erfassen.</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" to="/yourday">Mein Tag</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card color="#e5f9e0" class="primary--text">
        <v-card-title primary-title>
          <div>
            <div class="headline"><v-icon color="primary">face</v-icon> Symptome erfassen</div>
            <span>Es ist wichtig, dass du neben deinen Kopfschmerzen alle weitere Auffälligkeiten angibst,
              die dir aufgefallen sind. So kannst du herausfinden, ob diese einen Einfluss
              auf deine Kopfschmerzen haben.</span>
            <span></span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" to="/yoursymptoms">Meine Auffälligkeiten</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card class="primary--text">
        <v-card-title primary-title>
          <div>
            <span>Logge dich aus, wenn du fertig bist.<br></span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" @click="midata.logout()">MIDATA logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import warnings from '@/assets/messages.json'

export default {
  name: 'home',
  components: {
  },

  data() {
    return {
      midata: "",
      name: "",
      loading: false
    }
  },
  methods: {
    auth(){
      // create redirect uri fitting for productive or preview platform
      let url = window.location.href;
      if(!url.includes('localhost') && url.includes('/app/')){
        url = 'https://anakoda.ch/app/';
      }
      else if(!url.includes('localhost') && url.includes('/preview/')){
        url = 'https://anakoda.ch/preview/';
      }
      else{
        if(url.includes('#')){
         url = url.slice(0, url.indexOf('#'));
       }
        // url must end in an /
        if(url.charAt(url.length-1) != '/'){
          url = url + '/';
        }
      }

      // if everything is ok, we can call midata
      this.midata.requestAuth(url);
    },

    // loads patient info from midata
    getPatient(){
      if(this.$midataService.isReady()){
        // get patient resource and set user name
        this.$midataService.getData("Patient")
        .then(res => {
          this.$patient = this.$midataService.prepareData(res)[0];
          this.name = this.$patient.firstName;
        })
        .catch(err => {
          console.log("Fehler: " + err.responseText)
        });
      }
    }
  },
  // mounted() is executed when the component is mounted
  mounted(){
    // link this.midata to app-wide midataService
    this.midata = this.$midataService;
    // // fallback, if something went wrong
    // if(this.midata == "") {
    //   this.midata = new MidataService();
    // }
    // check if we got any parameters from MIDATA
    if(window.location.search){
      this.loading = true;
      this.midata.fetchToken().then(() =>{
        this.getPatient();
        this.loading = false;

        // remove the parameters from the url
         window.history.pushState('',document.title,window.location.toString().split("?")[0]);
      });
    }
    else{
      if(this.$patient.firstName){
        this.name = this.$patient.firstName;
      }
      else{
        this.getPatient();
      }
    }

    if(this.patient){
      // check if we have any warnings from study researchers
      let id = this.$patient.meta.participantId
      warnings.forEach(warning => {
        if(warning.patient == id){
          console.log("WARNUNG");
          console.log(warning.message);
          console.log("Bitte kontaktieren Sie " + warning.contact);
        }
      })
    }
    if(this.midata.isReady()){
      // cache all-observation query
      this.midata.getData('Observation')
      .then(()=> {
        console.log('Observation cached')
      })
      .catch(err => {
        console.log("Fehler: " + err.responseText)
      });
    }
  }
}
</script>
