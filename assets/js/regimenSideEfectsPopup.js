var popBoxCSS = document.createElement("span");
popBoxCSS.innerHTML = "<style>\
.side-effect-table {\
  text-align: center;\
  font-size: 20px;\
  height: 30px;\
  border-style: solid;\
  border-width: 0px 0px 1px 0px;\
  border-color: blue;\
}\
#confirmatory-test-popup-div {\
  width: 96% !important;\
  left: 1.4% !important;\
  top: -65px !important;\
  height: 85% !important;\
}\
#side-effects-table {\
  width: 97%;\
  margin: 10px;\
}\
#side-effects-table th {\
  background-color: lightgray;\
  font-size: 1.3em;\
}\
.buttonContainer {\
  width: 97%;\
  display: table;\
  position: absolute;\
  bottom: 0px;\
  padding: 10px;\
  border-collapse: separate;\
  border-spacing: 5px 10px;\
}\
.buttonContainerRow {\
  display: table-row;\
}\
.buttonContainerCell {\
  display: table-cell;\
  border-width: 1px;\
  border-style: solid;\
  text-align: center;\
  vertical-align: middle;\
  box-shadow: 0 8px 6px -6px black;\
  height: 100px;\
  font-weight: bold;\
  font-size: 20px;\
  color: white;\
}\
#buttonContainerCell-green {\
  background-color: rgb(34, 139, 34);\
}\
#buttonContainerCell-blue {\
  background-color: rgb(79, 148, 205);\
}\
#buttonContainerCell-lightblue {\
  background-color: rgb(0, 178, 238);\
}\
#tbody td {\
  text-align: center;\
  font-size: 1.3em;\
}\
.odd-row td {\
  background-color: mintcream;\
  border-style: solid;\
  border-width: 1px 0px 0px 0px;\
}\
.switching-table {\
  width: 99%;\
  display: table;\
  text-align: center;\
  border-collapse: separate;\
  border-spacing: 5px 10px;\
  height: 75%;\
}\
.switching-table-row {\
  display: table-row;\
}\
.switching-table-cell {\
  display: table-cell;\
  height: 3%;\
  border-style: solid;\
  border-width: 1px;\
  box-shadow: 0 8px 6px -6px black;\
  vertical-align: middle;\
}\
#switching-table-caption {\
  text-align: center;\
  font-size: 1.3em;\
  font-weight: bold;\
}\
</style>";




function checkForSideEffects() {
  var popBox = document.getElementById("confirmatory-test-popup-div");
  var popBoxCover = document.getElementById("confirmatory-test-cover");

  popBoxCover.style = "display: inline;";
  popBox.style = "display: inline;";

  popBox.innerHTML = null;

  var sideEffectContainer = document.createElement("div");
  sideEffectContainer.setAttribute("class","side-effect-table");
  popBox.appendChild(sideEffectContainer);

  var sideEffectContainerRow = document.createElement("div");
  sideEffectContainerRow.setAttribute("class","side-effect-table-row");
  sideEffectContainer.appendChild(sideEffectContainerRow);

  var sideEffectContainerCell = document.createElement("div");
  sideEffectContainerCell.setAttribute("class","side-effect-table-cell");
  sideEffectContainerCell.innerHTML = "Contraindications / Side effects";
  sideEffectContainerCell.innerHTML += "<span id='selected-regimen'></span>";
  sideEffectContainerRow.appendChild(sideEffectContainerCell);


  var table = document.createElement('table');
  table.setAttribute('id','side-effects-table'); 
  popBox.appendChild(table);

  var tr = document.createElement('tr');
  table.appendChild(tr);

  var headers = ['&nbsp;','Contraindication(s)','Side effect(s)'];
  for(var i = 0 ; i < headers.length ; i++){
    var th = document.createElement('th');
    th.innerHTML  = headers[i];
    tr.appendChild(th);
  }

  var tbody = document.createElement('tbody');
  tbody.setAttribute('id','tbody');
  table.appendChild(tbody);


  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Select other regimen','View whole history','Keep selected regimen'];
  
  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-lightblue');
      buttonContainerCell.setAttribute('onmousedown','closePopUp();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','wiewWholeHistory(this);');
    }else if(i == 2) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-green');
      buttonContainerCell.setAttribute('onmousedown','continueToPossibleStarterPack();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }

}

function continueToPossibleStarterPack() {
  closePopUp();
  sideEffectMatchFound = false;
  checkIFStartPackApplies();
}

