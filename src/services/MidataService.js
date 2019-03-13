import $ from 'jquery';

export default class MidataService {
  /*
    Constructor for MidataService class. Sets up a environment to communicate
    with a MIDATA instance using FHIR.
    parameters  - serviceUri: the URI of the service, e.g. https://test.midata.coop/fhir
                - client: the name of the App communicating with MIDATA
    returns     a MidataService
    author      hessg1
    version     2019-03-13
*/
  constructor(serviceUri, client){
    if(localStorage.getItem("oauth-client") == client){ // load midata information from storage
      console.log("loading midata");
      this.uri = JSON.parse(localStorage.getItem("oauth-uri"));
      this.resources = JSON.parse(localStorage.getItem("oauth-resources"));
      this.state = Number(localStorage.getItem("oauth-state"));
      this.lang = "de";
      this.token = localStorage.getItem("oauth-token") || "";
      this.refreshtoken = localStorage.getItem("oauth-refreshtoken") || "";
      this.tokenEOL = Number(localStorage.getItem("oauth-tokeneol") || Date.now());
      this.client = client;

    }
    else { // create completely new midata object
      this.uri = {
          service: "",
          conformance: "",
          auth: "",
          redirect: "",
          token: ""
        };
      this.resources = ""
      this.state = "",
      this.ready = false;
      this.lang = "de";
      this.token = "";
      this.refreshToken = "";

      // set up given pameters
      this.uri.service = (serviceUri.charAt(serviceUri.length - 1) == "/") ? serviceUri.substring(0, serviceUri.length - 1) : serviceUri;
      this.client = client;
      this.uri.conformance = serviceUri + "/metadata";
      localStorage.setItem("oauth-client", this.client);

      // generate a state ID - random generated number is not entirely collision proof, but it will do for now
      this.state = Math.round(Math.random()*100000000).toString();
      localStorage.setItem("oauth-state", this.state);

      // query the conformance server for auth and token URI
      let that = this;
      $.get(this.uri.conformance, "json").
        then(r=>{
        console.log(r);
        const smartExtension = r.rest[0].security.extension[0].extension;
        smartExtension.forEach(function(element) {
          if(element.url === "authorize") {
            that.uri.auth = element.valueUri;
          } else if(element.url === "token") {
            that.uri.token = element.valueUri;
          }
        });
        // save available ressources:
        that.resources = r.rest[0].resource;
        localStorage.setItem("oauth-resources", JSON.stringify(that.resources));

        // save URIS to localstorage
        localStorage.setItem("oauth-uri", JSON.stringify(that.uri));

      //  that.ready = true;
        console.log("new MIDATA created and saved");
      });
    }
  }

  /*
    Opens a new window where the User can enter the credentials.
    parameters
                - redirectUri: the Uri of the app that handles the oAuth2 token
                  request with MIDATA. CAVE: exact URI must be registered on
                  MIDATA in order to work
    returns     nothing
    author      hessg1
    version     2019-03-13
  */
  requestAuth(redirectUri){
    this.uri.redirect = redirectUri;
    localStorage.setItem("oauth-uri", JSON.stringify(this.uri));

    // build and open the request url
    window.location.href = this.uri.auth + "?" +
        "response_type=code&" +
        "client_id=" + encodeURIComponent(this.client) + "&" +
        "scope=" + encodeURIComponent(this.scope) + "&" +
        "redirect_uri=" + encodeURIComponent(this.uri.redirect) + "&" +
        "aud=" + encodeURIComponent(this.uri.service) + "&" +
        "state=" + this.state + "&language=" + this.lang;
  }

  /*
    Handles the URL parameters from a auth response (triggered by requestAuth
    and subsequently the user inputting correct credentials on midata)
    parameters  - urlParams: the GET parameters from
    returns     nothing, but sets token and gets MIDATA client ready
    author      hessg1
    version     2019-03-13
  */
  fetchToken(){
    console.log("we are on " + window.location.search);
    let state = "";
    let code = "";
    state + code; // this is for no other purpose than to prevent a faulty warning of "state" and "code" never being used

    // extract code and state from URL (code based on
    // http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html)
    var sURLVariables = window.location.search.substring(1).split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == "state") {
            state = decodeURIComponent(sParameterName[1].replace(/\+/g, '%20'));
        }
        if (sParameterName[0] == "code") {
            code = decodeURIComponent(sParameterName[1].replace(/\+/g, '%20'));
        }
    }

    // TODO: check if state is correct (once MIDATA object is persisted and not
    // always created on mount)
    if(state == this.state){
      console.log("correct state: " + state);
    }
    else {
      console.log("warning: incorrect state!");
    }

    // ajaxing to MIDATA for getting the token
    console.log("ajax token to " + this.uri.token);
    var that = this; // so "this" is available inside the
    $.ajax({
      url: this.uri.token,
      type: 'POST',
      data: {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: that.uri.redirect,
        client_id: that.client
      }
    }).done(res => {
      console.log("success:");
      console.log(res)
      this.token = res.access_token;
      this.refreshToken = res.refresh_token;
      this.tokenEOL = Date.now() + (1000 * res.expires_in);
      localStorage.setItem("oauth-token", res.access_token);
      localStorage.setItem("oauth-refreshtoken", res.refresh_token);
      localStorage.setItem("oauth-tokeneol", this.tokenEOL);
      this.log("token set to " + this.token);

    }).catch(err => {
      console.log("ups: ");
      console.log(err)
    });

  }

  /*
    Retrieves Data from MIDATA.
    Requires a completely set up MIDATA environment, with Token etc.
    TODO: detailed description
    parameters  - query: a string with the wanted midata-query
    returns     TODO
    author      hessg1
    version     2019-03-13
  */
  getData(query){
    const url = this.uri.service + "/" + query;
    const header =  "Bearer " + this.token;

    if(this.token == ""){
      console.log("please... get a token.");
      // TODO: handle missing token (e.g. get authorization)
    }
    else {
    console.log("url: " + url + " header: " + header);
      // ajax-request zu midata
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": header
        },
      }).done(res => {
        console.log("done");
        console.log(res.entry[0].resource);
      })
      .catch(err => {
        console.log("Fehler: " + err.responseText);
      });
    }
  }

  /*
    Convenience function for parsing of URL parameters
    from SMART on FHIR: http://docs.smarthealthit.org/tutorials/authorization/,
    based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
  */
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

}
