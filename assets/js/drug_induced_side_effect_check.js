var sideEffectConcepts = []
var reasonForSideEffects = {};
var previousMedsGivens = [];
var drugInducedSideEffectsCSS = document.createElement('span');

drugInducedSideEffectsCSS.innerHTML = "<style>\
#connection-table th {\
  border-style: none;\
  vertical-align: middle;\
  height: 1px;\
  font-size: 25px;\
}\
#connection-table td {\
  border-style: none;\
  height: 1px;\
  font-size: 23px;\
  vertical-align: middle;\
}\
#connection-table img {\
padding-left: 45px;\
}\
#connection-table {\
  width: 100%;\
  border-collapse: collapse;\
}\
#connection-table tr {\
  vertical-align: top;\
}\
.nav-order-btns {\
  margin-top: 1% !important;\
  width: 150px;\
}\
#box {\
  display: none;\
  background-color: #F4F4F4;\
  border: 2px solid #E0E0E0;\
  border-radius: 15px;\
  height: 92%;\
  padding: 5px;\
  position: absolute;\
  margin-top: 10px;\
  width: 95%;\
  left: 2%;\
  z-index: 991;\
}\
#box-cover {\
  display: none;\
  position: absolute;\
  background-color: black;\
  width: 100%;\
  height: 102%;\
  left: 0%;\
  top: 0%;\
  z-index: 990;\
  opacity: 0.65;\
}\
#box-nav-bar {\
  background-color: #333333;\
  height: 80px;\
  bottom: 0px;\
  position: absolute;\
  width: 99%;\
  border-radius: 0px 0px 9px 9px;\
}\
#input-container {\
  margin-top: 0% !important;\
  height: 87%;\
  width: 100%;\
  overflow-x: auto;\
}\
</style>"


function drugInducedSideEffects() {
  var nextbutton = document.getElementById('nextButton');
  nextbutton.setAttribute('onmousedown','checkForPossibleConnection();');
}

function resetReasonForSideEffects() {
	reasonForSideEffects = {};
}

function checkForPossibleConnection() {
  
  var f = document.getElementById('inputFrame' + tstCurrentPage);
  var clicked = f.getElementsByClassName('clicked');

  sideEffectConcepts = [];

  try {
    var body = document.getElementsByTagName('body')[0];
    var box = document.getElementById('box');
    var boxCover = document.getElementById('box-cover');
    body.removeChild(box);
    body.removeChild(boxCover);
  }catch(e){
  
  }

  for(var i = 0 ; i < clicked.length ; i++){
    if(clicked[i].getAttribute('whichone').toUpperCase() == 'YES'){
      if(clicked[i].getAttribute('question').toUpperCase() != 'OTHER')
        sideEffectConcepts.push([clicked[i].getAttribute('value'), 
					clicked[i].getAttribute('question'), 
					clicked[i].getAttribute('value')
				]);
    
    }
  }

  if(sideEffectConcepts.length > 0){
    buildConnection();
  }else{
    gotoNextPage();
  }
}

function buildConnection() {

  var box = document.createElement('div');
  box.setAttribute('id','box');
  var boxCover  = document.createElement('div');
  boxCover.setAttribute('id','box-cover');

  var body = document.getElementsByTagName('body')[0];
  body.appendChild(drugInducedSideEffectsCSS);
  body.appendChild(box);
  body.appendChild(boxCover);
  
  box.style = 'display: inline;';
  boxCover.style = 'display: inline;';
 
  var inputDiv = document.createElement('div');
  inputDiv.setAttribute('id','input-container');
  box.appendChild(inputDiv); 
  
  var boxNavBar = document.createElement('div');
  boxNavBar.setAttribute('id','box-nav-bar');
  box.appendChild(boxNavBar);

  var nextB = document.createElement('button');
  nextB.innerHTML = '<span>Next</span>';
  nextB.setAttribute('class','button green navButton nav-order-btns');
  nextB.setAttribute('onmousedown','nextSideEffect(1);');
  nextB.setAttribute('currentPage', 0);
  nextB.setAttribute('id','next-button');
  nextB.style = 'width: 120px;'
  boxNavBar.appendChild(nextB);
/*
*/
  addConnetion(0);
}

