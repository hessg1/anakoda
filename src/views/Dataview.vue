<template>
  <div>
    <Login />

    <!-- FEEDBACK DIALOG -->
    <Feedback :visible="openFeedback" :questions="questions" page="DataView" @close="openFeedback = false" />

    <!-- DETAIL VIEW DIALOG-->
    <v-dialog v-model="dialog" scrollable>
      <v-card  v-if="activeItem != null">
        <v-card-title>
          <span class="headline" v-if="activeItem.category == 'dayEntry'">Tageseintrag vom {{ activeItem.date }}</span>
          <span class="headline" v-else>{{ activeItem.de }} <br v-if="isMobile"/>am {{ activeItem.startTime.toLocaleDateString() }}</span>
          <v-tooltip bottom v-if="activeItem.category == 'Headache'">
            <template v-slot:activator="{ on }">
              <v-icon v-if="isPerceivedAttack(activeItem)" color="primary" v-on="on">flash_on</v-icon>
              <v-icon v-else color="primary" v-on="on">flash_off</v-icon>
            </template>
            <span v-if="isPerceivedAttack(activeItem)">Dieser Blitz zeigt an, dass du die Kopfschmerzen im Rahmen einer Migräne-Attacke eingeschätzt hast.</span>
            <span v-else>Du hast die Kopfschmerzen NICHT im Rahmen einer Migräne-Attacke eingeschätzt.</span>
          </v-tooltip>
        </v-card-title>

        <v-card-text>
          <table v-if="activeItem.category == 'dayEntry'" class="detail">
            <tr v-for="sleep in activeItem.sleep" :key="sleep.index">
              <td>
                geschlafen:<br />
                Schlafqualität:
              </td>
              <td>
                {{ sleep.startTime.toLocaleTimeString().slice(0,5) }} - {{ sleep.endTime.toLocaleTimeString().slice(0,5) }} ({{calcDuration(sleep.endTime, sleep.startTime)}})<br/>
                {{ sleep.quantity}}/10
              </td>
            </tr>
            <tr>
              <td>Essverhalten:</td>
              <td v-if="activeItem.eat != ''">{{activeItem.eat.de}}</td>
              <td v-else>Noch unbekannteres Essverhalten</td>
            </tr>

          </table>
          <table class="detail" v-else>
            <tr v-if="activeItem.category == 'Headache'">
              <td>Seite:</td>
              <td>{{ activeItem.bodySiteDE }}</td>
            </tr>
            <tr v-if="activeItem.category == 'VariousComplaint' || activeItem.category == 'Headache'">
              <td>Intensität:</td>
              <td>{{ activeItem.quantity}}/10</td>
            </tr>
            <tr v-if="activeItem.category == 'Headache' || activeItem.category == 'VariousComplaint' || activeItem.category == 'Condition'">
              <td>Dauer:</td>
              <td>{{ formatDuration(activeItem) }}</td>
            </tr>
            <tr v-if="relatedItems.length > 0 && activeItem.category == 'Headache'" class="detailRelated">
              <td>Gleichzeitige Auffälligkeiten:</td>
              <td>
                <ul>
                  <li v-for="item in relatedItems" v-bind:key="item.index">
                    {{item.de}} <span v-if="item.category == 'VariousComplaint'">({{item.quantity}}/10)</span>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
          <p class="sourceInfo">
            Erfasst am {{ activeItem.meta.timestamp.toLocaleDateString() }} mit {{ activeItem.meta.source}}.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat
            @click="activeItem = null; dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs color="#40c9a2" slider-color="#a3f7b5">
    <v-tab>Kopfschmerzen</v-tab>

    <!-- HEADACHE TABLE -->
    <v-tab-item>
      <v-container>
          <p>Hier siehst du deine Kopfschmerz-Attacken. Klicke einen Eintrag an, um mehr Infos dazu anzuzeigen.</p>
      <v-data-table
      :headers="headacheHeaders"
      :items="headaches"
      :pagination.sync="pagination"
      class="elevation-1"
      v-resize="onResize"
      >
        <template v-slot:items="props">
          <tr @click="clicked(props.item)">
            <td>{{ props.item.de }}</td>
            <td class="text-xs">{{ props.item.startTime.toLocaleDateString() }}</td>
            <td v-if="!isMobile" class="text-xs">{{ props.item.quantity }}</td>
            <td v-if="!isMobile" class="text-xs">{{ props.item.bodySiteDE }}</td>
            <td v-if="!isMobile" class="text-xs">{{ calcDuration(props.item.endTime, props.item.startTime) }}</td>
          </tr>
        </template>
        <template v-slot:no-data>
          Es gibt noch keine Daten zum Anzeigen.
        </template>
      </v-data-table>
    </v-container>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
        absolute
        dark
        fab
        top
        right
        color="#664147"
        v-on="on"
        @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
      </template>
      <span>Gib uns dein Feedback</span>
  </v-tooltip>
  </v-tab-item>

  <!-- SYMPTOM TABLE -->

    <v-tab>{{symptomTab}}</v-tab>
    <v-tab-item>
      <v-container>
        <p>Hier siehst du deine Symptome und Auffälligkeiten. Klicke einen Eintrag an, um mehr Infos dazu anzuzeigen.</p>
        <v-data-table
        :headers="symptomHeaders"
        :items="symptoms"
        :pagination.sync="pagination"
        class="elevation-1"
        v-resize="onResize"
        >
          <template v-slot:items="props">
            <tr @click="clicked(props.item)">
              <td>{{ props.item.de }}</td>
              <td class="text-xs">{{ props.item.startTime.toLocaleDateString() }}</td>
              <td v-if="!isMobile" class="text-xs">{{ calcDuration(props.item.endTime, props.item.startTime) }}</td>
            </tr>
          </template>
          <template v-slot:no-data>
            Es gibt noch keine Daten zum Anzeigen.
          </template>
        </v-data-table>
      </v-container>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
          absolute
          dark
          fab
          top
          right
          color="#664147"
          v-on="on"
          @click="openFeedback = openFeedback">
            <v-icon>comment</v-icon>
          </v-btn>
        </template>
        <span>Gib uns dein Feedback</span>
    </v-tooltip>
    </v-tab-item>

  <!-- DAY TABLE-->
  <v-tab>{{dayTab}}</v-tab>
  <v-tab-item>
    <v-container>
      <p>Hier siehst du deine Tages-Einträge. Klicke einen Eintrag an, um mehr Infos dazu anzuzeigen.</p>
      <v-data-table
      :headers="dayHeaders"
      :items="days"
      :pagination.sync="dayPagination"
      class="elevation-1"
      v-resize="onResize"
      >
        <template v-slot:items="props">
          <tr @click="clicked(props.item)">
            <td>{{ props.item.date }}</td>
            <td>{{ calcDuration(props.item.sleep[0].startTime, props.item.sleep[0].endTime)}}</td>
            <td>{{ props.item.eat.de }}</td>
        </tr>
        </template>
        <template v-slot:no-data>
          Es gibt noch keine Daten zum Anzeigen.
        </template>
      </v-data-table>
    </v-container>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
        absolute
        dark
        fab
        top
        right
        color="#664147"
        v-on="on"
        @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
      </template>
      <span>Gib uns dein Feedback</span>
  </v-tooltip>
  </v-tab-item>
  </v-tabs>
