<template>
  <v-container>
    <Login />
    <v-dialog v-model="dialog" scrollable>
      <v-card  v-if="activeItem != null">
        <v-card-title>
          <span class="headline">{{ activeItem.de }} am {{ activeItem.startTime.toLocaleDateString() }}</span>
        </v-card-title>

        <v-card-text>
          <table class="detail">
            <tr v-if="activeItem.category == 'Headache'">
              <td>Seite:</td>
              <td>{{ activeItem.bodySiteDE }}</td>
            </tr>
            <tr v-if="activeItem.category == 'VariousComplaint' || activeItem.category == 'Headache'">
              <td>Intensität:</td>
              <td>{{ activeItem.quantity}}/10</td>
            </tr>
            <tr v-if="activeItem.category == 'SleepPattern'">
              <td>Schlafqualität:</td>
              <td>{{ activeItem.quantity}}/10</td>
            </tr>
            <tr v-if="activeItem.category == 'SleepPattern'">
              <td>Schlafdauer:</td>
              <td>{{ calcDuration(activeItem.startTime, activeItem.endTime) }}</td>
            </tr>
            <tr v-if="activeItem.category == 'Headache' || activeItem.category == 'VariousComplaint'">
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
    <v-data-table
    :headers="headers"
    :items="headaches"
    class="elevation-1"
    v-resize="onResize"
    >
    <template v-slot:items="props">
      <tr @click="clicked(props.item)">
        <td>{{ props.item.de }}</td>
        <td class="text-xs-center">{{ props.item.startTime.toLocaleDateString() }}</td>
        <td v-if="!isMobile" class="text-xs-center">{{ props.item.quantity }}</td>
        <td v-if="!isMobile" class="text-xs-center">{{ props.item.bodySiteDE }}</td>
        <td v-if="!isMobile" class="text-xs-center">{{ calcDuration(props.item.endTime, props.item.startTime) }}</td>
      </tr>
    </template>
    <template v-slot:no-data>
      Es gibt noch keine Daten zum Anzeigen.
    </template>
  </v-data-table>
  </v-container>
</template>

<script>
import Login from '@/components/Login';
import SnomedService from '@/services/SnomedService';
const sct = new SnomedService();
let observations = [];

export default {
  data() {
    return {
      observations: [],
      headaches: [],
      pagination: {
          sortBy: 'name'
      },
      selected: [],
      search: '',
      isMobile: false,
      activeItem: null,
      relatedItems: null,
      dialog: false,
      headers: [
        {
          text: 'Kopfschmerzen',
          align: 'left',
          sortable: false,
          value: 'de'
        },
        { text: 'am:', value: 'startTime', align: 'center'},
        { text: 'Intensität', value: 'quantity', align: 'center'},
        { text: 'Seite', sortable: false, align: 'center'},
        { text: 'Dauer (h)', sortable: false, align: 'center'}
      ],
    }
  },
  components: {
    Login,
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
        // get the SCT codes for headaches from SnomedService
        let headacheCodes = sct.getFilteredProp(x => (x.category == 'Headache'), 'code');
        // and filter all the headache objects in observations
        //this.headaches = this.filterArray(function(obs){return headacheCodes.includes(obs.code)}, observations);
        this.headaches = this.filterArray(x => (headacheCodes.includes(x.code)), observations);
      });
    }

  },
  watch: {
    isMobile(){
      if(this.isMobile){
        this.headers = [
          {
            text: 'Kopfschmerzen',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'am:', value: 'startTime'}
        ]
      }
      else{
        this.headers = [
          {
            text: 'Kopfschmerzen',
            align: 'left',
            sortable: false,
            value: 'de'
          },
          { text: 'am:', value: 'startTime'},
          { text: 'Intensität', value: 'quantity' },
          { text: 'Seite', sortable: false},
          { text: 'Dauer (h)', sortable: false}
        ]
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
/* styling of the detail view table */
table.detail {
  width: 100%;
}
.detail tr:hover{
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
