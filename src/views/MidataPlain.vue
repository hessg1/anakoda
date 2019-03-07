<template>
  <v-container>
    <h1>MIDATA</h1>
    <p>Ohni Plugin, imfall, nur bitz jQuery.</p>
    <v-btn @click="auth()">klick do zum verbinde</v-btn>
    <v-btn v-if="this.token != ''" @click="getData()">und do zum Date lade</v-btn>
    <p v-if="this.data.name != ''">Hallo {{data.firstname}} {{data.name}}, du hast am {{data.birthdate}} Geburtstag, oder?</p>
  </v-container>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'midata-plain',
  components: {

  },

  data() {
    return {
      serviceUri: "http://test.midata.coop/fhir",
      conformanceUri: "http://test.midata.coop/fhir/metadata",
      redirectUri: "http://localhost:8080/midataplain/",
      tokenUri: "https://test.midata.coop/v1/token", // should not be hardcoded but got from conformanceUri
      client: "migrEnTest",
      scope: "",
      state: "",
      token: "",
      query: "Patient",
      log_history: [],
      data: {
        name: "",
        firstname: "",
        birthdate: ""
      }
    }
  },

  methods: {
    auth(){
      this.log("Auth clicked");

      // define scope of the access we want TODO: match to our data
      this.scope = [
        "patient/*.read",
        "launch"
      ].join(" ");

      // generate a random state id. TODO: is a bit "hacky", conflicts are theoretically possible
      this.state = Math.round(Math.random()*1000000).toString();

      // build the token request URL
      var url = "https://test.midata.coop/oauth.html#/portal/oauth2?aud=http:%2F%2Flocalhost:8080&client_id=migrEnTest&scope=&response_type=code&state="
      + this.state
      + "&redirect_uri=http:%2F%2Flocalhost:8080%2Fmidataplain%2F";

      url = "https://test.midata.coop/oauth.html#/portal/oauth2?" +
            "response_type=code&" +
            "client_id=" + encodeURIComponent(this.client) + "&" +
            "scope=" + encodeURIComponent(this.scope) + "&" +
            "redirect_uri=" + encodeURIComponent(this.redirectUri) + "&" +
            "aud=" + encodeURIComponent("http://localhost:8080") + "&" +
            "state=" + this.state;

      this.log("query: " + url);


      // open it and get forwarded to MIDATA -> TODO: new window or in an own element?
      window.location.href = url;
    },

    getData(){
      const url = this.serviceUri + "/" + this.query;

      const header =  "Bearer " + this.token;
      this.log("url: " + url + " header: " + header);

      if(this.token != ""){
        // ajax-request zu midata
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          headers: {
              "Authorization": header
          },
        }).done(res => {
          this.log("done");
          console.log(res.entry[0].resource);

          this.data.birthdate = res.entry[0].resource.birthDate;
          this.data.firstname = res.entry[0].resource.name[0].given[0];
          this.data.name = res.entry[0].resource.name[0].family;



        })
        .catch(err => {
          this.log("Fehler: " + err.responseText);
        });
      }
      else {
        this.log("Token unbekannt.");
      }
    },



    // logs a string to the console and to a log history array
    log(str){
      var now = new Date();
      this.log_history.push({
        time: ("0" + now.getHours()).slice(-2) + ":"
            + ("0" + now.getMinutes()).slice(-2) + ":"
            + ("0" + now.getSeconds()).slice(-2) + "."
            + ("00" + now.getMilliseconds()).slice(-3),
        msg: str
      });
      console.log(str);
    },

    // Convenience function for parsing of URL parameters
    // based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
    getUrlParameter(sParam){
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++)
      {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam) {
              var res = sParameterName[1].replace(/\+/g, '%20');
              return decodeURIComponent(res);
          }
      }
    }

  },
  // mounted() is executed when the component is mounted
  mounted(){
    // check if state and code are as parameters in the URL
    // (which means we got redirected from MIDATA authentification)
    if ((typeof this.getUrlParameter("state") !== 'undefined') && (typeof this.getUrlParameter("code") !== 'undefined')){
      // TODO: check if state is correct
      this.state = this.getUrlParameter("state");
      var code = this.getUrlParameter("code");

      this.log("got code: " + code + " and now try ajaxing for token");
      var that = this; // this and that again
      $.ajax({
        url: that.tokenUri,
        type: 'POST',
        data: {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: that.redirectUri,
        client_id: that.client
        }
      }).done(res => {
        that.token = res.access_token;
        that.log("token set to " + this.token);
      }).catch(err => {
        that.log("ups: ");
        that.log(err)
      });
    }
    else {
      this.log("parameters undefined");
    }
  }
}
</script>
