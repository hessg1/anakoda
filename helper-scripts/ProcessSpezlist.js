var fs = require('fs');

console.log("reading file...");
var spezlist = JSON.parse(fs.readFileSync('spezlist.json', 'utf8'));

let preps = spezlist.Preparations.Preparation;
let medications = []

console.log("file read, processing data");

for(var i in preps){
  let name = preps[i].NameDe;
  let description = preps[i].DescriptionDe;

  for(let j in preps[i].Packs.Pack){
    let med = {
      name: name,
      description: description,
      gtin: preps[i].Packs.Pack[j].GTIN,
      pack: preps[i].Packs.Pack[j].DescriptionDe
    }
    medications.push(med)
  }
}

let result = {
  medis: medications,
  meta: {
    dateGenerated: new Date().toISOString(),
    spezListVersion: new Date(spezlist.Preparations._ReleaseDate).toISOString()
  }
}


fs.writeFile("medis.json", JSON.stringify(result), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log(i +  " Medikamente erfolgreich in medis.json gespeichert. ");
});
