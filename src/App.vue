<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">anakoda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/">home</v-btn>
      <v-btn flat to="/datacollection">Daten erfassen</v-btn>
      <v-btn flat to="/midatatest">MIDATA</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      //
    }
  }
}
</script>
