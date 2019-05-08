<template>
  <v-app color="#e5f9e0">
    <v-navigation-drawer app width=250 mobile-break-point=800 v-model="drawer">
      <v-toolbar flat>
        <v-btn icon @click="drawer = !drawer"><v-icon>arrow_back</v-icon></v-btn>
      </v-toolbar>
      <v-list>

        <v-list-tile :to="'/'">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/dashboard'">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/dataview'">
          <v-list-tile-action>
            <v-icon>description</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Meine Daten</v-list-tile-title>
        </v-list-tile>

        <v-list-group prepend-icon="create" :value="newEntryFoldedOutness">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Eintrag erfassen</v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-tile :to="'/yourday'">
            <v-list-tile-action>
              <v-icon>today</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Tag erfassen</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :to="'/yoursymptoms'">
            <v-list-tile-action>
              <v-icon>face</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Auffälligkeiten erfassen</v-list-tile-title>
          </v-list-tile>
        </v-list-group>

        <v-list-tile :to="'/settings'">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Einstellungen</v-list-tile-title>
        </v-list-tile>

        <v-list-tile :to="'/about'">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Impressum</v-list-tile-title>
        </v-list-tile>
      </v-list>

      <v-divider />

      <v-btn v-if="$midataService.isReady()" flat  block @click="$midataService.logout()">MIDATA logout</v-btn>
    </v-navigation-drawer>

    <v-toolbar app clipped-left color="primary">
      <v-btn icon @click="drawer = !drawer"><v-icon>menu</v-icon></v-btn>
      <v-toolbar-title class="headline">
        <span class="font-weight-light">anakoda <i>preview V0.3&nbsp;</i></span>
      </v-toolbar-title>
    </v-toolbar>


    <v-content>
      <router-view/>
    </v-content>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; anakoda {{ new Date().getFullYear() }}</div>
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
      drawer: true,
      newEntryFoldedOutness: false
    }
  }
}
</script>
<style scoped>
i{
  color: red;
  font-size: medium;
}
</style>
