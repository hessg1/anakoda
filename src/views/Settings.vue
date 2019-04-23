<template>
<v-container>
  <h2>Einstellungen</h2>
  <p>Hier kannst du einige Einstellungen tätigen.</p>
  <v-switch v-model="loggedIn" label="Eingeloggt bleiben"></v-switch>
  <p>Wähle "Eingeloggt bleiben", um die Verbindung mit MIDATA zu behalten, auch wenn du das Browser-Fenster schliesst.<br />
    Beachte aber, dass in diesem Fall andere Menschen, die den selben Computer benutzen, Zugriff auf deine Daten haben.<br />
    Ausserdem kann es dennoch vorkommen, dass die Verbindung nach einiger Zeit von MIDATA getrennt wird.</p>
  <v-switch v-model="showInvalid" label="Unlogische Einträge auch anzeigen"></v-switch>
  <p>Wähle diese Option, um auch unlogische Einträge von MIDATA anzuzeigen. Unlogische Einträge sind zum Beispiel solche, bei denen die Start-
    nach der End-Zeit liegt.<br />
    Unlogische Einträge können durch Software-Fehler oder durch das Verwenden schlecht geprüfter Apps entstehen.</p>
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
    this.loggedin = this.$midataService.keepToken;
    this.showInvalid = localStorage.getItem("showInvalid");
  },
  watch: {
    loggedIn(){
      this.$midataService.keepToken = this.loggedIn;
      localStorage.setItem("keepToken", this.loggedIn);
    },
    showInvalid(){
      localStorage.setItem("showInvalid", this.showInvalid);
    }
  }
}
</script>
