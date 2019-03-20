// SCT codes to be accepted by EatingHabit resource
const validEatingHabits = [225526009, 289141003, 702970004];
// range of quality accepted by SleepPattern resource (lowest to highest)
const sleepQualityRange = [0,10];

/*
This is the default type of a FhirResource, that should not be initialized. It
is an Observation with the category-coding of "Survey", which suits most Resources,
but may be overwritten e.g. for MedicationStatents.
parameters  none
author      hessg1
version     2019-03-19
*/
class FhirResource {
  // creates a default FHIR resource with category coding of "Survey",
  // if necessary this can be overwritten
  constructor(){
    this.resourceType = "Observation";
    this.status = "preliminary";
    this.code = "";
    this.category = [{
        "coding": [{
            "system": "http://hl7.org/fhir/observation-category",
            "display": "Survey",
            "code": "survey"
    }]}];
  }
}

/*
EatingHabit is a ressource that describes the eating habit of a given day.
parameters  - date: the date of the given day (2019-03-19T15:30:00+01:00)
            - code: the SNOMED CT code of the value
              225526009 = "Eats irregularly"
              289141003 = "Eats regularly"
              702970004 (or anything else) = "Eating habit unknown"
author      hessg1
version     2019-03-19
*/
export class EatingHabit extends FhirResource {
  constructor(date, code){
    // check if code is valid
    code = Number(code);
    if(!validEatingHabits.includes(code)){
      throw("Illegal argument, invalid SCT code.");
    }

    let display = "Eating habit unkown";
    switch(code){
      case 225526009:
        display = "Eats irregularly";
        break;
      case 289141003:
        display = "Eats regularly";
        break;
    }
    super();
    this.code = {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "364645004",
        "display": "Eating feeding / drinking observable"
      }]};
    this.effectiveDateTime = date;
    this.valueCodeableConcept = {
      "coding": [{
          "system": "http://snomed.info/sct",
          "code": code,
          "display": display
        }]};
  }
}

/*
SleepPattern is a ressource that describes the eating habit of a given day.
parameters  - startTime: date and time when subject went to bed (2019-03-19T15:30:00+01:00)
            - endTime: date and time when subject left bed (2019-03-19T15:30:00+01:00)
            - quality: the subjective quality of sleep, on a scale from 0 to 10
author      hessg1
version     2019-03-19
*/
export class SleepPattern extends FhirResource {
  constructor(startTime, endTime, quality){
    super();
    // check if quality is valid
    if(quality < sleepQualityRange[0] || quality > sleepQualityRange[1]){
      throw("Invalid argument: quality must be at least " + sleepQualityRange[0] + " and at maximum " + sleepQualityRange[1]);
    }
    this.code = {
      "coding": [{
        "system": "http://loinc.org",
        "code": "65554-8",
        "display": "How many hours and minutes does it take for you to become fully awake from regular sleep, after first opening your eyes in the morning."
      }]};
    this.effectivePeriod = {"start": startTime, "end": endTime},
    this.component = [{
        "code": {
          "coding": [{
              "system": "http://snomed.info/sct",
              "code": "248254009",
              "display": "Sleep pattern finding"
            }]
        },
        "valueQuantity": {
          "value": quality
    }}];
  }
}
