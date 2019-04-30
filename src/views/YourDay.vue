<template>
  <v-container fluid grid-list-lg>
    <v-layout column wrap>
    <Login />
    <h2>Mein Tag</h2>
    <p>Hier kannst du dein alltägliches Befinden erfassen.</p>
    <v-stepper v-model="pos" vertical>
      <v-stepper-step :complete="pos > 1" step="1" editable color="#0a967a">
        Datum
        <small>Für welchen Tag gelten diese Daten?</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card>
          <v-card-text>
            <v-flex>
              <p>Dieser Eintrag gilt für:</p>
              <v-select
              v-model="entry"
              :items="items"
              menu-props="auto"
              single-line
              color="#0a967a"
              />
            </v-flex>
            <v-flex>
              <v-menu
                ref="menudate"
                v-model="menudate"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                v-if="entry === 'einen anderen Tag'"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                  v-model="dateFormatted"
                  label="Alternatives Datum"
                  hint="DD.MM.YYYY"
                  persistent-hint
                  prepend-icon="event"
                  v-on="on"
                  @focus="hideKeyboard()"
                  @blur="date = parseDate(dateFormatted)"
                  color="#0a967a"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  color="#0a967a"
                  no-title
                  @input="menudate = false"
                  locale="de-ch"
                  first-day-of-week="1"
                  :max="today"
                />
              </v-menu>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-btn
            color="#0a967a"
            class="white--text"
            @click="pos = 2"
            >
              Weiter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step :complete="pos > 2" step="2" editable color="#0a967a">
        Essgewohnheit
        <small>Wie hast du gegessen?</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card>
          <v-card-text>
            <v-radio-group v-model="eating" row align-center>
              <v-radio label="Regelmässig" value="289141003" color="#0a967a" @change="pos = 3"></v-radio>
              <v-radio label="Unregelmässig" value="225526009" color="#0a967a" @change="pos = 3"></v-radio>
              <v-radio label="Unbekannt" value="702970004" color="#0a967a" @change="pos = 3"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn
            color="#0a967a"
            class="white--text"
            @click="pos = 3"
            >
              Weiter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step step="3" editable color="#0a967a">
        Schlafgewohnheit
        <small>Wie hast du geschlafen?</small>
      </v-stepper-step>

        <v-stepper-content step="3">
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 md6>
                <v-menu
                ref="menutimestart"
                v-model="menutimestart"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="timestart"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                    v-model="timestart"
                    label="Einschlaf-Zeit"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                    color="#0a967a"
                    />
                  </template>
                  <v-time-picker
                  v-if="menutimestart"
                  v-model="timestart"
                  format="24hr"
                  color="#0a967a"
                  full-width
                  @click:minute="$refs.menutimestart.save(timestart)"
                  />
                </v-menu>
              </v-flex>
              <v-spacer />
              <v-flex xs12 md6>
                <v-menu
                ref="menudatestart"
                v-model="menudatestart"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                    v-model="datestartFormatted"
                    label="Einschlafdatum"
                    hint="DD.MM.YYYY"
                    persistent-hint
                    prepend-icon="event"
                    v-on="on"
                    @blur="datestart = parseDate(datestartFormatted)"
                    @focus="hideKeyboard()"
                    color="#0a967a"
                    />
                  </template>
                  <v-date-picker
                  v-model="datestart"
                  color="#0a967a"
                  no-title
                  @input="menudatestart = false"
                  locale="de-ch"
                  first-day-of-week="1"
                  :max="date"
                  />
                </v-menu>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 md6>
              <v-menu
              ref="menutimeend"
              v-model="menutimeend"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="timeend"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
              >
              <template v-slot:activator="{ on }">
                <v-text-field
                v-model="timeend"
                label="Aufwach-Zeit"
                prepend-icon="access_time"
                @focus="hideKeyboard()"
                readonly
                v-on="on"
                color="#0a967a"
                />
              </template>
              <v-time-picker
              v-if="menutimeend"
              v-model="timeend"
              format="24hr"
              color="#0a967a"
              full-width
              @click:minute="$refs.menutimeend.save(timeend)"
              />
            </v-menu>
          </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 md6>
                <v-menu
                ref="menudateend"
                v-model="menudateend"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                    v-model="dateendFormatted"
                    label="Aufwachdatum"
                    hint="DD.MM.YYYY"
                    persistent-hint
                    prepend-icon="event"
                    v-on="on"
                    @focus="hideKeyboard()"
                    @blur="dateend = parseDate(dateendFormatted)"
                    color="#0a967a"
                    />
                  </template>
                  <v-date-picker
                  v-model="dateend"
                  color="#0a967a"
                  no-title
                  @input="menudateend = false"
                  locale="de-ch"
                  first-day-of-week="1"
                  :max="date"
                  />
                </v-menu>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-subheader>Schlafqualität</v-subheader>
          <v-card-text>
            <v-slider
            v-model="quality"
            always-dirty
            thumb-label="always"
            min="0"
            max="10"
            append-icon="mood"
            prepend-icon="mood_bad"
            color="#0a967a"
            @click:append="qualityPlus"
            @click:prepend="qualityMinus"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="midata != null && timeend != null && timestart != null && midata.isReady()"
            @click="save()"
            color="#0a967a"
            class="white--text">
              Speichern
              <v-icon right dark>save</v-icon>
            </v-btn>
            <v-btn v-if="midata == null || !midata.isReady()"
            disabled
            class="white--text">
              MIDATA nicht bereit
              <v-icon right dark>save</v-icon>
            </v-btn>
            <v-btn v-if="(timeend == null || timestart == null) && (midata != null && midata.isReady())"
            disabled
            class="white--text">
              Schlafenszeit fehlt
              <v-icon right dark>save</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper>
    <v-snackbar v-model="snackbar" :color="snackbarcolor" :timeout="5000" :vertical="true">
      {{ snackbartext }}
      <v-btn v-if="snackbarcolor=='red'" dark flat @click="snackbar = false">schliessen</v-btn>
      <v-btn v-else dark flat to="/">home</v-btn>
    </v-snackbar>
  </v-layout>
  </v-container>
