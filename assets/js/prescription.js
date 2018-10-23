var sessionDate = new Date("2018-10-16");

var givenRegimens = {};
var passedRegimens = {};

var selectedRegimens
var setSelectedInterval;

var show_custom_regimens = false;

function buildRegimenPage() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage);
  frame.style = "height: 89%; width: 96%;";
  document.getElementById("clearButton").style = "display: none;";

  var regimenContainer = document.createElement("div");
  regimenContainer.setAttribute("class","regimen-container");
  frame.appendChild(regimenContainer);

  var regimenContainerRow = document.createElement("div");
  regimenContainerRow.setAttribute("class","regimen-container-row");
  regimenContainer.appendChild(regimenContainerRow);


  var cells = ["left","right"];
  
  for(var i = 0 ; i < cells.length ; i++){
    var regimenContainerCell = document.createElement("div");
    regimenContainerCell.setAttribute("class","regimen-container-cell");
    regimenContainerCell.setAttribute("id","regimen-container-" + cells[i]);
    regimenContainerRow.appendChild(regimenContainerCell);
    createContainers(cells[i]);
  }


  loadRegimens();
}

function loadRegimens() {
  var side = "right";

  for(var regimen in givenRegimens){
    side = (side == "right" ? "left" : "right");
    var table = document.getElementById("regimen-table-" + side);

    var tr = document.createElement("tr");
    table.appendChild(tr);

    var td = document.createElement("td");
    td.setAttribute("class","regimen-names");
    td.setAttribute("id", regimen);
    td.setAttribute("onmousedown","selectRegimen(this);");
    td.innerHTML = regimen;
    tr.appendChild(td);
  }

}

function selectRegimen(e) {
  var cells = document.getElementsByClassName("regimen-names");
  for(var i = 0 ; i < cells.length ; i++){
    cells[i].setAttribute("style","background-color: '';");
  }
    
  e.setAttribute("style","background-color: lightblue;");
  selectedRegimens = e.innerHTML;
}

function calculateEstimatedNextApp() {
  var selectedMeds = givenRegimens[selectedRegimens];
  var set_date = null;

  set_date = sessionDate.getFullYear();
  var month = (sessionDate.getMonth() + 1);

  if(month.length < 2)
    month = "0" + month;

  set_date += "-" + month;

  var day = (sessionDate.getDate());
  if(day.length < 2)
    day = "0" + day;

  set_date += "-" + day;
  
  var appDate = new Date(set_date);
  appDate.setDate(appDate.getDate() + parseInt(setSelectedInterval));

  var estimated_packs = [];

  for(var i = 0 ; i < selectedMeds.length ; i++){
    var pills_per_day = 0;
    var am  = 0; var noon = 0; var pm = 0;

    if(!isNaN(parseInt(selectedMeds[i].am)))
      am = parseFloat(selectedMeds[i].am);

    if(!isNaN(parseFloat(selectedMeds[i].noon)))
      noon = parseInt(selectedMeds[i].noon);

    if(!isNaN(parseFloat(selectedMeds[i].pm)))
      pm = parseInt(selectedMeds[i].pm);

    pills_per_day += (am + noon + pm);

    var packs = ((pills_per_day * setSelectedInterval) / parseInt(selectedMeds[i].pack_size));
    var pack_size_str = ("'" + packs + "'");
    var packs_rounded = packs;

    if(pack_size_str.match(/\./))
      packs_rounded =  Math.round(packs)
      
    if(packs_rounded > packs){
      packs = packs_rounded;
    }else{
      packs = packs_rounded + parseInt(selectedMeds[i].pack_size)
    }

    estimated_packs.push([selectedMeds[i].drug_name, packs]);
    console.log(estimated_packs[i][0] + "      Zzzz         " + estimated_packs[i][1])
  }

  var td = document.getElementById("estimated-next-appointment-date");
  td.innerHTML = appDate.getDate() + "/" + getFullMonth(appDate.getMonth()) + "/"+ appDate.getFullYear();


  var td = document.getElementById("estimated-packs");
  var innerHTML = "";
  for(var i = 0 ; i < estimated_packs.length ; i++){
    innerHTML += estimated_packs[i][0] + "<span class='pack-sizes'>" + estimated_packs[i][1] + "</span><br />";
  }
  
  td.innerHTML = innerHTML;
}

function createContainers(side) {
  var container = document.getElementById("regimen-container-" + side);

  var table = document.createElement("table");
  table.setAttribute("class","regimen-tables");
  table.setAttribute("id","regimen-table-" + side);
  container.appendChild(table);
}

