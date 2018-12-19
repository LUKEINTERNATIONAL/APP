var sideEffectConcepts = []
var reasonForSideEffects = {};

function drugInducedSideEffects() {
  var nextbutton = document.getElementById('nextButton');
  nextbutton.setAttribute('onmousedown','checkForPossibleConnection();');
}

function resetReasonForSideEffects() {
	reasonForSideEffects = {};
}

function checkForPossibleConnection() {
  if(earliest_start_dates.earliest_start_date == null){
    gotoNextPage();
    return;
  }
  
  var f = document.getElementById('inputFrame' + tstCurrentPage);
  var clicked = f.getElementsByClassName('clicked');

  sideEffectConcepts = [];

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

var resultsTableCSS = document.createElement("span");
resultsTableCSS.innerHTML = "<style>\
#results-table {\
  width: 100%;\
  overflow: auto;\
  border-collapse: collapse;\
}\
#backbatton{\
  position: absolute;\
  top: -10px !important;\
  right: 165px;\
  width: 150px;\
}\
.results-table-headers {\
  background-color: lightgrey;\
}\
.results-table-headers th {\
  text-align: left;\
  padding-left: 5px;\
}\
#results-table td {\
  border-width: 0px 0px 1px 0px;\
  border-style: solid;\
  text-align: center;\
}\
.row_odd {\
  background-color: white;\
}\
.row_even {\
  background-color: aliceblue;\
  color: black;\
}\
#orders-popup-div {\
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
#orders-cover-div {\
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
#orders-nav-bar {\
  background-color: #333333;\
  height: 80px;\
  bottom: 0px;\
  position: absolute;\
  width: 99%;\
  border-radius: 0px 0px 9px 9px;\
}\
.nav-order-btns {\
  margin-top: 1% !important;\
  width: 150px;\
}\
#input-container {\
  margin-top: 0% !important;\
  height: 87%;\
  width: 100%;\
}\
#date-table {\
  background-color: whitesmoke;\
  width: 400px;\
  border-style: solid;\
  border-width: 1px;\
  border-radius: 25px;\
  top: 20%;\
  position: absolute;\
  left: 23%;\
}\
#date-table td {\
  text-align: center;\
}\
.date-inputs {\
  width: 90px;\
  height: 60px;\
  font-size: 2.0em;\
  text-align: center;\
}\
.date-navButton {\
  width: 120px;\
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
#buttonContainerCell-red {\
  background-color: tomato;\
}\
</style>";

  var cover = document.getElementById('orders-cover-div');
  var box = document.getElementById('orders-popup-div');
  cover.style = 'display: inline;';
  box.style = 'display: inline;';
  box.appendChild(resultsTableCSS);

  var orderDiv = document.createElement('div');
  orderDiv.setAttribute('id','input-container');
  box.appendChild(orderDiv);

  var ordersNavBar = document.createElement('div');
  ordersNavBar.setAttribute('id','orders-nav-bar');
  box.appendChild(ordersNavBar);


  var nextB = document.createElement('button');
  nextB.innerHTML = '<span>Next</span>';
  nextB.setAttribute('class','button green navButton nav-order-btns');
  nextB.setAttribute('onmousedown','nextSideEffect(1);');
  nextB.setAttribute('id','next-button');
  ordersNavBar.appendChild(nextB);

  var cancelB = document.createElement('button');
  cancelB.innerHTML = '<span>Cancel</span>';
  cancelB.style = 'float: left; left: 5px;';
  cancelB.setAttribute('class','button red navButton nav-order-btns');
  cancelB.setAttribute('onmousedown','cancelOrder();');
  ordersNavBar.appendChild(cancelB);
  
  addMedications(0); 
}

