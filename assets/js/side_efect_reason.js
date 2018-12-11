

function sideEffectsAvailable() {
  var sideEffect = false;

  try {
    var h = yesNo_Hash['OTHER MALAWI ART SIDE EFFECTS'];
    
    sideEffect = (h.Cough == "Yes" ? true : sideEffect);
    sideEffect = (h.Dizziness == "Yes" ? true : sideEffect);
    sideEffect = (h.Fever == "Yes" ? true : sideEffect);
    sideEffect = (h.Headache == "Yes" ? true : sideEffect);
    sideEffect = (h["Lactic acidosis"] == "Yes" ? true : sideEffect);
    sideEffect = (h.Nausea == "Yes" ? true : sideEffect);
    sideEffect = (h["Treatment failure"] == "Yes" ? true : sideEffect);
    sideEffect = (h.Vomiting == "Yes" ? true : sideEffect);
  }catch(x) {
  }

  var h = yesNo_Hash['MALAWI ART SIDE EFFECTS'];
  sideEffect = (h.Anemia == "Yes" ? true : sideEffect);
  sideEffect = (h.Gynaecomastia == "Yes" ? true : sideEffect);
  sideEffect = (h.Jaundice == "Yes" ? true : sideEffect);
  sideEffect = (h['Kidney Failure'] == "Yes" ? true : sideEffect);
  sideEffect = (h.Lipodystrophy == "Yes" ? true : sideEffect);
  sideEffect = (h['Peripheral neuropathy'] == "Yes" ? true : sideEffect);
  sideEffect = (h.Psychosis == "Yes" ? true : sideEffect);

  var onART = false;
  try {
    if(earliest_start_dates.earliest_start_date.length == 10)
      onART = true;

  }catch(x) {
    return false;
  }

  return sideEffect
}

function medicationInduced() {
  var session_date = moment(new Date(sessionStorage.sessionDate)).format('YYYY-MM-DD');
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/programs/1/patients/';
  url += sessionStorage.patientID + "/last_drugs_received?date=" + session_date;
                                                                                
  var req = new XMLHttpRequest();                                               
    req.onreadystatechange = function () {                                      
      if (this.readyState == 4) {                                               
        if (this.status == 200) {                                               
           medication = JSON.parse(this.responseText);                          
           buildYesNoPage(medication);                                          
        }                                                                       
      }                                                                         
    };                                                                          
    try {                                                                       
      req.open('GET', url, true);                                               
      req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
      req.send(null);                                                           
    } catch (e) {                                                               
    }                                                                           
                                                                                
}

function buildYesNoPage(medication) {
  var drugs = {};
  var yesNo_string = []
 
  for(var i = 0 ; i < medication.length ; i++){
    drugs[medication[i].drug.drug_id] = medication[i].drug.name;
  }

  for(drug_id in drugs) {
    yesNo_string.push(drugs[drug_id] + ',' + drug_id);
  }

  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  tar.style = "width: 96%;";

  var attr = yesNo_string.join('#');
  console.log(attr)
  buildYesNoUI('Drug-induced', attr, tar);
}
