<template>
  <v-card
  class="mt-3 mx-auto"
  max-width="500">

  <v-card-title>
    <v-icon
    class="mr-5"
    size="64"
    >
    face
  </v-icon>
  <v-layout
  column
  align-start
  >
  <div class="caption grey--text text-uppercase">
    Intensität
  </div>
  <div>
    <span
    class="display-2 font-weight-black"
    v-text="intensityavg || '—'"
    ></span>
    <strong v-if="intensityavg">∅</strong>
  </div>
</v-layout>

<v-spacer></v-spacer>

<v-layout
column
align-start
>
<div class="caption grey--text text-uppercase">
  Kopfschmereinträge
</div>
<div>
  <span
  class="display-2 font-weight-black"
  v-text="headachedays || '—'"
  ></span>
  <strong v-if="headachedays">Einträge</strong>
</div>
</v-layout>
</v-card-title>
<v-card-text>
  <v-sparkline
    :value="intensity"
    :smooth="10"
    :line-width="3"
    stroke-linecap="round"
    auto-draw
    show-labels>
  </v-sparkline>
  <v-btn
  @click="getData()"
  color="#0a967a"
  class="white--text">GO
</v-btn>
</v-card-text>
</v-card>
</template>

<script>
export default {
  data: () => ({
    observations: [],
    intensity: [],
    intensityavg: false,
    headachedays: false,
  }),

  created () {
    this.getData()
    console.log("Vue instance created!");
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

    getData() {
          if(this.$midataService.isReady()){
            this.$midataService.getData('Observation?code:in=162306000').then(res => {
            this.observations = this.$midataService.prepareData(res);

            // only display valid entries
            if(!JSON.parse(localStorage.getItem("showInvalid"))){
              this.observations = this.filterArray(x => (!x.meta.invalid), this.observations);
            }

            var i;
            for(i = 0; i < this.observations.length; i++){
              this.intensity[i] = this.observations[i].quantity;
              this.intensityavg += this.intensity[i];
            }
            this.intensityavg /= this.intensity.length;
            this.intensityavg = Math.round(this.intensityavg * 100) / 100;
            this.headachedays = this.observations.length;

          });
        }
      }
  },

//   mounted(){
//     if(this.$midataService.isReady()){
//       this.$midataService.getData('Observation?code:in=162306000').then(res => {
//       this.observations = this.$midataService.prepareData(res);
//
//       // only display valid entries
//       if(!JSON.parse(localStorage.getItem("showInvalid"))){
//         this.observations = this.filterArray(x => (!x.meta.invalid), this.observations);
//       }
//
//       var i;
//       for(i = 0; i < this.observations.length; i++){
//         this.intensity[i] = this.observations[i].quantity;
//         this.intensityavg += this.intensity[i];
//       }
//       this.intensityavg /= this.intensity.length;
//       this.intensityavg = Math.round(this.intensityavg * 100) / 100;
//       this.headachedays = this.observations.length;
//
//     });
//   }
// }
}
</script>