function addConnetion(index) {
  var container = document.getElementById('input-container');
  container.innerHTML = null;

  var helpText = document.createElement('div');
  helpText.innerHTML = "<span id='sideeffectTag'>"  + sideEffectConcepts[index][1] + "</span>";
  helpText.innerHTML += ": suspected cause"
  helpText.setAttribute('class','helpTextClass');
  helpText.style = "width: 97%; border-style: solid; border-width: 0px 0px 1px 0px;";
  container.appendChild(helpText);

  var table = document.createElement('table');
  table.setAttribute('id','connection-table');
  container.appendChild(table);

  if(previousMedsGivens.length > 0){
    addMeds(table, sideEffectConcepts[index][1]);
  }

  addPreExisitingConditions(table, sideEffectConcepts[index][1]);
  addBackButton(index);
}

function addPreExisitingConditions(t, side_effect) {
  var tr = document.createElement('tr');
  t.appendChild(tr);
  var th = document.createElement('th');
  th.innerHTML = "Past medical history";
  th.setAttribute('colspan', 2);
  tr.appendChild(th);

  tr = document.createElement('tr');
  tr.setAttribute('id', "pre-exisiting-" + side_effect);
  tr.setAttribute('side-effect', side_effect);
  tr.setAttribute('onmousedown', 'updateSelectedPS(this);');
  t.appendChild(tr);

  var td = document.createElement('td')
  td.style = "width: 20px;";
  tr.appendChild(td);

  var img = document.createElement('img');
  img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
  img.setAttribute('alt', '[ ]');
  img.setAttribute('id', 'img-side-effect-' + side_effect);
  td.appendChild(img);

  var td = document.createElement('td')
  td.innerHTML = "Other, not drug related"
  tr.appendChild(td);

  /* WWWWWWWWW................................................. */
  tr = document.createElement('tr');
  tr.setAttribute('id', "pre-exisiting-drug-" + side_effect);
  tr.setAttribute('side-effect', side_effect);
  tr.setAttribute('onmousedown', 'updateSelectedPreExisiting(this);');
  t.appendChild(tr);

  var td = document.createElement('td')
  td.style = "width: 20px;";
  tr.appendChild(td);

  var img = document.createElement('img');
  img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
  img.setAttribute('alt', '[ ]');
  img.setAttribute('id', 'img-pre-exisiting-side-effect-' + side_effect);
  td.appendChild(img);

  var td = document.createElement('td')
  td.innerHTML = "Drug side effect";
  tr.appendChild(td);
  /* ................................................. */



  var nextButton = document.getElementById('next-button');
  var i = parseInt(nextButton.getAttribute('currentPage'));
  
  if(sideEffectConcepts[(i + 1)] == undefined) {
    nextButton.setAttribute('currentPage', (i + 1));
    nextButton.setAttribute('onmousedown','selectedDI();');
    nextButton.innerHTML = '<span>Done</span>';
  }else{
    nextButton.setAttribute('currentPage', (i + 1));
    nextButton.setAttribute('onmousedown','nextSideEffect(' + (i + 1) + ');');
  }

}

function addBackButton(num) {
  var root = document.getElementById('box-nav-bar');
  
  if(num > 0) {
    if(root.getElementsByTagName('button').length == 1) {
      var backB = document.createElement('button');
      backB.innerHTML = '<span>Back</span>';
      backB.setAttribute('onmousedown','addConnetion(' + (num - 1) + ');');
      backB.setAttribute('class','button blue navButton');
      backB.setAttribute('id','previous-button');
      backB.style = 'margin: 10px 10px 0px 0px;width: 120px;';
      root.appendChild(backB);
    }
  }else{
    if(root.getElementsByTagName('button').length > 1) {
      var backB = document.getElementById('previous-button');
      root.removeChild(backB);

      var nextS = document.getElementById('next-button');
      nextS.setAttribute('onmousedown','nextSideEffect(1);');
      nextS.innerHTML = '<span>Next side effect</span>';
    }
  }
}

