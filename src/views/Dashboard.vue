<template><div>
<v-img :src="require('../assets/dashboard_prvw.png')"></v-img>
<v-dialog
      v-model="dialog"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          coming soon...
        </v-card-title>

        <v-card-text>
          <p>Das Dashboard ist in anakoda 0.2 noch nicht verfügbar.</p>
          <p>
          Das Dashboard wird in einer ersten
          Version mit anakoda 0.3 eingeführt, die im Mai erscheint. Bis dann kannst du
          deine Daten unter <a href="#/dataview">Meine Daten</a> einsehen.

        </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            :to="'/'"
          >
            OK
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
</div>
</template>

<script>


export default {
  data () {
      return {
        dialog: true
      }
    },
  components: {
  }
}
</script>
