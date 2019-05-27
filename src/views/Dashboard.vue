<template>
  <div>
    <Login />

    <!-- FEEDBACK DIALOG -->
    <Feedback :visible="openFeedback" :questions="questions" page="Dashboard" @close="openFeedback = false" />

    <!-- Feedback floating action button-->
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn v-if="flashyFeedback" absolute dark fab top right color="#664147" z-index="1000" v-on="on" @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
        <v-btn
        v-else
        absolute
        small dark fab
        top right
        z-index="1000"
        color="grey"
        v-on="on"
        @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
      </template>
      <span>Gib uns dein Feedback</span>
    </v-tooltip>

    <v-tabs color="#40c9a2" slider-color="#a3f7b5">
    <v-tab>Kennzahlen</v-tab>
    <v-tab-item lazy>
      <KeyFigures />
    </v-tab-item>

    <v-tab>Zeitstrahl</v-tab>
    <v-tab-item lazy>
        <OverallChart />
    </v-tab-item>
  </v-tabs>

  </div>
</template>

<script>
import OverallChart from '@/components/OverallChart';
import KeyFigures from '@/components/KeyFigures';
import Login from '@/components/Login';
import Feedback from '@/components/Feedback';


export default {
  data () {
      return {
        dialog: true,
        openFeedback: false,
        questions: [
          { question: "Findest du die Übersichts-Grafik übersichtlich und verständlich?",
            answers: ["Ja", "Nein"],
            modelname: "overallChart",
            model: "",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Hast du Anregungen zur Übersichts-Grafik?",
            answers: ["Ja", "Nein"],
            modelname: "overallChartInput",
            model: "",
            questiontext: "Welche?",
            questiontextrule: "Ja",
            type: "select"
          },
          { question: "Sind die berechneten Kennzahlen hilfreich für dich?",
            answers: ["Ja", "Nein"],
            modelname: "otherdata",
            model: "",
            questiontext: false,
            questiontextrule: "",
            type: "select"
          },
          { question: "Würdest du gerne weitere (oder andere) Kennzahlen sehen?",
            answers: ["Ja", "Nein"],
            modelname: "otherdata",
            model: "",
            questiontext: "Welche anderen Kennzahlen würdest du gerne aufbereitet haben?",
            questiontextrule: "Ja",
            type: "select"
          },
          { question: "Gab es bei dir Darstellungsprobleme mit den Grafiken",
            answers: ["Ja", "Nein"],
            modelname: "graphicalProblems",
            model: "",
            questiontext: "Mit welcher Grafik? Beschreibe das Problem so gut wie möglich.",
            questiontextrule: "Ja",
            type: "select"
          },
        ]
      }
    },
  components: {
    OverallChart,
    KeyFigures,
    Login,
    Feedback
  },
  computed: {
    flashyFeedback(){
      // the feedback fab don't have to be flashy if feedback was filled out or page is loaded the first time
      let feedback = false;
      if(localStorage.getItem('feedback') && localStorage.getItem('feedback') != 'undefined'){
        feedback = JSON.parse(localStorage.getItem('feedback'))['Dashboard'];
      }
      return feedback != 'filled' && feedback > 1;
    }
  }
}
</script>