/* ########################################################################################### */

function showSelectedMeds() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage);
  frame.style = "height: 89%; width: 96%;";
  document.getElementById("clearButton").style = "display: none;";

  var table = document.createElement("table");
  table.setAttribute("id","selected-medication");
  frame.appendChild(table);

  var thead = document.createElement("thead");
  table.appendChild(thead);

  var tr = document.createElement("tr");
  tr.style = "background-color: lightgray;";
  thead.appendChild(tr);

  var theads = ["Drug name", "Units", "AM", "Noon", "PM"];
  for(var i = 0 ; i < theads.length ; i++){
    var th = document.createElement("th");
    th.innerHTML = theads[i];
    if(i == 0)
      th.style = "text-align: left;"

    tr.appendChild(th);
  }

  var tbody = document.createElement("tbody");
  tbody.setAttribute("id","selected-medication-tbody");
  table.appendChild(tbody);

  if(givenRegimens[selectedRegimens]) {
    var rows = givenRegimens[selectedRegimens]; 
    
    for(var i = 0 ; i < rows.length ; i++) {
      var tr = document.createElement("tr");
      tbody.appendChild(tr);

      if(selectedRegimens.split(" ")[0].match(/A/i)){
        tr.setAttribute("class","adult-category");
      }else if(selectedRegimens.split(" ")[0].match(/P/i)){
        tr.setAttribute("class","peads-category");
      }


      var td = document.createElement("td");
      td.innerHTML = rows[i].drug_name;
      td.setAttribute("class","numbers");
      td.setAttribute("class","med-names");
      tr.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = rows[i].units;
      td.setAttribute("class","numbers");
      tr.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = rows[i].am;
      td.setAttribute("class","numbers");
      tr.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = rows[i].noon;
      td.setAttribute("class","numbers");
      tr.appendChild(td);

      var td = document.createElement("td");
      td.innerHTML = rows[i].pm;
      td.setAttribute("class","numbers");
      tr.appendChild(td);


    }

  }
}



/* ###################################################### */

var assessment_questions = "Patient present?,1805#Guardian present?,2122"

var inclusion_list_arr = [
  ['Adult  18 years +', 9533], 
  ['On ART for 12 months +', 9534],
  ['On 1<sup>st</sup> line ART',9535],
  ['Good current adherence', 9537], ['Last VL <1000', 9536]
];

var exclusion_list_arr = [
  ['Pregnant / Breastfeeding', 9538],
  ["Side effects / HIV-rel. diseases", 9539],
  ["Needs BP / diabetes treatment", 9540],
  ['Started IPT <12m ago', 9527],
  ["Any sign for TB",2186]
];

function buildFTassessmentPage() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage)
  //buildYesNoUI("Fast track", assessment_questions, targetElement);

  var assessmentTable = document.createElement("div");
  assessmentTable.setAttribute("class","assessmentTable");
  frame.appendChild(assessmentTable)

  var assessmentTableRow = document.createElement("div");
  assessmentTableRow.setAttribute("class","assessmentTable-row");
  assessmentTable.appendChild(assessmentTableRow);

  var cells = ["left","right"];

  for(var i = 0 ; i < cells.length ; i++){
    var assessmentTableCell = document.createElement("div");
    assessmentTableCell.setAttribute("class","assessmentTable-cell");
    assessmentTableCell.setAttribute("id","assessmentTable-cell-" + cells[i]);
    assessmentTableRow.appendChild(assessmentTableCell);
  }

  var leftCell = document.getElementById("assessmentTable-cell-left");
  buildYesNoUI("Fast track", inclusion_list_arr.join("#").split(",").join(","), leftCell);

  var rightCell = document.getElementById("assessmentTable-cell-right");
  buildYesNoUI("Fast track", exclusion_list_arr.join("#").split(",").join(","), rightCell);

}

var setDataTable = null;

function initDataTable() {
  setDataTable = jQuery('#selected-medication').DataTable( {
    fixedHeader: true,
    searching: false,
    paging: false,
    scroller: {
      loadingIndicator: true
    }
  } );

  document.getElementById("selected-medication_info").style = "display: none;";
}

