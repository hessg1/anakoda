<template>

  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md12>
        <p>Hier findest du berechnete Kennzahlen über deine persönlichen Daten.</p>
      </v-flex>
      <v-flex xs12 md12>
        <v-select v-model="dateentry"
                  :key="interval.index"
                  :items="interval"
                  label="Kennzahlen anzeigen für"
                  persistent-hint
                  class="mt-0 pt-0">
        </v-select>
        <v-layout row wrap>
          <v-flex md3>
            <v-menu ref="datestartmenu"
                    v-model="datestartmenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    v-if="dateentry === 'einen anderen Zeitraum...'">
              <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                    v-model="datestartFormatted"
                                                                    label="Startdatum"
                                                                    persistent-hint
                                                                    prepend-icon="event"
                                                                    v-on="on"
                                                                    @focus="hideKeyboard()"
                                                                    @blur="date = parseDate(datestartFormatted)"
                                                                    color="#0a967a"
                                                                    />
                                                                  </template>
              <v-date-picker v-model="datestartdesired"
                             color="#0a967a"
                             no-title
                             @input="datestartmenu = false"
                             locale="de-ch"
                             first-day-of-week="1"
                             :max="today" />
            </v-menu>
          </v-flex>
          <v-flex md3>
            <v-menu ref="dateendmenu"
                    v-model="dateendmenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    v-if="dateentry === 'einen anderen Zeitraum...'">
              <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                    v-model="dateendFormatted"
                                                                    label="Enddatum"
                                                                    persistent-hint
                                                                    v-on="on"
                                                                    @focus="hideKeyboard()"
                                                                    @blur="date = parseDate(dateendFormatted)"
                                                                    color="#0a967a"
                                                                    />
                                                                  </template>
              <v-date-picker v-model="dateenddesired"
                             color="#0a967a"
                             no-title
                             @input="dateendmenu = false"
                             locale="de-ch"
                             first-day-of-week="1"
                             :max="today" />
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
              face
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Kopfschmerzen
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="data && headaches.length || '—'"></span>
                <strong v-if="data && headaches.length != 1">Einträge</strong>
                <strong v-if="data && headaches.length == 1">Eintrag</strong>
              </div>
            </v-layout>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                ∅ Intensität
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="headachintensavg || '—'"></span>
                <strong v-if="symdayavg">/10</strong>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-sparkline :value="headacheintens"
                         color="#7AD6FD"
                         smooth
                         fill
                         auto-draw></v-sparkline>
            <v-layout row>
              <div class="caption grey--text text-uppercase ml-2" v-if="data && headaches.length != 0">{{headaches[0].startTime.toLocaleDateString('de-CH')}}</div>
              <v-spacer></v-spacer>
              <div class="caption grey--text text-uppercase mr-2" v-if="data && headaches.length != 0">{{headaches[headaches.length-1].startTime.toLocaleDateString('de-CH')}}</div>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="data && headaches.length != 0">
              Zwischen dem {{headaches[0].startTime.toLocaleDateString('de-CH')}} und {{headaches[headaches.length-1].startTime.toLocaleDateString('de-CH')}}
              hast du {{headaches.length}} Mal Kopfschmerzen protokolliert, mit einer durchschnittlichen Intensität von {{headachintensavg}}.
              In der Grafik siehst du, wie sich die Schmerzintensität im Lauf der Zeit verändert hat.
            </div>
            <div class="body-1" v-if="headaches.length == 0">
              Du hast <strong>keine Kopfschmerzen</strong> im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
              loyalty
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Auffälligkeiten
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="data && symptoms.length || '—'"></span>
                <strong v-if="data && symptoms.length != 1">Einträge</strong>
                <strong v-if="data && symptoms.length == 1">Eintrag</strong>
              </div>
            </v-layout>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                ∅ am Tag
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="symdayavg || '—'"></span>
                <strong v-if="symdayavg">Einträge</strong>
              </div>
            </v-layout>

          </v-card-title>
          <v-card-text>
            <v-sparkline :value="sympday"
                         color="#FED37F"
                         smooth
                         fill
                         auto-draw></v-sparkline>
            <v-layout row>
              <div class="caption grey--text text-uppercase ml-2" v-if="data && symptoms.length != 0">{{symptoms[0].startTime.toLocaleDateString('de-CH')}}</div>
              <v-spacer></v-spacer>
              <div class="caption grey--text text-uppercase mr-2" v-if="data && symptoms.length != 0">{{symptoms[symptoms.length-1].startTime.toLocaleDateString('de-CH')}}</div>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="data && symptoms.length != 0">
              Für den Zeitraum vom {{symptoms[0].startTime.toLocaleDateString('de-CH')}} und dem {{symptoms[symptoms.length-1].startTime.toLocaleDateString('de-CH')}}
              hast du {{symptoms.length}} sonstige Auffälligkeiten notiert. Das sind durchschnittlich {{symdayavg}} pro Tag.
              In der Grafik siehst du die Veränderung im Zeitverlauf.
            </div>
            <div class="body-1" v-if="symptoms.length == 0">
              Du hast <strong>keine Auffälligkeiten</strong> im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-layout row align-start class="ma-0">
              <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
                link
              </v-icon>
              <div class="subheading grey--text text-uppercase">
                <strong>Während</strong> deinen Kopfschmerzen
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-sparkline :value="symin"
                         color="#7AD6FD"
                         auto-line-width
                         type="bar"
                         auto-draw></v-sparkline>
            <v-layout class="hidden-xs-only" wrap row v-if="data">
              <v-flex v-for="sym in syminlabel" :key="sym.index">
                <div class="body-2 text-truncate text-xs-center" :key="sym.index">{{sym.toString()}}</div>
              </v-flex>
            </v-layout>
            <v-layout class="hidden-sm-and-up" wrap column v-if="data">
              <v-flex v-for="sym in syminlabel" :key="sym.index">
                <div class="body-2 text-truncate" :key="sym.index">{{sym.toString()}}</div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="syminheadache.length != 0">
              Hier siehst du, welche Auffälligkeiten am häufigsten gleichzeitig mit Kopfschmerzen aufgetreten sind.
            </div>
            <div class="body-1" v-if="syminheadache.length == 0">
              Du hast <strong>keine Auffälligkeiten</strong> während deinen Kopfschmerzen im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-layout row align-start class="ma-0">
              <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
                link_off
              </v-icon>
              <div class="subheading grey--text text-uppercase">
                <strong>Ausserhalb</strong> deiner Kopfschmerzen
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-sparkline :value="symout"
                         color="#FED37F"
                         auto-line-width
                         type="bar"
                         auto-draw></v-sparkline>
            <v-layout class="hidden-xs-only" wrap row v-if="data">
              <v-flex v-for="sym in symoutlabel" :key="sym.index">
                <div class="body-2 text-truncate text-xs-center" :key="sym.index">{{sym.toString()}}</div>
              </v-flex>
            </v-layout>
            <v-layout class="hidden-sm-and-up" wrap column v-if="data">
              <v-flex v-for="sym in symoutlabel" :key="sym.index">
                <div class="body-2 text-truncate" :key="sym.index">{{sym.toString()}}</div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="syminheadache.length != 0">
              Hier siehst du, welche Auffälligkeiten am häufigsten bei dir vorkahmen, ohne dass du dabei Kopfschmerzen hattest.
            </div>
            <div class="body-1" v-if="syminheadache.length == 0">
              Du hast <strong>keine Auffälligkeiten</strong> ausserhalb deiner Kopfschmerzen im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>

  let observations = []

  var dds = new Date()
  dds.setDate( dds.getDate() - 10 )
  console.log(dds);

  export default {
    data: app => ({
      interval: ['alle Daten', 'diesen Monat', 'letzten Monat', 'einen anderen Zeitraum...'],
      monthname: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
      ],
      dateentry: 'alle Daten',
      datestart: null,
      datestartdesired: dds.toISOString().substr(0, 10),
      datestartmenu: false,
      datestartFormatted: app.formatDate(dds.toISOString().substr(0, 10)),
      dateend: null,
      dateenddesired: new Date().toISOString().substr(0, 10),
      dateendmenu: false,
      dateendFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
      today: new Date().toISOString(),
      data: false,
      headaches: [],
      symptoms: [],
      symptomscount: [],
      symoutheadache: [],
      symoutheadachecount: [],
      syminheadache: [],
      syminheadachecount: []
    }),

    created() {
      this.getData()
      this.defineIntervall()
    },

    computed: {
      headacheintens() {
        let intensity = [0, 0]
        if (this.data) {
          for (let i = 0; i < this.headaches.length; i++) {
            intensity[i] = this.headaches[i].quantity
          }
        }
        return intensity
      },
      headacheintenslabels() {
        let values = []
        if (this.data) {
          for (let i = 0; i < this.headaches.length; i++) {
            values[i] = this.headaches[i].startTime.toISOString().substr(8, 2)
          }
        }
        return values
      },
      headachintensavg() {
        let avg = 0
        let leng = this.headaches.length
        if (this.data) {
          for (let i = 0; i < leng; i++) {
            avg += this.headaches[i].quantity
          }
          avg = Math.round((avg / leng) * 100) / 100
        }
        return avg
      },
      sympday() {
        let day = [0, 0]
        if (this.data) {
          for (let i = 0; i < this.symptomscount.length; i++) {
            day[i] = this.symptomscount[i].count
          }
        }
        return day
      },

      symdayavg() {
        let count = 0
        let avg = 0
        let ds = new Date()
        let de = new Date()
        if (this.data) {
          for (let i = 0; i < this.symptomscount.length; i++) {
            count += this.symptomscount[i].count
          }
          if (this.dateentry.includes('alle')) {
            let dif = Math.round(
              (this.symptoms[this.symptoms.length - 1].startTime.getTime() - this.symptoms[0].startTime.getTime()) /
                24 /
                60 /
                60 /
                1000
            )
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('diesen')) {
            ds.setMonth(ds.getMonth(), 1)
            let dif = Math.round(
              (de.getTime() - ds.getTime()) /
                24 /
                60 /
                60 /
                1000
            )
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('letzten')) {
            ds.setMonth(ds.getMonth() - 1, 1)
            de.setMonth(de.getMonth(), 0)
            let dif = Math.round(
              (de.getTime() - ds.getTime()) /
                24 /
                60 /
                60 /
                1000
            )
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('anderen')) {
            ds = new Date(this.datestart)
            de = new Date(this.dateend)
            console.log(ds);
            console.log(de);
            let dif = Math.round(
              (de.getTime() - ds.getTime()) /
                24 /
                60 /
                60 /
                1000
            )
            console.log(dif);
            avg = Math.round((count / dif) * 100) / 100
          }
        }
        return avg
      },
      symout() {
        let sym = [0, 0]
        if (this.data) {
          if (this.symoutheadachecount.length < 3) {
            for (let i = 0; i < this.symoutheadachecount.length; i++) {
              sym[i] = this.symoutheadachecount[i].count
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              sym[i] = this.symoutheadachecount[i].count
            }
          }
        }
        return sym
      },
      symoutlabel() {
        let label = []
        if (this.data) {
          if (this.symoutheadachecount.length < 3) {
            for (let i = 0; i < this.symoutheadachecount.length; i++) {
              label.push(' ' + this.symoutheadachecount[i].symptom + ' (' + this.symoutheadachecount[i].count + ')')
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              label.push(' ' + this.symoutheadachecount[i].symptom + ' (' + this.symoutheadachecount[i].count + ')')
            }
          }
        }
        return label
      },
      symin() {
        let sym = [0, 0]
        if (this.data) {
          if (this.syminheadachecount.length < 3) {
            for (let i = 0; i < this.syminheadachecount.length; i++) {
              sym[i] = this.syminheadachecount[i].count
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              sym[i] = this.syminheadachecount[i].count
            }
          }
        }
        return sym
      },
      syminlabel() {
        let label = []
        if (this.data) {
          if (this.syminheadachecount.length < 3) {
            for (let i = 0; i < this.syminheadachecount.length; i++) {
              label.push(' ' + this.syminheadachecount[i].symptom + ' (' + this.syminheadachecount[i].count + ')')
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              label.push(' ' + this.syminheadachecount[i].symptom + ' (' + this.syminheadachecount[i].count + ')')
            }
          }
        }
        return label
      }
    },

    watch: {
      dateentry() {
        let ds = new Date()
        let de = new Date()
        if (this.dateentry.includes('diesen')) {
          ds.setMonth(ds.getMonth(), 1)
          this.datestart = ds.toISOString().substr(0, 10)
          this.dateend = de.toISOString().substr(0, 10)
        }
        if (this.dateentry.includes('letzten')) {
          ds.setMonth(ds.getMonth() - 1, 1)
          this.datestart = ds.toISOString().substr(0, 10)
          de.setMonth(de.getMonth(), 0)
          this.dateend = de.toISOString().substr(0, 10)
        }
        if (this.dateentry == 'alle Daten') {
          this.datestart = null
          this.dateend = null
        }
        if (this.dateentry == 'einen anderen Zeitraum...') {
          this.datestart = this.datestartdesired
          this.dateend = this.dateenddesired
        }
        this.getData()
      },

      datestartdesired() {
        this.datestart = this.datestartdesired
        this.datestartFormatted = this.formatDate(this.datestart)
        this.getData()
      },

      dateenddesired() {
        this.dateend = this.dateenddesired
        this.dateendFormatted = this.formatDate(this.dateend)
        this.getData()
      }
    },

    methods: {
      /*
                                                          Convenience method for filtering an array with any criterium.
                                                          hessg1 / 2019-04-10
                                                          */
      filterArray(filter, array) {
        let newArr = []
        for (var i in array) {
          if (filter(array[i])) {
            newArr.push(array[i])
          }
        }
        return newArr
      },
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

      defineIntervall() {
        let d = new Date()
        this.interval[1] = 'diesen Monat (' + this.monthname[d.getMonth()] + ')'
        this.interval[2] = 'letzten Monat (' + this.monthname[d.getMonth() - 1] + ')'
      },

      getData() {
        var query
        if (this.datestart && this.dateend) {
          query = 'Observation?date=ge' + this.datestart + '&date=le' + this.dateend
        } else {
          query = 'Observation'
        }
        if (this.$midataService.isReady()) {
          this.$midataService.getData(query).then(res => {
            observations = this.$midataService.prepareData(res)

            // only display valid entries
            observations = this.filterArray(x => !x.meta.invalid, observations)

            if (observations.length != 0) {
              this.data = true
              // get all headache ressources and write them in an array
              this.headaches = this.filterArray(x => x.category == 'Headache', observations)
              this.headaches.sort((a, b) => {
                return a.endTime - b.endTime
              })

              // get all symptoms except "attack" resources and write them in an array
              this.symptoms = this.filterArray(
                x => x.category == 'VariousComplaint' || (x.category == 'Condition' && x.code != 216299002),
                observations
              )
              this.symptoms.sort((a, b) => {
                return a.endTime - b.endTime
              })

              this.symptomscount = []
              this.symptomscount.push({ date: this.symptoms[0].endTime.toISOString().substr(0, 10), count: 1 })
              for (var i = 1; i < this.symptoms.length; i++) {
                if (
                  this.symptoms[i].endTime.toISOString().substr(0, 10) ==
                  this.symptomscount[this.symptomscount.length - 1].date
                ) {
                  this.symptomscount[this.symptomscount.length - 1].count += 1
                } else {
                  this.symptomscount.push({ date: this.symptoms[i].endTime.toISOString().substr(0, 10), count: 1 })
                }
              }

              this.symoutheadache = []
              for (let i = 0; i < this.symptoms.length; i++) {
                if (!this.controlInHeadache(this.headaches, this.symptoms[i])) {
                  this.symoutheadache.push(this.symptoms[i])
                }
              }

              this.symoutheadache.sort((a, b) => {
                return a.de > b.de
              })

              this.symoutheadachecount = []
              if (this.symoutheadache.length > 0) {
                this.symoutheadachecount.push({ symptom: this.symoutheadache[0].de, count: 1 })
                for (let i = 1; i < this.symoutheadache.length; i++) {
                  if (
                    this.symoutheadache[i].de == this.symoutheadachecount[this.symoutheadachecount.length - 1].symptom
                  ) {
                    this.symoutheadachecount[this.symoutheadachecount.length - 1].count += 1
                  } else {
                    this.symoutheadachecount.push({ symptom: this.symoutheadache[i].de, count: 1 })
                  }
                }
                this.symoutheadachecount.sort((a, b) => {
                  return a.count < b.count
                })
              }

              this.syminheadache = this.symptoms.filter(x => !this.symoutheadache.includes(x))

              this.syminheadache.sort((a, b) => {
                return a.de > b.de
              })

              this.syminheadachecount = []
              if (this.syminheadache.length > 0) {
                this.syminheadachecount.push({ symptom: this.syminheadache[0].de, count: 1 })
                for (let i = 1; i < this.syminheadache.length; i++) {
                  if (this.syminheadache[i].de == this.syminheadachecount[this.syminheadachecount.length - 1].symptom) {
                    this.syminheadachecount[this.syminheadachecount.length - 1].count += 1
                  } else {
                    this.syminheadachecount.push({ symptom: this.syminheadache[i].de, count: 1 })
                  }
                }
                this.syminheadachecount.sort((a, b) => {
                  return a.count < b.count
                })
              }
            } else {
              this.headaches = []
              this.symptoms = []
              this.symptomscount = []
              this.symoutheadache = []
              this.symoutheadachecount = []
              this.syminheadache = []
              this.syminheadachecount = []
              this.data = false
            }
          })
        }
      },

      controlInHeadache(arr, obj) {
        for (let i = 0; i < arr.length; i++) {
          if (obj.startTime < arr[i].endTime && obj.endTime > arr[i].startTime) {
            return true
          }
        }
        return false
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
      }
    }
  }

</script>
