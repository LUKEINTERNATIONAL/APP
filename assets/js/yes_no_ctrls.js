var previousNextButton = {};
var yesNo_Hash = {};
var yesNoValues = {};

function isHashEmpty(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
		}
	return true;
}

function validateYesNo(concept_name) {

  if(isHashEmpty(yesNo_Hash)){
    showMessage('Please complete selection by clicking Yes / No');
    return;
  }

	//var values = values.split('#');
	var values = yesNoValues[concept_name].join('');
  values = values.split('#');

	for(c in yesNo_Hash){
	  if(concept_name != c)
      continue;

  	for(name in yesNo_Hash[c]){
      if(yesNo_Hash[c][name] == null){
        showMessage('Please complete all selection(s) by clicking either Yes / No');
        return;
      }
		}

	}

  var nextButton =  document.getElementById('nextButton');
  nextButton.setAttribute('onmousedown', previousNextButton[concept_name]);
	//gotoNextPage();

	eval(previousNextButton[concept_name]);
  previousNextButton[concept_name] = null;
}

function buildYesNoUI(concept_name, values, targetElement) {
  var nextButton =  document.getElementById('nextButton');
  if(!previousNextButton[concept_name])
	  previousNextButton[concept_name] = nextButton.getAttribute("onmousedown");

  nextButton.setAttribute('onmousedown',"validateYesNo('" + concept_name + "');");
  nextButton.setAttribute('onclick',"");


  var inputFrame = document.getElementById("inputFrame" + tstCurrentPage); //.getElementsByClassName('yes_nos');
  inputFrame.style = "width: 96%;";
  createNewCtrl(targetElement, concept_name, values);

  preSelectYesNo();

  if(!yesNoValues[concept_name])
    yesNoValues[concept_name] = [];

    
  yesNoValues[concept_name].push(values);
}

function createNewCtrl(e, concept_name, values) {
  var attributes = values.split("#");
	for(var i = 0 ; i < attributes.length; i++){
		if(!yesNo_Hash[concept_name])
		  yesNo_Hash[concept_name] = {};

		if(!yesNo_Hash[concept_name][attributes[i].split(',')[0].trim()])
		  yesNo_Hash[concept_name][attributes[i].split(',')[0].trim()] = null;

	}
 
  var yesNoTable = document.createElement("table");
  yesNoTable.setAttribute("class","yes_no_table");

  for(var i  = 0 ; i < attributes.length ; i++){
    var concept = attributes[i].split(",")[0];
    var concept_id = attributes[i].split(",")[1];

    var setFunctionName = '';
    try{
      setFunctionName = attributes[i].split(",")[2];
    }catch(a){
      setFunctionName = '';
    }
    
    var r = document.createElement("tr");
    td = document.createElement("td");
    td.innerHTML = concept
    r.appendChild(td);

    yes_no = ["Yes","No"];
    for(var x = 0; x < ["Yes","No"].length; x++){
      td = document.createElement('td');
      td.setAttribute("class", "yes_no_container");
      button = document.createElement("a");
      //button.setAttribute("id", "btn_" + yes_no[x].toLowerCase() + "_" + i);
      button.setAttribute("id", concept_id + "_" + yes_no[x].toLowerCase());
      button.setAttribute("whichone", yes_no[x]);

      if(setFunctionName != undefined){
        setFunctions = "buttonClicked(this,'" + concept_name + "','" + concept + "');"  + setFunctionName + "(this);";
        button.setAttribute("onmousedown", setFunctions);
      }else{
        button.setAttribute("onmousedown","buttonClicked(this,'" + concept_name + "','" + concept + "');");
      }

      /* ............................................ */
      button.setAttribute("concept_name", concept_name);
      button.setAttribute("question", concept);
      /* ............................................ */

      button.setAttribute("value", concept_id);
      button.setAttribute("class", "yes_no_btns not-clicked");
      
      var span = document.createElement("span")
      span.setAttribute("class", "yes_no_text " + yes_no[x].toLowerCase() + "_texts");
      span.innerHTML = yes_no[x];
      button.appendChild(span);

      td.appendChild(button);
      r.appendChild(td);
    }

    yesNoTable.appendChild(r);
  }

  e.appendChild(yesNoTable)
}

function buttonClicked(btn, concept_name, concept) {
  var concept_id = btn.getAttribute("id").split("_")[0];

  var yesBTN  = document.getElementById(concept_id + "_yes");
  var noBTN   = document.getElementById(concept_id + "_no");
    
  if(btn.innerHTML == yesBTN.innerHTML) {
    if(btn.getAttribute("class").match(/not-clicked/i)){
      btn.setAttribute("class","yes_no_btns clicked");
    }
    noBTN.setAttribute("class","yes_no_btns not-clicked")
  }else if(btn.innerHTML == noBTN.innerHTML) {
    if(btn.getAttribute("class").match(/not-clicked/i)){
      btn.setAttribute("class","yes_no_btns clicked");
    }
    yesBTN.setAttribute("class","yes_no_btns not-clicked")
  }

/*

  if(btn.getAttribute("class").match(/not-clicked/i)){
    btn.setAttribute("class","yes_no_btns clicked");
  }else{
    btn.setAttribute("class","yes_no_btns not-clicked");
  }
*/
	
	var value = btn.getAttribute("whichone");
	value = (value.match(/no/i) ? "No" : "Yes");
	yesNo_Hash[concept_name][concept] = value;
}

function preSelectYesNo() {
  var yes_no_btns = document.getElementsByClassName("yes_no_btns");

  for(var b = 0 ; b < yes_no_btns.length ; b++){
    var concept_name  = yes_no_btns[b].getAttribute("concept_name");
    var question      = yes_no_btns[b].getAttribute("question");
    var YesNo         = yes_no_btns[b].getAttribute("whichone").toLowerCase();

    try {
      if(yesNo_Hash[concept_name][question].toLowerCase() == YesNo){
        yes_no_btns[b].setAttribute("class","yes_no_btns clicked");
      }
    }catch(e){
    }


  }

}
