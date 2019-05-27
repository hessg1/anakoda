<template>

  <v-container fluid grid-list-lg>
    <Feedback :visible="openFeedback" :questions="questions" page="anakoda" @close="openFeedback = false" />

    <v-card v-if="feedbacks.anakoda != 'filled'">
      <v-card-title class="headline lighten-2">
        Dein Feedback
      </v-card-title>
      <v-card-text>
        <p>Wir wollen herausfinden, ob die von anakoda aufbereiteten Daten im Dashboard hilfreich sind. Dazu brauchen wir deine
          Unterstützung. Mit dem Beantworten von {{questions.length + 2}} kurzen Fragen hilfst du uns, anakoda weiter zu verbessern.</p>
        <p v-if="this.feedbacks.Dashboard < 2 || this.feedbacks.Dashboard == undefined">
          Es ist wichtig, dass du das Dashboard von anakoda kennst, bevor du den Fragebogen beantwortest. Hast du es noch nicht benutzt?
          Dann bitten wir dich, dass du dich damit vertraut machst, und den Fragebogen später beantwortest.</p>
        <p v-if="this.feedbacks.Dashboard < 2 || this.feedbacks.Dashboard == undefined">
          Über den Link in der Mail oder den Button "Feedback" im Seitenmenü links kannst du auch später die Fragen beantworten.
        </p>
        <p>Klicke auf den untenstehenden Button, um den Fragebogen zu auszufüllen - es dauert nur wenige Minuten.</p>

      </v-card-text>
      <v-card-actions>
        <v-btn flat block color="primary" to="/" v-if="this.feedbacks.Dashboard < 2 || this.feedbacks.Dashboard == undefined">anakoda kennenlernen</v-btn>
        <v-btn flat block color="primary" @click="openFeedback = true">Fragebogen jetzt ausfüllen</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="feedbacks.anakoda === 'filled'">
      <v-card-title class="headline" primary-title>
        Herzlichen Dank für dein Feedback!
      </v-card-title>
      <v-card-actions>
        <v-btn flat block color="primary" @click="openFeedback = true">Noch ein Feedback abgeben</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

</template>

<script>

  import Feedback from '@/components/Feedback'

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
        feedbacks: {},
        questions: [
          {
            question: 'Wie oft hast du das Onlinetool anakoda genutzt?',
            answers: ['täglich', 'mehrmals wöchentlich', 'wöchentlich', 'selten', 'heute zum ersten Mal'],
            modelname: 'useCount',
            model: 'useCount',
            questiontext: false,
            questiontextrule: '',
            type: 'select'
          },
          {
            question: 'Welche Funktion hast du am meisten genutzt?',
            answers: ['Dashboard', 'Meine Daten', 'Tag erfassen', 'Auffälligkeit erfassen', 'weiss ich nicht'],
            modelname: 'mostUsed',
            model: 'mostUsed',
            questiontext: false,
            questiontextrule: '',
            type: 'select'
          },
          {
            question:
              'Findest du es aufwändig, in anakoda einen Überblick über deine Daten zu erhalten? (volle Kreise = hoher Aufwand)',
            answers: false,
            modelname: 'expenditure',
            model: null,
            questiontext: '',
            questiontextrule: '',
            type: 'rating'
          },
          {
            question: 'Hat dir anakoda geholfen, deine Kopfschmerzen besser zu verstehen?',
            answers: ['Ja', 'Nein'],
            modelname: 'problems',
            model: null,
            questiontext: '',
            questiontextrule: '',
            type: 'select'
          },
          {
            question: 'Hast du seit der Nutzung von anakoda dein Verhalten verändert?',
            answers: ['Ja', 'Nein'],
            modelname: 'conclusions',
            model: 'conclusions',
            questiontext: false,
            questiontextrule: '',
            type: 'select'
          },
          {
            question: 'Bist du bei der Bedienung von anakoda auf Probleme gestossen?',
            answers: ['Nein', 'Ja, anakoda ist zu kompliziert.', 'Ja, anakoda hatte technische Fehler.', 'Ja, beides.'],
            modelname: 'problems',
            model: null,
            questiontext: '',
            questiontextrule: '',
            type: 'select'
          },
          {
            question: 'Was hat dir am Onlinetool anakoda besonders gefallen?',
            answers: false,
            modelname: 'good',
            model: '',
            questiontext: 'Deine Antwort...',
            questiontextrule: '',
            type: ''
          },
          {
            question: 'Was sollte aus deiner Sicht verbessert werden?',
            answers: false,
            modelname: 'bad',
            model: '',
            questiontext: 'Deine Antwort...',
            questiontextrule: '',
            type: ''
          }
        ]
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
        this.$midataService.requestAuth(url)
      }
    },
    beforeCreate(){
      console.log("going to create feedback")
      sessionStorage.setItem('cameFromFeedback', true)
    },
    // mounted() is executed when the component is mounted
    mounted() {
      this.showLoginReminder = !this.$midataService.isReady()

      //sessionStorage.setItem('cameFromFeedback', true)

      if (localStorage.getItem('feedback') && localStorage.getItem('feedback') != 'undefined') {
        this.feedbacks = JSON.parse(localStorage.getItem('feedback'))
      }
    },
    watch: {
      showLoginReminder() {
        this.showAlreadyUsed = !this.showLoginReminder
      }
    }
  }

</script>

<style scoped>


</style>
