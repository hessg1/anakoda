<template>
  <v-container>
    <v-img
      :src="require('../assets/logo.png')"
      class="my-3"
      contain
      height="250"
    ></v-img>
    <p class="subheading font-weight-regular">
      Willkommen zu anakoda - Analyse von Kopfschmerz-Daten
    </p>
  </v-container>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    components: {
    }
  }
</script>
