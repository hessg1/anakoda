<template>
  <v-container fluid grid-list-lg>
    <v-dialog v-if="feedbacks.anakoda != 'filled'" v-model="showLoginReminder" max-width="400">
      <v-card>
        <v-card-title class="headline primary lighten-2" >
          Willkommen!
        </v-card-title>
        <v-card-text>
          <p>
            anakoda ist noch nicht mit MIDATA verbunden. Bitte logge dich ein
            und mache dich mit anakoda vertraut, bevor du den Fragebogen beantwortest.
          </p>
          <p>Über den Link in der Mail oder den Button "Feedback" im Seitenmenü links
            kannst du wieder auf diese Seite zurückkehren und die Fragen beantworten.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn flat @click="showLoginReminder = !showLoginReminder">abbrechen</v-btn>
          <v-spacer />
          <v-btn flat color="primary" @click="auth()">MIDATA login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="feedbacks.anakoda != 'filled'" v-model="showAlreadyUsed" max-width="400">
      <v-card>
        <v-card-title class="headline primary lighten-2" >
          Willkommen!
        </v-card-title>
        <v-card-text>
          <p>
            Es ist wichtig, dass du as Dashboard von anakoda kennst,
            bevor du den Fragebogen beantwortest. Hast du es noch nicht benutzt?
            Dann bitten wir dich, dass du dich damit vertraut machst, und den
            Fragebogen später beantwortest.
          </p>
          <p>Über den Link in der Mail oder den Button "Feedback" im Seitenmenü links
            kannst du später auf hierher zurückkehren und die Fragen beantworten.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn flat @click="showAlreadyUsed = !showAlreadyUsed">ich kenne anakoda</v-btn>
          <v-spacer />
          <v-btn flat color="primary" :to="'/'">anakoda kennenlernen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card v-if="feedbacks.anakoda === 'filled'">
      <v-card-title class="headline" primary-title>
        Herzlichen Dank für dein Feedback!
      </v-card-title>
      <v-card-text>
        Du hast bereits ein Feedback abgegeben.<br>
      </v-card-text>
    </v-card>

    <Feedback :questions="questions" page="anakoda" v-if="feedbacks.anakoda != 'filled'"/>

  </v-container>
</template>

<script>
  import Feedback from '@/components/Feedback';

  export default {
    name: 'evaluation',
    components: {
      Feedback
    },

    data() {
      return {
        showLoginReminder: false,
        showAlreadyUsed: false,
        feedbacks: {},
        questions: [
          { question: "Wie oft hast du das Onlinetool anakoda besucht?",
            answers: ["täglich", "wöchentlich", " weniger als zehn Mal", "weniger als fünf Mal", "heute zum ersten Mal"],
            modelname: "useCount",
            model: "useCount",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Welche Funktion hast du am meisten genutzt?",
            answers: ["Dashboard", "Meine Daten", "Tag erfassen", "Auffälligkeit erfassen", "weiss ich nicht"],
            modelname: "mostUsed",
            model: "mostUsed",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Wie hoch schätzt du den Aufwand, um mit dem Onlinetool anakoda einen Überblick über deine Daten zu erhalten? (volle Kreise = hoher Aufwand)",
            answers: false,
            modelname: "expenditure",
            model: null,
            questiontext: "",
            questiontextrule: "",
            type: "rating"
          },
          { question: "Konntest du mit dem “Dashboard“ oder der Auflistung in “Meine Daten“ fördernde Rückschlüsse über dein Verhalten ziehen, die dir zuvor noch nicht bekannt waren?",
            answers: ["Ja", "Nein"],
            modelname: "conclusions",
            model: "conclusions",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Hast du schone einmal einen Eintrag im Onlinetool anakoda erfasst?",
            answers: ["Ja", "Nein"],
            modelname: "dataCollectionAnakoda",
            model: "dataCollectionAnakoda",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Wie oft hattest du Technische- oder Verständnisprobleme mit dem Onlinetool anakoda? (volle Kreise = häufig)",
            answers: false,
            modelname: "problems",
            model: null,
            questiontext: "",
            questiontextrule: "",
            type: "rating"
          },
          { question: "Was hat dir am Onlinetool anakoda besonders gefallen?",
            answers: false,
            modelname: "good",
            model: "",
            questiontext: "Deine Antwort...",
            questiontextrule: "",
            type: ""
          },
          { question: "Was sollte aus deiner Sicht verbessert werden?",
            answers: false,
            modelname: "bad",
            model: "",
            questiontext: "Deine Antwort...",
            questiontextrule: "",
            type: ""
          },
        ]
      };
    },
    methods: {
      auth() {
        // create redirect uri fitting for productive or preview platform
        let url = window.location.href;
        if (!url.includes('localhost') && url.includes('/app/')) {
          url = 'https://anakoda.ch/app/';
        } else if (!url.includes('localhost')) {
          url = 'https://anakoda.ch/preview/';
        } else {
          if (url.includes('#')) {
            url = url.slice(0, url.indexOf('#'));
          }
          // url must end in an /
          if (url.charAt(url.length - 1) != '/') {
            url = url + '/';
          }
        }
        // if everything is ok, we can call midata
        this.$midataService.requestAuth(url);
      },

    },
    // mounted() is executed when the component is mounted
    mounted() {
      this.showLoginReminder = !this.$midataService.isReady();
      this.showAlreadyUsed = !this.showLoginReminder;

      sessionStorage.setItem('cameFromFeedback', true);

      if (localStorage.getItem('feedback') && localStorage.getItem('feedback') != 'undefined') {
        this.feedbacks = JSON.parse(localStorage.getItem('feedback'))
      }
    },
    watch: {
      showLoginReminder(){
        this.showAlreadyUsed = !this.showLoginReminder;
      }
    }
  };

</script>

<style scoped>


</style>
