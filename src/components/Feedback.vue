<template>
  <v-card>
  <v-card-title
  class="headline"
  primary-title>
  Deine Meinung ist uns wichtig!
</v-card-title>
<v-card-text>
  Damit wir unsere Webanwendung stetig verbessern können, ist uns deine Meinung sehr wichtig!
  Bitte fülle dafür die folgenden Felder aus. Das Feedback wird selbstverständlich anonym behandelt.
</v-card-text>

<v-divider></v-divider>

<v-form id="feedback" action="https://getsimpleform.com/messages?form_api_token=71e9e52b035d63023a80fac07ebe2d0b" method="post">

  <v-card-text v-if="agegroup == ''">
    In welcher Altersgruppe befindest du dich?
    <v-select
    :items="ageoption"
    v-model="agegroup"
    label="">
  </v-select>
  <input type="hidden" name='agegroup' :value="agegroup">
</v-card-text>

<v-card-text v-if="skill == ''">
  Wie häufig nutzt du Webanwendungen, wie Onlinebanking, ÖV-Fahrplan usw.?
  <v-select
  :items="skilloption"
  v-model="skill"
  label="">
</v-select>
<input type="hidden" name='skill' :value="skill">
</v-card-text>

<v-divider v-if="this.skill == '' && this.agegroup == ''"></v-divider>

<v-card-text v-for="question in questions" :key="question.index">
  {{question.question}}
  <v-select
  :items="question.answers"
  v-model="question.model"
  label="">
</v-select>
<input type="hidden" :name='question.modelname' :value="question.model">
<v-textarea
  :name="question.modelname+'-text'"
  solo
  :label="question.questiontext"
  v-if="question.questiontext && question.questiontextrule  === question.model">
</v-textarea>
</v-card-text>

<v-card-text>
      Wie viele Sterne gibst du unserer Webanwendung?
      <v-rating
      v-model="raiting"
      hover
      background-color="primary">
      </v-rating>
      <input type="hidden" name='raiting' :value="raiting">

</v-card-text>

<v-divider></v-divider>

<v-card-actions class="justify-space-between">
  <v-btn flat>
    Nein Danke
  </v-btn>
  <v-btn
  color="primary"
  flat
  @click="send()"
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
      raiting: 0,
      localdialog: null,
    }
  },

  props: {
    questions: Array,
  },

  methods:{
    send(){
      if(this.agegroup){
        localStorage.setItem("agegroup", this.agegroup);
      }
      if(this.skill){
        localStorage.setItem("skill", this.skill);
      }
      document.getElementById("feedback").submit();
    }

  },

  mounted(){
    if(localStorage.getItem("agegroup")){
      this.agegroup = localStorage.getItem("agegroup");
    }
    if(localStorage.getItem("skill")){
      this.skill = localStorage.getItem("skill");
    }
  }
}

</script>