function fetchSideEffectsIfANY(concept) {
  var concept_id = concept[0][1];

  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += "/observations?concept_id=" + concept_id; 
  url += "&person_id=" + sessionStorage.patientID;
  url += "&start_date=1900-01-01&end_date="; 
  url += moment(sessionDate).format('YYYY-MM-DD');

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);

      for(var i = 0 ; i < obj.length ; i++) {
        var value_coded = 0;
        try {
          value_coded = parseInt(obj[i].value_coded);
        }catch(e){
          value_coded = 0;
        }
             
        if(value_coded == 1065){      
          var dateTime = moment(new Date(obj[i]['obs_datetime'])).format('DD/MMM/YYYY')
          if(sideEffectHash[dateTime] == null)
            sideEffectHash[dateTime] = [];

          sideEffectHash[dateTime].push(concept[0][0]);
        }
      }

      sideEffects.shift();
      if(sideEffects.length > 0) {
        fetchSideEffectsIfANY(sideEffects);
      }else{
        document.getElementById('confirmatory-test-cover').style = "display: none;";
      }

    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function fetchOtherSideEffectsIfANY(concept) {
  var concept_id = concept[0][1];

  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += "/observations?concept_id=" + concept_id; 
  url += "&person_id=" + sessionStorage.patientID;
  url += "&start_date=1900-01-01&end_date="; 
  url += moment(sessionDate).format('YYYY-MM-DD');

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);

      for(var i = 0 ; i < obj.length ; i++) {
        var value_coded = 0;
        try {
          value_coded = parseInt(obj[i].value_coded);
        }catch(e){
          value_coded = 0;
        }
             
        if(value_coded == 1065){      
          var dateTime = moment(new Date(obj[i]['obs_datetime'])).format('DD/MMM/YYYY')
          if(otherSideEffectsHash[dateTime] == null)
            otherSideEffectsHash[dateTime] = [];

          otherSideEffectsHash[dateTime].push(concept[0][0]);
        }
      }

      otherSideEffects.shift();
      if(otherSideEffects.length > 0) {
        fetchOtherSideEffectsIfANY(otherSideEffects);
      }else{
        document.getElementById('confirmatory-test-cover').style = "display: none;";
      }

    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}


function updateAlertTable() {
  if(isHashEmpty(sideEffectHash)){
    return;
  }else{

    if(targetedDate != null)
      checkForSideEffects();

    var tbody = document.getElementById('tbody');
    var count = 0;

    for(var vdate in sideEffectHash) {
      if(targetedDate != null && vdate != targetedDate)
        continue;

      var oddEven = ( count & 1 ) ? "odd" : "even";

      var tr = document.createElement('tr');
      tr.setAttribute('class', oddEven + '-row')
      tbody.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = vdate;
      tr.appendChild(td);


      var cdate = moment(new Date(vdate)).format('YYYY-MM-DD');
      var earliest_start_date = null;

      if(earliest_start_dates.earliest_start_dates == null) {        
        var contraindications = sideEffectHash[vdate].join('<br />');
        var seffects  = '&nbsp;';
      }else if(earliest_start_dates.earliest_start_dates != null) {        
        if(earliest_start_date != cdate){
          var seffects = sideEffectHash[vdate].join('<br />');
          var contraindications  = '&nbsp;';
        }else{
          var contraindications = sideEffectHash[vdate].join('<br />');
          var seffects  = '&nbsp;';
        }
      }else{
        var seffects = sideEffectHash[vdate].join('<br />');
        var contraindications  = '&nbsp;';
      }

      var td = document.createElement('td');
      td.innerHTML = contraindications
      tr.appendChild(td);

      var td = document.createElement('td');
      td.innerHTML = seffects
      tr.appendChild(td);
      
      count++;
    }


  }
 
  var title = ' for regimen ';
  title += selectedRegimens.split(' ')[0]; 
  document.getElementById('selected-regimen').innerHTML = title;  
}

var targetedDate;
var sideEffectMatchFound = false;

function checkForPossibleSideEffects(regimen) {

  regimen = regimen.split(' ')[0]
  var r = /\d+/;
  regimen = parseInt(regimen.match(r));
  targetedDate = null;

  var sideE = contraindications[regimen];

  for(var i = 0 ; i < sideE.length ; i++){
    for(vdate in sideEffectHash){
      var all = sideEffectHash[vdate]
      for(var x = 0 ; x < all.length ; x++){
        if(all[x].toUpperCase() == sideE[i].toUpperCase()){
          sideEffectMatchFound = true;
          targetedDate = vdate;
          break;
        }
      }
    }
  }

  if(sideEffectMatchFound) {
    updateAlertTable();
  }else{
    //gotoNextPage();
  }

}

