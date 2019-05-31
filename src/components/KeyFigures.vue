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
                                        color="#0a967a"/>
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
                                        color="#0a967a"/>
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
            <apexchart type=area height=250 :options="headoption" :series="headacheintens" />
          </v-card-text>
          <v-card-text v-if="data && headaches.length != 0">
            <div class="body-1" v-if="this.dateentry.includes('alle')">
              Zwischen dem {{headaches[0].startTime.toLocaleDateString('de-CH')}} und {{headaches[headaches.length-1].startTime.toLocaleDateString('de-CH')}}
              hast du {{headaches.length}} Mal Kopfschmerzen protokolliert, mit einer durchschnittlichen Intensität von {{headachintensavg}}.
              In der Grafik siehst du, wie sich die Schmerzintensität im Lauf der Zeit verändert hat*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('diesen') || this.dateentry.includes('letzten')">
              Im {{currentmonth}} hast du {{headaches.length}} Mal Kopfschmerzen protokolliert, mit einer durchschnittlichen Intensität
              von {{headachintensavg}}. In der Grafik siehst du, wie sich die Schmerzintensität im Lauf der Zeit verändert
              hat*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('anderen')">
              Zwischen dem {{this.datestartFormatted}} und {{this.dateendFormatted}} hast du {{headaches.length}} Mal Kopfschmerzen protokolliert,
              mit einer durchschnittlichen Intensität von {{headachintensavg}}. In der Grafik siehst du, wie sich die Schmerzintensität
              im Lauf der Zeit verändert hat*.
            </div>
          </v-card-text>
          <v-card-text v-if="headaches.length == 0">
            <div class="body-1">
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
                <strong v-if="data && symdayavg != 1">Einträge</strong>
                <strong v-if="data && symdayavg == 1">Eintrag</strong>
              </div>
            </v-layout>

          </v-card-title>
          <v-card-text>
            <apexchart type=area height=250 :options="symoption" :series="sympday" />
          </v-card-text>
          <v-card-text v-if="data && symptoms.length != 0">
            <div class="body-1" v-if="this.dateentry.includes('alle')">
              Für den Zeitraum vom {{symptoms[0].startTime.toLocaleDateString('de-CH')}} und dem {{symptoms[symptoms.length-1].startTime.toLocaleDateString('de-CH')}}
              hast du {{symptoms.length}} sonstige Auffälligkeiten notiert. Das sind durchschnittlich {{symdayavg}} pro Tag.
              In der Grafik siehst du die Veränderung im Zeitverlauf*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('diesen') || this.dateentry.includes('letzten')">
              Im {{this.currentmonth}} hast du {{symptoms.length}} sonstige Auffälligkeiten notiert. Das sind durchschnittlich {{symdayavg}}
              pro Tag. In der Grafik siehst du die Veränderung im Zeitverlauf*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('anderen')">
              Für den Zeitraum vom {{this.datestartFormatted}} und dem {{this.dateendFormatted}} hast du {{symptoms.length}} sonstige Auffälligkeiten
              notiert. Das sind durchschnittlich {{symdayavg}} pro Tag. In der Grafik siehst du die Veränderung im Zeitverlauf*.
            </div>
          </v-card-text>
          <v-card-text v-if="symptoms.length == 0">
            <div class="body-1">
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
                blur_on
              </v-icon>
              <div class="subheading grey--text text-uppercase">
                <strong>Während</strong> deinen Kopfschmerzen
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <apexchart type=bar height=250 :options="syminoption" :series="symin" />
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
                blur_off
              </v-icon>
              <div class="subheading grey--text text-uppercase">
                <strong>Ausserhalb</strong> deiner Kopfschmerzen
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <apexchart type=bar height=250 :options="symoutoption" :series="symout" />
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="symoutheadache.length != 0">
              Hier siehst du, welche Auffälligkeiten am häufigsten bei dir vorkamen, ohne dass du dabei Kopfschmerzen hattest.
            </div>
            <div class="body-1" v-if="symoutheadache.length == 0">
              Du hast <strong>keine Auffälligkeiten</strong> ausserhalb deiner Kopfschmerzen im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
              history
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Schlafdauer
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="data && sleeps.length || '—'"></span>
                <strong v-if="data && sleeps.length != 1">Einträge</strong>
                <strong v-if="data && sleeps.length == 1">Eintrag</strong>
              </div>
            </v-layout>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                ∅ Schlafdauer
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="sleepavg || '—'"></span>
                <strong>Stunden</strong>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <apexchart type=area height=250 :options="sleepoption" :series="sleepduration" />
          </v-card-text>
          <v-card-text v-if="data && sleeps.length != 0">
            <div class="body-1" v-if="this.dateentry.includes('alle')">
              Für den Zeitraum vom {{sleeps[0].startTime.toLocaleDateString('de-CH')}} und dem {{sleeps[sleeps.length-1].startTime.toLocaleDateString('de-CH')}}
              hast du {{sleeps.length}} Mal deinen Schlaf erfasst. Im Schnitt hast du {{sleepavg}} Stunden geschlafen. Die
              Grafik zeigt dir den Verlauf deiner Einträge*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('diesen') || this.dateentry.includes('letzten')">
              Im {{this.currentmonth}} hast du {{sleeps.length}} Mal deinen Schlaf erfasst. Im Schnitt hast du {{sleepavg}} Stunden geschlafen.
              Die Grafik zeigt dir den Verlauf deiner Einträge*.
            </div>
            <div class="body-1" v-if="this.dateentry.includes('anderen')">
              Für den Zeitraum vom {{this.datestartFormatted}} und dem {{this.dateendFormatted}} hast du {{sleeps.length}} Mal deinen Schlaf
              erfasst. Im Schnitt hast du {{sleepavg}} Stunden geschlafen. Die Grafik zeigt dir den Verlauf deiner Einträge*.
            </div>
          </v-card-text>
          <v-card-text v-if="sleeps.length == 0">
            <div class="body-1">
              Du hast <strong>keine Schlafangaben</strong> im angegebenen Zeitraum erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon class="mr-5 hidden-xs-only" size="64" color="primary">
              local_pharmacy
            </v-icon>
            <v-layout column align-start class="ma-0">
              <div class="caption grey--text text-uppercase">
                Medikamente
              </div>
              <div>
                <span class="display-2 font-weight-black" v-text="medicaments && medicaments.length || '—'"></span>
                <strong v-if="medicaments && medicaments.length != 1">Einträge</strong>
                <strong v-if="medicaments && medicaments.length == 1">Eintrag</strong>
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <apexchart type=bar height=250 :options="medoptions" :series="medeffect" />
          </v-card-text>
          <v-card-text>
            <div class="body-1" v-if="hasmed">
              Die Grafik zeigt dir ob und wie oft die Medikamente gewirkt haben.
            </div>
            <div class="body-1" v-if="!hasmed">
              Du hast <strong>keine Medikamente</strong> erfasst.
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="caption grey--text mt-4">* In den Verlaufsgrafen werden nur Tage berücksichtigt, an denen du einen Eintrag gemacht hast.</div>
  </v-container>

