<template>

  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md12>
        <h2>Kennzahlen</h2>
      </v-flex>
      <v-flex xs12 md12>
        <p>Hier findest du berechnete Kennzahlen über deine persönlichen Daten.</p>
      </v-flex>
      <v-flex xs12 md12>
        <v-select v-model="dateentry"
                  :items="interval"
                  hint="Kennzahlen anzeigen für"
                  persistent-hint
                  class="mt-0 pt-0">
        </v-select>
        <v-layout row wrap>
          <v-flex xs12 md6>
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
                      hint="DD.MM.YYYY"
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
          <v-flex xs12 md6>
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
                      hint="DD.MM.YYYY"
                      persistent-hint
                      prepend-icon="event"
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
            <v-icon class="mr-5" size="64" color="primary">
              face
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                ∅ Intensität der Kopfschmerzen
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="headachintensavg || '—'"></span>
                <strong v-if="symdayavg">/10</strong>
              </div>
            </v-layout>

            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Kopfschmerzeinträge
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="this.headaches.length || '—'"></span>
                <strong v-if="this.headaches.length != 1">Einträge</strong>
                <strong v-if="this.headaches.length == 1">Eintrag</strong>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-sparkline :value="headacheintens"
                         color="rgba(10, 150, 122, .5)"
                         :smooth="16"
                         :line-width="3"
                         :label-size="200"
                         stroke-linecap="round"
                         fill
                         auto-draw></v-sparkline>
          </v-card-text>
          <v-card-text>
            <div class="caption grey--text">
              Diese Grafik zeigt dir, wie sich die Intensitäten deiner Kopfschmerzen im definierten Zeitraum verändert haben.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon class="mr-5" size="64" color="primary">
              loupe
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                ∅ Einträge am Tag
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="symdayavg || '—'"></span>
                <strong v-if="symdayavg">∅</strong>
              </div>
            </v-layout>

            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Andere erfasste Symptome
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="this.symptoms.length || '—'"></span>
                <strong v-if="this.symptoms.length != 1">Einträge</strong>
                <strong v-if="this.symptoms.length == 1">Eintrag</strong>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-sparkline :value="sympday"
                         color="rgba(10, 150, 122, .5)"
                         :smooth="16"
                         :line-width="3"
                         stroke-linecap="round"
                         fill
                         auto-draw></v-sparkline>
          </v-card-text>
          <v-card-text>
            <div class="caption grey--text">
              Diese Grafik zeigt dir, wie oft am Tag du im definierten Zeitraum neben den Kopfschmerzen andere Symptome angegeben hast.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>

  let observations = []

  var ds = new Date()
  ds.setMonth(ds.getMonth(), 1)

  export default {
    data: app => ({
      interval: ['alle Daten', 'diesen Monat', 'letzten Monat', 'einen anderen Zeitraum...'],
      dateentry: 'alle Daten',
      datestart: null,
      datestartdesired: ds.toISOString().substr(0, 10),
      datestartmenu: false,
      datestartFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
      dateend: null,
      dateenddesired: new Date().toISOString().substr(0, 10),
      dateendmenu: false,
      dateendFormatted: app.formatDate(new Date().toISOString().substr(0, 10)),
      today: new Date().toISOString(),
      headaches: [],
      symptoms: [],
      symptomscount: []
    }),

    created() {
      this.getData()
      console.log('created')
    },

    computed: {
      headacheintens() {
        let intensity = [0, 0]
        for (let i = 0; i < this.headaches.length; i++) {
          intensity[i] = this.headaches[i].quantity
        }
        return intensity
      },
      headacheintensvalue() {
        let values = []
        for (let i = 0; i < this.headaches.length; i++) {
          values[i] = this.headaches[i].startTime.toISOString().substr(8, 2)
        }
        return values
      },
      headachintensavg() {
        let avg = 0
        let leng = this.headaches.length
        for (let i = 0; i < leng; i++) {
          avg += this.headaches[i].quantity
        }
        avg = Math.round((avg / leng) * 100) / 100
        return avg
      },
      sympday() {
        let day = [0, 0]
        for (let i = 0; i < this.symptomscount.length; i++) {
          day[i] = this.symptomscount[i].count
        }
        return day
      },
      symdayavg() {
        let avg = 0
        let leng = this.symptomscount.length
        for (let i = 0; i < leng; i++) {
          avg += this.symptomscount[i].count
        }
        avg = Math.round((avg / leng) * 100) / 100
        return avg
      }
    },

    watch: {
      dateentry() {
        if (this.dateentry == 'diesen Monat') {
          var ds1 = new Date()
          ds1.setMonth(ds1.getMonth(), 1)
          this.datestart = ds1.toISOString().substr(0, 10)
          this.dateend = new Date().toISOString().substr(0, 10)
        }
        if (this.dateentry == 'letzten Monat') {
          var ds2 = new Date()
          ds2.setMonth(ds2.getMonth() - 1, 1)
          this.datestart = ds2.toISOString().substr(0, 10)
          var de2 = new Date()
          de2.setMonth(de2.getMonth(), 0)
          this.dateend = de2.toISOString().substr(0, 10)
        }
        if (this.dateentry == 'alle Daten') {
          this.datestart = null
          this.dateend = null
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
            if (!JSON.parse(localStorage.getItem('showInvalid'))) {
              observations = this.filterArray(x => !x.meta.invalid, observations)
            }

            // get all headache ressources and write them in an array
            this.headaches = this.filterArray(x => x.category == 'Headache', observations)
            this.headaches.sort((a, b) => {
              return a.endTime - b.endTime
            })

            // get all symptom ressources and write them in an array
            this.symptoms = this.filterArray(
              x => x.category == 'VariousComplaint' || x.category == 'Condition',
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
          })
        }
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
