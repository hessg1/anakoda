<template>
  <v-dialog v-model="show" max-width="700px">
    <v-card>
      <v-card-title
      class="headline"
      primary-title>
      Deine Meinung ist uns wichtig!
    </v-card-title>
    <v-card-text>
      Damit wir anakoda stetig verbessern können, ist uns deine Meinung sehr wichtig!<br />
      Bitte fülle dafür die folgenden Felder aus. Deine Antworten werden anonym übermittelt.
    </v-card-text>

    <v-divider></v-divider>

    <v-form ref="form" id="feedback" action="https://getsimpleform.com/messages?form_api_token=71e9e52b035d63023a80fac07ebe2d0b" method="post">

      <input type="hidden" name='page' :value="page">

      <v-card-text v-for="question in questions" :key="question.index">
        {{question.question}}
        <v-select
        :items="question.answers"
        v-model="question.model"
        :rules="[v => !!v || 'Bitte wähle etwas aus.']"
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
    Alles in allem: Wie viele Sterne gibst du anakoda?
    <v-rating
    v-model="rating"
    hover
    background-color="primary">
  </v-rating>
  <input type="hidden" name='rating' :value="rating">
  <input type="hidden" name='userID' :value="userID">
</v-card-text>

<v-divider></v-divider>

<v-card-text>
  In welcher Altersgruppe befindest du dich?
  <v-select
  :items="ageoption"
  :rules="[v => !!v || 'Bitte wähle etwas aus.']"
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
  :rules="[v => !!v || 'Bitte wähle etwas aus.']"
  label="">
</v-select>
<input type="hidden" name='skill' :value="skill">
</v-card-text>

<v-divider></v-divider>


<v-card-actions class="justify-space-between">
  <v-btn flat @click.stop="show=false">
    Abbrechen
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
</v-dialog>
</template>

<script>
const crypto = require('crypto');

export default {
  data() {
    return {
      ageoption: ["unter 25", "unter 40", "unter 65", "über 65"],
      agegroup: "",
      skilloption: ["nie", "wenige Male im Jahr", "monatlich", "wöchentlich", "einmal am Tag", "mehrmals am Tag"],
      skill: "",
      userID: "",
      rating: 0,
      show: false,
      feedbacks: {},
    }
  },

  props: {
    questions: Array,
    page: String,
    visible: Boolean,
  },

  methods:{
    /*
    Controls whether all fields are filled,
    stores the profile data in the local memory
    and submits the form.
    parameters: none
    returns:    none
    author:     schwf3
    version:    2019-04-23
    */
    send(){
      if (this.$refs.form.validate()) {
        if(this.agegroup){
          localStorage.setItem("agegroup", this.agegroup);
        }
        if(this.skill){
          localStorage.setItem("skill", this.skill);
        }
        document.getElementById("feedback").submit();
      }
    }

  },

  mounted(){
    // set profile data in locale storage
    if(localStorage.getItem("agegroup")){
      this.agegroup = localStorage.getItem("agegroup");
    }
    if(localStorage.getItem("skill")){
      this.skill = localStorage.getItem("skill");
    }
    //create an anonymous, but distinct user id
    let user = this.$midataService.patient;
    this.userID = crypto.createHash('md5').update(user).digest('hex');

    if(localStorage.getItem("feedback")){
      this.feedbacks = JSON.parse(localStorage.getItem("feedback"));
    }

    if(this.feedbacks[this.page]){
      if(this.feedbacks[this.page] <= 5){
        this.feedbacks[this.page] = this.feedbacks[this.page] + 1;
      }
      if(this.feedbacks[this.page] == 5){
        this.show = true;
      }
    }
    else{
      this.feedbacks[this.page] = 1;
    }

    localStorage.setItem("feedback",  JSON.stringify(this.feedbacks))

  },

  watch: {
    visible(){
      this.show = this.visible;
    },
    show(){
      if(!this.show){
        this.$emit('close');
      }
    }
  }
}

</script>
