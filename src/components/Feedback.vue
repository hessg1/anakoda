<template>
  <v-card
  class="elevation-16 mx-auto"
  max-width="600px">

  <v-card-title
  class="headline"
  primary-title>
  Deine Meinung ist uns Wichtig!
  </v-card-title>
  <v-card-text>
    Damit wir unsere Webanwendung stetig verbessern können, ist uns deine Meinung sehr wichtig!
    Bitte fülle dafür die folgenden Felder aus. Das Feedback wird selbstverständlich anonym behandelt.
  </v-card-text>

  <v-divider></v-divider>

  <v-form id="myForm" action="https://getsimpleform.com/messages?form_api_token=71e9e52b035d63023a80fac07ebe2d0b" method="post">

    <v-card-text>
      In welcher Altersgruppe befindest du dich?
      <v-select
        :items="ageoption"
        v-model="agegroup"
        label="">
      </v-select>
      <input type="hidden" name='agegroup' :value="agegroup">
    </v-card-text>

    <v-card-text>
      Wie häufig nutzt du Webanwendungen, wie Onlinebanking, ÖV-Fahrplan usw.?
      <v-select
        :items="skilloption"
        v-model="skill"
        label="">
      </v-select>
      <input type="hidden" name='skill' :value="skill">
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      Hast du schon einmal Einträge mit anakoda erfasst?
      <v-select
        :items="useoption"
        v-model="use"
        label="">
      </v-select>
      <input type="hidden" name='use' :value="use">
    </v-card-text>

    <v-card-text v-if="use === 'Ja'">
      Würdest du gerne zusätzlich weitere Daten oder Symptome erfassen können?
      <v-select
        :items="dataoption"
        label=""
        v-model="otherdata">
      </v-select>
      <input type="hidden" name='otherdata' :value="otherdata">
      <v-textarea
      name="otherdata"
      solo
      label="Welche?"
      v-if="this.otherdata === 'Ja' ">
      </v-textarea>
    </v-card-text>

    <v-card-text v-if="use === 'Ja'">
      Könntest du dir vorstellen mehrmals täglich Daten in anakoda zu erfassen, damit du deine Krankheit besser kennen lernen kannst?
      <v-select
        :items="suitableoption"
        v-model="dailysuitable"
        label="">
      </v-select>
      <input type="hidden" name='dailysuitable' :value="dailysuitable">
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      Wünschst du dir weitere Funktionen?
      <v-select
        :items="functionsoption"
        label=""
        v-model="otherfunctions">
      </v-select>
      <input type="hidden" name='otherfunctions' :value="otherfunctions">
      <v-textarea
      name="otherfunctions"
      solo
      label="Welche?"
      v-if="otherfunctions === 'Ja' ">
      </v-textarea>
    </v-card-text>

    <v-card-text>
      Wie viele Sterne gibst du unserer Webanwendung?
      <v-rating
      v-model="raiting"
      hover>
      </v-rating>
      <input type="hidden" name='raiting' :value="raiting">

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-space-between">
      <v-btn flat>Nein Danke</v-btn>
        <v-btn
          color="primary"
          flat
          type="submit"
        >
          Jetzt Bewerten
        </v-btn>
    </v-card-actions>

  </v-form>

  </v-card>
</template>

<script>

export default {
  data() {
    return {
    ageoption: ["unter 25", "unter 40", "unter 65", "über 65"],
    agegroup: "",
    skilloption: ["nie", "wenige Male im Jahr", "einmal im Monat", "einmal am Tag", "mehrmals am Tag"],
    skill: "",
    useoption: ["Ja", "Nein"],
    use: "",
    dataoption: ["Ja", "Nein"],
    otherdata: "",
    suitableoption:["Ja", "Nein"],
    dailysuitable: "",
    functionsoption:["Ja", "Nein"],
    otherfunctions: "",
    raiting: 0
  }
}
}

</script>
