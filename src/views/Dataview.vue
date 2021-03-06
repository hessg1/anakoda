<template>
  <div>
    <Login />

    <!-- FEEDBACK DIALOG -->
    <Feedback :visible="openFeedback" :questions="questions" page="DataView" @close="openFeedback = false" />

    <!-- DETAIL VIEW DIALOG-->
    <v-dialog v-model="dialog" scrollable lazy max-width="600">
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
            <tr v-for="eat in activeItem.eat" :key="eat.index">
              <td>Essverhalten:</td>
              <td>{{eat.de}}</td>
            </tr>
            <tr v-if="activeItem.eat.length == 0">
              <td>Essverhalten:</td>
              <td>nicht bekannt</td>
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
          <v-btn  @click="deletePrompt = true" icon><v-icon>delete</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat
            @click="activeItem = null; dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- DELETE PROMPT-->
    <v-dialog v-model="deletePrompt" lazy max-width="500" scrollable>
      <v-card>
        <v-card-title   class="headline primary lighten-2"
          primary-title>
          Eintrag löschen
        </v-card-title>
        <v-card-text v-if="activeItem">
          <span v-if="activeItem.category == 'dayEntry'">Welche Elemente des Tageseintrags vom {{ activeItem.date }} möchtest du löschen?</span>
          <span v-else>Möchtest du "{{ activeItem.de }}" vom {{ activeItem.startTime.toLocaleDateString() }} wirklich löschen?</span>
          <v-divider v-if="activeItem.category == 'dayEntry'"/>
          <table v-if="activeItem.category == 'dayEntry'" >
            <tr v-for="sleep in activeItem.sleep" :key="sleep.index">
              <td>
                <v-checkbox v-model="deleteSleep" :value="sleep.meta.id" color="#664147"/>
              </td>
              <td>
                Schlaf:
              </td>
              <td>
                {{ sleep.startTime.toLocaleTimeString().slice(0,5) }} - {{ sleep.endTime.toLocaleTimeString().slice(0,5) }} ({{calcDuration(sleep.endTime, sleep.startTime)}})
                ({{ sleep.quantity}}/10)
              </td>
            </tr>
            <tr v-for="eat in activeItem.eat" :key="eat.index">
              <td><v-checkbox v-model="deleteEat" :value="eat.meta.id" color="#664147"/></td>
              <td>Essen:</td>
              <td>{{eat.de}}</td>
            </tr>
            <tr v-if="activeItem.eat.length == 0">
              <td>Essverhalten:</td>
              <td>nicht bekannt</td>
            </tr>
          </table>

        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn  @click="deletePrompt = false" flat>abbrechen</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat
            @click="markAsError(activeItem)">
            löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn v-if="flashyFeedback" absolute dark fab top right color="#664147" z-index="1000" v-on="on" @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
        <v-btn
        v-else
        absolute
        small dark fab
        top right
        z-index="1000"
        color="grey"
        v-on="on"
        @click="openFeedback = !openFeedback">
          <v-icon>comment</v-icon>
        </v-btn>
      </template>
      <span>Gib uns dein Feedback</span>
  </v-tooltip>

    <v-tabs color="#40c9a2" slider-color="#a3f7b5">
    <v-tab>Kopfschmerzen</v-tab>

    <!-- HEADACHE TABLE -->
    <v-tab-item lazy>
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

  </v-tab-item>

  <!-- SYMPTOM TABLE -->

    <v-tab>{{symptomTab}}</v-tab>
    <v-tab-item lazy>
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

    </v-tab-item>

  <!-- DAY TABLE-->
  <v-tab>{{dayTab}}</v-tab>
  <v-tab-item lazy>
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
            <td v-if="props.item.sleep.length > 0">{{ calcDuration(props.item.sleep[0].startTime, props.item.sleep[0].endTime)}}</td>
            <td v-else>unbekannt</td>
            <td v-if="props.item.eat.length > 0">{{ props.item.eat[0].de }}</td>
            <td v-else>nicht bekannt</td>
        </tr>
        </template>
        <template v-slot:no-data>
          Es gibt noch keine Daten zum Anzeigen.
        </template>
      </v-data-table>
    </v-container>
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
      deletePrompt: false,
      deleteSleep: [],
      deleteEat: [],
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
          value: 'sortableDate'
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
          questiontextrule: "Nein",
          type: "select"
        },
        { question: "Würdest du gerne weitere Informationen einsehen?",
          answers: ["Ja", "Nein"],
          modelname: "otherdata",
          model: "",
          questiontext: "Welche?",
          questiontextrule: "Ja",
          type: "select"
        },
        { question: "Helfen dir die Auflistungen deiner Daten dabei deine Krankheit besser zu verstehen?",
          answers: ["Ja", "Nein"],
          modelname: "otherdata",
          model: "",
          questiontext: false,
          questiontextrule: "",
          type: "select"
        },
        { question: "Hattest du bei anakoda mit technischen Problemen zu kämpfen?",
          answers: ["Ja", "Nein"],
          modelname: "problems",
          model: "",
          questiontext: "Bitte beschreibe dein Problem und wo es aufgetreten ist.",
          questiontextrule: "Ja",
          type: "select"
        },

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
    },

    /*
      "Deletes" an item by marking the resource as "entered in error" on midata
      hessg1 / 2019-06-01
    */
    markAsError(item){
      if(item.category == 'dayEntry'){
        let promises = [];
        for(let i in this.deleteSleep){
          promises.push(this.$midataService.markAsEnteredInError(this.deleteSleep[i]));
        }
        for(let i in this.deleteEat){
          promises.push(this.$midataService.markAsEnteredInError(this.deleteEat[i]));
        }
                let that = this;
        if(promises.length > 0){
          Promise.all(promises).then(() => {
            that.deletePrompt = false;
            that.dialog = false;
            that.deleteEat = [];
            that.deleteSleep = [];
            that.activeItem = null;
            that.days = [];
            that.$midataService.removeFromCache('Observation');
            that.loadData();
          }).catch(err => {
            that.deletePrompt = false;
            that.deleteEat = [];
            that.deleteSleep = [];
            alert("Beim Löschen ist ein Fehler aufgetreten. (" + err + ")");
          });
        }
      }
      else {
        this.$midataService.markAsEnteredInError(item.meta.id).then(() => {
          this.deletePrompt = false;
          this.dialog = false;
          this.activeItem = null;
          // clear Observation query from cache, so we can reload
          this.$midataService.removeFromCache('Observation');
          this.loadData();
        }).catch(err => {
          this.deletePrompt = false;
          alert(item.de + " konnte nicht gelöscht werden. (" + err + ")");
        });
      }
    },

    /*
      Fetches the data from MIDATA.
      hessg1 / 2019-06-01
    */
    loadData(){
      if(this.$midataService.isReady()){
        this.$midataService.getData('Observation').then(res => { //'Observation?date=ge2019-03-01&date=le2019-04-30'
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
                sortableDate: sleep[i].endTime.getTime(),
                category: "dayEntry",
                sleep: [sleep[i]],
                eat: [],
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
              this.days.push({
                date: eat[i].date.toLocaleDateString(),
                sortableDate: eat[i].date.getTime(),
                category: "dayEntry",
                eat: [eat[i]],
                sleep: [],
                meta: eat[i].meta
              })
            }
            else{
              this.days[dayEntry].eat.push(eat[i]);
            }
          }
        });
      }
    }

  },
  mounted(){
    this.loadData();
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

  },
  computed: {
    flashyFeedback(){
      // the feedback fab don't have to be flashy if feedback was filled out or page is loaded the first time
      let feedback = false;
      if(localStorage.getItem('feedback') && localStorage.getItem('feedback') != 'undefined'){
        feedback = JSON.parse(localStorage.getItem('feedback'))['DataView'];
      }
      return feedback != 'filled' && feedback > 1;
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
