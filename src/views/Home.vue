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
            <b>Es gibt Neuigkeiten!</b><br/>
            <p>Und zwar ist das Dashboard ist nun verfügbar.<br />
              Ausserdem gibt es unsere Partner-App heMIgrania neu auch fürs iPhone. Mit heMIgrania
              kannst du deine Kopfschmerz-Daten komfortabel am Handy erfassen. Die App gibt es auf
              Anfrage an <a href="mailto:migraine.i4mi@bfh.ch">migraine.i4mi@bfh.ch</a>.</p>

             <p>Ausserdem haben wir das Login-Verhalten von MIDATA verbessert:
              Du kannst nun einstellen, dass du mit anakoda bei MIDATA eingeloggt
              bleibst, auch wenn du dein Browser-Fenster schliesst. Beachte aber,
              dass spätere Benutzer des gleichen Computers Zugriff auf deine Daten haben,
               wenn du dich nicht ausloggst!
             </p>
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
            <div class="headline"><v-icon color="primary">dashboard</v-icon>
              Dashboard</div>
            <p>Sehe all deine Kopfschmerz- und Migränedaten im Zeitverlauf, grafisch übersichtlich aufbereitet.<br />
            Ausserdem bietet dir das Dashboard einige Kennzahlen zu deinen Daten.</p>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" to="/dashboard">Dashboard</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card color="#e5f9e0" class="primary--text">
        <v-card-title primary-title>
          <div>
            <div class="headline"><v-icon color="primary">description</v-icon>
              Daten einsehen</div>
            <p>Lasse dir all deine Daten anzeigen, unabhängig mit welcher Applikation du sie abgespeichert hast.</p>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn class="primary--text" to="/dataview">Meine Daten</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex xs12 v-if="midata != '' && midata.isReady()">
      <v-card class="primary--text">
        <v-card-title primary-title>
          <div>
            <div class="headline"><v-icon color="primary">comment</v-icon>
              Dein Feedback</div>
            <p>Wusstest du, dass du auf verschiedenen Seiten Feedback zu den Funktionen von anakoda geben kann? Damit hilfst du uns bei der Entwicklung neuer Funktionen. Klicke dafür auf den Feedback-Button oben rechts im Dashboard oder bei Meine Daten.</p>
          </div>
        </v-card-title>
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
      else if(!url.includes('localhost')){
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
