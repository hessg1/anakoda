<template>

  <div>
    <!-- dialog that notifies the user to turn his phone into landscape-->
    <v-dialog v-model="isPortrait" width="200" v-resize="onResize">
      <v-card>
        <v-card-text>
          <v-img :src="require('../assets/rotatePhone.gif')" contain />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- actual content-->
    <v-container v-resize="onResize">
      <v-layout row wrap>
        <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition"
          offset-y @focus="hideKeyboard()" min-width="200px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="displayRange[0]" label="von" prepend-icon="event"
              readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="displayRange[0]" @input="menu1 = false" :max="displayRange[1]"
                        color="#0a967a" no-title locale="de-ch" first-day-of-week="1" :events="daysWithEntry" event-color="#a3f7b5"></v-date-picker>
        </v-menu>

        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition"
          offset-y @focus="hideKeyboard()" min-width="200px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="displayRange[1]" label="bis"
              readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="displayRange[1]" @input="menu2 = false" :min="displayRange[0]"
                        color="#0a967a" no-title locale="de-ch" first-day-of-week="1"></v-date-picker>
        </v-menu>

        <v-btn flat>Legende</v-btn>
      </v-layout>

      <GChart id="chart"
              :settings="{packages: ['timeline'], language: 'en'}"
              :data="chartData"
              :options="chartOptions"
              :createChart="(el, google) => new google.visualization.Timeline(el)"
              /> <!--@ready="onChartReady" /-->
      <v-switch v-model="showTitles" label="Beschreibungen anzeigen"></v-switch>
      <p>Bewege die Maus über ein Element, um Details anzuzeigen.<br>Beachte, dass Tage ohne Daten am Anfang und Ende der Grafik ausgelassen werden.</p>

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
        displayRange: ["2019-03-20","2019-04-03"],
        daysWithEntry: ["2019-04-05","2019-04-11","2019-03-21","2019-03-27","2019-04-03","2019-04-12",],
        isPortrait: false,
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
          height: 400,
          backgroundColor: '#fafafa',
          animation: {"startup": true}
        }
      }
    },

    props: {},

    methods: {

      /*
        Checks if we are in mobile and portrait mode
      */
      onResize() {
        this.isPortrait = window.innerWidth < 480
      },


      /*
        Processes the queried data in a format suitable for the google chart and causes the chart
        to redraw.
        parameters:   - data: An array of data objects as returned by MidataService.prepareData()
        returns:      - nothing, just allocates the data to the chart, causing it to redraw
        author:       hessg1
        version:      2019-05-01
      */
      fillChart(data){
        // we can only display valid data
        data = this.filterArray(x => !x.meta.invalid, data);

        if(data.length == 0){
          let name = 'Leider gibt es keine Einträge zum Anzeigen zwischen ' + this.displayRange[0] + ' und ' + this.displayRange[1] + '.';
          let tooltip = '<div class="tooltip"><h4>Keine Daten</h4><p>Wähle einen anderen Zeitraum aus.</p>';
          let style = 'color: #664147';

          this.chartData = [
            [{type: 'string', id: 'category'},{type: 'string', id: 'name'},
            { type: 'string', role: 'tooltip', p: { html: true } },{ type: 'string', id: 'style', role: 'style' },
            { type: 'date', id: 'Start' },{ type: 'date', id: 'End' }],
            ['Fehler', name, tooltip, style, new Date(this.displayRange[0]), new Date(this.displayRange[1])]
          ];
        }
        else {

          // first, set the categories available in the table (for table header)
          let tableHead = [[
            { type: 'string', id: 'category' },
            { type: 'string', id: 'name' },
            { type: 'string', role: 'tooltip', p: { html: true } },
            { type: 'string', id: 'style', role: 'style' },
            { type: 'date', id: 'Start' }, // start / end must be the last values
            { type: 'date', id: 'End' }
          ]];


          let firstDate = new Date("3000-01-01"); // i'm fully aware we are running into year 3000 problems here
          let lastDate = new Date(0); // also, no one has observations on midata that are older than 1970

          // prepare the actual data
          let headache = [];
          let compAndCond = [];
          let sleep = [];
          // bi iterating through data object
          for(let i in data){
            if(!data[i].meta.invalid){

              // handling headache
              if(data[i].category == 'Headache'){
                let title = this.showTitles ? data[i].de : '';
                let tooltip = '<div class="tooltip"><h4>' + data[i].de + '</h4>' +
                              '<p>Intensität ' + data[i].quantity + '/10<br />' +
                              data[i].bodySiteDE + '<br />' +
                              this.formatDuration(data[i]) + '</p>';
                let style = 'color: ' + data[i].colour + '; opacity: ' + (data[i].quantity / 10) + '; stroke-opacity: ' + (0.5 + data[i].quantity/20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                headache.push(['Kopfschmerzen', title, tooltip, style, start, end]);
              }

              // handling complaint
              if(data[i].category == 'VariousComplaint'){
                let title = this.showTitles ? data[i].de : '';
                let tooltip = '<div class="tooltip"><h4>' + data[i].de + '</h4>' +
                              '<p>Intensität ' + data[i].quantity + '/10<br />' +
                              this.formatDuration(data[i]) + '</p>';
                let style = 'color: ' + data[i].colour + '; opacity: ' + (data[i].quantity / 10) + '; stroke-opacity: ' + (0.5 + data[i].quantity/20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                compAndCond.push(['Auffälligkeiten', title, tooltip, style, start, end]);
              }

              // handling condition
              if(data[i].category == 'Condition'){
                let category = 'Auffälligkeiten';
                let title = this.showTitles ? data[i].de : '';
                let tooltip = '<div class="tooltip"><h4>' + data[i].de + '</h4>' +
                              this.formatDuration(data[i]) + '</p>';
                if(data[i].code == '216299002'){
                  category = 'Kopfschmerzen';
                  tooltip = '<div class="tooltip"><h4>' + data[i].de + '</h4>' +
                                this.formatDuration(data[i]) + '<br />' +
                                'Du hast dies als Migräne-Attacke eingeschätzt.</p>';
                }
                let style = 'color: ' + data[i].colour + '; opacity: 0.5; stroke-opacity: 0.75';
                let start = data[i].startTime;
                let end = data[i].endTime;
                compAndCond.push([category, title, tooltip, style, start, end]);
              }

              // handling sleep
              if(data[i].category == 'SleepPattern'){
                let title = this.showTitles ? 'Schlaf' : '';
                let tooltip = '<div class="tooltip"><h4>Schlafqualität ' + data[i].quantity + '</h4>' +
                              this.formatDuration(data[i]) + '</p>';
                let style = 'color: ' + data[i].colour + '; opacity: ' + (data[i].quantity / 10) + '; stroke-opacity: ' + (0.5 + data[i].quantity/20);
                let start = data[i].startTime;
                let end = data[i].endTime;
                sleep.push(['Schlaf', title, tooltip, style, start, end]);
              }

              // finally check if we have to adjust the date frame
              if(data[i].startTime < firstDate){
                firstDate = new Date(data[i].startTime);
              }
              if(data[i].endTime > lastDate){
                lastDate = new Date(data[i].endTime);
              }
            }
          }
          // adding a full day to lastDate makes the chart look better
          lastDate.setDate(lastDate.getDate() + 1);

          // now generate the day entries for every day needed:
          let day = firstDate;

          let sleepPatterns = this.filterArray(x => (x.category == 'SleepPattern'), data);
          let eatingHabits = this.filterArray(x => (x.category == 'EatingHabit'), data)

          // iterate through the days
          while(day < lastDate){
            // get the sleep data for the day
            let sleepDuration = 0;
            let sleepQuality = [];
            for(let i in sleepPatterns){
              if(sleepPatterns[i].endTime.toLocaleDateString() == day.toLocaleDateString()){
                sleepQuality.push(sleepPatterns[i].quantity);
                sleepDuration += (sleepPatterns[i].endTime - sleepPatterns[i].startTime) / 60000 // get time difference in minutes
              }
            }
            // calculate average quality
            if(sleepQuality.length > 0){
              let sum = sleepQuality.reduce((a,b) => (a+b));
              sleepQuality = 'Durchschnittliche Schlafqualität: ' +
                              Math.round(10 * sum / sleepQuality.length)/10
                              + '/10.';
            }
            else{
              sleepQuality = "Schlafqualität unbekannt.";
            }
            let hours = sleepDuration > 59 ? Math.round(sleepDuration / 60) : 0;
            let minutes = Math.round(sleepDuration % 60);
            sleepDuration = "Gesamte Schlafdauer: " + hours + (minutes < 10? ':0' + minutes :  ':' + minutes) + ' Stunden.';


            // get the eating habit for a day
            let eatingShort = "";
            let eating = "";
            for(let i in eatingHabits){
              if(eatingHabits[i].date.toLocaleDateString() == day.toLocaleDateString()){
                eating += eatingHabits[i].de + '.<br />';
                eatingShort = ' (' + eatingHabits[i].de.slice(0,1) + ')';
              }
            }
            eating = eating == '' ? 'Unbekanntes Essverhalten.<br />' : eating;
            eatingShort = eatingShort == 'U' ? '' : eatingShort;



            let months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            let textDate = day.getDate() + '. ' + months[day.getMonth()];
            let tooltip = '<div class="tooltip"><h4>' + textDate + '</h4>' +
                           '<p>' + eating + sleepDuration + '<br />' + sleepQuality + '</p>';

            tableHead.push(['Tag:', textDate + eatingShort, tooltip, this.chartOptions.backgroundColor, new Date(day.setHours(0,0)), new Date(day.setHours(23,59))]);
            // increment date by one
            day.setDate(day.getDate() + 1);
          }

          // merge tablehead and table:
          this.chartData = tableHead.concat(headache, compAndCond, sleep);
        }
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
      Convenience method for calculating the duration between two dates
      hessg1 / 2019-04-10
      */
      calcDuration(start, end){
        let duration = "0:00";
        let diff = end - start;
        diff = diff > 0 ? diff : diff * -1; // if arguments were exchanged
        diff = Math.round(diff / 1000 / 60); // get minutes
        let min = diff % 60;
        min = min < 10 ? '0' + min : min;
        diff = Math.floor(diff / 60); // get hours
        let hours = diff % 24;
        hours = hours < 10 ? '0' + hours : hours;
        diff = Math.floor(diff / 24); // get days
        if(diff > 1){
          duration = diff + " Tage, " + hours + ":" + min + "h";
        }
        else{
          duration = hours + ":" + min + "h";
        }
        return duration;

      },

      /*
      Convenience method for building a "duration" string
      hessg1 / 2019-04-17
      */
      formatDuration(item){
        let start = item.startTime.toLocaleTimeString().slice(0,5);
        let end = item.endTime.toLocaleTimeString().slice(0,5);
        // if(item.startTime.toLocaleDateString() != item.endTime.toLocaleDateString()){
        //   return "vom " + item.startTime.toLocaleDateString() + " um " + start
        //   + " bis am " + item.endTime.toLocaleDateString() + " um " + end
        //   + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
        // }
        // else{
          return "von " + start + " bis "
          + end + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
        // }
      },

    },

    mounted() {
      if (this.$midataService.isReady()) {
        let that = this;
        this.$midataService.getData('Observation?date=ge' + this.displayRange[0] + '&date=le' + this.displayRange[1]).then(res => {
          that.observations = this.$midataService.prepareData(res)
          this.fillChart(that.observations);
        })
      }
    },

    watch: {
      displayRange(){
        // update data and chart
        if (this.$midataService.isReady()) {
          let that = this;
          this.$midataService.getData('Observation?date=ge' + this.displayRange[0] + '&date=le' + this.displayRange[1]).then(res => {
            that.observations = this.$midataService.prepareData(res)
            this.fillChart(that.observations);
          })
        }
      },
      showTitles(){
          this.fillChart(this.observations);
        }
      },

    computed: {}
  }

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

</style>