</template>

<script>

  import VueApexCharts from 'vue-apexcharts'

  var dds = new Date()
  dds.setDate(dds.getDate() - 10)

  export default {
    components: {
      apexchart: VueApexCharts
    },

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
      currentmonth: null,
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
      syminheadachecount: [],
      sleeps: [],
      hasmed: false,
      medicaments: null,
      chartOptions: {
        chart: { stacked: true, toolbar: { show: false } },
        colors: ['#FD978F'],
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        }
      }
    }),

    created() {
      this.getObservations()
      this.defineIntervall()
      this.getMedicaments()
    },

    computed: {
      headacheintens() {
        let intensity = []
        if (this.data) {
          for (let i = 0; i < this.headaches.length; i++) {
            intensity[i] = this.headaches[i].quantity
          }
        }
        return [
          {
            name: 'Intensität',
            data: intensity
          }
        ]
      },
      headoption() {
        let labels = []
        if (this.data) {
          for (let i = 0; i < this.headaches.length; i++) {
            labels[i] = this.headaches[i].startTime.toLocaleDateString('de-CH')
          }
        }
        return {
          chart: { stacked: true, toolbar: { show: false } },
          colors: ['#7AD6FD'],
          stroke: { curve: 'smooth' },
          xaxis: { categories: labels, labels: { show: false } }
        }
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
        let day = []
        if (this.data) {
          for (let i = 0; i < this.symptomscount.length; i++) {
            day[i] = this.symptomscount[i].count
          }
        }
        return [
          {
            name: 'Eintrags-Anzahl',
            data: day
          }
        ]
      },
      symoption() {
        let labels = []
        if (this.data) {
          for (let i = 0; i < this.symptomscount.length; i++) {
            labels[i] = new Date(this.symptomscount[i].date).toLocaleDateString('de-CH')
          }
        }
        return {
          chart: { stacked: true, toolbar: { show: false } },
          colors: ['#FED37F'],
          stroke: { curve: 'smooth' },
          xaxis: { categories: labels, labels: { show: false } }
        }
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
          if (this.symptoms.length > 0 && this.dateentry.includes('alle')) {
            let dif = Math.round(
              (this.symptoms[this.symptoms.length - 1].startTime.getTime() - this.symptoms[0].startTime.getTime()) /
                24 /
                60 /
                60 /
                1000
            )
            dif = dif == 0 ? 1 : dif
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('diesen')) {
            ds.setMonth(ds.getMonth(), 1)
            let dif = Math.round((de.getTime() - ds.getTime()) / 24 / 60 / 60 / 1000)
            dif = dif == 0 ? 1 : dif
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('letzten')) {
            ds.setMonth(ds.getMonth() - 1, 1)
            de.setMonth(de.getMonth(), 0)
            let dif = Math.round((de.getTime() - ds.getTime()) / 24 / 60 / 60 / 1000)
            dif = dif == 0 ? 1 : dif
            avg = Math.round((count / dif) * 100) / 100
          }
          if (this.dateentry.includes('anderen')) {
            ds = new Date(this.datestart)
            de = new Date(this.dateend)
            let dif = Math.round((de.getTime() - ds.getTime()) / 24 / 60 / 60 / 1000)
            dif = dif == 0 ? 1 : dif
            avg = Math.round((count / dif) * 100) / 100
          }
        }
        return avg
      },
      symout() {
        let sym = []
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
        return [
          {
            name: 'Anzahl',
            data: sym
          }
        ]
      },
      symoutoption() {
        let labels = []
        if (this.data) {
          if (this.symoutheadachecount.length < 3) {
            for (let i = 0; i < this.symoutheadachecount.length; i++) {
              labels.push(this.symoutheadachecount[i].symptom)
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              labels.push(this.symoutheadachecount[i].symptom)
            }
          }
        }
        return {
          chart: { toolbar: { show: false } },
          xaxis: { categories: labels },
          dataLabels: { enabled: false },
          colors: ['#FED37F']
        }
      },
      symin() {
        let sym = []
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
        return [
          {
            name: 'Anzahl',
            data: sym
          }
        ]
      },

      syminoption() {
        let labels = []
        if (this.data) {
          if (this.syminheadachecount.length < 3) {
            for (let i = 0; i < this.syminheadachecount.length; i++) {
              labels.push(this.syminheadachecount[i].symptom)
            }
          } else {
            for (let i = 0; i <= 2; i++) {
              labels.push(this.syminheadachecount[i].symptom)
            }
          }
        }
        return {
          chart: { toolbar: { show: false } },
          xaxis: { categories: labels },
          dataLabels: { enabled: false },
          colors: ['#7AD6FD']
        }
      },

      sleepduration() {
        let dur = []
        if (this.data) {
          if (this.sleeps.length > 0) {
            for (let i = 0; i < this.sleeps.length; i++) {
              dur[i] =
                Math.round(
                  ((this.sleeps[i].endTime.getTime() - this.sleeps[i].startTime.getTime()) / 60 / 60 / 1000) * 10
                ) / 10
            }
          }
        }
        return [
          {
            name: 'Stunden',
            data: dur
          }
        ]
      },

      sleepoption() {
        let labels = []
        if (this.data) {
          for (let i = 0; i < this.sleeps.length; i++) {
            labels[i] = this.sleeps[i].startTime.toLocaleDateString('de-CH')
          }
        }
        return {
          chart: { stacked: true, toolbar: { show: false } },
          colors: ['#921B51'],
          stroke: { curve: 'smooth' },
          xaxis: { categories: labels, labels: { show: false } }
        }
      },

      sleepavg() {
        let avg = 0
        let dur = 0
        if (this.data) {
          if (this.sleeps.length > 0) {
            for (let i = 0; i < this.sleeps.length; i++) {
              dur += this.sleeps[i].endTime.getTime() - this.sleeps[i].startTime.getTime()
            }
            avg = dur / this.sleeps.length
            avg = Math.round((avg / 60 / 60 / 1000) * 100) / 100
          }
        }
        return avg
      },

      medoptions() {
        let names = []
        let options = {
          chart: { stacked: true, toolbar: { show: false } },
          colors: ['#aee26a', '#f4d35e', '#ce4a2f'],
          dataLabels: { enabled: false },
          legend: { show: false },
          xaxis: { categories: names }
        }
        if (this.hasmed) {
          names.push(this.medicaments[0].de)
          for (let i = 1; i < this.medicaments.length; i++) {
            if (names[names.length - 1] != this.medicaments[i].de) {
              names.push(this.medicaments[i].de)
            }
          }
          return options
        }
        return options
      },

      medeffect() {
        let effcount = []
        let effresult = []

        if (this.hasmed) {
          for (let med in this.medicaments) {
            let id = effcount.findIndex(i => i.name === this.medicaments[med].de)
            if (id != -1) {
              if (this.medicaments[med].effect == 'geholfen') {
                effcount[id].good += 1
              }
              if (this.medicaments[med].effect == 'nicht geholfen') {
                effcount[id].not += 1
              }
              if (this.medicaments[med].effect == 'die Situation verschlechtert') {
                effcount[id].worse += 1
              }
            } else {
              effcount.push({ name: this.medicaments[med].de, good: 0, not: 0, worse: 0 })
              if (this.medicaments[med].effect == 'geholfen') {
                effcount[effcount.length - 1].good += 1
              }
              if (this.medicaments[med].effect == 'nicht geholfen') {
                effcount[effcount.length - 1].not += 1
              }
              if (this.medicaments[med].effect == 'die Situation verschlechtert') {
                effcount[effcount.length - 1].worse += 1
              }
            }
          }

          let goodmed = []
          let notmed = []
          let worsemed = []

          for (let eff in effcount) {
            goodmed.push(effcount[eff].good)
            notmed.push(effcount[eff].not)
            worsemed.push(effcount[eff].worse)
          }

          effresult.push({ name: 'Positive Wirkung', data: goodmed })
          effresult.push({ name: 'Keine Wirkung', data: notmed })
          effresult.push({ name: 'Negative Wirkung', data: worsemed })
        }
        return effresult
      }
    },

    watch: {
      dateentry() {
        let d = new Date()
        let ds = new Date()
        let de = new Date()
        if (this.dateentry.includes('diesen')) {
          ds.setMonth(ds.getMonth(), 1)
          this.datestart = ds.toISOString().substr(0, 10)
          this.dateend = de.toISOString().substr(0, 10)
          this.currentmonth = this.monthname[d.getMonth()]
        }
        if (this.dateentry.includes('letzten')) {
          ds.setMonth(ds.getMonth() - 1, 1)
          this.datestart = ds.toISOString().substr(0, 10)
          de.setMonth(de.getMonth(), 0)
          this.dateend = de.toISOString().substr(0, 10)
          this.currentmonth = this.monthname[d.getMonth() - 1]
        }
        if (this.dateentry == 'alle Daten') {
          this.datestart = null
          this.dateend = null
        }
        if (this.dateentry == 'einen anderen Zeitraum...') {
          this.datestart = this.datestartdesired
          this.dateend = this.dateenddesired
        }
        this.getObservations()
        this.getMedicaments()
      },

      datestartdesired() {
        this.datestart = this.datestartdesired
        this.datestartFormatted = this.formatDate(this.datestart)
        this.getObservations()
        this.getMedicaments()
      },

      dateenddesired() {
        this.dateend = this.dateenddesired
        this.dateendFormatted = this.formatDate(this.dateend)
        this.getObservations()
        this.getMedicaments()
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

      // containsMed(arr, medname) {
      //   console.log(arr);
      //   console.log(medname);
      //   for(let i = 0; i < arr.length; i++){
      //     console.log(i);
      //     if(arr[i].name === medname){
      //       return i
      //       arr.findIndex(i => i.name === medname);
      //     }
      //   }
      //   return false;
      // },

      defineIntervall() {
        let d = new Date()
        this.interval[1] = 'diesen Monat (' + this.monthname[d.getMonth()] + ')'
        this.interval[2] = 'letzten Monat (' + this.monthname[d.getMonth() - 1] + ')'
      },

      getObservations() {
        let query
        if (this.datestart && this.dateend) {
          query = 'Observation?date=ge' + this.datestart + '&date=le' + this.dateend
        } else {
          query = 'Observation'
        }
        if (this.$midataService.isReady()) {
          this.$midataService.getData(query).then(res => {
            let observations = this.$midataService.prepareData(res)

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

              // get all sleep resources and write them in an array
              this.sleeps = this.filterArray(x => x.category == 'SleepPattern', observations)
              this.sleeps.sort((a, b) => {
                return a.endTime - b.endTime
              })

              this.symptomscount = []
              if(this.symptoms.length != 0){
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
              }


              this.symoutheadache = []
              for (let i = 0; i < this.symptoms.length; i++) {
                if (!this.controlInHeadache(this.headaches, this.symptoms[i])) {
                  this.symoutheadache.push(this.symptoms[i])
                }
              }

              this.symoutheadache.sort((a, b) => (a.de > b.de ? 1 : b.de > a.de ? -1 : 0))

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
                this.symoutheadachecount.sort((a, b) => (a.count < b.count ? 1 : a.count < b.count ? -1 : 0))
              }

              this.syminheadache = this.symptoms.filter(x => !this.symoutheadache.includes(x))

              this.syminheadache.sort((a, b) => (a.de > b.de ? 1 : b.de > a.de ? -1 : 0))

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
                this.syminheadachecount.sort((a, b) => (a.count < b.count ? 1 : a.count < b.count ? -1 : 0))
              }
            } else {
              this.headaches = []
              this.symptoms = []
              this.symptomscount = []
              this.symoutheadache = []
              this.symoutheadachecount = []
              this.syminheadache = []
              this.syminheadachecount = []
              this.sleeps = []
              this.data = false
            }
          })
        }
      },

      getMedicaments() {
        if (this.$midataService.isReady()) {
          this.$midataService.getData('MedicationStatement').then(res => {
            this.medicaments = this.$midataService.prepareData(res)

            // only display valid entries
            this.medicaments = this.filterArray(x => !x.meta.invalid, this.medicaments)
            if (this.medicaments.length != 0) {
              this.hasmed = true
              for (let med in this.medicaments) {
                this.medicaments[med].de = this.medicaments[med].de.toUpperCase()
              }
              this.medicaments.sort((a, b) => (a.de > b.de ? 1 : b.de > a.de ? -1 : 0))
            } else {
              this.hasmed = false
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