</div>

</template>

<script>
import Login from '@/components/Login';
import SnomedService from '@/services/SnomedService';
import Feedback from '../components/Feedback';
const sct = new SnomedService();
let observations = [];

export default {
  data() {
    return {
      observations: [],
      headaches: [],
      symptoms: [],
      days: [],
      pagination: {
          descending: true,
          rowsPerPage: 6,
          sortBy: "startTime"
      },
      dayPagination: {
          descending: true,
          rowsPerPage: 6,
          sortBy: "sleep[0].endTime"
      },
      search: '',
      isMobile: false,
      activeItem: null,
      relatedItems: null,
      dialog: false,
      symptomTab: 'Symptome & Auffälligkeiten',
      dayTab: 'Tageseinträge',
      headacheHeaders: [
        {
          text: 'Kopfschmerzen',
          align: 'left',
          sortable: false,
          value: 'de'
        },
        { text: 'Datum:', value: 'startTime', align: 'left'},
        { text: 'Intensität', value: 'quantity', align: 'left'},
        { text: 'Seite', sortable: false, align: 'left'},
        { text: 'Dauer (h)', sortable: false, align: 'left'}
      ],
      symptomHeaders: [
        {
          text: 'Symptome und Auffälligkeiten',
          align: 'left',
          sortable: false,
          value: 'de'
        },
        { text: 'Datum:', value: 'startTime', align: 'left'},
        { text: 'Dauer (h)', sortable: false, align: 'left'}
      ],
      dayHeaders: [
        {
          text: 'Eintrag vom',
          align: 'left',
          sortable: true,
          value: 'sleep[0].endTime'
        },
        { text: 'Schlaf', sortable: false, align: 'left'},
        { text: 'Essgewohnheit', sortable: false, align: 'left'}
      ],
      openFeedback: false,
      questions: [
        { question: "Findest du die Auflistung deiner Daten übersichtlich?",
          answers: ["Ja", "Nein"],
          modelname: "clear arrangement",
          model: "",
          questiontext: "Was stört dich?",
          questiontextrule: "Nein"
        },
        { question: "Würdest du gerne weitere Informationen einsehen?",
          answers: ["Ja", "Nein"],
          modelname: "otherdata",
          model: "",
          questiontext: "Welche?",
          questiontextrule: "Ja"
        },
        { question: "Helfen dir die Auflistungen deiner Daten dabei deine Krankheit besser zu verstehen?",
          answers: ["Ja", "Nein"],
          modelname: "otherdata",
          model: "",
          questiontext: false,
          questiontextrule: ""
        }
      ]
    }
  },
  components: {
    Login,
    Feedback
  },
  methods: {
    /*
    Convenience method for filtering an array with any criterium.
    hessg1 / 2019-04-10
    */
    filterArray(filter, array){
      let newArr = [];
      for(var i in array){
        if(filter(array[i])){
          newArr.push(array[i]);
        }
      }
      return newArr;
    },

    clicked(item){
      this.activeItem = item;
      this.dialog = true;
    },

    /*
    Convenience method for building a "duration" string
    hessg1 / 2019-04-17
    */
    formatDuration(item){
      let start = item.startTime.toLocaleTimeString().slice(0,5);
      let end = item.endTime.toLocaleTimeString().slice(0,5);
      if(item.startTime.toLocaleDateString() != item.endTime.toLocaleDateString()){
        return "vom " + item.startTime.toLocaleDateString() + " um " + start
        + " bis am " + item.endTime.toLocaleDateString() + " um " + end
        + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
      }
      else{
        return "von " + start + " bis "
        + end + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
      }
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
      Gets complaints and conditions that were happening during the occurence of a headache
      (started or ended between start and end of headache)
      hessg1 / 2019-04-15
    */
    getRelatedObs(headache){
       return this.filterArray(function(obs){
        if((obs.category == 'VariousComplaint' || obs.category == 'Condition') && obs.code != 216299002){
          return((obs.startTime >= headache.startTime && obs.startTime < headache.endTime) ||
                 (obs.endTime > headache.startTime && obs.endTime <= headache.endTime));
        }
        return false;
      }, observations);
    },

    /*
      Checks if a given headache was perceived by the user as a migraine attack
      (by searching all observations for an "attack" entry with the same start- and endtime)
      hessg1 / 2019-04-23
    */
    isPerceivedAttack(headache){
      let attacks = this.filterArray(x => (x.code == 216299002), observations);
      for(var i in attacks){
        if(attacks[i].startTime.getTime() == headache.startTime.getTime()
          && attacks[i].endTime.getTime() == headache.endTime.getTime()){
          return true;
        }
      }
      return false;
    },

    /*
      Checks on resizing the datatable / screen if we are on a smartphone
    */
    onResize(){
      this.isMobile = window.innerWidth < 600;
    }

  },
  mounted(){
    if(this.$midataService.isReady()){
      this.$midataService.getData('Observation').then(res => {
        observations = this.$midataService.prepareData(res);
        // only display valid entries
        if(!JSON.parse(localStorage.getItem("showInvalid"))){
          observations = this.filterArray(x => (!x.meta.invalid), observations);
        }

        // get the SCT codes for headaches from SnomedService
        let headacheCodes = sct.getFilteredProp(x => (x.category == 'Headache'), 'code');
        // and filter all the headache objects in observations
        this.headaches = this.filterArray(x => (headacheCodes.includes(x.code)), observations);

        this.symptoms = this.filterArray(x => ((x.category == 'VariousComplaint' || x.category == 'Condition') && x.code != 216299002), observations);

        // get all sleep patterns and write them to the days array
        let sleep = this.filterArray(x => (x.category == 'SleepPattern'), observations);
        for(let i in sleep){
          let dayEntry = null;
          // check if there is already an array entry for this day
          for(var j in this.days) {
            if(sleep[i].endTime.toLocaleDateString() == this.days[j].date){
              dayEntry = j;
            }
          }
          if(dayEntry == null){
            this.days.push({
              date: sleep[i].endTime.toLocaleDateString(),
              category: "dayEntry",
              sleep: [sleep[i]],
              eat: {de: "Unbekanntes Essverhalten"},
              meta: sleep[i].meta
            })
          }
          else{
            if(this.days[j].meta.invalid && this.days[j].sleep.length == 1){
              // check if it's invalid because only eating habit was created yet
              if(this.days[j].sleep[0].quantity == -1 ){
                this.days[j].meta.invalid = sleep[i].meta.invalid;
                this.days[j].sleep[0] = sleep[i];
              }
            }
            this.days[j].sleep.push(sleep[i]);
          }
        }

        // get all eating habits and write them to the days array
        let eat = this.filterArray(x => (x.category == 'EatingHabit'), observations);
        for(let i in eat){
          let dayEntry = null;
          // check if there is already an array entry for this day
          for(j in this.days) {
            if(eat[i].date.toLocaleDateString() == this.days[j].date){
              dayEntry = j;
            }
          }
          if(dayEntry == null){
            eat[i].meta.invalid = true; // if we don't have a sleep pattern, it's not valid
            this.days.push({
              date: eat[i].date.toLocaleDateString(),
              category: "dayEntry",
              eat: [eat[i]],
              sleep: [{
                startTime: new Date(0),
                endTime: new Date(1),
                quantity: -1
              }],
              meta: eat[i].meta
            })
          }
          else{
            this.days[j].eat = eat[i];
          }
        }
      });
    }
  },
  
  watch: {
    isMobile(){
      if(this.isMobile){
        this.headacheHeaders = [
          {
            text: 'Kopfschmerzen',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'Datum:', value: 'startTime', align: 'left',}
        ];
        this.symptomHeaders = [
          {
            text: 'Symptome und Auffälligkeiten',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'Datum:', value: 'startTime', align: 'left'}
        ];
        this.symptomTab = 'Auffälligkeiten';
        this.dayTab = 'Tage';
      }
      else{
        this.headacheHeaders = [
          {
            text: 'Kopfschmerzen',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'Datum:', value: 'startTime', align: 'left',},
          { text: 'Intensität', value: 'quantity', align: 'left',},
          { text: 'Seite', sortable: false, align: 'left',},
          { text: 'Dauer (h)', sortable: false, align: 'left',}
        ];
        this.symptomHeaders = [
          {
            text: 'Symptome und Auffälligkeiten',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'Datum:', value: 'startTime', align: 'left'},
          { text: 'Dauer (h)', sortable: false, align: 'left'}
        ];
        this.symptomTab = 'Symptome & Auffälligkeiten';
        this.dayTab = 'Tageseinträge';
      }
    },
    activeItem(){
      if(this.activeItem){
        this.relatedItems = (this.getRelatedObs(this.activeItem));
      }
      else{
        this.relatedItems = null;
      }
    }

  }
}
</script>

<style scoped>
.v-table td {
  cursor: pointer;
}

/* styling of the detail view table */
table.detail {
  width: 100%;
}
.detail td {
  justify-content: left;
  text-align: left;
}
.detail td:first-child{
  width: 30%;
  font-weight: bold;
  vertical-align: top;
}
.detail ul {
  list-style-type: none;
  padding-left: 0;
}
.detail tr.detailRelated td {
  border-top: 1px solid #F0F0F0;
  padding-top: 5px;
}
p.sourceInfo{
  margin-top: 15px;
  margin-bottom: 0px;
  text-align: left;
  color: grey;
  width: 100%;
}
</style>
