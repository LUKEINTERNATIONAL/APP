var sideEffectsLeft = [
  ["Peripheral neuropathy", 821],
  ["Jaundice", 215],["Lipodystrophy", 2148],
  ["Kidney Failure",  9242],
  ["Skin rash", 512]
];

var sideEffectsRight = [
  ["Psychosis", 219],["Gynaecomastia", 9440],
  ["Anemia", 3],["Insomnia", 867], ["Other", 6408, "activateOtherSideEffects"]
];

var otherSideEffectsLeft = [
  ["Fever", 5945],
  ["Vomiting", 5980],
  ["Dizziness", 877],
  ["Headache", 620],
  ["Night sweats", 6029]
];

var otherSideEffectsRight = [
  ["Nausea", 5978],
  ["Weight loss / Failure to thrive / malnutrition", 8260, 'checkForWeightLoss'],
  ["Lactic acidosis", 1458],
  ["Cough", 107]
];

var iacLeft = [
  ["Explained Key facts about starting ART?", 10],
  ["Explain how to achieve optimal adherence?", 11],
  ["Talk about ART failure and drug resistance?",12],
  ["Tell the patient that his or viral load will be checked again in 3 months?", 13]

];

var iacRight = [
  ["Identify specific problems that get in the way of good adherence", 14],
  ["Agree on plan?", 15],
  ["Supply medications on a monthly basis?", 16],
  ["If Viral Load undetected- Continue current regimen?", 17]

];

function addPregBreastFeedingYesNo() {
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  var attr = 'Pregnant?, 9#Breastfeeding?,10'
  buildYesNoUI('Pregnant-Breastfeeding', attr, tar);
  if(iac == true) {
    var nextButton =  document.getElementById('nextButton');
    nextButton.setAttribute('onmousedown', previousNextButton);
  }
  
}

function addIACYesNo() {
  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var effectsLeft  = iacLeft.join(";").split(";").join("#");
  var effectsRight = iacRight.join(";").split(";").join("#");

  var iac_table = document.createElement("div");
  iac_table.setAttribute("style","display: table;width: 100%;");
  frame.appendChild(iac_table);
  
  var iac_table_row = document.createElement("div");
  iac_table_row.setAttribute("style","display: table-row;");
  iac_table.appendChild(iac_table_row);
  
  var cells = ["left","right"];
  
  for(var i = 0 ; i < cells.length ; i++){
    var iac_table_cell = document.createElement("div");
    var style = "display: table-cell; width: 44%; float:";
    style += (i == 0 ? "left;" : "right;"); 
    iac_table_cell.setAttribute("style",style);
    iac_table_row.appendChild(iac_table_cell);
    
    if(i == 0) {   
      buildYesNoUI('Intensive adherence councelling', effectsLeft, iac_table_cell);
    }else{
      buildYesNoUI('Intensive adherence councelling', effectsRight, iac_table_cell);
    }

  }

}

function addSideEffectsYesNo() {
  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var effectsLeft  = sideEffectsLeft.join(";").split(";").join("#");
  var effectsRight = sideEffectsRight.join(";").split(";").join("#");

  var side_effect_table = document.createElement("div");
  side_effect_table.setAttribute("style","display: table;width: 100%;");
  frame.appendChild(side_effect_table);
  
  var side_effect_table_row = document.createElement("div");
  side_effect_table_row.setAttribute("style","display: table-row;");
  side_effect_table.appendChild(side_effect_table_row);
   
  var cells = ["left","right"];
  
  for(var i = 0 ; i < cells.length ; i++){
    var side_effect_table_cell = document.createElement("div");
    var style = "display: table-cell; width: 44%; float:";
    style += (i == 0 ? "left;" : "right;"); 
    side_effect_table_cell.setAttribute("style",style);
    side_effect_table_row.appendChild(side_effect_table_cell);
    
    if(i == 0) {   
      buildYesNoUI('MALAWI ART SIDE EFFECTS', effectsLeft, side_effect_table_cell);
    }else{
      buildYesNoUI('MALAWI ART SIDE EFFECTS', effectsRight, side_effect_table_cell);
    }

  }

}

