import $ from 'jquery';
const serviceUri = "https://test.midata.coop/fhir/";
const client = "anakoda";

export default class MidataService {
  /*
    Constructor for MidataService class. Sets up a environment to communicate
    with a MIDATA instance using FHIR.
    parameters  - serviceUri: the URI of the service, e.g. https://test.midata.coop/fhir
                - client: the name of the App communicating with MIDATA
    returns     a MidataService
    author      hessg1
    version     2019-04-01
*/
  constructor(){
    if(localStorage.getItem("oauth-client") == client){ // load midata information from storage
      this.uri = JSON.parse(localStorage.getItem("oauth-uri"));
      this.resources = JSON.parse(localStorage.getItem("oauth-resources"));
      this.state = Number(localStorage.getItem("oauth-state"));
      this.lang = "de";
      this.token = localStorage.getItem("oauth-token") || "";
      this.refreshToken = localStorage.getItem("oauth-refreshtoken") || "";
      this.tokenEOL = Number(localStorage.getItem("oauth-tokeneol") || Date.now());
      if(this.token == ""){
        this.token = sessionStorage.getItem("oauth-token") || "";
        this.refreshToken = sessionStorage.getItem("oauth-refreshtoken") || "";
        this.tokenEOL = Number(sessionStorage.getItem("oauth-tokeneol") || Date.now());
      }
      this.client = client;
      this.patient = localStorage.getItem("patientId") || "";
      this.keepToken = localStorage.getItem("keepToken") == 'true';

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
      this.lang = "de";
      this.token = "";
      this.refreshToken = "";
      this.patient = "";
      this.keepToken = false; // determines if token is kept in localStorage or in sessionStorage (and thus deleted when Browser Tab is closed)

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
      });
      localStorage.setItem("keepToken", this.keepToken);
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
    version     2019-04-01
  */
  fetchToken(){
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

    if(state == this.state){
      console.log("correct state: " + state);
    }
    else {
      console.log("warning: incorrect state!");
    }

    // ajaxing to MIDATA for getting the token
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
      this.patient = res.patient;
      if(this.keepToken){
        localStorage.setItem("oauth-token", res.access_token);
        localStorage.setItem("oauth-refreshtoken", res.refresh_token);
        localStorage.setItem("oauth-tokeneol", this.tokenEOL);
      }
      else{
        sessionStorage.setItem("oauth-token", res.access_token);
        sessionStorage.setItem("oauth-refreshtoken", res.refresh_token);
        sessionStorage.setItem("oauth-tokeneol", this.tokenEOL);
      }
      localStorage.setItem("patientId", res.patient);

    }).catch(err => {
      console.log("error retrieving token:");
      console.log(err)
    });

    // remove the parameters from the url
     window.history.pushState('',document.title,window.location.toString().split("?")[0]);

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
    if(!query || query == ''){
      throw("Kann keine leere Anfrage machen.");
    }
    const url = this.uri.service + "/" + query;
    const header =  "Bearer " + this.token;

    if(this.token == ""){
      console.log("please... get a token.");
      // TODO: handle missing token (e.g. get authorization)
    }
    else {
      // ajax-request to midata
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": header
        },
      }).done(res => {
        console.log("done");
        console.log(res);
      })
      .catch(err => {
        console.log("Error: " + err.responseText);
        throw(err);
      });
    }
  }

  /*
    Saves data to MIDATA.
    Requires a completely set up MIDATA environment, with token etc.
    parameters  - data: the data object, as a valid FHIR ressource or a FHIR bundle
                        cave: no validation of input!
    returns     a promise with the servers response
    throws      an error, if resourceType is not Bundle or Observation
    author      hessg1
    version     2019-03-19
  */
  saveData(data){
    if(!data){
      throw("Kann nicht NULL speichern.");
    }

    //TODO: validate data for FHIR specs?
    let that = this;
    return new Promise(function(resolve, reject){
      if(that.token == ""){
        reject("No token set, check authorization.");
      }

      // prepare settings
      var ajaxSettings = {
        "async": true,
        "crossDomain": true,
        "url": that.uri.service,
        "method": "POST",
        "headers": {
          "Content-Type": "application/fhir+json",
          "Authorization": "Bearer " + that.token,
          "cache-control": "no-cache"
        },
        "data": JSON.stringify(data),
        "error": function(err){
          //console.log(err);
          reject("An error occured (" + err.status + "): " + err.statusText );
        },
        "success": function(response){
          //console.log(response);
          resolve("saved to midata: " + response);
        }
      }

      if(data.resourceType == "Bundle"){
        ajaxSettings.success = function(response){
          resolve("bundle saved, id=" + response.id);
        }
        $.ajax(ajaxSettings);

      }
      else if(data.resourceType == "Observation" || data.resourceType == "MedicationStatement"){
        // if we have an Observation, we have to adjust the service URI
        ajaxSettings.url += "/" + data.resourceType; // add "/Observation" to URL
        $.ajax(ajaxSettings);

      }
      else {
        reject("Error: can not handle datatype " + data.resourceType + " yet.");
      }
    });
  }

  /*
    Packs single resources into a FHIR bundle
    parameters  - an array of resources to be bundled (as valid FHIR / JSON)
    returns     a bundle in JSON
    author      hessg1
    version     2019-03-20
  */
  bundle(resources){
    if(Array.isArray(resources) && resources.length > 0){
      // initialize the bundle
      let bundle = {
        "resourceType": "Bundle",
        "type": "transaction",
        "id": "bundle-transaction",
        "entry": []
      }
      for(var i in resources){
      // build the objects wrapping the individual resources
        let res = {
          "request": {
            "method": "POST",
            "url": resources[i].resourceType,
          },
          "resource": resources[i]
        }
        // and put them into the bundle
        bundle.entry.push(res);
      }
      return bundle;
    }
    else{
      throw("Invalid argument: \"resources\" must be an Array with at least one element");
    }
  }


  /*
    Removes the MIDATA related data from localstorage and thus logs out the user.
    parameters  none
    returns     nothing, just clears the memory and does a reload
    author      hessg1
    version     2019-04-01
  */
  logout(){
    localStorage.removeItem("oauth-client");
    localStorage.removeItem("oauth-refreshtoken");
    sessionStorage.removeItem("oauth-refreshtoken");
    localStorage.removeItem("oauth-resources");
    localStorage.removeItem("oauth-state");
    localStorage.removeItem("oauth-token");
    sessionStorage.removeItem("oauth-token");
    localStorage.removeItem("oauth-tokeneol");
    sessionStorage.removeItem("oauth-tokeneol");
    localStorage.removeItem("oauth-uri");
    localStorage.removeItem("patient");
    location.reload();
  }

  /*
    Checks if MIDATA environment is ready, with a token set
    parameters  none
    returns     - true, if a token is set and not expired (cave: token can still be invalid!)
                - false, if no token is set or token has expired
    author      hessg1
    version     2019-03-20
  */
  isReady(){
    if(this.token == "" || (this.tokenEOL < Number(Date.now()) - 60000))
      return false;
    return true;
  }
}