function buildNextIntervalPage() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage);
  frame.style = "height: 89%; width: 96%;";

  var nextBtn = document.getElementById("nextButton");
  nextButton.setAttribute("onmousedown", "validateIntervalSelection();");

  var container = document.createElement("div");
  container.setAttribute("class","next-interval-table");
  frame.appendChild(container);

  var containerRow = document.createElement("div");
  containerRow.setAttribute("class","next-interval-table-row");
  container.appendChild(containerRow);

  var cells = ["left","right"];

  for(var i = 0 ; i < cells.length ; i++){
    var containerCell = document.createElement("div");
    containerCell.setAttribute("class","next-interval-table-cell");
    containerCell.setAttribute("id","next-interval-table-" + cells[i]);
    containerRow.appendChild(containerCell);
  }
  
  addIntervals();
  addIntervalInfoSection();
}

function isEven(n) {
  return n % 2 == 0;
}

function isOdd(n) {
  return Math.abs(n % 2) == 1;
}

function addIntervalInfoSection() {
  var container = document.getElementById("next-interval-table-right");
  var table = document.createElement("table");
  table.setAttribute("id", "interval-info-table");

    var innerHTML = "<tr><th>Estimated next appointment date:</th></tr>";
   innerHTML +="<tr><td id='estimated-next-appointment-date'>&nbsp;</th></tr>";
   innerHTML += "<tr><td class='separator-rows'>&nbsp;</td></tr>";
   innerHTML += "<tr><th>Estimated packs/tins:</th></tr>";
   innerHTML += "<tr><td id='estimated-packs'>&nbsp;</th></tr>";
   innerHTML += "<tr><td class='separator-rows'>&nbsp;</td></tr>";

  table.innerHTML = innerHTML;
  container.appendChild(table);
}

function addIntervals() {
  var container = document.getElementById("next-interval-table-left");
  var intervals = ["2 weeks","1 month"]
  var count = 2;
  
  while(count < 13){
    intervals.push(count + " months");
    count++;
  }

  var table = document.createElement("table");
  table.setAttribute("id","intervals-table");
  var tr;

  for(var i = 0 ; i < intervals.length ; i++){
    if(isEven(i)) {
      tr = document.createElement("tr");
      table.appendChild(tr);
    }

    var td = document.createElement("td");
    td.setAttribute("class","interval-buttons");

    var days;

    if(intervals[i].match(/week/i)){
      days = ((parseInt(intervals[i].split(" ")[0])*7))
    }else if (intervals[i].match(/days/i)){
      days = 4
    }else if (intervals[i].match(/month/i)){
      days = ((parseInt(intervals[i].split(" ")[0])* 28))
    }

    td.setAttribute("interval", days);
    td.setAttribute("onmousedown","setNextInterval(this)");
    td.innerHTML = intervals[i];
    tr.appendChild(td);

  }




  container.appendChild(table);
}

function setNextInterval(e){
  var cells = document.getElementsByClassName("interval-buttons");
  for(var i = 0 ; i < cells.length ; i++){
    cells[i].setAttribute("style","background-color: '';");
  }
    
  e.setAttribute("style","background-color: lightblue;");
  setSelectedInterval = e.getAttribute("interval");
  calculateEstimatedNextApp(); 
}

function preSelectInterval() {
  var cells = document.getElementsByClassName("interval-buttons");
  for(var i = 0 ; i < cells.length ; i++){
    if(cells[i].getAttribute("interval") == setSelectedInterval)
      setNextInterval(cells[i]);

  }
}

function adjustFrameHeight() {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'height: 89% !important; width: 96%;';

  var lis = frame.getElementsByTagName("li")
  for(var i = 0 ; i < lis.length ; i++){
    var attr = lis[i].getAttribute("onmousedown");
    lis[i].setAttribute("onmousedown", attr + "; changeNextBtn(this);");
  }
}

function changeNextBtn(e) {
  var btn = document.getElementById("nextButton");

  if(e.innerHTML == "No"){
    btn.innerHTML = "<span>Finish</span>";
    btn.setAttribute("onmousedown", "submitFastTrackAssesment();")
  }else{
    btn.innerHTML = "<span>Next</span>";
    btn.setAttribute("onmousedown", "gotoNextPage();")
  }
}