function otherSideEffectsYesNo() {
  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var effectsLeft  = otherSideEffectsLeft.join(";").split(";").join("#");
  var effectsRight = otherSideEffectsRight.join(";").split(";").join("#");

  var other_side_effect_table = document.createElement("div");
  other_side_effect_table.setAttribute("style","display: table;width: 100%;");
  frame.appendChild(other_side_effect_table);
  
  var other_side_effect_table_row = document.createElement("div");
  other_side_effect_table_row.setAttribute("style","display: table-row;");
  other_side_effect_table.appendChild(other_side_effect_table_row);
   
  var cells = ["left","right"];
  
  for(var i = 0 ; i < cells.length ; i++){
    var other_side_effect_table_cell = document.createElement("div");
    var style = "display: table-cell; width: 44%; float:";
    style += (i == 0 ? "left;" : "right;"); 
    other_side_effect_table_cell.setAttribute("style",style);
    other_side_effect_table_row.appendChild(other_side_effect_table_cell);
    
    if(i == 0) {   
      buildYesNoUI('OTHER MALAWI ART SIDE EFFECTS', effectsLeft, other_side_effect_table_cell);
    }else{
      buildYesNoUI('OTHER MALAWI ART SIDE EFFECTS', effectsRight, other_side_effect_table_cell);
    }

  }

}

function checkForWeightLoss(element) {
  if (element.getAttribute("whichone").toLowerCase() === "no" && parseInt(sessionStorage.weightLoss) >= 10) {
    var val = element.getAttribute("value");
    newPopup(val);
  }
}

function checkIfTBsymptomsAlreadyDone() {
  var mwSideEffects = yesNo_Hash['MALAWI ART SIDE EFFECTS'];
  var otherSelected = mwSideEffects['Other'] == 'Yes' ? true : false;

  if(!otherSelected){
    yesNo_Hash['OTHER MALAWI ART SIDE EFFECTS'] = null;
    return false;
  }

  var mwOtherSideEffects = yesNo_Hash['OTHER MALAWI ART SIDE EFFECTS'];
  yesNo_Hash['ROUTINE TUBERCULOSIS SCREENING'] = {};

  for(var concept in mwOtherSideEffects){
    if(concept.toUpperCase() == 'Night sweats'.toUpperCase()){
      yesNo_Hash['ROUTINE TUBERCULOSIS SCREENING']['Night sweats'] =  mwOtherSideEffects[concept];
    }else if(concept.toUpperCase() == 'Weight loss / Failure to thrive / malnutrition'.toUpperCase()){
      yesNo_Hash['ROUTINE TUBERCULOSIS SCREENING']['Weight loss / Failure to thrive / malnutrition'] =  mwOtherSideEffects[concept];
    }else if(concept.toUpperCase() == 'Cough'.toUpperCase()){
      yesNo_Hash['ROUTINE TUBERCULOSIS SCREENING']['Cough of any duration'] =  mwOtherSideEffects[concept];
    }else if(concept.toUpperCase() == 'Fever'.toUpperCase()){
      yesNo_Hash['ROUTINE TUBERCULOSIS SCREENING']['Fever'] = mwOtherSideEffects[concept];
    }
  }

  return true;
}

function addTBassociatedSymptomsYesNo() {
  var concept_name = "ROUTINE TUBERCULOSIS SCREENING";
  var TBsymptoms = [
    ["Cough of any duration", 1],
    ["Fever", 2],
    ["Night sweats",3],
    ["Weight loss / Failure to thrive / malnutrition", 4, "checkForWeightLoss"]
  ];

  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var symptoms  = TBsymptoms.join(";").split(";").join("#");

  buildYesNoUI(concept_name, symptoms, frame);
}

function newPopup(val) {
  showSafeFamilyPlanningMethodsPopup();
  var confirm = document.getElementById("confirm-reading");
  confirm.style.visibility = "visible"
  confirm.style.backgroundColor = "green";
  var controlled = document.getElementById("safe-family-planning-yes");
  controlled.innerHTML = "Confirm Controlled";
  confirm.setAttribute("onclick", "selectVal("+val+")");
  document.getElementById("message-header").innerHTML = "patients weight has dropped "+sessionStorage.weightLoss+"% is this controlled weight loss??";
}
function selectVal(val) {
  hideSafeFamillyPlanningPopup();
  document.getElementById(val+"_yes").setAttribute("class","yes_no_btns clicked");
    document.getElementById(val+"_no").setAttribute("class","yes_no_btns not-clicked");
}


var OtherSideEffects = false

function activateOtherSideEffects(btn) {
  if(btn.getAttribute("whichone").toLowerCase() == 'yes'){
    OtherSideEffects = true;
  }else{
    OtherSideEffects = false;
  }
}

function addLabInvestigationsQuestions() {
  var concept_name = "Requested lab test set";
  var labSets = [
    ["CD4 count", 2],
    ["Crag", 34],
    ["Urine LAM", 27]
  ];

  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var tests  = labSets.join(";").split(";").join("#");
  
  buildYesNoUI(concept_name, tests, frame);
}
