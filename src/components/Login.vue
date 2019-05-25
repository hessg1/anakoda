<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <v-card>
      <v-card-title
        class="headline primary lighten-2"
        primary-title
      >
        Noch nicht eingeloggt
      </v-card-title>

      <v-card-text>
        <p>Melde dich auf der Startseite mit MIDATA an, damit du anakoda nutzen kannst.
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
</template>
<script>
export default {
  data: () => ({
    dialog: false
  }),

mounted(){
  if(this.$midataService.isReady()){
    this.dialog = false;
  }
  else{
    this.dialog = true;
  }
},


}

</script>
