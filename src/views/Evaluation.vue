<template>
  <v-container fluid grid-list-lg>
    <v-dialog v-model="showLoginReminder" max-width="400">
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

    <v-dialog v-model="showAlreadyUsed" max-width="400">
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

    <Feedback :visible="openFeedback" :questions="questions" page="anakoda Webapp" @close="openFeedback = false" />

    <v-card>
      <v-card-title class="headline lighten-2" >
        Dein Feedback
      </v-card-title>
      <v-card-text>
        <p>Danke, dass du anakoda benutzt!</p>
        <p>Wir wollen herausfinden, ob die von
        anakoda aufbereiteten Daten im Dashboard hilfreich sind. Dazu brauchen wir
        deine Unterstützung. Mit dem Beantworten von {{questions.length + 2}} Fragen hilfst du uns,
        anakoda weiter zu verbessern.</p>
        <p>Klicke auf den untenstehenden Button, um den Fragebogen zu auszufüllen - es dauert nur wenige Minuten.</p>

      </v-card-text>
      <v-card-actions>
        <v-btn flat block color="primary" @click="openFeedback = true">Fragebogen jetzt ausfüllen</v-btn>
        </v-card-actions>
    </v-card>
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
        openFeedback: false,
        questions: [
          { question: "Sein oder nicht sein?",
            answers: ["Ja", "Nein"],
            modelname: "quest1",
            model: "",
            questiontext: "Das ist hier die Frage",
            questiontextrule: "Ja"
          },
          { question: "zu definierende Frage",
            answers: ["Ja", "Nein"],
            modelname: "quest2",
            model: "",
            questiontext: "zu definierende Unterfrage",
            questiontextrule: "Ja"
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
