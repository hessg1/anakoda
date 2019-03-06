<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">anakoda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/">home</v-btn>
      <v-btn flat to="/about">vuetify</v-btn>
      <v-btn flat to="/midataplain">MIDATA</v-btn>
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
