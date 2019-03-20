export default class SnomedService {
  constructor(){
    this.codes = [
      {
        "code": 73905001,
        "en": "Sees flickering lights",
        "de": "Flimmersehen",
        "related": "",
        "category": ""
      },
      {
        "code": 162057007,
        "en": "Nausea",
        "de": "Übelkeit",
        "related": "",
        "category": ""
      },
      {
        "code": 409668002,
        "en": "Photophobia",
        "de": "Lichtempfindlichkeit",
        "related": "",
        "category": ""
      },
      {
        "code": 313387002,
        "en": "Phonophobia",
        "de": "Lärmempfindlichkeit",
        "related": "",
        "category": ""
      },
      {
        "code": 420103007,
        "en": "Watery eye",
        "de": "Tränende Augen",
        "related": "",
        "category": ""
      },
      {
        "code": 703630003,
        "en": "Red eye",
        "de": "Gerötete Augen",
        "related": "",
        "category": ""
      },
      {
        "code": 276319003,
        "en": "Menstruation",
        "de": "Menstruation",
        "related": "",
        "category": ""
      },
      {
        "code": 216299002,
        "en": "Attack",
        "de": "Anfall",
        "related": "",
        "category": ""
      },
      {
        "code": 73595000,
        "en": "Stress",
        "de": "Stress",
        "related": "",
        "category": ""
      },
      {
        "code": 102894008,
        "en": "Relaxed feeling",
        "de": "Entspannt",
        "related": "",
        "category": ""
      },
      {
        "code": 279079003,
        "en": "Dysaesthesia",
        "de": "Gefühlsstörung",
        "related": "",
        "category": ""
      },
      {
        "code": 29164008,
        "en": "Speech impairment",
        "de": "Sprachstörung",
        "related": "",
        "category": ""
      },
      {
        "code": 64531003,
        "en": "Nasal discharge",
        "de": "Nasenlaufen",
        "related": "",
        "category": ""
      },
      {
        "code": 119711004,
        "en": "Nose closure",
        "de": "Verstopfte Nase",
        "related": "",
        "category": ""
      },
      {
        "code": 45846002,
        "en": "Hyperosmia",
        "de": "Geruchsempfindlichkeit",
        "related": "",
        "category": ""
      },
      {
        "code": 1985008,
        "en": "Vomitus",
        "de": "Erbrechen",
        "related": "",
        "category": ""
      },
      {
        "code": 162308004,
        "en": "Throbbing Headache",
        "de": "Pulsierende Kopfschmerzen",
        "related": "",
        "category": "Headache"
      },
      {
        "code": 162307009,
        "en": "Aching Headache",
        "de": "Stechende Kopfschmerzen",
        "related": "",
        "category": "Headache"
      },
      {
        "code": 162309007,
        "en": "Shooting Headache",
        "de": "Einschiessende Kopfschmerzen",
        "related": "",
        "category": "Headache"
      },
      {
        "code": 702970004,
        "en": "Eating habit unknown",
        "de": "Unbekanntes Essverhalten",
        "related": "",
        "category": "EatingHabit"
      },
      {
        "code": 289141003,
        "en": "Eats regularly",
        "de": "Regelmässig gegessen",
        "related": "",
        "category": "EatingHabit"
      },
      {
        "code": 225526009,
        "en": "Eats irregularly",
        "de": "Unregelmässig gegessen",
        "related": "",
        "category": "EatingHabit"
      }
    ];
  }

  getEnglish(code){
    for(var i in this.codes){
      if(this.codes[i].code == code){
        return this.codes[i].en;
      }
    }
    return "";
  }

  getGerman(code){
    for(var i in this.codes){
      if(this.codes[i].code == code){
        return this.codes[i].de;
      }
    }
    return "";
  }

  getCode(term){
    for(var i in this.codes){
      if(this.codes[i].de == term || this.codes[i].en == term){
        return this.codes[i].code;
      }
    }
    return "";
  }

  getFiltered(filter){
    let res = [];
    for(var i in this.codes){
      if(filter(this.codes[i])){
        res.push(this.codes[i]);
      }
    }
    return res;
  }

  getFilteredProp(filter, prop){
    let res = [];
    for(var i in this.codes){
      if(filter(this.codes[i])){
        res.push(this.codes[i][prop]);
      }
    }
    return res;
  }

}
