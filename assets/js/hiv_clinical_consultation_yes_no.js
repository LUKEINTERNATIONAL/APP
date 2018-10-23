var sideEffectsLeft = [
  ["Peripheral neuropathy", 1],
  ["Jaundice",2],["Lipodystrophy",3],
  ["Kidney Failure",4]
];

var sideEffectsRight = [
  ["Psychosis",5],["Gynaecomastia",6],
  ["Anemia",7], ["Other", 8, "activateOtherSideEffects"]
];

function addPregBreastFeedingYesNo() {
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  var attr = 'Pregnant?, 9#Breastfeeding?,10'
  buildYesNoUI('Pregnant-Breastfeeding', attr, tar);
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

function addTBassociatedSymptomsYesNo() {
  var concept_name = "ROUTINE TUBERCULOSIS SCREENING";
  var TBsymptoms = [
    ["Cough of any duration", 1],
    ["Fever", 2],
    ["Night sweats",3],
    ["Weight loss / Failure to thrive / malnutrition", 4]
  ];

  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var symptoms  = TBsymptoms.join(";").split(";").join("#");

  buildYesNoUI(concept_name, symptoms, frame);
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
    ["CD4 count", 5497],
    ["Crag", 1001],
    ["Urine LAM", 1479]
  ];

  var frame   = document.getElementById("inputFrame" + tstCurrentPage);
  var tests  = labSets.join(";").split(";").join("#");

  buildYesNoUI(concept_name, tests, frame);
}
