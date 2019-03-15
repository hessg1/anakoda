<template>
  <v-container>
    <v-card>

      <v-card-title>
        <div>
          <div>
            <h2>Tägliche Erfassung</h2>
          </div>
          <p>Hier kannst du deine täglichen Daten erfassen.</p>
        </div>
      </v-card-title>

      <v-subheader><h3>Tag</h3></v-subheader>

      <v-card-text>
        <v-menu
        ref="menudate"
        v-model="menudate"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
        >
        <template v-slot:activator="{ on }">
          <v-text-field
          v-model="date"
          label="Erfassende Tag"
          prepend-icon="event"
          readonly
          v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menudate = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.menudate.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-card-text>

    <v-subheader><h3>Essverhalten</h3></v-subheader>

    <v-card-text>
      <v-radio-group v-model="eating" row align-center>
        <v-radio label="Regelmässig" value="regulary" color="success"></v-radio>
        <v-radio label="Unregelmässig" value="irregulary" color="warning"></v-radio>
        <v-radio label="Unbekannt" value="unknown" color="primary"></v-radio>
      </v-radio-group>
    </v-card-text>

    <v-subheader><h3>Schlafverhalten</h3></v-subheader>

    <v-card-text>
      <v-layout row>
        <v-flex xs12 sm6 md5>
          <v-menu
          ref="menudatestart"
          v-model="menudatestart"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="datestart"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
          >
          <template v-slot:activator="{ on }">
            <v-text-field
            v-model="datestart"
            label="Einschlaf-Tag"
            prepend-icon="event"
            readonly
            v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="datestart" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menudatestart = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menudatestart.save(datestart)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm5>
        <v-menu
        ref="menutimestart"
        v-model="menutimestart"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="timestart"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
        >
        <template v-slot:activator="{ on }">
          <v-text-field
          v-model="timestart"
          label="Einschlaf-Zeit"
          prepend-icon="access_time"
          readonly
          v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
        v-if="menutimestart"
        v-model="timestart"
        full-width
        @click:minute="$refs.menutimestart.save(timestart)"
        ></v-time-picker>
      </v-menu>
    </v-flex>
  </v-layout>
  <v-layout row>
    <v-flex xs12 sm6 md5>
      <v-menu
      ref="menudateend"
      v-model="menudateend"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="dateend"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
      >
      <template v-slot:activator="{ on }">
        <v-text-field
        v-model="dateend"
        label="Aufwach-Tag"
        prepend-icon="event"
        readonly
        v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="dateend" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menudateend = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.menudateend.save(dateend)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-spacer></v-spacer>
  <v-flex xs11 sm5>
    <v-menu
    ref="menutimeend"
    v-model="menutimeend"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="timeend"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
    >
    <template v-slot:activator="{ on }">
      <v-text-field
      v-model="timeend"
      label="Aufwach-Zeit"
      prepend-icon="access_time"
      readonly
      v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
    v-if="menutimeend"
    v-model="timeend"
    full-width
    @click:minute="$refs.menutimeend.save(timeend)"
    ></v-time-picker>
  </v-menu>
</v-flex>
</v-layout>
</v-card-text>

<v-subheader>Schlafqualität</v-subheader>
<v-card-text>
  <v-slider
  v-model="quality"
  thumb-label="always"
  min="0"
  max="10"
  append-icon="mood"
  prepend-icon="mood_bad"
  @click:append="qualityPlus"
  @click:prepend="qualityMinus"
  ></v-slider>
</v-card-text>
<v-card-actions>
  <v-btn flat color="#0a967a">Absenden</v-btn>
</v-card-actions>

</v-card>
</v-container>

</template>

<script>
export default {
  data () {
    return {
      date: new Date().toISOString().substr(0, 10),
      menudate: false,
      eating: 'regulary',
      datestart: new Date().toISOString().substr(0, 10),
      menudatestart: false,
      dateend: new Date().toISOString().substr(0, 10),
      menudateend: false,
      timestart: null,
      menutimestart: false,
      timeend: null,
      menutimeend: false,
      quality: 5
    }
  },
  methods: {
    qualityMinus () {
      this.quality = (this.quality - 1) || 0
    },
    qualityPlus () {
      this.quality = (this.quality + 1) || 10
    }
  }
}
</script>
