<template>
  <div>
    <v-tabs
    color="#0a967a"
    slider-color="#a3f7b5"
    >
      <v-tab>
        Dein Tag
      </v-tab>
      <v-tab-item>
        <DailyRecording></DailyRecording>
      </v-tab-item>
      <v-tab>
        Deine Symptome
      </v-tab>
      <v-tab-item>
        <ProgressiveSymptoms></ProgressiveSymptoms>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import DailyRecording from '../components/DailyRecording'
import ProgressiveSymptoms from '../components/ProgressiveSymptoms'

export default {
  components: {
    DailyRecording,
    ProgressiveSymptoms
  }
}
</script>