function addMedications(index) {
  var container = document.getElementById('input-container');
  container.innerHTML = null;

  var helpText = document.createElement('label');
  helpText.innerHTML = "Select the medication causing <span id='sideeffectTag'>"	+ sideEffectConcepts[index][1] + "</span>";
  helpText.setAttribute('class','helpTextClass');
  container.appendChild(helpText);
/*
  var inputDIV = document.createElement('div');
  var inputDIVstyle = 'border-style: solid; border-width: 1px 1px 0px 1px;';
  inputDIVstyle += 'border-radius: 9px 9px 0px 0px;';
  inputDIV.style = inputDIVstyle;
  container.appendChild(inputDIV);


  var inputDIV = document.createElement('div');
  var inputDIVstyle = 'border-style: solid; border-width: 1px 1px 0px 1px;';
  inputDIVstyle += 'border-radius: 9px 9px 0px 0px;';
  inputDIV.style = inputDIVstyle;
  container.appendChild(inputDIV);

  var input = document.createElement('input');
  input.setAttribute('id','selected-med-induced-' + sideEffectConcepts[index][0]);
  input.setAttribute('type','text');
  input.setAttribute('class','touchscreenTextInput');
  input. readOnly = true;
  inputDIV.appendChild(input);
*/


  var options = document.createElement('div');
  options.setAttribute('class','options');
  var inputDIVstyle = 'border-style: solid; border-width: 1px;';
  inputDIVstyle += 'border-radius: 9px; height: 95%;';
  options.style = inputDIVstyle;
  container.appendChild(options);

  var viewport = document.createElement('div');
  viewport.setAttribute('class','scrollable');
  viewport.setAttribute('id','side-effects-' + sideEffectConcepts[index][0]);
  options.appendChild(viewport);

  var ul = document.createElement('ul');
  viewport.appendChild(ul);
  
  var data = previousMedsGivens;

  for(var i = 0 ; i < data.length ; i++){
    
    var li = document.createElement('li');
    li.setAttribute('class', 'test-panel-list');
    li.setAttribute('tstvalue', 'panel-list');
    li.setAttribute('drug_id', data[i].drug.drug_id);
    li.setAttribute('panel-id', data[i].drug.drug_id);
		li.setAttribute('side_effect_id', sideEffectConcepts[index][2]);
    li.setAttribute('onmousedown','updateSelectedMedSideEffects(this);');
    li.style = '';

    var div1 = document.createElement('div');
    div1.style = 'display: table; border-spacing: 0px;';
    li.appendChild(div1);

    var div2 = document.createElement('div');
    div2.style = 'display: table-cell;';
    div1.appendChild(div2);

    var img = document.createElement('img');
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    img.setAttribute('alt', '[ ]');
    img.setAttribute('id', 'checkbox-' + data[i].drug.drug_id);
    div2.appendChild(img);

    var div3 = document.createElement('div');
    div3.style = 'display: table-cell; vertical-align: middle; text-align: left; padding-left: 15px;';
    div3.innerHTML = data[i].drug.name;
    div1.appendChild(div3);

    ul.appendChild(li);
  }

  addNone(ul, sideEffectConcepts[index][2]);

  var root = document.getElementById('orders-nav-bar');
  var nextbutton = document.getElementById('next-button');

  if(parseInt(index) > 0) {
    var backbutton = document.getElementById('backbatton');
    if(typeof(backbatton) === 'undefined' || typeof(backbatton) === 'object'){
      backbatton = document.createElement('button');
      backbatton.innerHTML = '<span>Back</span>';
      backbatton.setAttribute('class','button blue navButton back-buttons');
      backbatton.setAttribute('id','backbatton');
      backbatton.setAttribute('onmousedown','previousSideEffect(' + (index - 1) + ');');
      root.appendChild(backbatton);
      //root.insertBefore(backbatton, nextbutton);
    }
  }else{ 
    var backbuttons = document.getElementsByClassName('back-buttons');
    for(var x = 0 ; x < backbuttons.length ; x++){
      if(typeof(backbuttons[x]) === 'object'){
        try {
          root.removeChild(backbuttons[x]);
        }catch(e){}
      }
    }
  }

  if(sideEffectConcepts[(index + 1)] == undefined){
    nextbutton.innerHTML = '<span>Done</span>';
    nextbutton.setAttribute('onmousedown','saveMedicationInduced();');
    var backbutton = document.getElementById('backbatton');

    if(typeof(backbatton) === 'object' && parseInt(index) != 0){
      index = (sideEffectConcepts.length - 2);
      backbatton.setAttribute('onmousedown','previousSideEffect(' + (index) + ');');
    }

  }else{
    nextbutton.innerHTML = '<span>Next</span>';
    nextbutton.setAttribute('onmousedown','nextSideEffect(' + (index + 1) + ');');
  }
}

function nextSideEffect(i) {
	var input = document.getElementById('sideeffectTag');
	if(reasonForSideEffects[input.innerHTML] == undefined) {
		showMessage('Please select from the list');
		return;
	}

  addMedications(i);
}

function previousSideEffect(i) {
  var root = document.getElementById('orders-nav-bar');
    
  var backbuttons = document.getElementsByClassName('back-buttons');
  for(var x = 0 ; x < backbuttons.length ; x++){
    if(typeof(backbuttons[x]) === 'object' && parseInt(i) == 0){
      try {
        root.removeChild(backbuttons[x]);
      }catch(e){}
    }
  }
  addMedications(i);
}