function addMeds(t, side_effect) {
  var tr = document.createElement('tr');
  t.appendChild(tr);
  var th = document.createElement('th');
  th.setAttribute('colspan', 2);
  th.innerHTML = "Current medication";
  tr.appendChild(th);
  
  for(var i = 0 ; i < previousMedsGivens.length ; i++){
    tr = document.createElement('tr');
    tr.setAttribute('id', previousMedsGivens[i].drug.drug_id);
    tr.setAttribute('onmousedown', 'updateSelectedMedSideEffects(this, "' + side_effect + '");');
    tr.setAttribute('side-effect', side_effect);
    tr.setAttribute('class', side_effect);
    t.appendChild(tr);

    var td = document.createElement('td')
    td.style = "width: 5px;";
    tr.appendChild(td);

    var img = document.createElement('img');
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    img.setAttribute('alt', '[ ]');
    img.setAttribute('id', 'img-side-effect-' + previousMedsGivens[i].drug.drug_id);
    td.appendChild(img);

    var td = document.createElement('td')
    td.innerHTML = previousMedsGivens[i].drug.name
    tr.appendChild(td);
  }
   
}

function updateSelectedMedSideEffects(e, side_effect_id) {
  var img = document.getElementById('img-side-effect-' + e.id);
  var selected = false;

  if(img.getAttribute('src').match(/unticked/i)){
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
    e.style = "background-color: lightblue;";
    selected = true;
  }else{  
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    e.style = "background-color: '';";
  }

  var sideEffect = e.getAttribute('side-effect').replace('drug-','');

  if(selected){
    if(reasonForSideEffects[sideEffect] == undefined) 
      reasonForSideEffects[sideEffect] = {drug_ids: [], ps: null};

    reasonForSideEffects[sideEffect].drug_ids.push(e.id);
  }else{
    if(reasonForSideEffects[sideEffect] == undefined) 
      reasonForSideEffects[sideEffect] = {drug_ids: [], ps: null};

    reasonForSideEffects[sideEffect].drug_ids = [];
  }
  
  
  if(selected){
    var cells = [
      ['pre-exisiting-drug-','img-pre-exisiting-side-effect-'],
      ['pre-exisiting-','img-side-effect-']
    ];

    for(var i = 0 ; i < cells.length ; i++) {
      var row = document.getElementById(cells[i][0] + side_effect_id);
      /* ..................... */ 
        row.style = 'background-color: "";';
        var img = document.getElementById(cells[i][1] + side_effect_id);
        img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
        
        if(reasonForSideEffects[sideEffect] == undefined) 
          reasonForSideEffects[sideEffect] = {drug_ids: [], ps: null};

        reasonForSideEffects[sideEffect].ps = null;
        reasonForSideEffects[sideEffect].pre_exisiting = null;
      /* ..................... */ 
    }  
  }
}

function updateSelectedPS(e) {
  var img = document.getElementById('img-side-effect-' + e.getAttribute('side-effect'));
  var selected = false;
  if(img.getAttribute('src').match(/unticked/i)){
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
    e.style = "background-color: lightblue;";
    selected = true;
  }else{  
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    e.style = "background-color: '';";
  }

  if(selected){
    if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
      reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null};

    reasonForSideEffects[e.getAttribute('side-effect')].drug_ids = [];
    reasonForSideEffects[e.getAttribute('side-effect')].ps = 'Yes';
  }else{
    if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
      reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null};

    reasonForSideEffects[e.getAttribute('side-effect')].ps = null;
  }
 
  if(selected) { 
    var list = document.getElementsByClassName(e.id.replace('pre-exisiting-',''));
    for(var i = 0 ; i < list.length ; i++){
   
    /* ..................... */ 
      if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
        reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null};

      reasonForSideEffects[e.getAttribute('side-effect')].drug_ids = [];
      list[i].style = 'background-color: "";'; 
      var img = document.getElementById('img-side-effect-' + list[i].id)
      img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    /* ..................... */ 
    
    }

    var side_effect_id = e.getAttribute('side-effect');
    var row = document.getElementById("pre-exisiting-drug-" + side_effect_id);
    /* ..................... */
      row.style = 'background-color: "";';
      var img = document.getElementById('img-pre-exisiting-side-effect-' + side_effect_id);
      img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');

      if(reasonForSideEffects[side_effect_id] == undefined)
        reasonForSideEffects[side_effect_id] = {drug_ids: [], ps: null, pre_exisiting: null};

      reasonForSideEffects[side_effect_id].pre_exisiting = null;
    /* ..................... */

  }
}

