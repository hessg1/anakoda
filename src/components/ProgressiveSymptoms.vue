<template>
  <v-container>
    <h2>Deine Symptome</h2>
    <p>Hier kannst du deine Symptome erfassen.</p>

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
              :items="entryoption"
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
  Symptome
  <small>Welche Symptome sind dir aufgefallen?</small>
</v-stepper-step>

<v-stepper-content step="2">
  <v-card>
    <v-subheader>Klicke auf dein erfasstes Symptom um genauere Angaben zu erfassen.</v-subheader>
    <v-card-text>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-combobox
          v-model="symptoms"
          :items="symoption"
          item-text="name"
          label="Deine Symptome"
          chips
          clearable
          solo
          multiple
          >
          <template v-slot:selection="data">
            <v-chip
            :selected="data.selected.name"
            close
            @input="remove(data.item)"
            @click="setCurrent(data.item)"
            v-on="on"
            >
            <strong>{{ data.item.name }}</strong>&nbsp;
            <span>{{data.item.intens}}</span>&nbsp;
            <span>({{data.item.start}} - {{data.item.end}})</span>
          </v-chip>
        </template>
      </v-combobox>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Weitere Angaben</span>
      </v-card-title>
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
              label="Startzeit"
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
        <v-spacer></v-spacer>
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
            label="Endzeit"
            prepend-icon="access_time"
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
    </v-layout>
  </v-card-text>
  <v-subheader>Intensität</v-subheader>
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
    />
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
    <v-btn color="blue darken-1" flat @click="saveData()">Save</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>
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
</v-stepper>
</v-container>
</template>

<script>
export default {
  data: app => ({
    pos: 0,
    entryoption: ['heute', 'gestern', 'vorgestern', 'einen anderen Tag'],
    entry: "heute",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: app.formateDate(new Date().toISOString().substr(0, 10)),
    menudate: false,
    timestart: null,
    menutimestart: false,
    timeend: null,
    menutimeend: false,
    quality: 5,
    symptoms: [],
    symoption: [
      {
        name:'Kopfschmerzen',
        intens:'',
        start: null,
        end: null
      },
      {
        name:'Lichtempfindlichkeit',
        intens:'',
        start: null,
        end: null
      }
    ],
    currentchip: null,
    dialog: false
  }),

  watch: {
    date () {
      this.dateFormatted = this.formateDate(this.date)
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
    },
    remove (item) {
      this.symptoms.splice(this.symptoms.indexOf(item), 1)
      this.symptoms = [...this.symptoms]
    },
    setCurrent (item) {
      this.currentchip = this.symptoms.indexOf(item);
      this.timestart = item.start;
      this.timeend = item.end;
      this.quality = item.intens;
    },
    saveData () {
      this.symptoms[this.currentchip].start = this.timestart;
      this.symptoms[this.currentchip].end = this.timeend;
      this.symptoms[this.currentchip].intens = this.quality;
      this.dialog = false;
    }
  }

}
</script>
