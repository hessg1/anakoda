<template>
  <div class="home">
    <!--img alt="Vue logo" src="../assets/logo.png"-->
    <a href="#" @click="connect('susanne@mueller.ch', 'MiSusanne1')">"🐍"</a>
    <br>serviceUri: {{serviceUri}} | conformance: {{conformanceUri}}
    <br>scope: {{scope}} | state: {{state}}
    <br>launch: {{launchUri}} | redirect: {{redirectUri}}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import $ from 'jquery';

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      serviceUri: "http://test.midata.coop/fhir",
      scope: "-",
      state: "-",
      launchUri: "-",
      redirectUri: "-",
      conformanceUri: "-"
    }
  },

  methods: {
    connect(name, pw){
      console.log("method connect");

      this.scope = [
        "patient/*.read",
        "launch"
      ].join(" ");
      this.state = Math.round(Math.random()*100000000).toString();

      this.launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
      this.redirectUri = this.launchUri.replace("launch.html","index.html");
      this.conformanceUri = this.serviceUri + "/metadata";
      var token =  "V1Y3ujgxz-SOGUHf00N3l8a1HUtqBTT8gHT--17DO6E25ZonJIOP7eCIKLgie3DhNlIxGChmCsLmM3AVda0ktjs47tTqBLYAan_8XJ03846S4LwOebf8JEpj0Oc8XqfflLkizFD6uIRa6WvMOdfj9zDYWWy0gcYbOkgpheAZHogMrQ9WTZk4vpdD55FZ9wDU";
      $.ajax({
        url: "https://test.midata.coop/fhir/Patient",
        type: "GET",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + token
        }
        }).done(patList => {
          console.log(patList);
        });
    }
  }
}
</script>