function isHashEmpty(obj) {                                                     
  for(var key in obj) {                                                         
    if(obj.hasOwnProperty(key))                                                 
      return false;                                                             
    }                                                                           
  return true;                                                                  
} 

function closePopUp() {
  document.getElementById('confirmatory-test-cover').style = 'display: none;';
  document.getElementById('confirmatory-test-popup-div').style = 'display: none;';
}

function checkIFStartPackApplies() {
 
  var starterPackNeed = false 

  if(patientInitiationStatus.toUpperCase() != 'CONTINUING' && !sideEffectMatchFound) {
    var medication = givenRegimens[selectedRegimens];
    for(var i = 0 ; i < medication.length ; i++){
      if(medication[i].drug_name.match(/NVP/i) || medication[i].drug_name.match(/nevirapine/i)) {
        starterPackNeed = true;
        showStartPackMessage(medication);
      }
    }


    if(parseInt(sessionStorage.patientAge) < 3 && !starterPackNeed){
      var regimen = parseInt(selectedRegimens.match(/\d+/)[0]);
      if(regimen == 11){
        starterPackNeed = true;
        showStartPackMessage(medication);
      }else{
        buildRecommendationPopUP();
        return;
      }
    }

  }
  
  if(!starterPackNeed && !sideEffectMatchFound)
    checkIFRegimenHasLPv();

}

function getPatientInitiationStatus() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID + '/status?date=';
  url += moment(sessionDate).format('YYYY-MM-DD');

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);
      patientInitiationStatus = obj.status;
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

var patientInitiationStatus;
getPatientInitiationStatus();


