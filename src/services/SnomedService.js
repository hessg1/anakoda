/*
SnomedService is a helper class for handling the SNOMED CT (SCT) codes used in this
project. It offers translation from codes to english and german display values,
as well as searching codes in different categories defined by the project.
author      hessg1
version     2019-03-20
*/

export default class SnomedService {
  constructor(){
    /*
    This large array of JS objects is the "library" of the function. When adding
    a new SCT code to the project, it should also be added here.
    */
    this.codes = [
      {
        "code": 73905001,
        "en": "Sees flickering lights",
        "de": "Flimmersehen",
        "superCategory": 281004000,
        "category": "VariousComplaint"
      },
      {
        "code": 74964007,
        "en": "Other symptom",
        "de": "Andere Symptome",
        "superCategory": 118222006,
        "category": "Condition"
      },
      {
        "code": 162057007,
        "en": "Nausea present",
        "de": "Übelkeit",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 248254009,
        "en": "Sleep pattern finding",
        "de": "Schlafmuster",
        "superCategory": "65554-8",
        "category": "SleepPattern"
      },
      {
        "code": "65554-8",
        "en": "Sleep / wakeup duration",
        "de": "Schlafdauer",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 409668002,
        "en": "Photophobia",
        "de": "Lichtempfindlichkeit",
        "superCategory": 246613004,
        "category": "VariousComplaint"
      },
      {
        "code": 313387002,
        "en": "Phonophobia",
        "de": "Lärmempfindlichkeit",
        "superCategory": 285854004,
        "category": "VariousComplaint"
      },
      {
        "code": 267092007,
        "en": "Has eye discharge",
        "de": "Tränende Augen",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 267093002,
        "en": "Has a red eye",
        "de": "Gerötete Augen",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 276319003,
        "en": "Menstruation finding",
        "de": "Menstruation",
        "superCategory": 66523006,
        "category": "Condition"
      },
      {
        "code": 216299002,
        "en": "Attack",
        "de": "Migräneanfall",
        "superCategory": 118222006,
        "category": "Condition"
      },
      {
        "code": 73595000,
        "en": "Stress",
        "de": "Stress",
        "superCategory": 363870007,
        "category": "Condition"
      },
      {
        "code": 102894008,
        "en": "Feeling calm",
        "de": "Entspannt",
        "superCategory": 285854004,
        "category": "Condition"
      },
      {
        "code": 279079003,
        "en": "Dysesthesia",
        "de": "Gefühlsstörung",
        "superCategory": 247325003,
        "category": "VariousComplaint"
      },
      {
        "code": 29164008,
        "en": "Speech Impairment",
        "de": "Sprachstörung",
        "superCategory": 363918005,
        "category": "VariousComplaint"
      },
      {
        "code": 267101005,
        "en": "Nasal discharge present",
        "de": "Nasenlaufen",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 267100006,
        "en": "Nasal obstruction present",
        "de": "Verstopfte Nase",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 119711004,
        "en": "Nose closure",
        "de": "Verstopfte Nase",
        "superCategory": 373573001,
        "category": "VariousComplaint"
      },
      {
        "code": 45846002,
        "en": "Hyperosmia",
        "de": "Geruchsempfindlichkeit",
        "superCategory": 397686008,
        "category": "VariousComplaint"
      },
      {
        "code": 422400008,
        "en": "Vomiting",
        "de": "Erbrechen",
        "superCategory": 405166007,
        "category": "VariousComplaint"
      },
      {
        "code": 16932000,
        "en": "Nausea and vomiting",
        "de": "Übelkeit und Erbrechen",
        "superCategory": 405166007,
        "category": "VariousComplaint"
      },
      {
        "code": 248626009,
        "en": "Yawning",
        "de": "Vermehrtes Gähnen",
        "superCategory": 37993006,
        "category": "VariousComplaint"
      },
      {
        "code": 309253009,
        "en": "Difficulty reading",
        "de": "Leseschwierigkeiten",
        "superCategory": 363870007,
        "category": "Condition"
      },
      {
        "code": 106126000,
        "en": "Emotional state finding",
        "de": "Emotionale Empfindlichkeit",
        "superCategory": 285854004,
        "category": "Condition"
      },
      {
        "code": 162308004,
        "en": "Throbbing Headache",
        "de": "Pulsierende Kopfschmerzen",
        "superCategory": "",
        "category": "Headache"
      },
      {
        "code": 162307009,
        "en": "Aching Headache",
        "de": "Stechende Kopfschmerzen",
        "superCategory": "",
        "category": "Headache"
      },
      {
        "code": 162309007,
        "en": "Shooting Headache",
        "de": "Einschiessende Kopfschmerzen",
        "superCategory": "",
        "category": "Headache"
      },
      {
        "code": 702970004,
        "en": "Eating habit unknown",
        "de": "Unbekanntes Essverhalten",
        "superCategory": "",
        "category": "EatingHabit"
      },
      {
        "code": 289141003,
        "en": "Eats regularly",
        "de": "Regelmässig gegessen",
        "superCategory": "",
        "category": "EatingHabit"
      },
      {
        "code": 225526009,
        "en": "Eats irregularly",
        "de": "Unregelmässig gegessen",
        "superCategory": "",
        "category": "EatingHabit"
      },
      {
        "code": 29624005,
        "en": "Right side of head",
        "de": "Rechte Kopfhälfte",
        "superCategory": "",
        "category": "BodySite"
      },
      {
        "code": 64237003,
        "en": "Left side of head",
        "de": "Linke Kopfhälfte",
        "superCategory": "",
        "category": "BodySite"
      },
      {
        "code": 162301005,
        "en": "Bilateral headache",
        "de": "Beidseitige Kopfschmerzen",
        "superCategory": "",
        "category": "BodySite"
      },
      {
        "code": 405166007,
        "en": "Nausea and vomiting status",
        "de": "Übelkeits- und Erbrechensstatus",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 285854004,
        "en": "Emotion",
        "de": "Emotion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 281004000,
        "en": "Visual function",
        "de": "Visuelle Funktion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 363918005,
        "en": "Speech observable",
        "de": "Sprachbeobachtung",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 397686008,
        "en": "Sense of smell, function",
        "de": "Geruchssinnfunktion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 37993006,
        "en": "Yawning, function",
        "de": "Gähnfunktion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 246613004,
        "en": "General reaction to light",
        "de": "Generelle Reaktion auf Licht",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 247325003,
        "en": "Altered sensation of skin",
        "de": "Verändertes Hautempfinden",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 118222006,
        "en": "General finding of observation of patient",
        "de": "Generelle Beobachtung des Patienten",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 373573001,
        "en": "Clinical finding present",
        "de": "Klinischer Befund vorhanden",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 363870007,
        "en": "Mental state, behavior / psychosocial function observable",
        "de": "Beobachtung psychischer Zustand, psychosoziale Funktion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 66523006,
        "en": "Female reproductive function",
        "de": "Funktion weiblicher Reproduktion",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 128187005,
        "en": "Vascular headache",
        "de": "Vaskuläre Kopfschmerzen",
        "superCategory": "",
        "category": "SuperCategory"
      },
      {
        "code": 37796009,
        "en": "Migraine",
        "de": "Migräne",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "G43.0",
        "en": "Migraine without aura",
        "de": "Migräne ohne Aura",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "G43.1",
        "en": "Migraine with aura",
        "de": "Migräne mit Aura",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "G43.10",
        "en": "Typical aura with headache",
        "de": "Typische Aura mit Kopfschmerzen",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "G43.104",
        "en": "Typical aura without headache",
        "de": "Typische Aura ohne Kopfschmerzen",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "G43.105",
        "en": "Hemiplegic migraine",
        "de": "Hemiplegische Migräne",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      // we have to deal with fake snomed codes for "other diagnosis" and "other
      // headache", because they are all encoded in heMigrania with 74964007 and
      // thus conflicting with "other complaint"
      {
        "code": "74964007d",
        "en": "Other diagnosis",
        "de": "Andere Diagnose",
        "superCategory": 128187005,
        "category": "Diagnosis"
      },
      {
        "code": "74964007h",
        "en": "Other Headache",
        "de": "Sonstige Kopfschmerzen",
        "superCategory": "",
        "category": "Headache"
      },
    ];
  }


  /*
  This method returns the english display name to a SCT code.
  parameters  - code: a SCT code used in the project
  returns     the corresponding display name in english,
  throws      "not found" if code is not in the project
  author      hessg1
  version     2019-03-26
  */
  getEnglish(code){
    for(var i in this.codes){
      if(this.codes[i].code == code){
        return this.codes[i].en;
      }
    }
    throw "code " + code + " not found";
  }

  /*
  This method returns the german display name to a SCT code.
  parameters  - code: a SCT code used in the project
  returns     the corresponding display name in german,
  throws      "not found" if code is not in the project
  author      hessg1
  version     2019-03-26
  */
  getGerman(code){
    for(var i in this.codes){
      if(this.codes[i].code == code){
        return this.codes[i].de;
      }
    }
    throw "code " + code + " not found";
  }

  /*
  This method returns the SCT code to a given display name (not case sensitive,
  but otherwise exact)
  parameters  - code: a display name used in the project
  returns     the corresponding SCT code
  throws      "not found" if term is not in the project
  author      hessg1
  version     2019-03-26
  */
  getCode(term){
    term = term.toLowerCase();
    for(var i in this.codes){
      if(this.codes[i].de.toLowerCase() == term || this.codes[i].en.toLowerCase() == term){
        return this.codes[i].code;
      }
    }
      throw "term <" + term + "> not found";
  }

  /*
  This method returns an array of JS objects containing the code, categories and
  display names, that match the filter defined in the function. The objects are
  structured as following:
  {
    code: "the SCT code",
    en:  "english display name",
    de: "german display name",
    superCategory: "SCT of the super category"
    category: "category in the project, e.g. Headache, VariousComplaint or SleepPattern"
  }
  parameters  - filter: a function that takes an object (as described above) as
                an argument and returns a boolean
                example: "x => x.category == SleepPattern"
  returns     an array of objects (as described above) that evaluate in the given
              filter function to TRUE
  author      hessg1
  version     2019-03-20
  */
  getFiltered(filter){
    let res = [];
    for(var i in this.codes){
      if(filter(this.codes[i])){
        res.push(this.codes[i]);
      }
    }
    return res;
  }

  /*
  This method returns an array of a given proposition from the objects that match
  the filter defined in the function.
  parameters  - filter: a function that takes an object as
                an argument and returns a boolean
              - prop: the name of a proposition to be returned
                (code, en, de, supercategory or category)
  returns     an array of values from the given proposition from objects
              that evaluate in the given filter function to TRUE
  author      hessg1
  version     2019-03-20
  */
  getFilteredProp(filter, prop){
    // catch invalid prop arguments
    if(!prop || !['code', 'en', 'de', 'superCategory', 'category'].includes(prop)){
      throw("Illegal argument: prop <" + prop + "> not available");
    }

    let res = [];
    for(var i in this.codes){
      if(filter(this.codes[i])){
        res.push(this.codes[i][prop]);
      }
    }
    return res;
  }
}
