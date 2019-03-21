import SnomedService from '@/services/SnomedService';
const sct = new SnomedService();

// SCT codes to be accepted by Headache resource
const validHeadaches = sct.getFilteredProp(x => x.category == "Headache", "code");
// SCT codes to be accepted by EatingHabit resource
const validEatingHabits = sct.getFilteredProp(x => x.category == "EatingHabit", "code");
// SCT codes to be accepted by resources using bodysite
const validBodySites = sct.getFilteredProp(x => x.category == "BodySite", "code");
// SCT codes to be accepted by VariousComplaint collective resource
const validVarComplaints = sct.getFilteredProp(x => x.category == "VariousComplaint", "code");
// SCT codes to be accepted by Condition collective resource
const validConditions = sct.getFilteredProp(x => x.category == "Condition", "code");

// range of quality accepted by SleepPattern resource (lowest to highest)
const sleepQualityRange = [0,10];
// range of intensity accepted by Complaint resources (lowest to highest)
const intensityRange = [0,10];



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
EatingHabit is a resource that describes the eating habit of a given day.
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
      throw("Illegal argument: invalid SCT code for EatingHabit.");
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
          "display": sct.getEnglish(code)
        }]};
  }
}

/*
SleepPattern is a resource that describes the eating habit of a given day.
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

/*
This is the default type of Complaint resources. It can be initialized with codes
of the "VariousComplaint" category, or inherited by concrete Complaints like Headache.
parameters  - startTime: date and time of beginning of the complaint (2019-03-19T15:30:00+01:00)
            - endTime: date and time when the complaint ended (2019-03-19T15:30:00+01:00)
            - code: the type of the complaint as SCT
            - intensity: the intensity of the complaint, on a scale from 0 to 10
author      hessg1
version     2019-03-20
*/
export class Complaint extends FhirResource {
  constructor(startTime, endTime, intensity, code){

    // the following part is valid for all Complaints, even specific
    super();
    // check if intensity is valid
    if(intensity < intensityRange[0] || intensity > intensityRange[1]){
      throw("Invalid argument: intensity must be at least " + intensityRange[0] + " and at maximum " + intensityRange[1]);
    }

    this.effectivePeriod = {"start": startTime, "end": endTime};
    this.valueCodeableConcept = {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": code,
          "display": sct.getEnglish(code)
        }
      ]
    };
    this.component = [{
        "code": {
          "coding": [{
              "system": "http://snomed.info/sct",
              "code": "425401001",
              "display": "Pain intensity rating scale"
            }]
        },
        "valueQuantity": {
          "value": intensity
    }}];

    // the following is only valid for codes from the VariousComplaint category:
    code = Number(code);
    if(validVarComplaints.includes(code)){
      let superCode = sct.getFilteredProp(x=>x.code == code, "superCategory")[0];
      this.code = {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": superCode,
            "display": sct.getEnglish(superCode)
          }
        ]
      };
    }
    // if its neither a VariousComplaint nor a Headache, something is wrong:
    else if (!validHeadaches.includes(code)){
      throw("Illegal argument: Invalid SCT code for VariousComplaint.");
    }
  }
}

/*
This is the default type of Condition resources. It can be initialized with codes
of the "VariousComplaint" category.
parameters  - startTime: date and time of beginning of the complaint (2019-03-19T15:30:00+01:00)
            - endTime: date and time when the complaint ended (2019-03-19T15:30:00+01:00)
            - code: the type of the complaint as SCT
author      hessg1
version     2019-03-21
*/
export class Condition extends FhirResource {
  constructor(startTime, endTime, code){
    code = Number(code);
    if(!validConditions.includes(code)){
      throw("Illegal argument: Invalid SCT code for Condition.");
    }
    super();
    this.effectivePeriod = {"start": startTime, "end": endTime};
    this.valueCodeableConcept = {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": code,
          "display": sct.getEnglish(code)
        }
      ]
    };
    let superCode = sct.getFilteredProp(x=>x.code == code, "superCategory")[0];
    this.code = {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": superCode,
          "display": sct.getEnglish(superCode)
        }
      ]
    };
  }
}

/*
Headache is a resource that describes exactly what the name says: a headache.
parameters  - startTime: date and time when headache started (2019-03-19T15:30:00+01:00)
            - endTime: date and time when headache ended (2019-03-19T15:30:00+01:00)
            - intensity: the intensity of the headache, on a scale from 0 to 10
            - code: the type of the headache (throbbing, aching, ...) as SCT
            - bodysite: the site of the headache (left, right, bilateral), as SCT
author      hessg1
version     2019-03-20
*/
export class Headache extends Complaint {
  constructor(startTime, endTime, intensity, code, bodysite){
    super(startTime, endTime, intensity, code);
    // check if code is valid
    code = Number(code);
    if(!validHeadaches.includes(code)){
      throw("Illegal argument: invalid SCT code for Headache.");
    }
    // check if bodysite is valid
    bodysite = Number(bodysite);
    if(!validBodySites.includes(bodysite)){
      throw("Illegal argument: invalid SCT code for headache bodysite.");
    }

    this.code = {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "162306000",
        "display": "Headache character"
    }]};

    this.bodySite = {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": bodysite,
        "display": sct.getEnglish(bodysite)
    }]};

  }
}
