var fs = require('fs');

var users = ["P-8F1F-88L7", "P-L2RL-F2TR", "P-OK4A-6U65", "P-BFIF-3CLQ"]

var input = JSON.parse(fs.readFileSync('study.json', 'utf8'));
let res = {
  "resourceType": "Bundle",
  "type": "transaction",
  "id": "bundle-transaction",
  "entry": []
}
for(let j in users){
  for(let i in input.entry){
    let entry = input.entry[i];
    if(entry.resource.subject && entry.resource.subject.display == users[j]){
        entry.request = {
          "method": "POST",
          "url": entry.resource.resourceType
        }


        delete entry.resource.subject;
        delete entry.resource.meta;
        delete entry.resource.id;
        delete entry.fullUrl;


        res.entry.push(entry);
    }
  }

  fs.writeFile(users[j] + ".json", JSON.stringify(res, null, 2), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log(users[j] + " gespeichert");
  });
}