</template>

<script>
import MidataService from '@/services/MidataService';
import { EatingHabit, SleepPattern } from '@/services/ResourceService';
import Login from '@/components/Login';

export default {
  data: app => ({
    today: new Date().toISOString().substr(0, 10),
    pos: 0,
    items: ['heute', 'gestern', 'vorgestern', 'einen anderen Tag'],
    entry: "heute",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
    menudate: false,
    eating: '702970004', // default: unbekannt
    datestart: new Date().toISOString().substr(0, 10),
    datestartFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
    menudatestart: false,
    dateend: new Date().toISOString().substr(0, 10),
    dateendFormatted:app.formatDate(new Date().toISOString().substr(0, 10)),
    menudateend: false,
    timestart: null,
    menutimestart: false,
    timeend: null,
    menutimeend: false,
    quality: 5,
    midata: null,
    snackbartext: "",
    snackbar: false,
    snackbarcolor: ''
  }),
  components: {
    Login
  },


  watch: {
    date () {
      this.dateFormatted = this.formatDate(this.date)
      this.datestart = this.date;
      this.dateend = this.date;
    },
    datestart () {
      this.datestartFormatted = this.formatDate(this.datestart)
    },
    dateend () {
      this.dateendFormatted = this.formatDate(this.dateend)
    },
    entry() {
      if(this.entry === 'gestern'){
        var date1 = new Date().toISOString().substr(0, 10);
        this.date = this.generateDate(date1, -1);
      }
      else if(this.entry === 'vorgestern'){
        var date2 = new Date().toISOString().substr(0, 10);
        this.date = this.generateDate(date2, -2);
      }
      else if(this.entry === 'heute'){
        this.date = new Date().toISOString().substr(0, 10);
      }
    },

    timestart() {
      if(this.timestart >= "17:00" && this.timestart <= "23:59"){
        var date1 = this.date;
        this.datestart = this.generateDate(date1, -1);
      }
      else{
        var date0 = this.date;
        this.datestart = date0;
      }
    }
  },

  methods: {
    /*
    Saves the entered information to MIDATA. Needs a set up MIDATA object, of course.
    parameters: none
    returns:    none, displays the result to the user in a Snackbox
    author:     hessg1
    version:    2019-03-20
    */
    save(){
      try{
        let eat = new EatingHabit(this.date, this.eating);
        let sleep = new SleepPattern(
          this.datestart + "T" + this.timestart + ":00",
          this.dateend + "T" + this.timeend + ":00",
          this.quality);
        let bundle = this.midata.bundle([eat,sleep]);

        this.midata.saveData(bundle)
          .then(res => {
            console.log("Speichern erfolgreich\n" + res);
            this.feedback("Erfolgreich gespeichert.", false);
            this.eating = 702970004;
            this.quality = 5;
            this.timestart = null;
            this.timeend = null;
          })
          .catch(err => {
            this.feedback("Da ist etwas schiefgegangen: " + err, true);
            console.log(err);
          });
      }
      catch(err)
      {
        this.feedback("Da ist etwas schiefgegangen: " + err, true);
        this.timestart = null;
        console.log(err);
      }
    },

    /*
    Displays a SnackBar to the user. If the error parameter is set to true, the
    message is displayed in red.
    parameters: - text: the text displayed to the user
                - error: boolean, if it is an error message (message in red)
    returns:    nothing
    author:     hessg1
    version:    2019-03-27
    */
    feedback(text, error){
      this.snackbarcolor = error ? "red" : "#0a967a";
      this.snackbartext = text;
      this.snackbar = true;
    },

    /*
    Format a Date to string in Swiss standard DD.MM.YYYY
    parameters: - date: a date as ISO8601-string (YYYY-MM-DD)
    returns:    - a date string in the format DD.MM.YYYY
    author:     schwf3
    version:    2019-03-26
    */
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },

    /*
    Format a Date to string to ISO8601 (YYYY-MM-DD)
    parameters: - date: a date string in the format DD.MM.YYYY
    returns:    - a date as ISO-string (YYYY-MM-DD)
    author:     schwf3
    version:    2019-03-26
    */
    parseDate (date) {
      if (!date) return null

      const [day, month , year] = date.split('.')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    /*
    Corrects the day of a date (as iso-string) by a given value, taking into account
    parameters: - date: the original date, as a string compatible to the Date()
                        constructor (e.g ISO8601: YYYY-MM-DD)
                - val: the number of days to correct the date by (e.g. -1 for
                       yesterday)
    returns:    - a date as a string in ISO8601 (YYYY-MM-DD)
    author:     schwf3, refactoring hessg1
    version:    2019-03-26
    */
    generateDate (date, val) {

      // ok, this is going to be a bit ugly with converting the date from string
      // to numbers to date to string, but it ain't stupid if it works:

      // first, convert the string into a date object and get the milliseconds since 1/1/1970
      date = new Date(date).getTime();

      // add or substract the according number of milliseconds and convert into date again
      date = new Date(date + (val * 24 * 60 * 60 * 1000));

      // finally, convert the date object to a string again
      date = date.toISOString().substr(0, 10);

      return date;
    },

    //Lower the quality of sleep when pressing the icon
    qualityMinus () {
      this.quality = (this.quality - 1) || 0
    },

    //Increase the quality of sleep when pressing the icon
    qualityPlus () {
      this.quality = (this.quality + 1) || 10
    },

    /*
    Helper method for not showing software keyboard on smartphones, when a input-
    field is clicked (e.g. with date picker)
    usage: put @focus="hideKeyboard()" into the keyboard-triggering elements properties
    author:     hessg1
    version:    2019-03-29
    */
    hideKeyboard(){
      document.activeElement.blur();
    },
  },
  // mounted is executed when component is mounted
  mounted(){
    // link this.midata to app-wide midataService
    this.midata = this.$midataService;
    // fallback, if something went wrong
    if(this.midata == "") {
      this.midata = new MidataService();
    }

    // if current time is before 4 PM, we assume the user wants to protocol yesterday
    if(new Date().getHours() < 16){
      this.entry = 'gestern';
    }
  }
}
</script>