function getRegimens() {
  var nextBtn = document.getElementById("nextButton");
  nextButton.setAttribute("onmousedown", "validateRegimenSelection();");

  var footer = document.getElementById("buttons");
  customRgimen = document.createElement("button")
  customRgimen.setAttribute("onmousedown","customRegimen();");
  customRgimen.setAttribute("id","customRegimen");
  customRgimen.setAttribute("class","button blue navButton");
  customRgimen.innerHTML = "<span>Custom regimen</span>";
  footer.appendChild(customRgimen);
  show_custom_regimens = false;

  resetCustomRegimens();


  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/programs/1/regimens";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);
      
      for(var key in obj) {
        passedRegimens[key] = [];
        for(var i = 0 ; i < obj[key].length ; i++){
          var pack_size = 30;
          
          if(!isNaN(parseInt(obj[key][i].parseInt)))
            pack_size = parseInt(obj[key][i].pack_size);


          var drug = {
            drug_name: obj[key][i].drug_name, 
            concept_name: obj[key][i].concept_name, 
            drug_id: obj[key][i].drug_id, 
            units: obj[key][i].units, 
            pack_size: pack_size, 
            am: obj[key][i].am, 
            noon: 'N/A', 
            pm: obj[key][i].pm
          }
          passedRegimens[key].push(drug);
        }
      }

      for(var key in passedRegimens){
        var regimen_name = key;
        var concept_names = [];
        for(var i = 0 ; i < passedRegimens[key].length ; i++){
          concept_names.push(passedRegimens[key][i].concept_name)
        }
        regimen_name += " (" + concept_names.join(" ") + ")";
        givenRegimens[regimen_name] = passedRegimens[key]; 
      }
      
      buildRegimenPage();
      preSelectRegimenSelection();
    }
  };
  
  xhttp.open("GET", url + "?weight=60.5", true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}


function preSelectRegimenSelection() {
  if(selectedRegimens) {
    var e = document.getElementById(selectedRegimens);
    selectRegimen(e);
  }
}

function validateRegimenSelection() {
  if(!selectedRegimens){
    showMessage("Please select one of regimens shown or<br />build your own by selecting: <b>Custom</b>");
    return;
  }

 gotoNextPage(); 
}

function validateIntervalSelection() {
  if(!setSelectedInterval){
    showMessage("Please select Interval to next visit");
    return;
  }

 gotoNextPage(); 
}

function getFullMonth(i) {
  var months = new Array();
  months[0] = "January";
  months[1] = "February";
  months[2] = "March";
  months[3] = "April";
  months[4] = "May";
  months[5] = "June";
  months[6] = "July";
  months[7] = "August";
  months[8] = "September";
  months[9] = "October";
  months[10] = "November";
  months[11] = "December";

  return months[i].substring(0,3);
}


/* ######### custom prescription page ######################### */
function showCustomPrescriptionPage() {
  return show_custom_regimens;
}

function removeCustomBtn() {
  var footer = document.getElementById("buttons");
  var btn = document.getElementById("customRegimen");
  footer.removeChild(btn);
}

function customRegimen() {
  show_custom_regimens = true;
  gotoNextPage();
}

function buildCustomPrescriptionPage() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage);
  frame.style = "height: 89%; width: 96%;";

  var nextBtn = document.getElementById("nextButton");
  nextBtn.style = "display: none;";

  var custom = document.createElement("div");
  custom.setAttribute("class","custom-regimens");
  frame.appendChild(custom);

  var customRow = document.createElement("div");
  customRow.setAttribute("class","custom-regimens-row");
  custom.appendChild(customRow);

  var cells = [["Medication","left"], ["Dosage","right"]];
  for(var i = 0 ; i < cells.length ; i++){
    var customCell = document.createElement("div");
    customCell.setAttribute("class","custom-regimens-cell");
    customCell.setAttribute("id","custom-regimens-cell-" + cells[i][1]);
    customCell.innerHTML = cells[i][0];
    customCell.setAttribute("onmousedown","selectView(this);");

    customRow.appendChild(customCell);
  }


  buildMainCustomContainer();
  var e = document.getElementById("custom-regimens-cell-left");
  selectView(e)
}

function buildMainCustomContainer() {
  var container = document.getElementById("inputFrame" + tstCurrentPage)
  var controllers = document.createElement("div");
  controllers.setAttribute("class","controllers-div");
  controllers.setAttribute("id","controllers-div");
  container.appendChild(controllers);
}

function medicationView() {
  controllers = document.getElementById("controllers-div");

  var table = document.createElement("table");
  table.setAttribute("class","medication-search");
  controllers.appendChild(table);
  
  var tr = document.createElement("tr");
  table.appendChild(tr);

  var td = document.createElement("td")
  td.setAttribute("id","search-results-td");

  var searchResults = document.createElement("div");
  searchResults.setAttribute("id","search-results");
  td.appendChild(searchResults);

  tr.appendChild(td);


  var td = document.createElement("td")
  td.setAttribute("id","selected-results-td");

  var selectedResults = document.createElement("div");
  selectedResults.setAttribute("id","selected-results");
  td.appendChild(selectedResults);

  tr.appendChild(td);




  var tr = document.createElement("tr");
  table.appendChild(tr);

  var td = document.createElement("td")
  td.setAttribute("id","keayboard-td");
  td.setAttribute("colspan", "2");
  tr.appendChild(td);

  addKeyBoard();  

}

