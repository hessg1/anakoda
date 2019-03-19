/*
This is the default type of a FhirResource, that should not be initialized. It
is an Observation with the category-coding of "Survey", which suits most Resources,
but may be overwritten e.g. for MedicationStatents.
parameters  none
author      hessg1
version     2019-03-19
*/
export class FhirResource {
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
            - code: the SNOMED CT code of the value (225526009, 289141003 or 702970004)
            - display: the correscponding display value to the SCT code ("Eats irregularly", "Eats regularly" or "Eating habit unknown")
author      hessg1
version     2019-03-19
*/
export class EatingHabit extends FhirResource {
  constructor(date, code){
    code = Number(code);
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
