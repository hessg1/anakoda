<template>
  <div>
    <Login />
    <v-tabs color="#40c9a2" slider-color="#a3f7b5">
    <v-tab>Übersicht</v-tab>
    <v-tab-item lazy>
      <OverallChart />
    </v-tab-item>

    <v-tab>Kennzahlen</v-tab>
    <v-tab-item lazy>
        <KeyFigures />
    </v-tab-item>
  </v-tabs>

  </div>
</template>

<script>
import OverallChart from '@/components/OverallChart';
import KeyFigures from '@/components/KeyFigures';
import Login from '@/components/Login';


export default {
  data () {
      return {
        dialog: true
      }
    },
  components: {
    OverallChart,
    KeyFigures,
    Login
  }
}
</script>