function addKeyBoard() {
  var container = document.getElementById("keayboard-td");
  var e = document.createElement("div");
  e.setAttribute("class","search-results-keyboard");
  container.appendChild(e);

  var qwerty = [];
  qwerty.push(["q","w","e","r","t","y","u","i","o","p"]);
  qwerty.push(["a","s","d","f","g","h","j","k","l"]);
  qwerty.push(["Shift","z","x","c","v","b","n","m","Del.","Clear"]);



  for(var i = 0 ; i < qwerty.length; i++){
    var row = document.createElement("div");
    row.setAttribute("class","search-results-keyboard-row");

    for(var j = 0 ; j < qwerty[i].length; j++){
      var cell = document.createElement("div");
      cell.setAttribute("class","search-results-keyboard-cell");
      var span = document.createElement("span");
      span.setAttribute("class","keyboard-buttons");
      span.innerHTML = qwerty[i][j];
      span.setAttribute("onmousedown","setEnteredKey(this);");
      cell.appendChild(span);
      row.appendChild(cell);
    }
    e.appendChild(row);
  }

  var keyInput = document.createElement("input");
  keyInput.setAttribute("id","key-input");
  keyInput.setAttribute("type","hidden");

  e.appendChild(keyInput);
}

function selectView(e) {
  var main = document.getElementById("controllers-div");
  main.innerHTML = null;

  var cells = document.getElementsByClassName("custom-regimens-cell");
  for(var i = 0 ; i < cells.length ; i++){
    cells[i].setAttribute("class","custom-regimens-cell");
  }
  e.setAttribute("class", "custom-regimens-cell selected-bar");
  
  if(e.innerHTML == "Medication"){
    medicationView();
    displaySelected("selected-results");
  }else{
    dosageView();
    displaySelected("dosage-container-cell-left");
    checkIfDone();
  }


}

function setEnteredKey(key) {
  var inputBox = document.getElementById("key-input");

  try{

    if(key.innerHTML.match(/Del/i)){
      inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
    }else if(key.innerHTML.match(/Clear/i)){
      inputBox.value = null;
    }else{
      inputBox.value += key.innerHTML;
    }

  }catch(x) { }

  getMedication(inputBox.value);
}