function updateSelectedPreExisiting(e) {
  var img = document.getElementById('img-pre-exisiting-side-effect-' + e.getAttribute('side-effect'));
  var selected = false;
  if(img.getAttribute('src').match(/unticked/i)){
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
    e.style = "background-color: lightblue;";
    selected = true;
  }else{  
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    e.style = "background-color: '';";
  }

  if(selected){
    if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
      reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null };

    reasonForSideEffects[e.getAttribute('side-effect')].drug_ids = [];
    reasonForSideEffects[e.getAttribute('side-effect')].ps = null;
    reasonForSideEffects[e.getAttribute('side-effect')].pre_exisiting = 'Yes';
  }else{
    if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
      reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null};

    reasonForSideEffects[e.getAttribute('side-effect')].pre_exisiting = null;
  }
 
  if(selected) {
    removeRest(e) 
  }
}

function removeRest(e){
  var list = document.getElementsByClassName(e.getAttribute('side-effect'));
  for(var i = 0 ; i < list.length ; i++){
 
  /* ..................... */ 
    if(reasonForSideEffects[e.getAttribute('side-effect')] == undefined) 
      reasonForSideEffects[e.getAttribute('side-effect')] = {drug_ids: [], ps: null, pre_exisiting: null};

    reasonForSideEffects[e.getAttribute('side-effect')].drug_ids = [];
    list[i].style = 'background-color: "";'; 
    var img = document.getElementById('img-side-effect-' + list[i].id)
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
  /* ..................... */ 
  
  }

  var side_effect_id = e.getAttribute('side-effect');
  var row = document.getElementById("pre-exisiting-" + side_effect_id);
  /* ..................... */
    row.style = 'background-color: "";';
    var img = document.getElementById('img-side-effect-' + side_effect_id);
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');

    if(reasonForSideEffects[side_effect_id] == undefined)
      reasonForSideEffects[side_effect_id] = {drug_ids: [], ps: null, pre_exisiting: null};

    reasonForSideEffects[side_effect_id].ps = null;
  /* ..................... */
}

function nextSideEffect(i) {
  var input = document.getElementById('sideeffectTag');
  if(reasonForSideEffects[input.innerHTML] == undefined) {
    showMessage('Please select from the list');
    return;
  }

  addConnetion(i);
}

function selectedDI() {
  if(isHashEmpty(reasonForSideEffects)) {
    showMessage('Please select from the list');
    return;
  }

  for(se in reasonForSideEffects) {
    var drugs = reasonForSideEffects[se].drug_ids;
    var ps  = reasonForSideEffects[se].ps;
    var pre_exisiting  = reasonForSideEffects[se].pre_exisiting;

    if(drugs.length < 1 && ps == null && pre_exisiting == null){
      showMessage('Please select from the list');
      return;
    }
  }

  var box = document.getElementById('box');
  var boxCover = document.getElementById('box-cover');
  box.style = 'display: none;';
  boxCover.style = 'display: none;';
  gotoNextPage();
}

function possibleCausedMedicationOfSideEffects() {
  var session_date = moment(new Date(sessionStorage.sessionDate)).format('YYYY-MM-DD');
  var url = sessionStorage.apiProtocol+ '://' + apiURL + ':' + apiPort + '/api/v1/patients/';
  url += sessionStorage.patientID + '/drugs_received';

  var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var previousDrugs = {};
          var drugs = JSON.parse(this.responseText);
          
          for(var i = 0 ; i < drugs.length ; i++) {
           previousDrugs[drugs[i]['drug'].drug_id] = drugs[i]
          }
          
          for(drug_id in previousDrugs) { 
            previousMedsGivens.push(previousDrugs[drug_id]);
          }
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

function isHashEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
    }
  return true;
}

possibleCausedMedicationOfSideEffects();
