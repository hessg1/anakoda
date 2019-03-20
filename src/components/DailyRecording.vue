<template>
  <v-container>
    <h2>Dein Tag</h2>
    <p>Hier kannst du dein alltägliches Verhalten erfassen.<br>
      Ein geregelter Alltag kann beireits Migräneanfälle minimieren.</p>

      <v-stepper v-model="pos" vertical>
        <v-stepper-step :complete="pos > 1" step="1" editable color="#0a967a">
          Datum
          <small>Für welchen Tag gelten diese Daten?</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card>
            <v-card-text>
              <v-flex>
                <p>Dieser Eintrag gillt für:</p>
                <v-select
                v-model="entry"
                :items="items"
                menu-props="auto"
                single-line
                color="#0a967a"
                >
              </v-select>
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
                @blur="date = parseDate(dateFormatted)"
                color="#0a967a"
                ></v-text-field>
              </template>
              <v-date-picker
              v-model="date"
              color="#0a967a"
              no-title
              @input="menudate = false"
              locale="de-ch"
              first-day-of-week="1"
              :max="today"
              ></v-date-picker>
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
    <small>Wie war dein Essverhalten?</small>
  </v-stepper-step>

  <v-stepper-content step="2">
    <v-card>
      <v-card-text>
        <v-radio-group v-model="eating" row align-center>
          <v-radio label="Regelmässig" value="regulary" color="#0a967a" @change="pos = 3"></v-radio>
          <v-radio label="Unregelmässig" value="irregulary" color="#0a967a" @change="pos = 3"></v-radio>
          <v-radio label="Unbekannt" value="unknown" color="#0a967a" @change="pos = 3"></v-radio>
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
  <small>Wie war dein Schlafverhalten?</small>
</v-stepper-step>

<v-stepper-content step="3">
  <v-card>
    <v-card-text>
      <v-layout row>
        <v-flex xs11 sm5>
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
            ></v-text-field>
          </template>
          <v-time-picker
          v-if="menutimestart"
          v-model="timestart"
          format="24hr"
          color="#0a967a"
          full-width
          @click:minute="$refs.menutimestart.save(timestart)"
          ></v-time-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 sm6 md5>
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
          color="#0a967a"
          ></v-text-field>
        </template>
        <v-date-picker
        v-model="datestart"
        color="#0a967a"
        no-title
        @input="menudatestart = false"
        locale="de-ch"
        first-day-of-week="1"
        :max="date"
        ></v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs11 sm5>
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
        readonly
        v-on="on"
        color="#0a967a"
        ></v-text-field>
      </template>
      <v-time-picker
      v-if="menutimeend"
      v-model="timeend"
      format="24hr"
      color="#0a967a"
      full-width
      @click:minute="$refs.menutimeend.save(timeend)"
      ></v-time-picker>
    </v-menu>
  </v-flex>
  <v-spacer></v-spacer>
  <v-flex xs12 sm6 md5>
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
      @blur="dateend = parseDate(dateendFormatted)"
      color="#0a967a"
      ></v-text-field>
    </template>
    <v-date-picker
    v-model="dateend"
    color="#0a967a"
    no-title
    @input="menudateend = false"
    locale="de-ch"
    first-day-of-week="1"
    :max="date"
    ></v-date-picker>
  </v-menu>
</v-flex>
</v-layout>
</v-card-text>
<v-subheader>Schlafqualität</v-subheader>
<v-card-text>
  <v-slider
  v-model="quality"
  thumb-label="always"
  min="0"
  max="10"
  append-icon="mood"
  prepend-icon="mood_bad"
  color="#0a967a"
  @click:append="qualityPlus"
  @click:prepend="qualityMinus"
  ></v-slider>
</v-card-text>
<v-card-actions>
  <v-btn
  color="#0a967a"
  class="white--text">
  Speichern
  <v-icon right dark>save</v-icon>
</v-btn>
</v-card-actions>
</v-card>
</v-stepper-content>
</v-stepper>

</v-container>
</template>

<script>
export default {
  data: app => ({
    today: new Date().toISOString().substr(0, 10),
    pos: 0,
    items: ['heute', 'gestern', 'vorgestern', 'einen anderen Tag'],
    entry: "heute",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: app.formateDate(new Date().toISOString().substr(0, 10)),
    menudate: false,
    eating: 'regulary',
    datestart: new Date().toISOString().substr(0, 10),
    datestartFormatted: app.formateDate(new Date().toISOString().substr(0, 10)),
    menudatestart: false,
    dateend: new Date().toISOString().substr(0, 10),
    dateendFormatted:app.formateDate(new Date().toISOString().substr(0, 10)),
    menudateend: false,
    timestart: null,
    menutimestart: false,
    timeend: null,
    menutimeend: false,
    quality: 5
  }),

  watch: {
    date () {
      this.dateFormatted = this.formateDate(this.date)
      this.datestart = this.date;
      this.dateend = this.date;
    },
    datestart () {
      this.datestartFormatted = this.formateDate(this.datestart)
    },
    dateend () {
      this.dateendFormatted = this.formateDate(this.dateend)
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
    //Form Date to Swiss standard DD.MM.YYYY
    formateDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    //Parse Date to ISO 8601 format
    parseDate (date) {
      if (!date) return null

      const [day, month , year] = date.split('.')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    //Correct the day of the date and parse to ISO 8601 format
    generateDate (date, val) {
      var d = date.substr(0, 8);
      var dt = parseInt(date.substr(8, 10)) + val;
      if (dt < 10) {
        dt = '0' + dt;
      }

      return d + dt;

    },
    //Lower the quality of sleep when pressing the icon
    qualityMinus () {
      this.quality = (this.quality - 1) || 0
    },
    //Increase the quality of sleep when pressing the icon
    qualityPlus () {
      this.quality = (this.quality + 1) || 10
    }
  }
}
</script>