function addNone(ul, side_effect_id) {
	var li = document.createElement('li');
	li.setAttribute('class', 'test-panel-list');
	li.setAttribute('tstvalue', 'panel-list');
	li.setAttribute('onmousedown','updateSelectedMedSideEffects(this);');
	li.setAttribute('panel-id', 'none');
	li.setAttribute('drug_id', 1107);
	li.setAttribute('side_effect_id', side_effect_id);
	li.style = '';

	var div1 = document.createElement('div');
	div1.style = 'display: table; border-spacing: 0px;';
	li.appendChild(div1);

	var div2 = document.createElement('div');
	div2.style = 'display: table-cell;';
	div1.appendChild(div2);

	var img = document.createElement('img');
	img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
	img.setAttribute('alt', '[ ]');
	img.setAttribute('id', 'checkbox-none');
	div2.appendChild(img);

	var div3 = document.createElement('div');
	div3.style = 'display: table-cell; vertical-align: middle; text-align: left; padding-left: 15px;';
	div3.innerHTML = 'None';
	div1.appendChild(div3);

	ul.appendChild(li);
}

function updateSelectedMedSideEffects(e) {
  var list = document.getElementsByClassName('test-panel-list');
  var img = document.getElementById('checkbox-' + e.getAttribute('panel-id'));

  if(e.getAttribute('style').match(/lightblue/)) {
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    e.style = 'background-color: ""';
    var tempList = [];
    for(var i = 0 ; i < selectedPanels.length ; i++){
      if(parseInt(selectedPanels[i]) != parseInt(e.getAttribute('testtype'))){
        tempList.push(selectedPanels[i]);
      }
    }
    selectedPanels = tempList;
  }else{
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
    e.style = 'background-color: lightblue;';
    selectedPanels.push(parseInt(e.getAttribute('testtype')));
	
		var input = document.getElementById('sideeffectTag');
		if(reasonForSideEffects[input.innerHTML] == undefined)
			reasonForSideEffects[input.innerHTML] = [];

		reasonForSideEffects[input.innerHTML].push([
			e.getAttribute('side_effect_id'),
			e.getAttribute('drug_id')
		]);
  }

	if(e.getAttribute('panel-id') == 'none'){
		if(e.getAttribute('style').match(/lightblue/)){
			deSelectAll(e);
		}
  }else{
		var img = document.getElementById('checkbox-none');
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    var n = img.parentElement.parentElement.parentElement; //document.getElementById('pan')
		n.style = 'background-color: ""';

		var tempCache = reasonForSideEffects[input.innerHTML];
		reasonForSideEffects[input.innerHTML] = [];
		for(var x = 0 ; x < tempCache.length; x++){
			if(parseInt(tempCache[x]) != 1107)
				reasonForSideEffects[input.innerHTML].push(tempCache[x]);
		
		}
	}
}	

function deSelectAll(e) {
  var list = document.getElementsByClassName('test-panel-list');
  for(var i = 0 ; i < list.length ; i++){
		var img = document.getElementById('checkbox-' + list[i].getAttribute('panel-id'));
    img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    list[i].style = 'background-color: ""';
	}

	var input = document.getElementById('sideeffectTag');
	reasonForSideEffects[input.innerHTML] = null;
	
	var img = document.getElementById('checkbox-' + e.getAttribute('panel-id'));
	img.setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
	e.style = 'background-color: lightblue;';
		
	var input = document.getElementById('sideeffectTag');
	if(reasonForSideEffects[input.innerHTML] == undefined)
		reasonForSideEffects[input.innerHTML] = [];

	reasonForSideEffects[input.innerHTML] = [];
	reasonForSideEffects[input.innerHTML].push([
		e.getAttribute('side_effect_id'),
		e.getAttribute('drug_id')
	]);
}

function saveMedicationInduced() {
  var input = document.getElementById('sideeffectTag');
  if(reasonForSideEffects[input.innerHTML] == undefined) {
    showMessage('Please select from the list');
    return;
  }

  var cover = document.getElementById('orders-cover-div');
  var box = document.getElementById('orders-popup-div');
	box.innerHTML = null;
	box.style = 'display: none;';
	cover.style = 'display: none;';
	gotoNextPage();
}

var previousMedsGivens;


function possibleCausedMedicationOfSideEffects() {
  var session_date = moment(new Date(sessionStorage.sessionDate)).format('YYYY-MM-DD');
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/programs/1/patients/';
  url += sessionStorage.patientID + "/last_drugs_received?date=" + session_date;

  var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
           previousMedsGivens = JSON.parse(this.responseText);
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

possibleCausedMedicationOfSideEffects();
