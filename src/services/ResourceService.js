import SnomedService from '@/services/SnomedService';
const sct = new SnomedService();

// SCT codes to be accepted by Headache resource
const validHeadaches = sct.getFilteredProp(x => x.category == "Headache", "code");
// SCT codes to be accepted by EatingHabit resource
const validEatingHabits = sct.getFilteredProp(x => x.category == "EatingHabit", "code");
// SCT codes to be accepted by SleepPattern resource
const validBodySites = sct.getFilteredProp(x => x.category == "BodySite", "code");
// SCT codes to be accepted by VariousComplaint collective resource
const validVarComplaints = sct.getFilteredProp(x => x.category == "VariousComplaint", "code");
// SCT codes to be accepted by Condition collective resource
const validConditions = sct.getFilteredProp(x => x.category == "Condition", "code");
// SCT codes to be accepted by Diagnosis resource
const validDiagnoses = sct.getFilteredProp(x => x.category == "Diagnosis", "code");

// range of quality accepted by SleepPattern resource (lowest to highest)
const sleepQualityRange = [0,10];
// range of intensity accepted by Complaint resources (lowest to highest)
const intensityRange = [0,10];

let prepareTime = function(time){
  var offset = -1 * new Date().getTimezoneOffset()/60;
  time = time + "+0" + offset + ":00";
  return time;
}

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
throws:     - an error if a SCT is entered that is not in the projects list for EatingHabits
author      hessg1
version     2019-03-19
*/
export class EatingHabit extends FhirResource {
  constructor(date, code){
    // check for undefined values
    if(!date || !code){
      throw("Fehler: Nullwert eingegeben.");
    }

    // check if date is in future
    if(new Date(date).getTime() > Date.now() + 10000){
      throw("Fehler: Kann keine Observation mit zukünftigem Datum erstellen.");
    }

    // check if code is valid
    code = Number(code);
    if(!validEatingHabits.includes(code)){
      throw("Fehler: Ungültiger SCT-Code für EatingHabit.");
    }

    super();
    this.code = {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "364645004",
        "display": "Eating feeding / drinking observable"
      }]};
    this.effectiveDateTime = new Date(date).toISOString();
    this.valueCodeableConcept = {
      "coding": [{
          "system": "http://snomed.info/sct",
          "code": code,
          "display": sct.getEnglish(code)
        }]};
  }
}

