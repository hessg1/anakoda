<template>
  <v-container>
    <Login />
    <v-dialog v-model="dialog">
      <v-card  v-if="activeItem != null">
        <v-card-title>
          <span class="headline">{{ activeItem.de }} am {{ activeItem.startTime.toLocaleDateString() }}</span>
        </v-card-title>

        <v-card-text>
          <table width="90%">
            <tr v-if="activeItem.category == 'Headache'">
              <td>Seite:</td><td> {{ activeItem.bodySiteDE}}</td>
            </tr>
            <tr v-if="activeItem.category == 'VariousComplaint' || activeItem.category == 'Headache'">
              <td>Intensität:</td><td> {{ activeItem.quantity }}</td>
            </tr>
            <tr v-if="activeItem.category == 'SleepPattern' ">
              <td>Qualität:</td><td> {{ activeItem.quantity }}</td>
            </tr>
            <tr v-if="activeItem.category == 'SleepPattern' ">
              <td>Schlafdauer: </td><td> {{ calcDuration(activeItem.startTime, activeItem.endTime) }}</td>
            </tr>
            <tr v-if="activeItem.category == 'Headache' || activeItem.category == 'VariousComplaint' ">
              <td>Dauer: </td><td> {{ formatDuration(activeItem) }}</td>
            </tr>
          </table>

          <br /><span>Erfasst am {{ activeItem.meta.timestamp.toLocaleDateString() }} mit {{ activeItem.meta.source}}.</span>
        </v-card-text>

        <v-divider></v-divider>

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
      dialog: false,
      headers: [
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

    formatDuration(item){
      //if(item.startTime.getDate() != item.endTime.getDate() && item.startTime.getMonth() != item.endTime.getMonth()){
      if(item.startTime.toLocaleDateString() != item.endTime.toLocaleDateString()){
        return "vom " + item.startTime.toLocaleDateString() + " um " + item.startTime.toLocaleTimeString()
        + " bis am " + item.endTime.toLocaleDateString() + " um " + item.endTime.toLocaleTimeString()
        + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
      }
      else{
        return "von " + item.startTime.toLocaleTimeString() + " bis "
        + item.endTime.toLocaleTimeString() + " (" + this.calcDuration(item.startTime, item.endTime) + ")";
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
    onResize(){
      this.isMobile = window.innerWidth < 600;
    }

  },
  mounted(){
    if(this.$midataService.isReady()){
      this.$midataService.getData('Observation?code=162306000').then(res => {
        const observations = this.$midataService.prepareData(res);
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
    }

  }
}
</script>

<style scoped>

</style>
