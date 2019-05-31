<template>

  <v-container fluid grid-list-lg>
    <v-layout column wrap>
      <Login />
      <h2>Meine Auffälligkeiten</h2>
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
                <v-select v-model="entry"
                          :items="entryoption"
                          menu-props="auto"
                          single-line
                          color="#0a967a">
                </v-select>
              </v-flex>
              <v-flex>
                <v-menu ref="menudate"
                        v-model="menudate"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                        v-if="entry === 'einen anderen Tag'">
                  <template v-slot:activator="{ on }">
                <v-text-field
                v-model="dateFormatted"
                label="Alternatives Datum"
                hint="DD.MM.YYYY"
                persistent-hint
                prepend-icon="event"
                v-on="on"
                @blur="date = parseDate(dateFormatted)"
                @focus="hideKeyboard()"
                color="#0a967a"></v-text-field>
              </template>
                  <v-date-picker v-model="date"
                                 color="#0a967a"
                                 no-title
                                 @input="menudate = false"
                                 locale="de-ch"
                                 first-day-of-week="1"
                                 :max="today"></v-date-picker>
                </v-menu>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#0a967a"
                     class="white--text"
                     @click="pos = 2">Weiter</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-step :complete="pos > 2" step="2" editable color="#0a967a">
          Kopfschmerzen
          <small>Hattest du Kopfschmerzen?</small>
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card>
            <v-card-text>
              <v-flex>
                <v-form ref="form" id="headache">
                  <v-dialog v-model="dialogHeadache" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                <v-radio-group v-model="headache" column align-center v-on="on">
                  <v-radio v-for="i in headoption" :key="i.de"  :label="i.de" :value="i" color="#0a967a"></v-radio>
                </v-radio-group>
              </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Weitere Angaben zu deinen Kopfschmerzen</span>
                      </v-card-title>
                      <v-card-text>
                        <v-layout row wrap>
                          <v-flex xs12 md6>
                            <v-menu ref="menutimestarth"
                                    v-model="menutimestarth"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="timestart"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    max-width="290px"
                                    min-width="290px">
                              <template v-slot:activator="{ on }">
                        <v-text-field
                        v-model="timestart"
                        label="Startzeit"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                        @focus="hideKeyboard()"
                        :rules="[v => !!v || 'Bitte wähle eine Startzeit.']"
                        color="#0a967a"/>
                      </template>
                              <v-time-picker v-if="menutimestarth"
                                             v-model="timestart"
                                             format="24hr"
                                             color="#0a967a"
                                             full-width
                                             :max="timemax"
                                             @click:minute="$refs.menutimestarth.save(timestart)" />
                            </v-menu>
                          </v-flex>
                          <v-spacer></v-spacer>
                          <v-flex xs12 md6>
                            <v-menu ref="menutimeendh"
                                    v-model="menutimeendh"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="timeend"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    max-width="290px"
                                    min-width="290px">
                              <template v-slot:activator="{ on }">
                      <v-text-field
                      v-model="timeend"
                      label="Endzeit"
                      prepend-icon="access_time"
                      readonly
                      @focus="hideKeyboard()"
                      v-on="on"
                      :rules="[v => !!v || 'Bitte wähle eine Endzeit.']"
                      color="#0a967a"/>
                    </template>
                              <v-time-picker v-if="menutimeendh"
                                             v-model="timeend"
                                             format="24hr"
                                             color="#0a967a"
                                             full-width
                                             :min="timemin"
                                             @click:minute="$refs.menutimeendh.save(timeend)" />
                            </v-menu>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                      <v-card-text>
                        <v-subheader>Kopfseite</v-subheader>
                        <v-select v-model="hsite"
                                  :items="hsiteoption"
                                  :rules="[v => !!v || 'Bitte wähle eine Kopfseite.']"
                                  item-text="de"
                                  menu-props="auto"
                                  single-line
                                  color="#0a967a"
                                  return-object>
                        </v-select>
                      </v-card-text>
                      <v-card-text>
                        <v-subheader>Intensität</v-subheader>
                        <v-slider v-model="quality"
                                  thumb-label="always"
                                  :rules="[v => v > 1 || 'Bitte eine Intesität angeben']"
                                  min="0"
                                  max="10"
                                  append-icon="mood_bad"
                                  prepend-icon="mood"
                                  color="#0a967a"
                                  @click:append="qualityPlus"
                                  @click:prepend="qualityMinus" />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary darken-1" flat @click="closeHeadacheDialog()">Abbrechen</v-btn>
                        <v-btn color="primary darken-1" flat @click="saveCurrentHeadache()">Fertig</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-form>
                <v-radio-group v-model="headache" column align-center>
                  <v-radio label="Keine Kopfschmerzen" :value="noheadache" color="#0a967a"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#0a967a"
                     class="white--text"
                     @click="pos = 3">Weiter</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-step :complete="pos > 3" step="3" editable color="#0a967a">
          Andere Symptome
          <small>Welche anderen Symptome sind dir aufgefallen?</small>
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card>
            <v-card-text>
              <v-layout wrap>
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
              <v-select
              v-model="symptoms"
              :items="symoption"
              item-text="de"
              label="Deine Symptome"
              chips
              clearable
              solo
              multiple
              return-object>
              <template v-slot:selection="data">
                <v-badge color="red" overlap>
                  <template v-slot:badge v-if="data.item.flag == false">
                    <v-icon
                    dark
                    small>
                    warning
                  </v-icon>
                </template>
                  <v-chip :selected="data.selected.de" close
                          @input="remove(data.item)"
                          @click="setCurrent(data.item)"
                          v-on="on"
                          outline
                          color="#0a967a"
                          class="text-truncate">
                    <strong>{{ data.item.de }}</strong>
                    <span v-if="data.item.flag == true && data.item.category != 'Condition'" class="hidden-sm-and-down text-truncate">&nbsp;{{data.item.quality}}</span>
                    <span v-if="data.item.flag == true" class="hidden-sm-and-down text-truncate">({{data.item.start}} - {{data.item.end}})</span>
                    <span v-else class="hidden-sm-and-down text-truncate">&nbsp;(Details fehlen)</span>
                  </v-chip>
                  </v-badge>
                  </template>
                  </v-select>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Weitere Angaben</span>
                    </v-card-title>
                    <v-card-text>
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <v-menu ref="menutimestart"
                                  v-model="menutimestart"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="timestart"
                                  lazy
                                  transition="scale-transition"
                                  offset-y
                                  full-width
                                  max-width="290px"
                                  min-width="290px">
                            <template v-slot:activator="{ on }">
                <v-text-field
                v-model="timestart"
                label="Startzeit"
                prepend-icon="access_time"
                readonly
                v-on="on"
                @focus="hideKeyboard()"
                color="#0a967a"/>
              </template>
                            <v-time-picker v-if="menutimestart"
                                           v-model="timestart"
                                           format="24hr"
                                           color="#0a967a"
                                           full-width
                                           :max="timemax"
                                           @click:minute="$refs.menutimestart.save(timestart)" />
                          </v-menu>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs12 md6>
                          <v-menu ref="menutimeend"
                                  v-model="menutimeend"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="timeend"
                                  lazy
                                  transition="scale-transition"
                                  offset-y
                                  full-width
                                  max-width="290px"
                                  min-width="290px">
                            <template v-slot:activator="{ on }">
              <v-text-field
              v-model="timeend"
              label="Endzeit"
              prepend-icon="access_time"
              readonly
              @focus="hideKeyboard()"
              v-on="on"
              color="#0a967a"/>
            </template>
                            <v-time-picker v-if="menutimeend"
                                           v-model="timeend"
                                           format="24hr"
                                           color="#0a967a"
                                           full-width
                                           :min="timemin"
                                           @click:minute="$refs.menutimeend.save(timeend)" />
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-card-text v-if="this.symcurrentid != null && this.symptoms[this.symcurrentid].category != 'Condition'">
                      <v-subheader>Intensität</v-subheader>
                      <v-slider v-model="quality"
                                thumb-label="always"
                                min="0"
                                max="10"
                                append-icon="mood_bad"
                                prepend-icon="mood"
                                color="#0a967a"
                                @click:append="qualityPlus"
                                @click:prepend="qualityMinus" />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary darken-1" flat @click="closeDialog()">Abbrechen</v-btn>
                      <v-btn color="primary darken-1" flat @click="saveCurrent()">Fertig</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-card-text>
            <v-subheader v-if="controll==false">
              <v-icon color="red">warning</v-icon>
              Klicke auf dein erfasstes Symptom um die fehlenden Details zu erfassen.
            </v-subheader>
            <v-card-actions>
              <v-btn v-if="midata != null && controll == false && midata.isReady()" disabled class="white--text">
                Daten unvollständig
              </v-btn>
              <v-btn v-if="midata != null && controll == true && midata.isReady()"
                     color="#0a967a"
                     class="white--text"
                     @click="save()">
                Speichern
                <v-icon right dark>save</v-icon>
              </v-btn>
              <v-btn v-if="midata == null || !midata.isReady()" disabled class="white--text">
                MIDATA nicht bereit
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

  import SnomedService from '@/services/SnomedService'
  import MidataService from '@/services/MidataService'
  import { Complaint, Condition, Headache } from '@/services/ResourceService'
  import Login from '@/components/Login'

  export default {
    data: app => ({
      pos: 0,
      entryoption: ['heute', 'gestern', 'vorgestern', 'einen anderen Tag'],
      today: new Date().toISOString().substr(0, 10),
      entry: 'heute',
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
      menudate: false,
      category: null,
      timemin: null,
      timemax: null,
      timestart: null,
      timestartFormatted: null,
      menutimestart: false,
      menutimestarth: false,
      timeend: null,
      timeendFormatted: null,
      menutimeend: false,
      menutimeendh: false,
      quality: 0,
      snomedservice: null,
      symptoms: [],
      symoption: [],
      symcurrentid: null,
      dialog: false,
      hsiteoption: [],
      hsite: null,
      controll: false,
      attack: false,
      midata: null,
      snackbartext: '',
      snackbar: false,
      snackbarcolor: '',
      dialogHeadache: false,
      headache: { de: 'Keine Kopfschmerzen', flag: true },
      noheadache: { de: 'Keine Kopfschmerzen', flag: true },
      headoption: []
    }),
    components: {
      Login
    },

    watch: {
      date() {
        this.dateFormatted = this.formatDate(this.date)
      },
      timestart() {
        this.timestartFormatted = this.formateTime(this.timestart)
        this.timemin = this.timestart
      },
      timeend() {
        this.timeendFormatted = this.formateTime(this.timeend)
        this.timemax = this.timeend
      },
      entry() {
        if (this.entry === 'gestern') {
          var date1 = new Date().toISOString().substr(0, 10)
          this.date = this.generateDate(date1, -1)
        } else if (this.entry === 'vorgestern') {
          var date2 = new Date().toISOString().substr(0, 10)
          this.date = this.generateDate(date2, -2)
        } else if (this.entry === 'heute') {
          this.date = new Date().toISOString().substr(0, 10)
        }
      },
      symptoms() {
        this.controll = true
        for (var i = 0; i < this.symptoms.length; i++) {
          if (this.symptoms[i].flag == false) {
            this.controll = false
          }
        }
      }
    },
    methods: {
      /*
      Format a Date to string in Swiss standard DD.MM.YYYY
      parameters: - date: a date as ISO8601-string (YYYY-MM-DD)
      returns:    - a date string in the format DD.MM.YYYY
      author:     schwf3
      version:    2019-03-26
      */
      formatDate(date) {
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
      parseDate(date) {
        if (!date) return null

        const [day, month, year] = date.split('.')
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
      generateDate(date, val) {
        // ok, this is going to be a bit ugly with converting the date from string
        // to numbers to date to string, but it ain't stupid if it works:

        // first, convert the string into a date object and get the milliseconds since 1/1/1970
        date = new Date(date).getTime()

        // add or substract the according number of milliseconds and convert into date again
        date = new Date(date + val * 24 * 60 * 60 * 1000)

        // finally, convert the date object to a string again
        date = date.toISOString().substr(0, 10)

        return date
      },

      /*
      Format a Time to string to ISO8601 (YYYY-MM-DDThh:mm:ss+hh:mm)
      parameters: - time: a time string in the format hh:mm
      returns:    - a date with time as ISO-string (YYYY-MM-DDThh:mm:ss+hh:mm)
      author:     schwf3, updated hessg1
      version:    2019-03-27, updated 2019-04-24
      */
      formateTime(time) {
        if (!time) return null

        return new Date(this.date + 'T' + time).toISOString()
      },

      /*
      Lower the quality of sleep when pressing the icon
      author:     schwf3
      version:    2019-03-27
      */
      qualityMinus() {
        this.quality = this.quality - 1 || 0
      },

      /*
      Increase the quality of sleep when pressing the icon
      author:     schwf3
      version:    2019-03-27
      */
      qualityPlus() {
        this.quality = this.quality + 1 || 10
      },

      /*
      Remove a specific chip.
      parameters: - item: a Object in an array.
      author:     schwf3
      version:    2019-03-27
      */
      remove(item) {
        this.symptoms.splice(this.symptoms.indexOf(item), 1)
        this.symptoms = [...this.symptoms]
        this.symcurrentid = null
      },

      /*
      Set values to current inputs of a specific chip.
      parameters: - item: a Object in an array.
      author:     schwf3
      version:    2019-03-27
      */
      setCurrent(item) {
        this.symcurrentid = this.symptoms.indexOf(item)
        this.timestart = item.start
        this.timeend = item.end
        if (item.quality) {
          this.quality = item.quality
        }
        if (item.bodysite) {
          this.hsite = item.bodysite
        }
      },

      /*
      Save values of a specific chip into the current Object in an array.
      Controll the data and set values to default and close dialog.
      author:     schwf3
      version:    2019-03-27
      */
      saveCurrent() {
        if (this.symcurrentid != null) {
          this.symptoms[this.symcurrentid].start = this.timestart
          this.symptoms[this.symcurrentid].end = this.timeend
          this.symptoms[this.symcurrentid].startFormatted = this.timestartFormatted
          this.symptoms[this.symcurrentid].endFormatted = this.timeendFormatted
          this.symptoms[this.symcurrentid].quality = this.quality
          if (this.symptoms[this.symcurrentid].category === 'Headache')
            this.symptoms[this.symcurrentid].bodysite = this.hsite
        }
        if (this.symptoms[this.symcurrentid].category === 'Headache') {
          if (
            this.symptoms[this.symcurrentid].start &&
            this.symptoms[this.symcurrentid].end &&
            this.symptoms[this.symcurrentid].bodysite &&
            this.symptoms[this.symcurrentid].quality != 0
          ) {
            this.symptoms[this.symcurrentid].flag = true
          } else {
            this.symptoms[this.symcurrentid].flag = false
          }
        } else if (this.symptoms[this.symcurrentid].category === 'Condition') {
          if (this.symptoms[this.symcurrentid].start && this.symptoms[this.symcurrentid].end) {
            this.symptoms[this.symcurrentid].flag = true
          } else {
            this.symptoms[this.symcurrentid].flag = false
          }
        } else {
          if (
            this.symptoms[this.symcurrentid].start &&
            this.symptoms[this.symcurrentid].end &&
            this.symptoms[this.symcurrentid].quality != 0
          ) {
            this.symptoms[this.symcurrentid].flag = true
          } else {
            this.symptoms[this.symcurrentid].flag = false
          }
        }
        this.controll = true
        for (var i = 0; i < this.symptoms.length; i++) {
          if (this.symptoms[i].flag == false) {
            this.controll = false
          }
        }
        this.quality = 0
        this.hsite = null
        this.dialog = false
      },

      /*
      Save values of headache.
      Controll the data and set values to default and close dialog.
      author:     schwf3
      version:    2019-03-27
      */
      saveCurrentHeadache() {
        if(this.$refs.form.validate()){
          this.headache.start = this.timestart
          this.headache.end = this.timeend
          this.headache.startFormatted = this.timestartFormatted
          this.headache.endFormatted = this.timeendFormatted
          this.headache.quality = this.quality
          this.headache.bodysite = this.hsite
          this.timestart = null
          this.timeend = null
          if (this.quality > 0 && this.hsite != null && this.headache.start != null && this.headache.end != null) {
            this.controll = true
            this.pos = 3
            this.quality = 0
            this.hsite = null
            this.dialogHeadache = false
          }
        }
      },

      /*
      Set values to default and close dialog.
      author:     schwf3
      version:    2019-03-27
      */
      closeDialog() {
        this.quality = 0
        this.hsite = null
        this.timestart = null
        this.timeend = null
        this.dialog = false
        this.dialogHeadache = false
      },

      closeHeadacheDialog() {
        this.quality = 0
        this.hsite = null
        this.timestart = null
        this.timeend = null
        this.dialog = false
        this.dialogHeadache = false
        this.headache = { de: 'Keine Kopfschmerzen', flag: true }
      },

      /*
      Saves the entered information to MIDATA. Needs a set up MIDATA object, of course.
      parameters: none
      returns:    none, displays the result to the user in a Snackbox
      author:     hessg1
      version:    2019-03-28
      */
      save() {
        try {
          var observations = []
          for (var i = 0; i < this.symptoms.length; i++) {
            if (this.symptoms[i].category === 'VariousComplaint') {
              observations[i] = new Complaint(
                this.symptoms[i].startFormatted,
                this.symptoms[i].endFormatted,
                this.symptoms[i].quality,
                this.symptoms[i].code
              )
            } else if (this.symptoms[i].category === 'Condition') {
              observations[i] = new Condition(
                this.symptoms[i].startFormatted,
                this.symptoms[i].endFormatted,
                this.symptoms[i].code
              )
            } else if (this.symptoms[i].category === 'Headache') {
              observations[i] = new Headache(
                this.symptoms[i].startFormatted,
                this.symptoms[i].endFormatted,
                this.symptoms[i].quality,
                this.symptoms[i].code,
                this.symptoms[i].bodysite.code
              )
            }
          }
          if (this.headoption.includes(this.headache)) {
            var ha = new Headache(
              this.headache.startFormatted,
              this.headache.endFormatted,
              this.headache.quality,
              this.headache.code,
              this.headache.bodysite.code
            )
            observations.push(ha)
          }
          let bundle = this.midata.bundle(observations)
          this.midata.saveData(bundle).then(() => {
            this.feedback('Speichern erfolgreich.', false)
            this.symptoms = []
            this.headache = { de: 'Keine Kopfschmerzen', flag: true }
            this.controll = false
            this.symcurrentid = null
          })
        } catch (err) {
          this.feedback('Da ist etwas schiefgegangen: ' + err, true)
          console.log(err)
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
      feedback(text, error) {
        this.snackbarcolor = error ? 'red' : '#0a967a'
        this.snackbartext = text
        this.snackbar = true
      },

      /*
      Helper method for not showing software keyboard on smartphones, when a input-
      field is clicked (e.g. with date picker)
      usage: put @focus="hideKeyboard()" into the keyboard-triggering elements properties
      author:     hessg1
      version:    2019-03-29
      */
      hideKeyboard() {
        document.activeElement.blur()
      },
      setCurrentHead() {}
    },

    // mounted is executed when component is mounted
    mounted() {
      // link this.midata to app-wide midataService
      this.midata = this.$midataService
      // fallback, if something went wrong
      if (this.midata == '') {
        this.midata = new MidataService()
      }

      this.snomedservice = new SnomedService()
      this.symoption = this.snomedservice.getFiltered(x => x.category == 'VariousComplaint' || x.category == 'Condition')
      this.headoption = this.snomedservice.getFiltered(y => y.category == 'Headache')
      for (var i in this.symoption) {
        this.symoption[i].flag = false
      }
      for (var j in this.headoption) {
        this.headoption[j].flag = false
      }
      this.hsiteoption = this.snomedservice.getFiltered(x => x.category == 'BodySite')
      for (var y in this.hsiteoption) {
        this.hsiteoption[y].flag = false
      }
    }
  }

</script>
