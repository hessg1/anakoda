<template>
  <v-app color="#e5f9e0">
    <v-navigation-drawer app width=250 mobile-break-point=800 v-model="drawer">
      <v-toolbar flat>
        <v-btn icon @click="drawer = !drawer"><v-icon>arrow_back</v-icon></v-btn>
      </v-toolbar>
      <v-list>
        <v-list-tile
        :key="home"
        :to="'/'"
        >
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
      :key="dashboard"
      :to="'/dashboard'"
      >
      <v-list-tile-action>
        <v-icon>dashboard</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Dashboard</v-list-tile-title>
    </v-list-tile>
    <v-list-group
    prepend-icon="create"
    value="true"
    >
    <template v-slot:activator>
      <v-list-tile>
        <v-list-tile-title>Neuer Eintrag</v-list-tile-title>
      </v-list-tile>
    </template>
    <v-list-tile
    :key="yourday"
    :to="'/yourday'"
    >
    <v-list-tile-action>
      <v-icon>today</v-icon>
    </v-list-tile-action>
    <v-list-tile-title>Mein Tag</v-list-tile-title>
  </v-list-tile>
  <v-list-tile
  :key="yoursymptoms"
  :to="'/yoursymptoms'"
  >
  <v-list-tile-action>
    <v-icon>face</v-icon>
  </v-list-tile-action>
  <v-list-tile-title>Meine Auffälligkeiten</v-list-tile-title>
</v-list-tile>
</v-list-group>
<v-list-tile
:key="about"
:to="'/about'"
>
<v-list-tile-action>
  <v-icon>info</v-icon>
</v-list-tile-action>
<v-list-tile-title>Impressum</v-list-tile-title>
</v-list-tile>



</v-list>
</v-navigation-drawer>

<v-toolbar app clipped-left>
  <v-btn icon @click="drawer = !drawer"><v-icon>menu</v-icon></v-btn>
  <v-toolbar-title class="headline">
    <span class="font-weight-light">anakoda</span>
  </v-toolbar-title>
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
      menu_items: [
        { title: 'Home', icon: 'home', target:"/" },
        { title: 'Dashboard', icon: 'dashboard', target:"/dashboard" },
        { title: 'Einträge erfassen', icon: 'today', target:"/yourdata" ,
        sub_items:[
          { title: 'Mein Tag', icon: 'today', target:"/yourday" },
          { title: 'Neuer Eintrag', icon: 'create', target:"/yoursymptoms" },
        ]
      },
      { title: 'Impressum', icon: 'info', target:"/about" },
    ],
    drawer: "true"
  }
}
}
</script>
