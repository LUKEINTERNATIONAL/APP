var formattedDate = sessionStorage.sessionDate;
formattedDate = (new Date(formattedDate));
var sessionDate = new Date(moment(formattedDate).format('YYYY-MM-DD'));

var givenRegimens = {};
var passedRegimens = {};

var selectedRegimens
var setSelectedInterval;

var show_custom_regimens = false;
var prescribe_arv = false;
var prescribe_cpt = false;
var prescribe_ipt = false;
var medication_orders = {};

var starterPackSelected = false;


function buildRegimenPage() {
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "height: 89%; width: 96%;";
    document.getElementById("clearButton").style = "display: none;";

        starterPackSelected = false;

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
      td.setAttribute("onmousedown","selectRegimen(this);checkIfSwitchingRegimen(this);");
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

    //checkForPossibleSideEffects(e);
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
            packs = packs_rounded + 1; //parseInt(selectedMeds[i].pack_size)
        }


        estimated_packs.push([selectedMeds[i].drug_name, packs, pills_per_day]);
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

  if(!pelletsActivated){
    continueShowSelectedMeds();
    return;
  } 

  var regimen = parseInt(selectedRegimens, 10);
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += "/programs/1/pellets_regimen?regimen=" + regimen;
  url += "&patient_id=" + sessionStorage.patientID;
  url += "&use_pellets=true";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obj = JSON.parse(this.responseText);
      givenRegimens[selectedRegimens] = obj;
      continueShowSelectedMeds();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function continueShowSelectedMeds() {
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

    for (var drugName in medication_orders){
        var am_dose = medication_orders[drugName]["am"];
        var concept_id = medication_orders[drugName]["concept_id"];
        var drug_id = medication_orders[drugName]["drug_id"];
        var drug_name = medication_orders[drugName]["drug_name"];
        var pm_dose = medication_orders[drugName]["pm"];
        var units = medication_orders[drugName]["units"];

        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        /*if(selectedRegimens.split(" ")[0].match(/A/i)){
            tr.setAttribute("class","adult-category");
        }else if(selectedRegimens.split(" ")[0].match(/P/i)){
            tr.setAttribute("class","peads-category");
        }*/

        if (drug_name.match(/COTR/i)){
            if (drug_name.match(/120/)){
                tr.setAttribute("class","peads-category");
            } else {
                tr.setAttribute("class","adult-category");
            }
        }

        var td = document.createElement("td");
        td.innerHTML = drug_name;
        td.setAttribute("class","numbers");
        td.setAttribute("class","med-names");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = units;
        td.setAttribute("class","numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = am_dose;
        td.setAttribute("class","numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = "N/A";
        td.setAttribute("class","numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = pm_dose;
        td.setAttribute("class","numbers");
        tr.appendChild(td);
    }



}



/* ###################################################### */
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

    var innerHTML = "<tr><th>Medication run-out date:</th></tr>";
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

        var days;

        if(intervals[i].match(/week/i)){
            days = ((parseInt(intervals[i].split(" ")[0])*7))
        }else if (intervals[i].match(/days/i)){
            days = 4
        }else if (intervals[i].match(/month/i)){
            days = ((parseInt(intervals[i].split(" ")[0])* 28))
        }

        td.setAttribute("interval", days);
        if(starterPackSelected && !intervals[i].match(/week/i)) {
          td.setAttribute("class","interval-buttons interval-buttons-strike");
        }else{
          td.setAttribute("onmousedown","setNextInterval(this)");
          td.setAttribute("class","interval-buttons");
        }
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
    
    if(starterPackSelected){
      if(cells[0].getAttribute("interval") == setSelectedInterval){
          setNextInterval(cells[0]);
      }else if(setSelectedInterval){
          setNextInterval(cells[0]);
      }
    }else{

      for(var i = 0 ; i < cells.length ; i++){
          if(cells[i].getAttribute("interval") == setSelectedInterval)
              setNextInterval(cells[i]);

      }

    }
}

function adjustFrameHeight() {
    var frame = document.getElementById('inputFrame' + tstCurrentPage);
    frame.style = 'height: 89% !important; width: 96%;';

    var btn = document.getElementById("nextButton");
    btn.setAttribute("onmousedown","validateEntries();");
}

function validateEntries() {
    /*var inputBox = document.getElementById('touchscreenInput4');
    if(inputBox.value < 1){
        showMessage('Please select No/Yes from the list');
    }*/

    submitRegimen();
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

                    var drug_name = obj[key][i].drug_name
                    var alternative_drug_name = obj[key][i].alternative_drug_name
                    drug_name = alternative_drug_name == null ?  drug_name : alternative_drug_name;

                    var drug = {
                        drug_name: drug_name,
                        concept_name: obj[key][i].concept_name,
                        drug_id: obj[key][i].drug_id,
                        units: obj[key][i].units,
                        pack_size: pack_size,
                        am: obj[key][i].am,
                        noon: 'N/A',
                        pm: obj[key][i].pm,
                        alternative_drug_name: obj[key][i].alternative_drug_name
                    }
                    passedRegimens[key].push(drug);
                }
            }

            for(var key in passedRegimens){
                var regimen_name = key;
                var concept_names = [];
                for(var i = 0 ; i < passedRegimens[key].length ; i++){
                  var alternative_name = passedRegimens[key][i].alternative_drug_name;
                  var concept_name = passedRegimens[key][i].concept_name;
                  alternative_name = alternative_name == null ?  concept_name : alternative_name;
                  concept_names.push(alternative_name);
                }
                regimen_name += " (" + concept_names.join(" + ") + ")";
                givenRegimens[regimen_name] = passedRegimens[key];
            }

            buildRegimenPage();
            preSelectRegimenSelection();
        }
    };
    xhttp.open("GET", url + "?patient_id="+sessionStorage.patientID, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function getMedicationOrders() {
    var medication_order_date = new Date(sessionStorage.sessionDate);
    medication_order_date = medication_order_date.getFullYear() + "-" + (medication_order_date.getMonth() + 1) + "-" + medication_order_date.getDate()

    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/programs/1/patients/" + sessionStorage.patientID + "/dosages?date=" + medication_order_date;
    var medication_order_concept_id = 1282;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            medication_orders = JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

//getMedicationOrders();

function isARTPrescribed() {
    var todays_date = new Date(sessionStorage.sessionDate);
    todays_date = todays_date.getFullYear() + "-" + (todays_date.getMonth() + 1) + "-" + todays_date.getDate()
    var medication_order_concept_id = 1282;
    var antiretroviral_drugs_value_coded  = 1085;
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/observations?person_id=" + sessionStorage.patientID + "&concept_id=" + medication_order_concept_id + "&value_coded=" + antiretroviral_drugs_value_coded + "&obs_datetime=" + todays_date;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var art_prescription_obs = JSON.parse(this.responseText);
            if (art_prescription_obs.length > 0){
                prescribe_arv = true;
                return prescribe_arv
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

//isARTPrescribed();

function getCPTDosage() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/cpt_dosage/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            cpt_dosage = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", url + "?patient_id="+sessionStorage.patientID, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function getIPTDosage() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/ipd_dosage/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            ipt_dosage = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", url + "?patient_id="+sessionStorage.patientID, true);
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

    child_bearing_client = false;

    child_bearing_client = checkIfChildBearing();

    if(child_bearing_client){
      showDTGwarning();
    }else{
      continueValidateRegimenSelection();
    }
}

function showDTGwarning() {
  var box = document.getElementById("confirmatory-test-popup-div");
  var cover = document.getElementById("confirmatory-test-cover");

  cover.style = "display: inline;";
  box.style = "display: inline;";

  box.innerHTML = null;
  
  var initiationBox = document.createElement('div');
  initiationBox.setAttribute('class','initiationBox');
  box.appendChild(initiationBox);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  var cssText ='text-align: center; color: brown;';
  cssText += 'font-size: 14pt;font-weight: bolder;';
  cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;border-color: black;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxCell.innerHTML = 'Use of DTG or EFV in women of reproductive age';
  initiationBoxRow.appendChild(initiationBoxCell);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  var text = '<span style="color: black;">There is currently <u>no confirmation</u>';
  text += '</span> that <b>DTG</b> is safe in <u>very early preganancy</u><br />';
  text += 'DTG-based regimens are therefore not used as standard 1st line regimens for ';
  text += '<u>girls and women</u> who may get preganant'
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  initiationBoxCell.innerHTML = text;
  
  var cssText = 'text-align: center; margin-top: 5%;';
  cssText += 'font-size: 25px;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxRow.appendChild(initiationBoxCell);



  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  box.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);


  var cells = ['Select another regimen','Continue with regimen'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.innerHTML = cells[i];
    buttonContainerCell.setAttribute('id','buttonContainerCell-blue');

    if(i == 0) {
      buttonContainerCell.setAttribute('onmousedown','cancelDTG();');
      buttonContainerCell.setAttribute('style','width: 100px;');
    }else{
      buttonContainerCell.setAttribute('onmousedown','cancelDTG();continueValidateRegimenSelection();');
      buttonContainerCell.setAttribute('style','background-color: tomato;width: 100px;');
    }
    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

function cancelDTG() {
  var box = document.getElementById("confirmatory-test-popup-div");
  var cover = document.getElementById("confirmatory-test-cover");
  box.innerHTML = null;

  box.style = "display: none;";
  cover.style = "display: none;";
}

function continueValidateRegimenSelection() {
    checkForPossibleSideEffects(selectedRegimens)
    checkIFStartPackApplies();
}

var pelletsActivated;

function checkIFRegimenHasLPv() {
  pelletsActivated = false;
  
  var regimen = parseInt(selectedRegimens, 10);
  var w = parseFloat(sessionStorage.currentWeight); 
  if (regimen == 11 || regimen == 9 && (w >= 3 && w <= 25) ) {
    buildPalletBox();
  }else{
    gotoNextPage();
  }
}

function buildPalletBox() {
  var box = document.getElementById("confirmatory-test-popup-div");
  var cover = document.getElementById("confirmatory-test-cover");

  box.style = "display: inline;";
  cover.style = "display: inline;";
  box.innerHTML = null;

  /* ################################### */
  document.getElementById('confirmatory-test-cover').style = 'display: inline;';

  var initiationBox = document.createElement('div');
  initiationBox.setAttribute('class','initiationBox');
  box.appendChild(initiationBox);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  var cssText ='text-align: center; color: brown;';
  cssText += 'font-size: 14pt;font-weight: bolder; border-color: black;';
  cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxCell.innerHTML = 'Pellets (cups) / Tabs';
  initiationBoxRow.appendChild(initiationBoxCell);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  var text = '<span style="color: black;">Prescribe LPV/r in <b>Pellets (cups)</b> or <b>Tablets</b>?</span> ';
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  initiationBoxCell.innerHTML = text;
  
  var cssText = 'text-align: center; margin-top: 5%;';
  cssText += 'font-size: 25px;';
  initiationBoxCell.setAttribute('style', cssText);
  initiationBoxRow.appendChild(initiationBoxCell);



  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  box.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);


  var cells = ['Pellets','Tabs'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];
    buttonContainerCell.setAttribute('id','buttonContainerCell-blue');

    buttonContainerRow.appendChild(buttonContainerCell);
    if(i == 0) {
      buttonContainerCell.setAttribute('onmousedown','prescribePelletsTabs("pellets");');
    }else{
      buttonContainerCell.setAttribute('onmousedown','prescribePelletsTabs("tabs");');
    }
    buttonContainerRow.appendChild(buttonContainerCell);
  }
  /* ################################## */
}

function prescribePelletsTabs(ans) {
  var box = document.getElementById("confirmatory-test-popup-div");
  var cover = document.getElementById("confirmatory-test-cover");
  box.innerHTML = null;
  box.style = "display: none;";
  cover.style = "display: none;";

  pelletsActivated = (ans == 'pellets' ? true : false); 
  gotoNextPage();
}

function checkIfChildBearing() {
  if(sessionStorage.patientGender == 'M')
    return false;

  var regimen = parseInt(selectedRegimens, 10);
  var client_age = parseInt(sessionStorage.patientAge);

  if(regimen >= 12 && (client_age >= 14 && client_age <= 45))
    return true

  return false
}

function validateIntervalSelection() {
    if(!setSelectedInterval){
        showMessage("Please select Interval to next visit");
        return;
    }

    prepareForSubmitting();
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
        var drug_name;
        try {
          if(medication[i].alternative_names.length > 0){
            drug_name = medication[i].alternative_names[0].name
          }else{
            continue;
            drug_name = medication[i].name;
          }
        }catch(x) {
          drug_name = medication[i].name;
        }
    
        var li = document.createElement("li");
        li.innerHTML = drug_name;
        li.setAttribute("tstvalue", drug_name);
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

function submitRegimen(){
    var currentTime = moment().format(' HH:mm:ss');
    var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
    encounter_datetime += currentTime;

    var encounter = {
        encounter_type_id:  25,
        patient_id: patient_id,
        encounter_datetime: encounter_datetime
    }

  if(appointment_type.length < 1){
    submitParameters(encounter, "/encounters", "postRegimenOrders");
  }else{
    submitParameters(encounter, "/encounters", "createAppointmentType");
  }
}

function createAppointmentType(encounter) {
  var obs = {
    encounter_id: encounter.encounter_id,
    observations: [
      { concept_id: 6784, value_text: appointment_type }
    ]
  }; 
  
  
  submitParameters(obs, "/observations", "postRegimenOrders");
}

function postRegimenOrders(encounter){
    if(!encounter.encounter_id){
      encounter_id = encounter[0].encounter_id;
    }else{
      encounter_id = encounter.encounter_id;
    }

    var drug_orders_params = {encounter_id: encounter_id, drug_orders: []}
    var start_date = new Date();

    var start_date = sessionDate;
    var start_date_formated = getFormattedDate(start_date);
    var duration = parseInt(setSelectedInterval);
    var auto_expire_date = start_date.setDate(start_date.getDate() + duration);
    var auto_expire_date_formated = getFormattedDate(new Date(auto_expire_date));
    var drug_orders = givenRegimens[selectedRegimens];
    if (!drug_orders){
         drug_orders = [];
    }

    for (var drugName in medication_orders){
        var am_dose = medication_orders[drugName]["am"];
        var drug_id = medication_orders[drugName]["drug_id"];
        var drug_name = medication_orders[drugName]["drug_name"];
        var pm_dose = medication_orders[drugName]["pm"];
        var units = medication_orders[drugName]["units"];

        var drug_order = {drug_name: drug_name, drug_id: drug_id, units: units, am: am_dose, pm: pm_dose}
        drug_orders.push(drug_order)
    }


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

    if(selectedSwitchReason.length > 0) {
      treatmentObs(drug_orders_params, "/drug_orders", "treatmentObs");
    }else{
      //submitParameters(drug_orders_params, "/drug_orders", "submitFastTrack");
      submitParameters(drug_orders_params, "/drug_orders", "nextPage");
    }
}

function treatmentObs(encounter) {
  var obs = {                                                                   
    encounter_id: encounter.encounter_id,                                    
    observations: [                                                             
      { concept_id: 1779, value_text:  selectedSwitchReason }
    ]                                                                           
  };                                                                            
                                                                                
  submitParameters(obs, "/observations", "nextPage")  
}

function submitFastTrack(e){
    var encounter = {
        encounter_type_id:  156,
        patient_id: patient_id,
        encounter_datetime: null
    }

    submitParameters(encounter, "/encounters", "postFastTrackAssesmentObs");
}

function postFastTrackAssesmentObs(encounter) {
    var obs = {
        encounter_id: encounter.encounter_id,
        observations: [
            { concept_id: 9561, value_coded: assessForFastTrackAnswer() }
        ]
    };

    submitParameters(obs, "/observations", "nextPage");
}

function assessForFastTrackAnswer(){
    value = __$("assess_for_ft").value;
    if (value.trim().toUpperCase() == "YES"){
        return 1065;
    } else {
        return 1066;
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

function getCurrentRegimen() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/";
    url +=  "programs/1/patients/" + sessionStorage.patientID + "?date=";
    url += moment(sessionDate).format('YYYY-MM-DD');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
          var data = JSON.parse(this.responseText);
          document.getElementById('current-regimen').innerHTML = data.current_regimen;
      }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function checkIfSwitchingRegimen(e) {
  var selectedRegimenIndex = parseInt(e.id.match(/\d+/)[0]);
  var current_regimen = document.getElementById('current-regimen');

  try {
    current_regimen = parseInt(current_regimen.innerHTML.match(/\d+/)[0]);
  }catch(i){
    current_regimen = selectedRegimenIndex;
  }

  if(selectedRegimenIndex != current_regimen){
    buildResonForSwitchinPopup();
  }else{
    selectedSwitchReason = '';
  }
}

function buildResonForSwitchinPopup() {
  var popBox = document.getElementById("confirmatory-test-popup-div");
  var popBoxCover = document.getElementById("confirmatory-test-cover");

  popBoxCover.style = "display: inline;";
  popBox.style = "display: inline;";

  popBox.innerHTML = null;
  
  var switchingTableTitle = document.createElement('div');
  switchingTableTitle.setAttribute('id','switching-table-caption');
  switchingTableTitle.innerHTML = "Reason for switching regimen"
  popBox.appendChild(switchingTableTitle);


  var switching_reasons = [
    'Reduce the number of pills, doses or drugs that are taken daily',
    'Improve side effects issues in the short- and long-term',
    'Ease possible drug-drug interactions','Ease swallowing',
    'Support the best use of meds during pregnancy',
    'Regimen not available / Expensive','Other'
  ];

  var switchingTable = document.createElement('div');
  switchingTable.setAttribute('class','switching-table');
  popBox.appendChild(switchingTable);

  for(var i = 0 ; i < switching_reasons.length ; i++){
    var switchingTableRow = document.createElement('div');
    switchingTableRow.setAttribute('class','switching-table-row');
    switchingTable.appendChild(switchingTableRow);

    var switchingTableCell = document.createElement('div');
    switchingTableCell.setAttribute('class','switching-table-cell switching-reasons');
    switchingTableCell.setAttribute('onclick','switchReason(this);');
    switchingTableCell.innerHTML = switching_reasons[i];
    switchingTableRow.appendChild(switchingTableCell);
  }

  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Cancel','Switch'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-lightblue');
      buttonContainerCell.setAttribute('onmousedown','cancelSwitch();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','switchMedication(this);');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

var selectedSwitchReason = '';

function cancelSwitch() {
  var current_regimen = document.getElementById('current-regimen');
  current_regimen = parseInt(current_regimen.innerHTML.match(/\d+/)[0]);

  var available_regimens = document.getElementsByClassName('regimen-names');
  var prev_regimen;

  for(var i = 0 ; i < available_regimens.length ; i++){
    var reg = parseInt(available_regimens[i].id.match(/\d+/)[0]);
    if(reg == current_regimen){
      prev_regimen = available_regimens[i];
    }
  }

  selectedSwitchReason = '';
  closePopUp();
  selectRegimen(prev_regimen);
}

function switchReason(e) {
  var reasons = document.getElementsByClassName('switching-reasons');
  for(var i = 0 ; i < reasons.length ; i++){
    reasons[i].style = "background-color: white;";
  }
    
  e.style = "background-color: lightblue;";
  selectedSwitchReason = e.innerHTML;
}

function switchMedication(e) {
  var reasons = document.getElementsByClassName('switching-reasons');
  var selection_made = false
  for(var i = 0 ; i < reasons.length ; i++){
    if(reasons[i].getAttribute('style'))
      selection_made = true;

  }

  if(selection_made){
    closePopUp();
  }
}

function prepareForSubmitting() {
  var btn = document.getElementById("nextButton");
  //btn.setAttribute("onmousedown","validateEntries();");

  var selectedARVs = givenRegimens[selectedRegimens];


  var order_date = new Date(sessionStorage.sessionDate);
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/";
  url += '/observations?person_id=' + sessionStorage.patientID;
  url += '&date=' + moment(order_date).format('YYYY-MM-DD') + '&page_size=1';
  url += '&concept_id=6987';


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var data = JSON.parse(this.responseText);
      var showSuggestion = false;

      for(var i = 0 ; i < selectedARVs.length ; i++){
        var selectedARV_id = selectedARVs[i].drug_id
        
        for(var x = 0 ; x < data.length ; x++){
          var pillCountDrugID = data[x].order.drug_order.drug_inventory_id;
          if(pillCountDrugID == selectedARV_id){
            showSuggestion = true;
            break;
          }
        }
            
        if(showSuggestion)
          break;

      }

      if(showSuggestion){
        buildSuggestion();
      }else{
        validateEntries();
      }
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function buildSuggestion() {
  document.getElementById('confirmatory-test-cover').style = 'display: inline;';
  var popBox = document.getElementById('confirmatory-test-popup-div');
  popBox.style = 'display: inline;';
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
  initiationBoxCell.innerHTML = 'Hanging pills recommendation';
  initiationBoxRow.appendChild(initiationBoxCell);

  var initiationBoxRow = document.createElement('div');
  initiationBoxRow.setAttribute('class','initiationBoxRow');
  initiationBox.appendChild(initiationBoxRow);

  var initiationBoxCell = document.createElement('div');
  var text = '<b style="color: green;">Use hanging pills to calculate next appoint date?</b> ';
  initiationBoxCell.setAttribute('class','initiationBoxCell');
  initiationBoxCell.innerHTML = text;
  
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


  var cells = ['NO','YES'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];
    buttonContainerCell.setAttribute('id','buttonContainerCell-blue');

    if(i == 0) {
      buttonContainerCell.setAttribute('onmousedown','useHangingPills("No");');
    }else{
      buttonContainerCell.setAttribute('onmousedown','useHangingPills("Yes");');
    }
    buttonContainerRow.appendChild(buttonContainerCell);
  }

}

var appointment_type = '';
function useHangingPills(ans) {
  appointment_type = (ans == 'Yes' ? 'Optimize - including hanging pills' : 'Exact - excluding hanging pills');
  closePopUp();
  validateEntries();
}
