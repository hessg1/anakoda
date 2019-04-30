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
        <HeadacheDays />
    </v-tab-item>
  </v-tabs>

  </div>
</template>

<script>
import OverallChart from '@/components/OverallChart';
import HeadacheDays from '@/components/HeadacheDays';
import Login from '@/components/Login';


export default {
  data () {
      return {
        dialog: true
      }
    },
  components: {
    OverallChart,
    HeadacheDays,
    Login
  }
}
</script>