function showStartPackMessage(medication) {
  var popBox = document.getElementById("confirmatory-test-popup-div");
  var popBoxCover = document.getElementById("confirmatory-test-cover");

  popBoxCover.style = "display: inline;";
  popBox.style = "display: inline;";

  popBox.innerHTML = null;

  var initiationBox = document.createElement('div');
  initiationBox.setAttribute('class','initiationBox');
  popBox.appendChild(initiationBox);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  var cssText ='text-align: center; color: rgb(255, 165, 0);';
  cssText += 'font-size: 14pt;font-weight: bolder;';
  cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxCell.innerHTML = 'Starter pack needed for 14 days';
  initiationBoxRow.appendChild(initiationBoxCell);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  if(patientInitiationStatus == 'Initiation'){
    var text = '<b style="color: green;">First time initiation</b> ';
  }else{
    var text = '<b style="color: green;">Re-initiation</b> ';
  }

  initiationBoxCell.setAttribute('class','initiationBoxCell');
  initiationBoxCell.innerHTML = text + '<br />';
/*
  for(var i = 0 ; i < medication.length ; i++){
    initiationBoxCell.innerHTML += medication[i].drug_name + '<br />';
  }
*/
  initiationBoxCell.innerHTML += selectedRegimens;
  var cssText = 'text-align: center; margin-top: 5%;';
  cssText += 'font-size: 25px;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxRow.appendChild(initiationBoxCell);



  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Cancel','Prescribe starter pack'];
  
  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];
    buttonContainerCell.setAttribute('id','buttonContainerCell-blue');

    if(i == 0) {
      buttonContainerCell.setAttribute('onmousedown','closePopUp();');
    }else{
      buttonContainerCell.setAttribute('onmousedown','getStaterPackBreakDown();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }

}

function wiewWholeHistory(e) {
  targetedDate = null;
  document.getElementById('tbody').innerHTML = null;

  if(e.innerHTML.match(/whole/i)){
    e.innerHTML = 'Back to <br />current status';
    updateAlertTable();
    document.getElementById('selected-regimen').innerHTML = ' (whole history)';
  }else{
    closePopUp();
    checkForPossibleSideEffects(selectedRegimens);
  }


}

function buildRecommendationPopUP() {
  var popBox = document.getElementById("confirmatory-test-popup-div");
  var popBoxCover = document.getElementById("confirmatory-test-cover");

  popBoxCover.style = "display: inline;";
  popBox.style = "display: inline;";

  popBox.innerHTML = null;

  var recommendationDIV = document.createElement('div');
  popBox.appendChild(recommendationDIV);

  var p = document.createElement('p');
  var cssText = "text-align: center; font-size: 25px; color: orange;";
  cssText += "border-style: solid; border-width: 0px 0px 1px 0px;";
  p.setAttribute("style", cssText);
  p.innerHTML = "Recommendation";
  recommendationDIV.appendChild(p);

  var ul = document.createElement('ul');
  recommendationDIV.appendChild(ul);

  var li = document.createElement('li');
  ul.appendChild(li);

  var p = document.createElement('p');
  cssText = "margin-top: 10px; font-size: 1.3em;";
  p.setAttribute("style", cssText);
  p.innerHTML = "Children under 3 years often have a high viral load and may ";
  p.innerHTML += "be infected with drug-resistant HIV from previous exposure ";
  p.innerHTML += "to ARVs (mother's ART and/or infant nevirapine prophylaxis)";
  li.appendChild(p);

  var li = document.createElement('li');
  ul.appendChild(li);

  var p = document.createElement('p');
  p.setAttribute("style", cssText);
  p.innerHTML = "Therefore, children <b>under 3 years</b> respond better when ";
  p.innerHTML += "<b>started immediately on 2nd line regimen</b> (Regimen <b>11</b>)";
  li.appendChild(p);

  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Cancel', 'Keep selected regimen'];
  
  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-lightblue');
      buttonContainerCell.setAttribute('onmousedown','closePopUp();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','closePopUp();gotoNextPage();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

var contraindications = {};
contraindications[0] = ['Jaundice','hepatitis','hypersensitivity', 'fever', 'vomiting', 'cough', 'treatment failure'];
contraindications[2] = ['Jaundice','Anemia','hepatitis', 'vomiting', 'Lactic Acidosis', 'Treatment failure'];
contraindications[4] = ['Anemia','Psychosis', 'vomiting', 'Lactic acidosis'];
contraindications[5] = ['Renal Failure','Kidney Failure','Psychosis', 'Treatment failure', 'Dizziness'];
contraindications[6] = ['Jaundice','Renal Failure','Kidney Failure','Hepatitis', 'Treatment failure'];
contraindications[7] = ['Jaundice','Renal Failure','Kidney Failure','Hepatitis', 'Treatment failure'];
contraindications[8] = ['Anemia','Jaundice', 'Hepatitis', 'vomiting', 'Lactic acidosis', 'Treatment failure'];
contraindications[9] = ['hypersensitivity', 'fever', 'vomiting', 'cough', 'diarrhoea', 'vomiting', 'dizziness', 'headache','Treatment failure'];
contraindications[10] = ['Renal Failure', 'Kidney Failure','Uncontrolled BP', 'vomiting', 'diziness', 'headache', 'Treatment failure'];
contraindications[11] = ['Anemia', 'vomiting', 'lactic acidosis', 'diarrhoea', 'vomiting', 'dizziness', 'headache', 'Treatment failure'];
contraindications[12] = ['Diarrhoea', 'vomiting', 'headache', 'dizziness', 'jaundice'];
contraindications[13] = ['Renal Failure','Hepatitis','Uncontrolled BP', 'headache', 'nausea', 'diarrhoea', 'Treatment failure'];
contraindications[14] = ['Anemia','Hepatitis', 'vomitiing', 'headache', 'nausea', 'Treatment failure'];
contraindications[15] = ['hypersensitivity','Hepatitis', 'fever', 'cough', 'insomnia', 'headache', 'nausea', 'diahrhoea', 'Treatment failure'];





var sideEffects = [                                                         
  ["Peripheral neuropathy", 821],                                               
  ["Jaundice", 215],["Lipodystrophy", 2148],["Kidney Failure",  9242], 
  ["Psychosis", 219],["Gynaecomastia", 9440],["Anemia", 3],["Skin rash", 512],["Insomnia", 867]
];

var otherSideEffects = [
  ["Fever", 5945],
  ["Vomiting", 5980],["Dizziness", 877],["Headache", 620],
  ["Nausea", 5978],["Treatment failure", 843],
  ["Lactic acidosis", 1458],["Cough", 107]
];

var sideEffectHash = {}
fetchSideEffectsIfANY(sideEffects);

var otherSideEffectsHash = {}
fetchOtherSideEffectsIfANY(otherSideEffects);
  
var hmtlBody = document.getElementsByTagName("body")[0];
hmtlBody.appendChild(popBoxCSS);


function getEarliestStartDate() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID;
  url += '/earliest_start_date';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      earliest_start_dates = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function getStaterPackBreakDown() {
  var regimen_index = parseInt(selectedRegimens.match(/\d+/)[0]);
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/regimen_starter_packs?regimen=';
  url += regimen_index + '&weight=' + sessionStorage.currentWeight;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
       var data = JSON.parse(this.responseText);
       if(data.length > 0) {
         givenRegimens[selectedRegimens] = data;
       }
       starterPackSelected = true;
       closePopUp();
       //gotoNextPage();
       checkIFRegimenHasLPv();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

var earliest_start_dates;
getEarliestStartDate();
