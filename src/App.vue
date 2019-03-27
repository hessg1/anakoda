<template>
  <v-app color="#e5f9e0">
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">anakoda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/">home</v-btn>
      <v-btn flat to="/yourdata">Daten erfassen</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
    <v-footer class="pa-3">
    <v-spacer></v-spacer>
    <div>&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
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
