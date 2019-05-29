export default class MediService {
  constructor(){
    let data = require('@/assets/medis.json');
    this.medis = data.medis;
    this.meta = data.meta;
  }

  /*
  This method gets a medications name and dosage from a GTIN. The medication must
  listed on the swiss speciality list.
  parameters  - gtin: a GTIN of a medication
  returns     the corresponding display name in english,
  throws      "not found" if code is not in the project
  author      hessg1
  version     2019-05-28
  */
  getMedName(gtin){
    let retVal = null;
    for(let i in this.medis){
      if(this.medis[i].gtin == gtin){
        retVal = this.medis[i];
        console.log(retVal)
      }
    }
    if(retVal == null){
      throw("Medikament mit der GTIN " + gtin + " wurde nicht gefunden.")
    }
    else{
      return retVal.name.toUpperCase() + " (" + retVal.description + ")";
    }
  }

}
