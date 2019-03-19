<template>
  <v-container>
    <v-card>
      <v-card-title>
        <div>
          <div>
            <h2>Verlaufs-Daten</h2>
          </div>
          <p>Hier kannst du deine Verlaufs-Daten erfassen.</p>
        </div>
      </v-card-title>

      <v-subheader><h3>Tag</h3></v-subheader>

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
              label="Start-Tag"
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
            label="Start-Zeit"
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
          label="End-Tag"
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
        label="End-Zeit"
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
</v-card>

<v-spacer></v-spacer>

<v-card mt=12>
  <v-subheader><h3>Anliegen</h3></v-subheader>

  <v-card-text>
    hallo
  </v-card-text>
</v-card>

</v-container>
</template>

<script>
export default {
  data () {
    return {
      datestart: new Date().toISOString().substr(0, 10),
      menudatestart: false,
      dateend: new Date().toISOString().substr(0, 10),
      menudateend: false,
      timestart: null,
      menutimestart: false,
      timeend: null,
      menutimeend: false
    }
  }
}
</script>
