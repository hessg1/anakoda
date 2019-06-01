<template>
<v-dialog v-model="show" max-width="700px">
  <v-card>
    <v-card-title class="headline" primary-title>
      Deine Meinung ist uns wichtig!
      <v-spacer />
      <v-icon large>comment</v-icon>
    </v-card-title>
    <v-card-text>
      <p>Herzlichen Dank für deine Zeit! <br />
      Das Beantworten der Fragen ist anonym und hilft uns anakoda zu verbessern.</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-form ref="form" id="feedback" action="https://anakoda.ch/backend/feedbackMailer.php" method="post">

      <input type="hidden" name='page' :value="page">
      <input type="hidden" name='userID' :value="userID">

      <v-divider></v-divider>

      <v-card-text v-for="question in questions" :key="question.index">
        {{question.question}}
        <v-select :items="question.answers"
                  v-model="question.model"
                  v-if="question.type == 'select'"
                  :rules="[v => !!v || 'Bitte wähle etwas aus.']"
                  label="">
        </v-select>
        <v-textarea :name="question.modelname+'-text'" solo
                    :label="question.questiontext"
                    v-if="question.questiontext && question.questiontextrule  === question.model">
        </v-textarea>
        <v-rating v-model="question.model" hover
                  v-if="question.type == 'rating'"
                  empty-icon="panorama_fish_eye"
                  full-icon="lens"
                  background-color="primary">
        </v-rating>
        <input type="hidden" :name='question.modelname' :value="question.model">
      </v-card-text>

      <v-divider />

      <v-card-text>
        <b>Alles in allem:</b><br/>Wie viele Sterne gibst du anakoda?
        <v-rating v-model="stars" hover background-color="primary">
        </v-rating>
        <input type="hidden" name='stars' :value="stars">
      </v-card-text>

      <v-divider />

      <v-card-text>
        <b>Und zum Abschluss noch zwei Fragen zu deiner Person:</b><br /><br /> In welcher Altersgruppe befindest du dich?
        <v-select :items="ageoption"
                  :rules="[v => !!v || 'Bitte wähle etwas aus.']"
                  v-model="agegroup"
                  label="">
        </v-select>
        <input type="hidden" name='agegroup' :value="agegroup">
      </v-card-text>

      <v-card-text>
        Wie häufig nutzt du Webanwendungen, wie Onlinebanking, ÖV-Fahrplan usw.?
        <v-select :items="skilloption"
                  v-model="skill"
                  :rules="[v => !!v || 'Bitte wähle etwas aus.']"
                  label="">
        </v-select>
        <input type="hidden" name='skill' :value="skill">
        <input type="hidden" name='feedbackcounter' :value="JSON.stringify(feedbacks)">
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-space-between">
        <v-btn flat @click.stop="show=false">
          Abbrechen
        </v-btn>
        <v-btn color="primary" flat @click="send()">
          Feedback abschicken
        </v-btn>
      </v-card-actions>

    </v-form>

  </v-card>
</v-dialog>
</template>

<script>

  const crypto = require('crypto')
  import $ from 'jquery'

  export default {
    data() {
      return {
        ageoption: ['unter 25', 'unter 40', 'unter 65', 'über 65'],
        agegroup: '',
        skilloption: ['mehrmals am Tag', 'einmal am Tag', 'wöchentlich', 'monatlich', 'wenige Male im Jahr', 'nie'],
        skill: '',
        userID: '',
        stars: 0,
        show: false,
        feedbacks: {},
        filled: false
      }
    },

    props: {
      questions: Array,
      page: String,
      visible: Boolean
    },

    methods: {
      /*
        Controls whether all fields are filled,
        stores the profile data in the local memory
        and submits the form.
        parameters: none
        returns:    none
        author:     schwf3 / hessg1
        version:    2019-04-28
        */
      send() {
        if (this.$refs.form.validate()) {
          // persist demographic values locally
          if (this.agegroup) {
            localStorage.setItem('agegroup', this.agegroup)
          }
          if (this.skill) {
            localStorage.setItem('skill', this.skill)
          }

          // actually send form
          let that = this
          $.ajax({
            type: 'POST',
            url: 'https://anakoda.ch/backend/feedbackMailer.php',
            data: $('form').serialize(),
            dataType: 'json'
          })
            .done(function(res, text, header) {
              console.log('feedback verschickt, status: ' + header.status)
              that.show = false

              that.feedbacks[that.page] = 'filled'
              localStorage.setItem('feedback', JSON.stringify(that.feedbacks))

              // reset form:
              that.$refs.form.reset()
            })
            .catch(function(err, text, header) {
              if (err.status == 0) {
                console.log('Feedbackformular: Fehler \n(beim Testen von localhost vermutlich Cross-Origin blockiert)')

                // for testing locally, we assume everything was alright

                that.show = false
                that.feedbacks[that.page] = 'filled'
                localStorage.setItem('feedback', JSON.stringify(that.feedbacks))

                // reset form:
                that.$refs.form.reset()
              } else {
                if(err.responseText == 'OK'){ // don't know why we still get an error, even it worked
                that.show = false
                that.feedbacks[that.page] = 'filled'
                localStorage.setItem('feedback', JSON.stringify(that.feedbacks))

                // reset form:
                that.$refs.form.reset()
                }
                else {
                  console.log('Feedbackformular: Fehler (Status: ' + header.status + ')')
                  console.log(err)
                  alert('Ups, da ist etwas schiefgegangen.')
                }
              }
            })
        }
      }
    },

    mounted() {
      // set profile data in locale storage
      if (localStorage.getItem('agegroup')) {
        this.agegroup = localStorage.getItem('agegroup')
      }
      if (localStorage.getItem('skill')) {
        this.skill = localStorage.getItem('skill')
      }
      //create an anonymous, but distinct user id
      if(this.$midataService && this.$patient){
        let user = this.$midataService.patient + this.$patient.firstName
        this.userID = crypto
          .createHash('md5')
          .update(user)
          .digest('hex')
      }
      else{
        // when a user answers the feedback on evaluation page without being logged in
        this.userID = "an unknown stranger"
      }

      // show feedback automaticly every fifth time if not filled in
      if (localStorage.getItem('feedback') && localStorage.getItem('feedback') != 'undefined') {
        this.feedbacks = JSON.parse(localStorage.getItem('feedback'))
      }
      if (this.feedbacks[this.page]) {
        if (this.feedbacks[this.page] != 'filled') {
          this.feedbacks[this.page] += 1
          if (this.feedbacks[this.page] % 5 == 0 && this.page != "anakoda") {
            this.show = true
          }
        }
      } else {
        this.feedbacks[this.page] = 1
      }
      localStorage.setItem('feedback', JSON.stringify(this.feedbacks))
    },

    watch: {
      visible() {
        this.show = this.visible
      },
      show() {
        if (!this.show) {
          this.$emit('close')
        }
      }
    }
  }

</script>
