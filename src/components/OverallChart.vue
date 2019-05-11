<template>

  <div>

    <v-container v-resize="onResize" fluid grid-list-lg>
      <p v-if="!isPortrait">
        Hier siehst du alle deine Kopfschmerzen und Symptome im Zeitverlauf. Bewege deine Maus über einen Eintrag,
        um Details dazu anzuzeigen.
      </p>

      <!-- warning if screen width is too small-->
      <v-card v-if="isPortrait">
        <v-img :src="require('../assets/rotatePhone.gif')" contain />
        <v-card-text>
          Es wird stark empfohlen, diese Grafik auf einem grösseren Bildschirm, oder zumindest im Querformat, zu betrachten.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="isPortrait = false">trotzdem anzeigen</v-btn>
        </v-card-actions>

      </v-card>

      <!-- actual content-->
      <v-card v-else>
        <v-card-title>
          <v-icon class="mr-5" size="64" color="primary" v-if="!isMobile">
            trending_up
          </v-icon>
          <v-spacer />
          <v-layout row wrap>

            <v-menu v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    @focus="hideKeyboard()"
                    max-width="290px"
                    min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="formattedDates[0]" label="vom" prepend-inner-icon="event"
                  readonly v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="displayRange[0]"
                             @input="menu1 = false"
                             :max="displayRange[1]"
                             color="#0a967a"
                             no-title
                             locale="de-ch"
                             first-day-of-week="1"
                             :events="daysWithEntry"
                             event-color="#a3f7b5"></v-date-picker>
            </v-menu>

            <v-menu v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    @focus="hideKeyboard()"
                    width="100px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="formattedDates[1]" label="bis"
                  readonly v-on="on" ></v-text-field>
              </template>
              <v-date-picker v-model="displayRange[1]"
                             @input="menu2 = false"
                             :min="displayRange[0]"
                             color="#0a967a"
                             no-title
                             locale="de-ch"
                             first-day-of-week="1"
                             :events="daysWithEntry"
                             event-color="#a3f7b5">
              </v-date-picker>
            </v-menu>

            <v-spacer />


            <v-spacer />
          </v-layout>
        </v-card-title>
        <v-layout row wrap>
        <v-flex xs9>
          <v-card-text>
            <p>
              Leere Tage am Anfang und Ende der Grafik werden ausgeblendet.
            <br />
            <span v-if="numberOfDays > 20">Die Grafik ist für mittlere Zeitspannen optimiert. Auf kleinen Bildschirmen kann es bei längeren Zeitspannen zu Grafikfehlern kommen.</span></p>
          </v-card-text>
        </v-flex>
        <v-flex xs3>
          <v-tooltip bottom v-model="legend">
            <template v-slot:activator="{ on }">
              <!--v-icon @click="legend = !legend" large>info</v-icon-->
              <v-btn flat absolute right @click="legend = !legend">Legende</v-btn>
            </template>
            <span @blur="legend = false">
              <v-icon class="closeIcon" @click="legend = false">close</v-icon>
              <h3>Legende</h3>
              <table class="legend">
                <tr>
                  <td style="font-weight: bold">Kopfschmerzen:</td>
                  <td colspan="5"> (Intensität)</td>
                </tr>
                <tr>
                  <td style="background-color: #7B84FC; color: #000;">Pulsierende K.</td>
                  <td style="background-color: #7B84FC; color: #000; opacity: 0.9">9</td>
                  <td style="background-color: #7B84FC; color: #000; opacity: 0.7">7</td>
                  <td style="background-color: #7B84FC; color: #000; opacity: 0.5">5</td>
                  <td style="background-color: #7B84FC; color: #000; opacity: 0.3">3</td>
                  <td style="background-color: #7B84FC; color: #000; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td style="background-color: #7AD6FD; color: #000;">Einschiessende K.</td>
                  <td style="background-color: #7AD6FD; color: #000; opacity: 0.9">9</td>
                  <td style="background-color: #7AD6FD; color: #000; opacity: 0.7">7</td>
                  <td style="background-color: #7AD6FD; color: #000; opacity: 0.5">5</td>
                  <td style="background-color: #7AD6FD; color: #000; opacity: 0.3">3</td>
                  <td style="background-color: #7AD6FD; color: #000; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td style="background-color: #79FDFE; color: #000;">Stechende K.</td>
                  <td style="background-color: #79FDFE; color: #000; opacity: 0.9">9</td>
                  <td style="background-color: #79FDFE; color: #000; opacity: 0.7">7</td>
                  <td style="background-color: #79FDFE; color: #000; opacity: 0.5">5</td>
                  <td style="background-color: #79FDFE; color: #000; opacity: 0.3">3</td>
                  <td style="background-color: #79FDFE; color: #000; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td style="background-color: #79FBD6; color: #000;">Andere K.</td>
                  <td style="background-color: #79FBD6; color: #000; opacity: 0.9">9</td>
                  <td style="background-color: #79FBD6; color: #000; opacity: 0.7">7</td>
                  <td style="background-color: #79FBD6; color: #000; opacity: 0.5">5</td>
                  <td style="background-color: #79FBD6; color: #000; opacity: 0.3">3</td>
                  <td style="background-color: #79FBD6; color: #000; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td style="background-color: #FD978F; color: #000;">Migräne-Anfall</td>
                  <td colspan="5">nicht abgestuft</td>
                </tr>
                <tr>
                  <td style="font-weight: bold">Auffälligkeiten:</td>
                  <td colspan="5"> (Intensität)</td>
                </tr>
                <tr>
                  <td style="background-color: #FED37F; color: #000;">Beschwerden</td>
                  <td style="background-color: #FED37F; color: #000; opacity: 0.9">9</td>
                  <td style="background-color: #FED37F; color: #000; opacity: 0.7">7</td>
                  <td style="background-color: #FED37F; color: #000; opacity: 0.5">5</td>
                  <td style="background-color: #FED37F; color: #000; opacity: 0.3">3</td>
                  <td style="background-color: #FED37F; color: #000; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td style="background-color: #D5FA80; color: #000;">Zustände</td>
                  <td colspan="5">nicht abgestuft</td>
                </tr>
                <tr>
                  <td style="font-weight: bold">Sonstiges:</td>
                  <td colspan="5"> </td>
                </tr>
                <tr>
                  <td style="background-color: #921B51;">Schlafqualität</td>
                  <td style="background-color: #921B51; opacity: 0.9">9</td>
                  <td style="background-color: #921B51; opacity: 0.7">7</td>
                  <td style="background-color: #921B51; opacity: 0.5">5</td>
                  <td style="background-color: #921B51; opacity: 0.3">3</td>
                  <td style="background-color: #921B51; opacity: 0.1">1</td>
                </tr>
                <tr>
                  <td>Medikamente:</td>
                  <td colspan="5">💊</td>
                </tr>
              </table>
              <br /><h3>Optionen</h3>
              <table>
                <tr>
                  <td>
                  <v-switch v-model="showTitles" label=""></v-switch>
                </td>
                <td>Beschreibungen in <br/>Grafik einblenden<br />(wo Platz vorhanden).</td>
              </tr></table>
              Bewege die Maus über ein Element,<br/>um die Details anzuzeigen.
            </span>
          </v-tooltip>
        </v-flex>
      </v-layout>
        <GChart class="gchart"
                id="chart"
                :settings="{packages: ['timeline'], language: 'de'}"
                :data="chartData"
                :options="chartOptions"
                :resizeDebounce="1"
                :createChart="(el, google) => new google.visualization.Timeline(el)" />

      </v-card>
    </v-container>

  </div>