function getMedication(search_str) {
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/drugs';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
      renderResults(objs);
    }
  };
  xhttp.open("GET", (url + "?name=" + search_str), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function renderResults(medication) {
  var resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = null;

  var ul = document.createElement("ul");
  ul.setAttribute("id", "results-ul");

  for(var i = 0 ; i < medication.length ; i++) {
    var li = document.createElement("li");
    li.innerHTML = medication[i].name;
    li.setAttribute("tstvalue", medication[i].name);
    li.setAttribute("class", "results-list");
    li.setAttribute("dose_strength", medication[i].dose_strength);
    li.setAttribute("units", medication[i].units);
    li.setAttribute("id", medication[i].drug_id);
    li.setAttribute("onmousedown", "null; updateSelection(this);");
    ul.appendChild(li);
  }

  resultsContainer.appendChild(ul);
}

var selected_meds = {};

function updateSelection(li) {
  var lists = document.getElementsByClassName("results-list");
  for(var i = 0 ; i < lists.length ; i++){
    lists[i].style = "background-color: none;";
  }

  li.style = "background-color: lightblue;";

  selected_meds[li.id] = {
    name: li.innerHTML, am: null,
    noon: null, pm: null,
    dose_strength: li.getAttribute("dose_strength"),
    units: li.getAttribute("units")
  };
  displaySelected("selected-results");

  var keyInput = document.getElementById("key-input");
  keyInput.value = null;
}

function displaySelected(container_name) {
  var mainContainer = document.getElementById(container_name);
  
  try{
    mainContainer.innerHTML = null;
  }catch(z){
  }

  var table = document.createElement("table");
  table.style = "width: 98%; margin: 5px; border-collapse: collapse;";

  for(var drug_id in selected_meds){
    var row = document.createElement("tr");

    row.setAttribute("id","row-" + drug_id);
    row.setAttribute("class","selected-meds-row");
    row.setAttribute("onmousedown","setDosage(this, '" + container_name + "');");
    table.appendChild(row);

    var td = document.createElement("td");
    td.setAttribute("style","width: 40px; padding: 5px 0px 5px 0px;");
    td.innerHTML = "&nbsp;"

    var img = document.createElement("img");
    img.setAttribute("src","../../../../assets/images/delete.png");
    img.setAttribute("id", drug_id);
    img.setAttribute("onmousedown", "deleteFromList(this,'" + container_name + "');");
    img.setAttribute("class","icons");
    td.appendChild(img);
    row.appendChild(td);

    var td = document.createElement("td");
    td.setAttribute("style"," padding: 5px 0px 5px 0px; font-family: 'Nimbus Sans L','Arial Narrow',sans-serif; font-size: 1.2em;");
    td.innerHTML = selected_meds[drug_id].name;
    row.appendChild(td);


  }

  mainContainer.appendChild(table);
}

function setDosage(e, container_name) {
  if(container_name != "dosage-container-cell-left")
    return;

  var rows = document.getElementsByClassName("selected-meds-row");
  for(var i = 0 ; i < rows.length ; i++){
    rows[i].style = "background-color: none; color: black;";
  }
  e.style = "color: black; background-color: #87ceeb;";
  resetDosageContainers();

  var drug_id = e.id.replace("row-","");

  try {
    document.getElementById("dosage-input-am").value      = selected_meds[drug_id].am;
    document.getElementById("dosage-input-noon").value    = selected_meds[drug_id].noon;
    document.getElementById("dosage-input-pm").value      = selected_meds[drug_id].pm;
  }catch(i) {}

}

function resetDosageContainers() {
  document.getElementById("dosage-input-am").value = null;
  document.getElementById("dosage-input-noon").value = null;
  document.getElementById("dosage-input-pm").value = null;
}

function deleteFromList(e, container_name) {
  delete selected_meds[e.id];
  displaySelected(container_name);

  if(container_name.match(/dosage-table-cell-left/i)){
    resetDosageContainers();
  }

  checkIfDone();
}

function dosageView() {
  var main = document.getElementById("controllers-div");

  var row = document.createElement("div");
  row.setAttribute("class","dosage-container-row");
  main.appendChild(row);

  var cells = ["left", "right"];
  for(var i = 0 ; i < cells.length ; i++){
    var cell = document.createElement("div");
    cell.setAttribute("class","dosage-container-cell");
    cell.setAttribute("id","dosage-container-cell-" + cells[i]);
    row.appendChild(cell);
  }

  addKeyPad();
}

function addKeyPad() {
  var main = document.getElementById("dosage-container-cell-right");

  var table = document.createElement("table");
  table.setAttribute("id","keypad-table");
  main.appendChild(table);

  var tr = document.createElement("tr");
  table.appendChild(tr);


  var tds = [["Am","morning.png"],["Noon","noon.png"], ["PM","evening.png"]];

  for(var i = 0 ; i < tds.length ; i++){

    var th = document.createElement("th");
    tr.appendChild(th);

    var img = document.createElement("img");
    img.setAttribute("src","../../../../assets/images/prescription/" + tds[i][1]);
    img.setAttribute("draggable", "false");
    img.setAttribute("class","icons");
    th.appendChild(img);

    var p = document.createElement("p");
    p.innerHTML = tds[i][0];
    th.appendChild(p);

  }

  var tds = [["Am","morning.png"],["Noon","noon.png"], ["PM","evening.png"]];

  var tr = document.createElement("tr");
  table.appendChild(tr);

  for(var i = 0 ; i < tds.length ; i++){
    var td = document.createElement("td");
    td.setAttribute("class","text-inputs-tds");

    var inputBox = document.createElement("input");
    inputBox.setAttribute("class","dosage-inputs");
    inputBox.setAttribute("id","dosage-input-" + tds[i][0].toLowerCase());

    inputBox.setAttribute("onfocus","setKeyPadFocus(this)")
    //inputBox.setAttribute("id","text-" + tds[i][0].toLowerCase());


    td.appendChild(inputBox);

    tr.appendChild(td);
  }

  var tr = document.createElement("tr");
  table.appendChild(tr);

  var td = document.createElement("td")
  td.setAttribute("colspan", "3");
  td.setAttribute("id","keypad-td");
  tr.appendChild(td)


  createKeyPad();
}

function createKeyPad() {
  var e = document.getElementById("keypad-td");

  var table = document.createElement('table');
  table.setAttribute("class","prescription-keypad");

  /* ........................................ */
  /* ........................................ */

  var keypad_attributes = [];
  keypad_attributes.push([1,2,3]);
  keypad_attributes.push([4,5,6]);
  keypad_attributes.push([7,8,9]);
  keypad_attributes.push(["Del.",0,"."]);
  //keypad_attributes.push(["Clear","%","/"]);

  for(var i = 0 ; i < keypad_attributes.length ; i++) {
    var tr = document.createElement("tr");
    table.appendChild(tr);

    for(var j = 0 ; j < keypad_attributes[i].length ; j++){
      var td = document.createElement('td');
      tr.appendChild(td);

      var span = document.createElement('span');
      span.setAttribute("class","keypad-buttons");
      span.setAttribute("onmousedown","enterKeypadValue(this);");
      span.innerHTML = keypad_attributes[i][j];
      td.appendChild(span);
    }
  }

  e.appendChild(table);

}

function enterKeypadValue(key) {
}


function setKeyPadFocus(e) {
  var keys = document.getElementsByClassName("keypad-buttons");

  for(var i = 0 ; i < keys.length ; i++){
    keys[i].setAttribute("onmousedown", "dosageEntered(this,'" + e.id + "');");
  }

}

var rowSelected;

function dosageEntered(key, text_box_id){
  var inputBox = document.getElementById(text_box_id);
  rowSelected = getRowSelected();

  if(!rowSelected)
    return;

  var drug_id = rowSelected.id.replace("row-","");

  try{

    if(key.innerHTML.match(/Del/i)){
      inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
    }else if(key.innerHTML.match(/Clear/i)){
      inputBox.value = null;
    }else{
      inputBox.value += key.innerHTML;
    }

    if(text_box_id.match(/am/i)){
      selected_meds[drug_id].am = inputBox.value;
    }else if(text_box_id.match(/noon/i)){
      selected_meds[drug_id].noon = inputBox.value;
    }else if(text_box_id.match(/pm/i)){
      selected_meds[drug_id].pm = inputBox.value;
    }
  }catch(x) { }

  checkIfDone();
}

function getRowSelected(){
  var rows = document.getElementsByClassName("selected-meds-row");
  var row = null;
  for(var i = 0 ; i < rows.length ; i++){
    var styles = rows[i].style.backgroundColor;
    if(styles == "rgb(135, 206, 235)")
      row = rows[i];

  }
  return row;
}

function checkIfDone() {
  var done = false
  var nextBtn = document.getElementById("nextButton");
  
  for(var drug_id in selected_meds) {
    var am    = selected_meds[drug_id].am;
    var noon  = selected_meds[drug_id].noon;
    var pm    = selected_meds[drug_id].pm;

    if (!isNumeric(am) && isNumeric(noon) && isNumeric(pm)){
      done = false
      break;
    }

    if (isEmpty(am) || isEmpty(noon) || isEmpty(pm)){
      done = false
      break;
    }

    done = true;
  }

  if(!done){
    nextBtn.style = "display: none"; 
    //showMessage("Set medication dosage first<br />before going to Summary");
    return;
  }

  givenRegimens["Unknown regimen"] = [];

  for(var drug_id in selected_meds){
    var med = {
      concept_name: "Unknown",
      drug_name: selected_meds[drug_id].name, 
      am: selected_meds[drug_id].am,
      noon: selected_meds[drug_id].noon,
      pm: selected_meds[drug_id].pm,
      drug_id: drug_id,
      units:  selected_meds[drug_id].units,
      pack_size: 30
    }

    selectedRegimens = "Unknown regimen";
    givenRegimens["Unknown regimen"].push(med);
  }

  nextBtn.style = "display: inline"; 
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmpty(str){
  try {
    return (str.replace(/\s+/g, '').length < 1);
  }catch(e){
    return true;
  }
}

function resetCustomRegimens() {
  if(selectedRegimens != "Unknown regimen"){
    return;
  }

  selectedRegimens = null;
  show_custom_regimens = false;
  givenRegimens["Unknown regimen"] = null;

  var originalRegimens = {};

  for(var regimen in givenRegimens){
    if(regimen == "Unknown regimen")
      continue;

    originalRegimens[regimen] = givenRegimens[regimen];
  }

  givenRegimens = originalRegimens;
  selected_meds = {};
}


    var patient_id = sessionStorage.patientID;
    
    function submitFastTrackAssesment() {

        var encounter = {
            encounter_type_id:  156,
            patient_id: patient_id,
            encounter_datetime: null
        }

        submitParameters(encounter, "/encounters", "postFastTrackAssesmentObs");
    }

    function submitRegimen(){
        var encounter = {
            encounter_type_id:  25,
            patient_id: patient_id,
            encounter_datetime: null
        }

        submitParameters(encounter, "/encounters", "postRegimenOrders");
    }

    function postRegimenOrders(encounter){
        var drug_orders_params = {encounter_id: encounter.encounter_id, drug_orders: []}
        var start_date = new Date();

        var start_date = new Date();
        var start_date_formated = getFormattedDate(start_date);
        var duration = parseInt(setSelectedInterval);
        var auto_expire_date = start_date.setDate(start_date.getDate() + duration);
        var auto_expire_date_formated = getFormattedDate(new Date(auto_expire_date));
        var drug_orders = givenRegimens[selectedRegimens];

        for (var i=0; i < drug_orders.length; i++){
            morning_tabs = parseFloat(drug_orders[i]["am"]);
            evening_tabs = parseFloat(drug_orders[i]["pm"]);
            frequency = "ONCE A DAY (OD)";
            equivalent_daily_dose = morning_tabs + evening_tabs;
            instructions = drug_orders[i].drug_name + ":- Morning: "  + morning_tabs + " tab(s), Evening: " + evening_tabs + " tabs";

            if (evening_tabs == 0){
                dose = morning_tabs;
            }

            if (morning_tabs == 0){
                dose = evening_tabs;
            }

            if (morning_tabs > 0 && evening_tabs > 0){
                frequency = "TWICE A DAY (BD)";
                dose = (morning_tabs + evening_tabs)/2;
            }

            drug_order = {
                drug_inventory_id: drug_orders[i].drug_id,
                dose: dose,
                equivalent_daily_dose: equivalent_daily_dose,
                frequency: frequency,
                start_date: start_date_formated,
                auto_expire_date: auto_expire_date_formated,
                instructions: instructions,
                units: drug_orders[i].units
            }

            drug_orders_params.drug_orders.push(drug_order);
        }


        submitParameters(drug_orders_params, "/drug_orders", "nextPage");
    }


    function postFastTrackAssesmentObs(encounter){
        var obs = {
            encounter_id: encounter.encounter_id,
            observations: [
                { concept_id: 9561, value_coded: assessForFastTrackAnswer() },
                { concept_id: 9533, value_coded: getFastTrackAssesmentAnswerConcept('Adult  18 years +') },
                { concept_id: 9534, value_coded: getFastTrackAssesmentAnswerConcept('On ART for 12 months +') },
                { concept_id: 9535, value_coded: getFastTrackAssesmentAnswerConcept('On 1<sup>st</sup> line ART') },
                { concept_id: 9537, value_coded: getFastTrackAssesmentAnswerConcept('Good current adherence') },
                { concept_id: 9536, value_coded: getFastTrackAssesmentAnswerConcept('Last VL <1000') },
                { concept_id: 9538, value_coded: getFastTrackAssesmentAnswerConcept('Pregnant / Breastfeeding') },
                { concept_id: 9539, value_coded: getFastTrackAssesmentAnswerConcept('Side effects / HIV-rel. diseases') },
                { concept_id: 9540, value_coded: getFastTrackAssesmentAnswerConcept('Needs BP / diabetes treatment') },
                { concept_id: 9527, value_coded: getFastTrackAssesmentAnswerConcept('Started IPT <12m ago') },
                { concept_id: 2186, value_coded: getFastTrackAssesmentAnswerConcept('Any sign for TB') }
            ]
        };

        submitParameters(obs, "/observations", "submitRegimen")
    }

    function assessForFastTrackAnswer(){
        value = __$("assess_for_ft").value;
        if (value.trim().toUpperCase() == "YES"){
            return 1065;
        } else {
            return 1066;
        }
    }

    function changeSubmitFunction(){
        var nextButton =  document.getElementById('nextButton');
        nextButton.onmousedown = function(){
            submitFastTrackAssesment();
            //submitRegimen();
        }
    }


    function getFastTrackAssesmentAnswerConcept(key){
        try{
            value = yesNo_Hash["Fast track"][key];

            if (value.match(/YES/i)){
                return "1065";
            } else {
                return "1066";
            }

        } catch(e){
            return "";
        }

    }

    function getFormattedDate(set_date) {
        var month = (set_date.getMonth() + 1);
        if(month < 10)
            month = "0" + month;

        var day = (set_date.getDate());
        if(day < 10)
            day = "0" + day;

        var year = (set_date.getFullYear());
        return year + "-" + month + "-" + day;
    }

    function nextPage(){
        nextEncounter(sessionStorage.patientID, 1);

    }

