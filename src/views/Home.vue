<template>

  <v-container fluid grid-list-lg>

    <v-layout row wrap>
      <!--message to user-->
      <v-flex xs12 v-if="message">
        <v-card>
          <v-card-title class="headline red lighten-2" color="#664147" primary-title>
            Wichtige Nachricht
          </v-card-title>
          <v-card-text>
            <p><b>Du hast eine Mitteilung von den Forschern der anakoda-Studie:</b></p>
            <p>{{message}}</p>
            <p v-if="contact">Bitte melde dich bei: {{contact}}.</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <!--is loading-->
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
      <!--is logged in-->
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
      <!--welcome text-->
      <v-flex xs12 v-if="midata != '' && midata.isReady()">
        <v-card class="primary--text">
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <div class="headline"> <b>Ana</b>lysiere deine <b>Ko</b>pfschmerz-<b>Da</b>ten</div><br/>

                <p class="subheading">Hallo<span v-if="name!=''">, {{name}}</span>!<br />Hier eine Übersicht, was dir anakoda bietet:</p><br/>
              </v-flex>
              <v-flex xs12 md6>
                <v-img :src="require('../assets/logo.png')"
                       class="my-3"
                       contain
                       height="100"></v-img>
              </v-flex>
            </v-layout>
            </v-card-title>
            <v-card-text>

              <v-layout row wrap>
                <v-flex xs12 md4>
                  <div class="title">
                    <v-icon color="primary">dashboard</v-icon>
                    Dashboard</div>
                  <p>Im Dashboard findest du einen Zeitstrahl, auf dem alle deine erfassten Symptome und Kopfschmerzen angezeigt
                    werden. Du kannst mit der Maus über die einzelnen Einträge fahren, um die Details anzuzeigen. Im Kennzahlen-Tab
                    berechnen wir dir einzelne Kennzahlen aus deinen Daten. Erfahre, wie sich diese im Lauf der Zeit verändern!</p>
                </v-flex>
                <v-flex xs12 md4>
                  <div class="title">
                    <v-icon color="primary">description</v-icon>
                    Meine Daten</div>
                  <p>Lasse dir all deine Daten anzeigen, unabhängig mit welcher Applikation du sie abgespeichert hast. So kannst
                    du auf einen Blick kontrollieren, ob die Daten vollständig sind und ob sich Fehler bei der Eingabe ergeben
                    haben. <br />
                    <b>Neu:</b> Du kannst fehlerhafte Einträge löschen. Klicke sie dazu bei "Meine Daten" an und wähle dann im Popup unten links das Löschen-Icon.</p>
                </v-flex>
                <v-flex xs12 md4>
                  <div class="title">
                    <v-icon color="primary">create</v-icon>
                    Eintrag erfassen</div>
                  <p>Neben deinem täglichen Verhalten ist es für eine möglichst detaillierte Analyse wichtig, dass du all dein
                    Symptome während und ausserhalb deiner Kopfschmerzen angibst. Dies ist nicht nur in anakoda, sondern auch
                    mit der Hilfe unserer Partner-App heMIgrania auf Android und iOS möglich. Die App erhältst du auf Anfrage
                    an <a href="mailto:migraine.i4mi@bfh.ch?subject=Informationen&body=Ich bin interessiert und würde mich über weitere Informationen freuen.">migraine.i4mi@bfh.ch</a>.</p>
                </v-flex>
              </v-layout>
            </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 v-if="midata != '' && midata.isReady()">
        <v-card color="#e5f9e0" class="primary--text" to="/dashboard" min-height="175px">
          <v-card-title primary-title>
            <div>
              <div class="headline">
                <v-icon color="primary">dashboard</v-icon>
                Dashboard</div>
              <p>Finde all deine Kopfschmerz- und Migränedaten im Zeitverlauf, grafisch übersichtlich aufbereitet.<br /> Ausserdem
                bietet dir das Dashboard einige Kennzahlen mit spannenden Grafen zu deinen Daten.</p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 v-if="midata != '' && midata.isReady()">
        <v-card color="#e5f9e0" class="primary--text" to="/dataview" min-height="175px">
          <v-card-title primary-title>
            <div>
              <div class="headline">
                <v-icon color="primary">description</v-icon>
                Daten einsehen</div>
              <p>Lasse dir all deine Daten anzeigen, unabhängig mit welcher Applikation du sie abgespeichert hast.</p>
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

  import $ from 'jquery'

  export default {
    name: 'home',
    components: {},

    data() {
      return {
        midata: '',
        name: '',
        loading: false,
        contact: '',
        message: ''
      }
    },

    methods: {
      auth() {
        // create redirect uri fitting for productive or preview platform
        let url = window.location.href
        if (!url.includes('localhost') && url.includes('/app/')) {
          url = 'https://anakoda.ch/app/'
        } else if (!url.includes('localhost')) {
          url = 'https://anakoda.ch/preview/'
        } else {
          if (url.includes('#')) {
            url = url.slice(0, url.indexOf('#'))
          }
          // url must end in an /
          if (url.charAt(url.length - 1) != '/') {
            url = url + '/'
          }
        }
        // if everything is ok, we can call midata
        this.midata.requestAuth(url)
      },

      // loads patient info from midata
      getPatient() {
        if (this.$midataService.isReady()) {
          // get patient resource and set user name
          this.$midataService
            .getData('Patient')
            .then(res => {
              this.$patient = this.$midataService.prepareData(res)[0]
              this.name = this.$patient.firstName

              // get message informations
              let that = this
              $.ajax({
                url: 'https://anakoda.ch/msg/data.json',
                method: 'GET',
                crossDomain: true
              }).done(function(warnings) {
                // check if we have any warnings from study researchers
                let id = that.$patient.meta.participantId
                warnings.forEach(warning => {
                  if (warning.patient == id) {
                    that.message = warning.message
                    that.contact = warning.contact
                  }
                })
              })
            })
            .catch(err => {
              console.log('Fehler')
              console.log(err)
            })
        }
      }
    },
    // mounted() is executed when the component is mounted
    mounted() {
      // link this.midata to app-wide midataService
      this.midata = this.$midataService

      // check if we got any parameters from MIDATA
      if (window.location.search) {
        this.loading = true
        this.midata.fetchToken().then(() => {
          this.getPatient()
          this.loading = false

          // remove the parameters from the url
          window.history.pushState('', document.title, window.location.toString().split('?')[0])
        })
      } else {
        if (this.$patient.firstName) {
          this.name = this.$patient.firstName
        } else {
          this.getPatient()
        }
      }

      if (this.midata.isReady()) {
        // cache all-observation query
        this.midata
          .getData('Observation')
          .then(() => {
            console.log('Observation cached')
          })
          .catch(err => {
            console.log('Fehler: ' + err.responseText)
          })
      }
    }
  }

</script>

<style scoped>

  p {
    hyphens: auto;
    text-align: justify;
  }

</style>