</template>

<script>

  import { GChart } from 'vue-google-charts';

  export default {
    components: {
      GChart
    },
    data() {
      return {
        legend: false,
        displayRange: ['2019-03-20', '2019-04-03'],
        formattedDates: [],
        daysWithEntry: [],
        numberOfDays: 7,
        isPortrait: false,
        isMobile: false,
        showTitles: false,
        observations: [],
        menu1: false,
        menu2: false,
        dataTable: null,
        chartData: [],
        chartOptions: {
          timeline: {
            groupByRowLabel: true,
            rowLabelStyle: { fontName: 'Helvetica' },
            barLabelStyle: { fontName: 'Helvetica' }
          },
          tooltip: {
            isHtml: true
          },
          avoidOverlappingGridLines: false,
          height: 270,
          backgroundColor: '#fff',
          animation: { startup: true }
        }
      };
    },

    props: {},

    methods: {
      /*
                      Checks if we are in mobile and portrait mode
                    */
      onResize() {
        this.isPortrait = window.innerWidth < 480;
        this.isMobile = window.innerWidth < 600;
      },

      /*
                      Processes the queried data in a format suitable for the google chart and causes the chart
                      to redraw.
                      parameters:   - data: An array of data objects as returned by MidataService.prepareData()
                      returns:      - nothing, just allocates the data to the chart, causing it to redraw
                      author:       hessg1
                      version:      2019-05-01
                    */
      fillChart(data) {
        // we can only display valid data
        data = this.filterArray(x => !x.meta.invalid, data);

        if (data.length == 0) {
          this.chartOptions.height = 45;
          let name =
            'Leider gibt es keine Einträge zum Anzeigen zwischen ' +
            this.displayRange[0] +
            ' und ' +
            this.displayRange[1] +
            '.';
          let tooltip = '<div class="tooltip"><h4>Keine Daten</h4><p>Wähle einen anderen Zeitraum aus.</p>';
          let style = 'color: #664147';

          this.chartData = [
            [
              { type: 'string', id: 'category' },
              { type: 'string', id: 'name' },
              { type: 'string', role: 'tooltip', p: { html: true } },
              { type: 'string', id: 'style', role: 'style' },
              { type: 'date', id: 'Start' },
              { type: 'date', id: 'End' }
            ],
            ['Fehler', name, tooltip, style, new Date(this.displayRange[0]+ "T00:00:00"), new Date(this.displayRange[1] + "T00:00:01")]
          ];
        } else {
          // first, set the categories available in the table (for table header)
          let tableHead = [
            [
              { type: 'string', id: 'category' },
              { type: 'string', id: 'name' },
              { type: 'string', role: 'tooltip', p: { html: true } },
              { type: 'string', id: 'style', role: 'style' },
              { type: 'date', id: 'Start' }, // start / end must be the last values
              { type: 'date', id: 'End' }
            ]
          ];

          let firstDate = new Date('3000-01-01'); // i'm fully aware we are running into year 3000 problems here
          let lastDate = new Date(0); // also, no one has observations on midata that are older than 1970

          // prepare the actual data
          let headache = [];
          let compAndCond = [];
          let sleep = [];
          let meds = [];
          // bi iterating through data object
          for (let i in data) {
            if (!data[i].meta.invalid) {
              // handling headache
              if (data[i].category == 'Headache') {
                let title = this.showTitles ? data[i].de : '';
                let tooltip =
                  '<div class="tooltip"><h4>' +
                  data[i].de +
                  '</h4>' +
                  '<p>Intensität ' +
                  data[i].quantity +
                  '/10<br />' +
                  data[i].bodySiteDE +
                  '<br />' +
                  this.formatDuration(data[i]) +
                  '</p>';
                let style =
                  'color: ' +
                  data[i].colour +
                  '; opacity: ' +
                  data[i].quantity / 10 +
                  '; stroke-opacity: ' +
                  (0.5 + data[i].quantity / 20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                headache.push(['Kopfschmerzen', title, tooltip, style, start, end]);

                // if(!this.legendContent.contains({text: "Kopfschmerzen", style: ""})){
                //   this.legendContent.push({text: "Kopfschmerzen", style: ""})
                // }
              }

              // handling complaint
              if (data[i].category == 'VariousComplaint') {
                let title = this.showTitles ? data[i].de : '';
                let tooltip =
                  '<div class="tooltip"><h4>' +
                  data[i].de +
                  '</h4>' +
                  '<p>Intensität ' +
                  data[i].quantity +
                  '/10<br />' +
                  this.formatDuration(data[i]) +
                  '</p>';
                let style =
                  'color: ' +
                  data[i].colour +
                  '; opacity: ' +
                  data[i].quantity / 10 +
                  '; stroke-opacity: ' +
                  (0.5 + data[i].quantity / 20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                compAndCond.push(['Auffälligkeiten', title, tooltip, style, start, end]);
              }

              // handling condition
              if (data[i].category == 'Condition') {
                let category = 'Auffälligkeiten';
                let title = this.showTitles ? data[i].de : '';
                let tooltip = '<div class="tooltip"><h4>' + data[i].de + '</h4>' + this.formatDuration(data[i]) + '</p>';
                if (data[i].code == '216299002') {
                  category = 'Kopfschmerzen';
                  tooltip =
                    '<div class="tooltip"><h4>' +
                    data[i].de +
                    '</h4>' +
                    this.formatDuration(data[i]) +
                    '<br />' +
                    'Du hast dies als Migräne-Attacke eingeschätzt.</p>';
                }
                let style = 'color: ' + data[i].colour + '; opacity: 0.5; stroke-opacity: 0.75';
                let start = data[i].startTime;
                let end = data[i].endTime;
                compAndCond.push([category, title, tooltip, style, start, end]);
              }


              // handling medication
              if (data[i].category == 'Medication') {
                let title = '💊';
                let tooltip =
                  '<div class="tooltip"><h4>' +
                  data[i].de +
                  '</h4><p>' +
                  data[i].dosage + ' Einheiten um ' +
                  data[i].date.toLocaleTimeString().slice(0,5) + ' Uhr genommen.<br />' +
                  'Es hat ' + data[i].effect + '.</p>';
                let style =
                  'opacity: 0; stroke-opacity: 0'
                let start = data[i].date;
                let end = new Date(data[i].date.getTime() + 1000);
                meds.push(['Medikamente', title, tooltip, style, start, end]);
              }

              // handling sleep
              if (data[i].category == 'SleepPattern') {
                let title = this.showTitles ? 'Schlaf' : '';
                let tooltip =
                  '<div class="tooltip"><h4>Schlafqualität ' +
                  data[i].quantity +
                  '</h4><p>' +
                  this.formatDuration(data[i]) +
                  '</p>';
                let style =
                  'color: ' +
                  data[i].colour +
                  '; opacity: ' +
                  data[i].quantity / 10 +
                  '; stroke-opacity: ' +
                  (0.5 + data[i].quantity / 20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                sleep.push(['Schlaf', title, tooltip, style, start, end]);
              }

              // finally check if we have to adjust the date frame
              if (data[i].startTime < firstDate) {
                firstDate = new Date(data[i].startTime);
              }
              if (data[i].endTime > lastDate) {
                lastDate = new Date(data[i].endTime);
              }
            }
          }
          // adding a full day to lastDate makes the chart look better
          lastDate.setDate(lastDate.getDate() + 1);

          this.numberOfDays = Math.round((lastDate.getTime() - firstDate.getTime()) / (24*60*60*1000))

          // now generate the day entries for every day needed:
          let day = firstDate;
          let sleepPatterns = this.filterArray(x => x.category == 'SleepPattern', data);
          let eatingHabits = this.filterArray(x => x.category == 'EatingHabit', data);

          // iterate through the days
          while (day < lastDate) {
            // get the sleep data for the day
            let sleepDuration = 0;
            let sleepQuality = [];
            for (let i in sleepPatterns) {
              if (sleepPatterns[i].endTime.toLocaleDateString() == day.toLocaleDateString()) {
                sleepQuality.push(sleepPatterns[i].quantity);
                sleepDuration += (sleepPatterns[i].endTime - sleepPatterns[i].startTime) / 60000; // get time difference in minutes
              }
            }
            // calculate average quality
            if (sleepQuality.length > 0) {
              let sum = sleepQuality.reduce((a, b) => a + b);
              sleepQuality =
                'Durchschnittliche Schlafqualität: ' + Math.round((10 * sum) / sleepQuality.length) / 10 + '/10.';
            } else {
              sleepQuality = 'Schlafqualität: Keine Daten.';
            }
            let hours = sleepDuration > 59 ? Math.round(sleepDuration / 60) : 0;
            let minutes = Math.round(sleepDuration % 60);
            if(sleepDuration == 0){
              sleepDuration = 'Gesamte Schlafdauer: Keine Daten.'
            }
            else {
              sleepDuration = 'Gesamte Schlafdauer: ' + hours + (minutes < 10 ? ':0' + minutes : ':' + minutes) + ' Stunden.';
            }


            // get the eating habit for a day
            let eatingShort = '';
            let eating = '';
            for (let i in eatingHabits) {
              if (eatingHabits[i].date.toLocaleDateString() == day.toLocaleDateString()) {
                eating += eatingHabits[i].de + '.<br />';
                eatingShort = ' (' + eatingHabits[i].de.slice(0, 1) + ')';
              }
            }
            eating = eating == '' ? 'Essverhalten: Keine Daten.<br />' : eating;
            eatingShort = eatingShort == 'U' ? '' : eatingShort;

            let months = [
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
            ];
            let textDate = day.getDate() + '. '+ months[day.getMonth()];
            let shortDate = day.getDate() + '.';
            if(this.numberOfDays < 10){
              shortDate = textDate;
            }
            else if(this.numberOfDays < 20){
              shortDate += '' + (day.getMonth() + 1) + '.';
            }

            let tooltip =
              '<div class="tooltip"><h4>' +
              textDate +
              '</h4>' +
              '<p>' +
              eating +
              sleepDuration +
              '<br />' +
              sleepQuality +
              '</p>';

            tableHead.push([
              'Tag:',
              shortDate, // + eatingShort,
              tooltip,
              this.chartOptions.backgroundColor,
              new Date(day.setHours(0, 0)),
              new Date(day.setHours(23, 59))
            ]);
            // increment date by one
            day.setDate(day.getDate() + 1);
          }
          this.chartOptions.height = 270;
          if(this.numberOfDays > 30){
            this.chartOptions.height += 100;
          }
          if (headache.length == 0) {
            this.chartOptions.height -= 42;
            headache.push([
              'Kopfschmerzen',
              'Keine Kopfschmerzen in dem Zeitraum.',
              '',
              'opacity: 0',
              new Date(day - 24 * 60 * 60 * 1000 - 1),
              new Date(day - 24 * 60 * 60 * 1000)
            ]);
          }
          if (compAndCond.length == 0) {
            this.chartOptions.height -= 42;
            compAndCond.push([
              'Auffälligkeiten',
              'Keine Auffälligkeiten in dem Zeitraum.',
              '',
              'opacity: 0',
              new Date(day - 24 * 60 * 60 * 1000 - 1),
              new Date(day - 24 * 60 * 60 * 1000)
            ]);
          }
          if (sleep.length == 0) {
            sleep.push([
              'Schlaf',
              'Keine Schlafdaten in dem Zeitraum.',
              '',
              'opacity: 0',
              new Date(day - 24 * 60 * 60 * 1000 - 1),
              new Date(day - 24 * 60 * 60 * 1000)
            ]);
          }
          if(meds.length == 0){
            this.chartOptions.height -= 42;
          }

          // merge tablehead and table:
          this.chartData = tableHead.concat(headache, meds, compAndCond, sleep);
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
        document.activeElement.blur();
      },

      /*
                    Convenience method for filtering an array with any criterium.
                    hessg1 / 2019-04-10
                    */
      filterArray(filter, array) {
        let newArr = [];
        for (var i in array) {
          if (filter(array[i])) {
            newArr.push(array[i]);
          }
        }
        return newArr;
      },

      /*
                    Convenience method for calculating the duration between two dates
                    hessg1 / 2019-04-10
                    */
      calcDuration(start, end) {
        let duration = '0:00';
        let diff = end - start;
        diff = diff > 0 ? diff : diff * -1; // if arguments were exchanged
        diff = Math.round(diff / 1000 / 60); // get minutes
        let min = diff % 60;
        min = min < 10 ? '0' + min : min;
        diff = Math.floor(diff / 60); // get hours
        let hours = diff % 24;
        hours = hours < 10 ? '0' + hours : hours;
        diff = Math.floor(diff / 24); // get days
        if (diff > 1) {
          duration = diff + ' Tage, ' + hours + ':' + min + 'h';
        } else {
          duration = hours + ':' + min + 'h';
        }
        return duration;
      },

      putDataIntoChart(){
        // update data and chart
        if (this.$midataService.isReady()) {
          let that = this;

          Promise.all([
            this.$midataService.getData('Observation?date=ge' + this.displayRange[0] + '&date=le' + this.displayRange[1]),
            this.$midataService.getData('MedicationStatement') // medication statement query can't be limited by date
          ]).then(res => {
            let obs = this.$midataService.prepareData(res[0]);
            let meds = this.$midataService.prepareData(res[1]);
            meds = this.filterArray(x => {
              return x.date >= new Date(this.displayRange[0] + "T00:00") && x.date <= new Date(this.displayRange[1] + "T23:59");
            }, meds);
            that.observations = obs.concat(meds);
            that.fillChart(that.observations);
          });
        }
      },

      /*
        Convenience method for building a "duration" string
        hessg1 / 2019-04-17
      */
      formatDuration(item) {
        let start = item.startTime.toLocaleTimeString().slice(0, 5);
        let end = item.endTime.toLocaleTimeString().slice(0, 5);
        return 'von ' + start + ' bis ' + end + ' (' + this.calcDuration(item.startTime, item.endTime) + ')';
      }
    },

    mounted() {
      let today = new Date();
      let lastWeek = new Date(today.setDate(today.getDate() - 7)).toISOString().slice(0, 10);
      this.displayRange = [lastWeek, new Date().toISOString().slice(0, 10)];

      this.putDataIntoChart();

      let allObs = this.$midataService.getCachedData('Observation');
      if(allObs != null) {
        allObs = this.$midataService.prepareData(allObs);
        allObs = this.filterArray(
          x =>
            !x.meta.invalid &&
            (x.category == 'Headache' ||
              x.category == 'VariousComplaint' ||
              x.category == 'Condition' ||
              x.category == 'Sleep'),
          allObs
        );
        for (let i in allObs) {
          let date = allObs[i].endTime.toISOString().slice(0, 10);
          if (!this.daysWithEntry.includes(date)) {
            this.daysWithEntry.push(date);
          }
        }
      }
    },

    watch: {
      displayRange() {
        // update formatted date:
        this.formattedDates[0] = new Date(this.displayRange[0]).toLocaleDateString();
        this.formattedDates[1] = new Date(this.displayRange[1]).toLocaleDateString();
        this.putDataIntoChart();

      },
      showTitles() {
        this.fillChart(this.observations);
      },
    }
  };

</script>
<style>

  div.tooltip {
    padding: 5px;
    margin-bottom: 2px;
    background-color: #e5f9e0;
    white-space: nowrap;
  }
  div.tooltip h4 {
    padding: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid black;
  }

  div.tooltip p {
    margin-top: 0px;
    margin-bottom: 2px;
    padding-left: 5px;
    padding-right: 5px;
  }

  table.legend td {
    padding: 2px;
  }

  /* formatting close icon of legend tooltip */
  .closeIcon {
    position: absolute !important;
    right: 4px !important;
    top: 4px !important;
  }

  /* this is needed so the google chart always has his needed height. fully aware of the ugliness of this.*/
  .gchart div {
    overflow: visible !important;
  }

  input {
    width: 100px !important;
  }

</style>