/*
SleepPattern is a resource that describes the sleep pattern of a given day.
parameters  - startTime: date and time when subject went to bed (2019-03-19T15:30:00+01:00)
            - endTime: date and time when subject left bed (2019-03-19T15:30:00+01:00)
            - quality: the subjective quality of sleep, on a scale from 0 to 10
throws:     - an error if a SCT is entered that is not in the projects list for SleepPattern
            - an error if the quality is not in the preset range
author      hessg1
version     2019-03-19
*/
export class SleepPattern extends FhirResource {
  constructor(startTime, endTime, quality){
    super();

    // check for undefined values
    if(!startTime || !endTime || !quality){
      throw("Fehler: Nullwert eingegeben.");
    }

    // check if quality is valid
    if(quality < sleepQualityRange[0] || quality > sleepQualityRange[1]){
      throw("Fehler: Qualität muss zwischen " + sleepQualityRange[0] + " und " + sleepQualityRange[1] + " liegen.");
    }

    startTime = new Date(prepareTime(startTime));
    endTime = new Date(prepareTime(endTime));
    // check if date is in future
    if(startTime.getTime() > Date.now() || endTime.getTime() > Date.now() + 2*60*60*1000){
      throw("Fehler: Kann keine Observation mit Datum in der Zukunft erstellen.");
    }

    // throw an error if endTime is before startTime
    if(endTime < startTime){
      throw("Fehler: endTime liegt vor startTime.");
    }

    this.code = {
      "coding": [{
        "system": "http://loinc.org",
        "code": "65554-8",
        "display": "How many hours and minutes does it take for you to become fully awake from regular sleep, after first opening your eyes in the morning."
      }]};
    this.effectivePeriod = {"start": startTime.toISOString(), "end": endTime.toISOString()},
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
throws:     - an error if a SCT is entered that is not in the projects list for complaints
            - an error if the intensity is not in the preset range
author      hessg1
version     2019-03-20
*/
export class Complaint extends FhirResource {
  constructor(startTime, endTime, intensity, code){

    // check for undefined values
    if(!startTime || !endTime || !intensity || !code){
      throw("Fehler: Nullwert eingegeben.");
    }

    startTime = new Date(prepareTime(startTime));
    endTime = new Date(prepareTime(endTime));

    if(startTime.getTime() > Date.now() || endTime.getTime() > Date.now() + 2*60*60*1000){
      throw("Fehler: Kann keine Observation mit Datum in der Zukunft erstellen.");
    }

    // throw an error if endTime is before startTime
    if(endTime < startTime){
      throw("Fehler: endTime liegt vor startTime.");
    }

    // the following part is valid for all Complaints, even specific
    super();
    // check if intensity is valid
    if(intensity < intensityRange[0] || intensity > intensityRange[1]){
      throw("Fehler: Intensität muss zwischen " + intensityRange[0] + " und " + intensityRange[1] + " liegen.");
    }

    this.effectivePeriod = {"start": startTime.toISOString(), "end": endTime.toISOString()};
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
              "code": "406127006",
              "display": "Pain intensity"
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
      throw("Fehler: Ungültiger SCT Code für VariousComplaint.");
    }
  }
}

/*
This is the default type of Condition resources. It can be initialized with codes
of the "VariousComplaint" category.
parameters  - startTime: date and time of beginning of the complaint (2019-03-19T15:30:00+01:00)
            - endTime: date and time when the complaint ended (2019-03-19T15:30:00+01:00)
            - code: the type of the complaint as SCT
throws:     - an error if a SCT is entered that is not in the projects list for conditions
author      hessg1
version     2019-03-21
*/
export class Condition extends FhirResource {
  constructor(startTime, endTime, code){

    // check for undefined values
    if(!startTime || !endTime || !code){
      throw("Fehler: Nullwert eingegeben.");
    }

    startTime = new Date(prepareTime(startTime));
    endTime = new Date(prepareTime(endTime));
    if(startTime.getTime() > Date.now() || endTime.getTime() > Date.now() + 2*60*60*1000){
      throw("Fehler: Kann keine Observation mit Datum in der Zukunft erstellen.");
    }

    // throw an error if endTime is before startTime
    if(endTime < startTime){
      throw("Fehler: endTime liegt vor startTime.");
    }


    code = Number(code);
    if(!validConditions.includes(code)){
      throw("Fehler: Ungültiger SCT Code für Condition.");
    }
    super();
    this.effectivePeriod = {"start": startTime.toISOString(), "end": endTime.toISOString()};
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
throws:     - an error if a SCT is entered that is not in the projects list for headaches
            - an error if the intensity is not in the preset range
author      hessg1
version     2019-03-20
*/
export class Headache extends Complaint {
  constructor(startTime, endTime, intensity, code, bodysite){
    // check for undefined bodysite (others are checked in super)
    if(!bodysite){
      throw("Fehler: bodySite ist null / undefined");
    }

    super(startTime, endTime, intensity, code);
    // check if code is valid
    code = Number(code);
    if(!validHeadaches.includes(code)){
      throw("Fehler: Ungültiger SCT Code für Headache.");
    }
    // check if bodysite is valid
    bodysite = Number(bodysite);
    if(!validBodySites.includes(bodysite)){
      throw("Fehler: Ungültiger SCT Code für headache bodysite.");
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


/*
Diagnosis is the resource for saving a migraine or headache diagnosis
as diagnosed by a medical doctor (but entered by the patient).
parameters  - date: the date when the diagnosis was made (YYYY-MM-DD)
            - diagnosis: the diagnosis as SCT code
throws:     - an error if a SCT is entered that is not in the projects list for diagnoses
author      hessg1
version     2019-03-21
*/
export class Diagnosis extends FhirResource {
  constructor(date, diagnosis){
    // check for undefined values
    if(!date || !diagnosis){
      throw("Fehler: Nullwert eingegeben.");
    }


    let code = Number(diagnosis);
    if(!validDiagnoses.includes(code)){
      throw("Fehler: Ungültiger SCT Code für Diagnosis");
    }
    super();
    this.effectiveDateTime = new Date(date).toISOString();

    let superCode = sct.getFilteredProp(x=>x.code == code, "superCategory")[0];
    this.code = {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": superCode, // could be hardcoded with 128187005, but this leaves more flexibility for later
          "display": sct.getEnglish(superCode) // could be hardcoded with "Vascular Headache", but this leaves more flexibility for later
        }
      ]
    };

    this.valueCodeableConcept = {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": code,
          "display": sct.getEnglish(code)
        }
      ]
    };
  }
}
