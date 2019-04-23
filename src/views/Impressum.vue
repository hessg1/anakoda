<template>
  <v-tabs color="#40c9a2" slider-color="#a3f7b5">
    <v-tab>
      Nutzungsbedingungen
    </v-tab>
    <v-tab-item>
      <Terms />
    </v-tab-item>
    <v-tab>
      Versionen
    </v-tab>
    <v-tab-item>
      <Versions />
    </v-tab-item>
    <v-tab>
      Über
    </v-tab>
    <v-tab-item>
      <About />
    </v-tab-item>
    <v-tab>
      Feedback
    </v-tab>
    <v-tab-item>
      <Feedback :questions="questions"></Feedback>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import Terms from '../components/Terms';
import Versions from '../components/Versions';
import About from '../components/About';
import Feedback from '../components/Feedback';

export default {
  components: {
    Terms,
    Versions,
    About,
    Feedback
  },

  data() {
    return {
      questions: [
        { question: "Wünschst du dir weitere Funktionen?",
          answers: ["Ja", "Nein"],
          modelname: "functions",
          model: "",
          questiontext: "Welche?",
          questiontextrule: "Ja"
        },
        { question: "Ist der Himmel blau?",
          answers: ["Ja", "Nein"],
          modelname: "skycolor",
          model: "",
          questiontext: "Welche Farbe hat er?",
          questiontextrule: "Nein"
        }
      ]
    }
  }
}
</script>
