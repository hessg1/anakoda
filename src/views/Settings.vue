<template>
<v-container fluid grid-list-lg>
  <v-layout column wrap>
    <h2>Einstellungen</h2>
    <p>Hier kannst du einige Einstellungen tätigen.</p>
    <v-flex>
      <v-card>
        <v-card-text>
          Wähle "Eingeloggt bleiben", um die Verbindung mit MIDATA zu behalten, auch wenn du das Browser-Fenster schliesst oder länger als sechs Stunden eingeloggt bist. Beachte aber, dass in diesem Fall andere Menschen, die den selben Computer benutzen, Zugriff auf deine Daten haben.<br />

          </v-card-text>
        <v-card-actions>
          <v-switch v-model="loggedIn" label="Eingeloggt bleiben"></v-switch>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-text>
          Wähle diese Option, um auch unlogische Einträge von MIDATA anzuzeigen. Dies wirkt sich nur
          auf "Meine Daten" aus. Im Dashboard werden unlogische Einträge nie angezeigt, und auch nicht
          in Berechnungen einbezogen.<br />
          Unlogische Einträge sind zum Beispiel solche, bei denen die Start-
          nach der End-Zeit liegt. Sie können durch Software-Fehler oder durch das
          Verwenden schlecht geprüfter Apps entstehen.
        </v-card-text>
        <v-card-actions>
          <v-switch v-model="showInvalid" label="Unlogische Einträge auch anzeigen"></v-switch>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-text>
        Falls du Einstellungen an deinem MIDATA-Profil vornehmen möchtest, kannst du dies im MIDATA-Portal tätigen.
      </v-card-text>
      <v-card-actions>
        <v-btn class="primary--text" href="https://ch.midata.coop/#/portal/login" target="_blank">Zum MIDATA-Portal</v-btn>
      </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>


export default {
  components: {

  },
  data() {
    return {
      loggedIn: false,
      showInvalid: false
    }
  },
  mounted(){
    this.loggedIn = this.$midataService.keepToken;
    this.showInvalid = localStorage.getItem("showInvalid") == 'true';
  },
  watch: {
    loggedIn(){
      this.$midataService.keepToken = this.loggedIn;
      localStorage.setItem("keepToken", this.loggedIn);
      if(this.loggedIn == false){
        localStorage.removeItem("oauth-token");
        localStorage.removeItem("oauth-refreshtoken");
        localStorage.removeItem("oauth-tokeneol");
      }
      else{
        localStorage.setItem("oauth-token", this.$midataService.token);
        localStorage.setItem("oauth-refreshtoken", this.$midataService.refreshToken);
        localStorage.setItem("oauth-tokeneol", this.$midataService.tokenEOL);
      }
    },
    showInvalid(){
      localStorage.setItem("showInvalid", this.showInvalid);
    }
  }
}
</script>
