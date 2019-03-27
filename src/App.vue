<template>
  <v-app color="#e5f9e0">
    <v-navigation-drawer app width=250 mobile-break-point=800 v-model="drawer">
    <v-toolbar flat>
      <v-btn icon @click="drawer = !drawer"><v-icon>arrow_back</v-icon></v-btn>
    </v-toolbar>
    <v-list  class="pt-0">
      <v-list-tile
        v-for="item in menu_items"
        :key="item.title"
        :to="item.target"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
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
          { title: 'Dein Tag erfassen', icon: 'today', target:"/yourdata" },
          { title: 'Symptome erfassen', icon: 'mood', target:"/yourdata" },
          { title: 'Impressum', icon: 'info', target:"/about" },
        ],
      drawer: "true"
    }
  }
}
</script>
