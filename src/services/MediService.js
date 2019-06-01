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
  returns     the corresponding display name in german
  throws      "not found" if the GTIN is not on the swiss speciality sist
  author      hessg1
  version     2019-05-28
  */
  getMedName(gtin){
    let retVal = null;
    for(let i in this.medis){
      if(this.medis[i].gtin == gtin){
        retVal = this.medis[i];
      }
    }
    if(retVal == null){
      throw("Medikament mit der GTIN " + gtin + " wurde nicht gefunden.")
    }
    else{
      return retVal.name.toUpperCase() + " (" + retVal.description + ")";
    }
  }

  /*
  This method gets a medications name and dosage from a GTIN. The medication must
  listed on the swiss speciality list.
  parameters  - gtin: a GTIN of a medication
  returns     the complete medication object, with name, description, gtin and pack size
  throws      "not found" if the GTIN is not on the swiss speciality sist
  author      hessg1
  version     2019-05-28
  */
  getMed(gtin){
    let retVal = null;
    for(let i in this.medis){
      if(this.medis[i].gtin == gtin){
        retVal = this.medis[i];
      }
    }
    if(retVal == null){
      throw("Medikament mit der GTIN " + gtin + " wurde nicht gefunden.")
    }
    else{
      return retVal;
    }
  }

  /*
  Returns the version and generation date of the speciality list used by MediService.
  parameters  none
  returns     a string with version and generation date of the speciality list
  author      hessg1
  version     2019-06-01
  */
  version(){
    return('Version von ' + this.meta.spezListVersion.slice(0,10) + " (generiert am " + this.meta.dateGenerated.slice(0,10) + ')');
  }


}
