const serviceUri = "https://test.midata.coop/fhir/";
const client = "anakoda";

import $ from 'jquery';
import SnomedService from '@/services/SnomedService';
const sct = new SnomedService();

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
    localStorage.setItem('cacheQueries', true);

    this.queryCache = [];
    let cachedUri = "";
    if(localStorage.getItem('oauth-uri')){
      cachedUri = JSON.parse(localStorage.getItem('oauth-uri')).service;
    }
    if(cachedUri == serviceUri || cachedUri + '/' == serviceUri){ // load midata information from storage
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
      this.cacheQueries = localStorage.getItem("cacheQueries") == 'true';
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
      this.cacheQueries = true; // determines if queries are cached

      // set up given parameters
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
        // save available resources:
        that.resources = r.rest[0].resource;
        localStorage.setItem("oauth-resources", JSON.stringify(that.resources));

        // save URIS to localstorage
        localStorage.setItem("oauth-uri", JSON.stringify(that.uri));
      });
      localStorage.setItem("keepToken", this.keepToken);
      localStorage.setItem("cacheQueries", this.cacheQueries);
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
    returns     - a Promise with the response of the midata server
    author      hessg1
    version     2019-04-10
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
    var that = this; // so "this" is available inside
    return new Promise(function(resolve, reject){
      // ajaxing to MIDATA for getting the token

      $.ajax({
        url: that.uri.token,
        type: 'POST',
        data: {
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: that.uri.redirect,
          client_id: that.client
        }
      }).done(res => {
        console.log("token successful");
        that.token = res.access_token;
        that.refreshToken = res.refresh_token;
        that.tokenEOL = Date.now() + (1000 * res.expires_in);
        that.patient = res.patient;
        // check if logged in patient is the same as last logged in
        if(localStorage.getItem("patientId") != res.patient){
          // if we have another patient, we need to clear the localStorage
          localStorage.clear();
          localStorage.setItem("patientId", res.patient);
          localStorage.setItem("oauth-client", that.client);
          localStorage.setItem("oauth-state", that.state);
          localStorage.setItem("oauth-uri", JSON.stringify(that.uri));
          localStorage.setItem("keepToken", that.keepToken);
        }
        if(that.keepToken){
          localStorage.setItem("oauth-token", res.access_token);
          localStorage.setItem("oauth-refreshtoken", res.refresh_token);
          localStorage.setItem("oauth-tokeneol", that.tokenEOL);
        }
        else{
          sessionStorage.setItem("oauth-token", res.access_token);
          sessionStorage.setItem("oauth-refreshtoken", res.refresh_token);
          sessionStorage.setItem("oauth-tokeneol", that.tokenEOL);
        }

        resolve(res);

      }).catch(err => {
        console.log("error retrieving token:");
        console.log(err);
        reject(err);
      });
    });



  }

  /*
    Retrieves Data from MIDATA.
    Requires a completely set up MIDATA environment, with Token etc.
    parameters  - query: a string with the wanted midata-query
    returns     - a cached FHIR bundle from MIDATA, if it was cached
                  null if the query was not cached
    author      hessg1
    version     2019-05-01
  */
  getCachedData(query){
      // limit query to actual patient
    if(!query.includes('atient')){ // so we cover 'Patient' and 'patient'
      if(query.includes('?')){
        query += '&patient=' + this.patient;
      }
      else{
        query += '?patient=' + this.patient;
      }
    }

    for(let i in this.queryCache){
      if(this.queryCache[i][0] == query){
        return this.queryCache[i][1];
      }
    }
    return null;
  }

  /*
    Retrieves Data from MIDATA.
    Requires a completely set up MIDATA environment, with Token etc.
    parameters  - query: a string with the wanted midata-query
    returns     - a promise with either the FHIR bundle as returned from
                  MIDATA (resolve) or an error (reject)
    author      hessg1
    version     2019-04-09
  */
  getData(query){
    if(!query || query == ''){
      throw("Kann keine leere Anfrage machen.");
    }
    if(this.token == ""){
      throw("please... get a token.");
      // TODO: handle missing token (e.g. get authorization)
    }
    else {
      // limit query to actual patient
      if(!query.includes('atient')){
        if(query.includes('?')){
          query += '&patient=' + this.patient;
        }
        else{
          query += '?patient=' + this.patient;
        }
      }
      const url = this.uri.service + "/" + query;
      const header =  "Bearer " + this.token;
      let that = this;
      return new Promise(function(resolve, reject){
        // check in cache
        let result = null;
        if(that.cacheQueries){
          result = that.getCachedData(query)
        }
        if(result){
          resolve(result);
        }
        else{
          // ajax-request to midata
          $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            headers: {
                "Authorization": header
            },
          }).done(res => {
            //write query to cache
            that.queryCache.push([query, res]);
            resolve(res);
          })
          .catch(err => {
            console.log("Error: " + err.responseText);
            reject(err);
          });
        }



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
          console.log(err);
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
  Processes a FHIR bundle into easier to handle JSON objects with all relevant data
  parameters  - res: a FHIR bundle as retrieved from MIDATA (and as returned
                     from getData()), containing Patient and / or Observation resources.
  returns     - an array of Objects, containing Observations and / or patient object
                (depending on resources in bundle)
  throws      - an error if the bundly contains any non patient- or observation resource
  author      hessg1
  version     2019-04-11
  */
  prepareData(res){
    if(typeof res != 'object' ){
      throw("Fehler: Ungültige Eingabe (res ist kein Objekt)");
    }
    let data = [];
    if(res.resource){ // catch if only one resource instead of a bundle was passed as argument
      res.entry = [];
      res.entry.push(res);
    }
    for(var i in res.entry){
      if(res.entry[i].resource.resourceType == 'Observation'){

        // create template object from SnomedService
        let code = "";
        let invalid = true;
        if(res.entry[i].resource.valueCodeableConcept != undefined){
          code = res.entry[i].resource.valueCodeableConcept.coding[0].code;
          invalid = false;
        }
        else if(res.entry[i].resource.component[0].code != undefined) {
          code = res.entry[i].resource.component[0].code.coding[0].code;
          invalid = false;
        }


        // we have to catch possible "other diagnosis" and "other headache",
        // which are persisted with a wrong and colliding SNOMED code in heMigrania
        if(code == "74964007" && res.entry[i].resource.code.coding[0].code == "418138009"){ // diagnosis
          code = "74964007d"
        }
        if(code == "74964007" && res.entry[i].resource.code.coding[0].code == "162306000"){ // headache
          code = "74964007h"
        }

        // get the template for the sct code from snomed service
        const templateArr = sct.getFiltered(x => (x.code == code));

        // if code was not found in SNOMED CT, we abort and throw an error:
        if(templateArr.length == 0){
          throw("Fehlerhafte Daten: SNOMED-Code " + code + " ist nicht bekannt (Objekt " + i + ").");
        }


        // we only expect this array to have one entry anyway, since code is unique
        // we have to do the json stringify dance, so the object is later not passed by reference,
        // which was causing strange errors
        let template = JSON.parse(JSON.stringify(templateArr[0]));

        // fill template with actual values from resource
        if(template.category == 'EatingHabit' || template.category == 'Diagnosis'){ // EatingHabit and diagnosis has only one Time
          if(res.entry[i].resource.effectiveDateTime){
            template.date = new Date(res.entry[i].resource.effectiveDateTime);

            // mark entries with invalid time values
            invalid = template.startTime > new Date();
          }
          else {
            template.date = new Date(1);
            invalid = true;
          }
        }
        else { // all other have start and end times
          if(res.entry[i].resource.effectivePeriod){
            template.startTime = new Date(res.entry[i].resource.effectivePeriod.start);
            template.endTime = new Date(res.entry[i].resource.effectivePeriod.end);

            // mark entries with invalid time values
            invalid = (template.startTime > template.endTime) || (template.startTime > new Date());
          }
          else{ // some older entries don't even have time entries, and are thus invalid
            template.startTime = new Date(0);
            template.endTime = new Date(1);
            invalid = true;
          }
        }

        if(template.category == 'VariousComplaint' || template.category == 'Headache' || template.category == 'SleepPattern'){
          // these Categories have intensities

          if(res.entry[i].resource.component && res.entry[i].resource.component[0].valueQuantity){ // catch old faulty entries
            template.quantity = res.entry[i].resource.component[0].valueQuantity.value;
          }
          else{
            invalid = true;
          }

        }


        if(template.category == 'Headache'){
          // headaches also have body sites
          if(res.entry[i].resource.bodySite.coding[0]){
            template.bodySiteSCT = res.entry[i].resource.bodySite.coding[0].code;
            template.bodySiteDE = sct.getGerman(template.bodySiteSCT);
          }
          else{
            invalid = true;
          }
        }

        // create metadata
        let meta = {};
        meta.id = res.entry[i].resource.id;
        if(res.entry[i].resource.meta){
          meta.versionId = res.entry[i].resource.meta.versionId;
          meta.timestamp = new Date(res.entry[i].resource.meta.lastUpdated);
          meta.source = res.entry[i].resource.meta.extension[0].extension[0].valueCoding.display;
        }
        else {
          invalid = true;
        }
        meta.invalid = invalid;
        template.meta = meta;
        data.push(template);
      }

      else if(res.entry[i].resource.resourceType == 'Patient'){
        let pat = {};
        pat.id = res.entry[i].resource.id;
        pat.name = res.entry[i].resource.name[0].family;
        pat.firstName = res.entry[i].resource.name[0].given[0];
        pat.fullName = pat.firstName + " " + pat.name;
        pat.birthDate = res.entry[i].resource.birthDate

        let meta = {};
        meta.versionId = res.entry[i].resource.meta.versionId;
        meta.timestamp = res.entry[i].resource.meta.lastUpdated;
        meta.participantId = "";
        // identifier is an array of various identifiers in MIDATA
        let ident = res.entry[i].resource.identifier;
        for(var entry in ident){
          // we want the participant-name the user has in a study
          if (ident[entry].system == 'http://midata.coop/identifier/participant-name'){
            meta.participantId = ident[entry].value;
          }
        }
        pat.meta = meta;
        data.push(pat);
      }
      else if(res.entry[i].resource.resourceType == 'MedicationStatement'){
        let med = {
          code: 'medication',
          category: 'Medication',
          superCategory: '',
          colour: '#FD8DD7'
        };
        let invalid = true;

        if(res.entry[i].resource.medicationCodeableConcept.coding){
          med.en = res.entry[i].resource.medicationCodeableConcept.coding[0].display;
          med.de = med.en;
          invalid = false;
        }

        if(res.entry[i].resource.dosage){
          med.dosage = res.entry[i].resource.dosage[0].doseQuantity.value;
          med.effect = res.entry[i].resource.dosage[0].text;
          med.effect = med.effect == 'Good' ? 'geholfen' : med.effect == 'Bad' ? 'die Situation verschlechtert' : 'nicht geholfen';
        }
        else{
          med.dosage = 0;
          invalid = true;
        }

        med.taken = res.entry[i].taken == 'y';


        if(res.entry[i].resource.effectiveDateTime){
          med.date = new Date(res.entry[i].resource.effectiveDateTime);

          // mark entries with invalid time values
          invalid = med.startTime > new Date();
        }
        else {
          med.date = new Date(1);
          invalid = true;
        }

        // heMIGrania had a bug that persisted medication statements wrong until 10.5.2019
        // if(new Date(res.entry[i].resource.meta.lastUpdated) < new Date("2019-05-10")){
        //   invalid = true;
        // }

        // create metadata
        let meta = {};
        meta.id = res.entry[i].resource.id;
        if(res.entry[i].resource.meta){
          meta.versionId = res.entry[i].resource.meta.versionId;
          meta.timestamp = new Date(res.entry[i].resource.meta.lastUpdated);
          meta.source = res.entry[i].resource.meta.extension[0].extension[0].valueCoding.display; // this is a bit shaky and should be done more flexible for generalisation
        }
        else {
          invalid = true;
        }
        meta.invalid = invalid;
        med.meta = meta;

        data.push(med);
      }
      else{
        throw("Fehler: Kann momentan nur Bundles mit Observation-, MedicationStatement- oder Patient-Ressourcen verarbeiten.");
      }
    }
    return data;
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
