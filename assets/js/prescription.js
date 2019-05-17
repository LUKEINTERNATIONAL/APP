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
var customRegimenIngredients = {};
var patient_is_fast_track = false;

var customListCSS = document.createElement('span');
customListCSS.innerHTML = "<style>\
.scrollableList li {\
  color: black;\
  list-style: none;\
  padding-left: 5px;\
  padding-right: 5px;\
  margin-top: 5px;\
  margin-bottom: 5px;\
  font-family: 'Nimbus Sans L','Arial Narrow',sans-serif;\
  font-size: 1.2em;\
}\
.scrollableList img {\
width: 45px;\
height: 45px;\
}\
.custom-regimen-th {\
  background-color: lightgray;\
}\
.custom-regimen-td {\
  border-style: solid;\
  border-width: 1px 0px 0px 0px;\
  text-align: center;\
}\
.dosage-inputs {\
  border: solid 1px;\
  height: 60px;\
  width: 60px;\
  background-color: lightgoldenrodyellow;\
}\
.custom-regimen-th img {\
  height: 40px;\
  width: 40px;\
}\
.keypad-buttons {\
  padding: 20% 0px 0px 0px;\
  float: left;\
  text-align: center;\
  margin-right: auto;\
  margin-left: auto;\
  display: block;\
  margin: 5px;\
  border: 1px solid #5ca6c4;\
  cursor: pointer;\
  /*box-shadow: inset 2px -4px 2px 0px;*/\
  background-color: white;\
  border-radius: 7px;\
  border: solid black 3px;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  border: 1px solid #7eb9d0;\
  -webkit-border-radius: 3px;\
  -moz-border-radius: 3px;\
  border-radius: 3px;\
  font-size: 23px;\
  font-family: arial, helvetica, sans-serif;\
  padding: 10px 10px 10px 10px;\
  text-decoration: none;\
  display: inline-block;\
  text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);\
  font-weight: bold;\
  color: #FFFFFF;\
  background-color: #a7cfdf;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#a7cfdf), to(#23538a));\
  background-image: -webkit-linear-gradient(top, #a7cfdf, #23538a);\
  background-image: -moz-linear-gradient(top, #a7cfdf, #23538a);\
  background-image: -ms-linear-gradient(top, #a7cfdf, #23538a);\
  background-image: -o-linear-gradient(top, #a7cfdf, #23538a);\
  background-image: linear-gradient(to bottom, #a7cfdf, #23538a);\
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a7cfdf, endColorstr=#23538a);\
  text-align: center;\
  width: 75px;\
  height: 65px;\
}\
#custom-keypad-container {\
  background-color: #F4F4F4;\
  border: 2px solid #E0E0E0;\
  border-radius: 15px;\
  padding: 5px;\
  position: absolute;\
  top: 60px;\
  width: 280px;\
  /*margin-left: 430px;*/\
  left: 39%;\
  z-index: 991;\
  }\
</style>";


function buildRegimenPage() {
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "height: 89%; width: 96%;";
    document.getElementById("clearButton").style = "display: none;";

    if(show_custom_regimens == true) {
      selectedRegimens = null;
      show_custom_regimens = false;
      getMedicationOrders();
    }

    starterPackSelected = false;
    customRegimenIngredients = {};

    var regimenContainer = document.createElement("div");
    regimenContainer.setAttribute("class", "regimen-container");
    frame.appendChild(regimenContainer);

    var regimenContainerRow = document.createElement("div");
    regimenContainerRow.setAttribute("class", "regimen-container-row");
    regimenContainer.appendChild(regimenContainerRow);


    var cells = ["left", "right"];

    for (var i = 0; i < cells.length; i++) {
        var regimenContainerCell = document.createElement("div");
        regimenContainerCell.setAttribute("class", "regimen-container-cell");
        regimenContainerCell.setAttribute("id", "regimen-container-" + cells[i]);
        regimenContainerRow.appendChild(regimenContainerCell);
        createContainers(cells[i]);
    }

    loadRegimens();
}

function loadRegimens() {
    for (var regimen in givenRegimens) {
        var regimen_num = parseInt(regimen.split(' ')[0]);
        var side = (regimen_num < 9 ? "left" : "right");
        var table = document.getElementById("regimen-table-" + side);

        var tr = document.createElement("tr");
        table.appendChild(tr);

        var td = document.createElement("td");
        td.setAttribute("class", "regimen-names");
        td.setAttribute("selected-regimen", regimen);
        td.setAttribute("id", regimen);
        //td.innerHTML = regimen;
        td.setAttribute("onmousedown", "selectRegimen(this);checkIfSwitchingRegimen(this);");
        addPrettyPrint(td, regimen);
        tr.appendChild(td);
    }

}

function addPrettyPrint(container, regimen) {
    var num = regimen.split(' ')[0];
    var medication = regimen.replace(num, '');

    var table = document.createElement('table');
    table.setAttribute('class', 'pretty-regimen-display');
    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    td.setAttribute('class', 'pretty-regimen-one');
    td.innerHTML = num;
    tr.appendChild(td);

    var td = document.createElement('td');
    td.innerHTML = medication;
    td.setAttribute('class', 'pretty-regimen-two');
    tr.appendChild(td);


    container.appendChild(table);
}

function selectRegimen(e) {
    var cells = document.getElementsByClassName("regimen-names");
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("style", "background-color: '';");
    }

    e.setAttribute("style", "background-color: lightblue;");
    selectedRegimens = e.getAttribute('selected-regimen');

    //checkForPossibleSideEffects(e);
}

function calculateEstimatedNextApp() {
    if (patient_is_fast_track) {
        var selectedMeds = medication_orders;
    } else {
        var selectedMeds = givenRegimens[selectedRegimens];
    }

    var set_date = null;

    set_date = sessionDate.getFullYear();
    var month = (sessionDate.getMonth() + 1);

    if (month.length < 2)
        month = "0" + month;

    set_date += "-" + month;

    var day = (sessionDate.getDate());
    if (day.length < 2)
        day = "0" + day;

    set_date += "-" + day;

    var appDate = new Date(set_date);
    appDate.setDate(appDate.getDate() + parseInt(setSelectedInterval));

    var estimated_packs = [];

    for (var i = 0; i < selectedMeds.length; i++) {
        var pills_per_day = 0;
        var am = 0;
        var noon = 0;
        var pm = 0;

        if (!isNaN(parseInt(selectedMeds[i].am)))
            am = parseFloat(selectedMeds[i].am);

        if (!isNaN(parseFloat(selectedMeds[i].noon)))
            noon = parseInt(selectedMeds[i].noon);

        if (!isNaN(parseFloat(selectedMeds[i].pm)))
            pm = parseInt(selectedMeds[i].pm);

        pills_per_day += (am + noon + pm);

        var set_pack_size;
        if (selectedMeds[i].pack_size == null) {
            try {
                set_pack_size = selectedMeds[i].barcodes[0].tabs;
            } catch (z) {
                set_pack_size = 30;
            }
        } else {
            set_pack_size = selectedMeds[i].pack_size;
        }

        var packs = ((pills_per_day * setSelectedInterval) / parseInt(set_pack_size));
        var pack_size_str = ("'" + packs + "'");
        var packs_rounded = packs;

        if (pack_size_str.match(/\./))
            packs_rounded = Math.round(packs)

        if (packs_rounded > packs) {
            packs = packs_rounded;
        } else {
            packs = packs_rounded + 1; //parseInt(selectedMeds[i].pack_size)
        }


        estimated_packs.push([selectedMeds[i].drug_name, packs, pills_per_day]);
    }

    var td = document.getElementById("estimated-next-appointment-date");
    td.innerHTML = appDate.getDate() + "/" + getFullMonth(appDate.getMonth()) + "/" + appDate.getFullYear();


    var td = document.getElementById("estimated-packs");
    var innerHTML = "";
    for (var i = 0; i < estimated_packs.length; i++) {
        innerHTML += estimated_packs[i][0] + "<span class='pack-sizes'>" + estimated_packs[i][1] + "</span><br />";
    }

    td.innerHTML = innerHTML;
}

function createContainers(side) {
    var container = document.getElementById("regimen-container-" + side);

    var table = document.createElement("table");
    table.setAttribute("class", "regimen-tables");
    table.setAttribute("id", "regimen-table-" + side);
    container.appendChild(table);
}

/* ########################################################################################### */

function showSelectedMeds() {

    if (!pelletsActivated) {
        continueShowSelectedMeds();
        return;
    }

    var regimen = parseInt(selectedRegimens, 10);
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
    url += "/programs/1/pellets_regimen?regimen=" + regimen;
    url += "&patient_id=" + sessionStorage.patientID;
    url += "&use_pellets=true";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var obj = JSON.parse(this.responseText);
            var drugs = [];
            
            for(var i = 0 ; i < obj.length ; i++) {        
              var drug = {
                drug_name: obj[i].drug_name,
                concept_name: obj[i].concept_name,
                drug_id: obj[i].drug_id,
                units: obj[i].units,
                pack_size: (obj[i].pack_size == null ? 1 : obj[i].pack_size),
                am: obj[i].am,
                noon: '0',
                pm: obj[i].pm,
                category: (obj[i].regimen_category != undefined ? obj[i].regimen_category : ''),
                alternative_drug_name: obj[i].alternative_drug_name
              }
              drugs.push(drug);
            }

            givenRegimens[selectedRegimens] = drugs;
            continueShowSelectedMeds();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function continueShowSelectedMeds() {
    var htn_drugs = []
    try {
        htn_drugs = JSON.parse(sessionStorage.htn_drugs)
    } catch (e) {

    }
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "height: 89%; width: 96%;";
    document.getElementById("clearButton").style = "display: none;";

    var table = document.createElement("table");
    table.setAttribute("id", "selected-medication");
    frame.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    tr.style = "background-color: lightgray;";
    thead.appendChild(tr);

    var theads = ["Drug name", "Units", "AM", "Noon", "PM"];
    for (var i = 0; i < theads.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = theads[i];
        if (i == 0)
            th.style = "text-align: left;"

        tr.appendChild(th);
    }

    /* .............................................Will clean up later */
    if (isHashEmpty(customRegimenIngredients) == false) {
        setCustomRegimen();
    }
    /* .............................................Will clean up later */

    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "selected-medication-tbody");
    table.appendChild(tbody);

    if (givenRegimens[selectedRegimens]) {
        var rows = givenRegimens[selectedRegimens];
        for (var i = 0; i < rows.length; i++) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);

            //console.log(rows[i])

            try {
              var category = rows[i].category;
              if (category.match(/A/i)) {
                  tr.setAttribute("class", "adult-category");
              } else if (category.match(/P/i)) {
                  tr.setAttribute("class", "peads-category");
              }
            }catch(q) {}

            var td = document.createElement("td");
            td.innerHTML = rows[i].drug_name;
            td.setAttribute("class", "numbers");
            td.setAttribute("class", "med-names");
            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML = rows[i].units;
            td.setAttribute("class", "numbers");
            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML = rows[i].am;
            td.setAttribute("class", "numbers");
            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML = rows[i].noon;
            td.setAttribute("class", "numbers");
            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML = rows[i].pm;
            td.setAttribute("class", "numbers");
            tr.appendChild(td);


        }

    }
        
    if(show_custom_regimens == true)
      medication_orders = {};

    for (var drugName in medication_orders) {
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

        if (drug_name.match(/COTR/i)) {
            if (drug_name.match(/120/)) {
                tr.setAttribute("class", "peads-category");
            } else {
                tr.setAttribute("class", "adult-category");
            }
        }

        var td = document.createElement("td");
        td.innerHTML = drug_name;
        td.setAttribute("class", "numbers");
        td.setAttribute("class", "med-names");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = units;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = am_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = "0";
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = pm_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);
    }

    for (var i = 0; i <= htn_drugs.length - 1; i++) {
        var am_dose = "0";
        var drug_id = htn_drugs[i]["drug_id"];
        var drug_name = htn_drugs[i]["name"];
        var pm_dose = "1";
        var units = "tabs(s)";

        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        var td = document.createElement("td");
        td.innerHTML = drug_name;
        td.setAttribute("class", "numbers");
        td.setAttribute("class", "med-names");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = units;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = am_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = "0";
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = pm_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);
    }
}

/* ###################################################### */
var setDataTable = null;

function initDataTable() {
    setDataTable = jQuery('#selected-medication').DataTable({
        fixedHeader: true,
        searching: false,
        paging: false,
        scroller: {
            loadingIndicator: true
        }
    });

    document.getElementById("selected-medication_info").style = "display: none;";
}

function buildNextIntervalPage() {
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "height: 89%; width: 96%;";

    var nextBtn = document.getElementById("nextButton");
    nextButton.setAttribute("onmousedown", "validateIntervalSelection();");

    var container = document.createElement("div");
    container.setAttribute("class", "next-interval-table");
    frame.appendChild(container);

    var containerRow = document.createElement("div");
    containerRow.setAttribute("class", "next-interval-table-row");
    container.appendChild(containerRow);

    var cells = ["left", "right"];

    for (var i = 0; i < cells.length; i++) {
        var containerCell = document.createElement("div");
        containerCell.setAttribute("class", "next-interval-table-cell");
        containerCell.setAttribute("id", "next-interval-table-" + cells[i]);
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
    innerHTML += "<tr><td id='estimated-next-appointment-date'>&nbsp;</th></tr>";
    innerHTML += "<tr><td class='separator-rows'>&nbsp;</td></tr>";
    innerHTML += "<tr><th>Estimated packs/tins:</th></tr>";
    innerHTML += "<tr><td id='estimated-packs'>&nbsp;</th></tr>";
    innerHTML += "<tr><td class='separator-rows'>&nbsp;</td></tr>";

    table.innerHTML = innerHTML;
    container.appendChild(table);
}

function addIntervals() {
    var container = document.getElementById("next-interval-table-left");
    var intervals = ["2 weeks", "1 month"]
    var count = 2;

    while (count < 13) {
        intervals.push(count + " months");
        count++;
    }

    var table = document.createElement("table");
    table.setAttribute("id", "intervals-table");
    var tr;

    for (var i = 0; i < intervals.length; i++) {
        if (isEven(i)) {
            tr = document.createElement("tr");
            table.appendChild(tr);
        }

        var td = document.createElement("td");

        var days;

        if (intervals[i].match(/week/i)) {
            days = ((parseInt(intervals[i].split(" ")[0]) * 7))
        } else if (intervals[i].match(/days/i)) {
            days = 4
        } else if (intervals[i].match(/month/i)) {
            days = ((parseInt(intervals[i].split(" ")[0]) * 28))
        }

        td.setAttribute("interval", days);
        if (starterPackSelected && !intervals[i].match(/week/i)) {
            td.setAttribute("class", "interval-buttons interval-buttons-strike");
        } else {
            td.setAttribute("onmousedown", "setNextInterval(this)");
            td.setAttribute("class", "interval-buttons");
        }
        td.innerHTML = intervals[i];
        tr.appendChild(td);

    }


    container.appendChild(table);
}

function setNextInterval(e) {
    var cells = document.getElementsByClassName("interval-buttons");
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("style", "background-color: '';");
    }

    e.setAttribute("style", "background-color: lightblue;");
    setSelectedInterval = e.getAttribute("interval");
    calculateEstimatedNextApp();
}

function preSelectInterval() {
    var cells = document.getElementsByClassName("interval-buttons");

    if (starterPackSelected) {
        if (cells[0].getAttribute("interval") == setSelectedInterval) {
            setNextInterval(cells[0]);
        } else if (setSelectedInterval) {
            setNextInterval(cells[0]);
        }
    } else {

        for (var i = 0; i < cells.length; i++) {
            if (cells[i].getAttribute("interval") == setSelectedInterval)
                setNextInterval(cells[i]);

        }

    }
}

function adjustFrameHeight() {
    var frame = document.getElementById('inputFrame' + tstCurrentPage);
    frame.style = 'height: 89% !important; width: 96%;';

    var btn = document.getElementById("nextButton");
    btn.setAttribute("onmousedown", "validateEntries();");
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
    customRgimen.setAttribute("onmousedown", "customRegimen();");
    customRgimen.setAttribute("id", "customRegimen");
    customRgimen.setAttribute("class", "button blue navButton");
    customRgimen.innerHTML = "<span>Custom regimen</span>";
    footer.appendChild(customRgimen);
    //show_custom_regimens = false;

    resetCustomRegimens();

    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/programs/1/regimens";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var obj = JSON.parse(this.responseText);

            for (var key in obj) {
                passedRegimens[key] = [];
                for (var i = 0; i < obj[key].length; i++) {
                    var pack_size = 30;

                    if (!isNaN(parseInt(obj[key][i].parseInt)))
                        pack_size = parseInt(obj[key][i].pack_size);

                    var drug_name = obj[key][i].drug_name
                    var alternative_drug_name = obj[key][i].alternative_drug_name
                    drug_name = alternative_drug_name == null ? drug_name : alternative_drug_name;
                      
                    var drug = {
                        drug_name: drug_name,
                        concept_name: obj[key][i].concept_name,
                        drug_id: obj[key][i].drug_id,
                        units: obj[key][i].units,
                        pack_size: pack_size,
                        am: obj[key][i].am,
                        noon: '0',
                        pm: obj[key][i].pm,
                        category: (obj[key][i].regimen_category != undefined ? obj[key][i].regimen_category : ''),
                        alternative_drug_name: obj[key][i].alternative_drug_name
                    }

                    passedRegimens[key].push(drug);
                }
            }

            for (var key in passedRegimens) {
                var regimen_name = key;
                var concept_names = [];
                for (var i = 0; i < passedRegimens[key].length; i++) {
                    var alternative_name = passedRegimens[key][i].alternative_drug_name;
                    var concept_name = passedRegimens[key][i].concept_name;
                    alternative_name = alternative_name == null ? concept_name : alternative_name;
                    concept_names.push(alternative_name);
                }
                regimen_name += " (" + concept_names.join(" + ") + ")";
                givenRegimens[regimen_name] = passedRegimens[key];
            }

            buildRegimenPage();
            preSelectRegimenSelection();
        }
    };
    xhttp.open("GET", url + "?patient_id=" + sessionStorage.patientID, true);
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
    xhttp.onreadystatechange = function () {
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
    var antiretroviral_drugs_value_coded = 1085;
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/observations?person_id=" + sessionStorage.patientID + "&concept_id=" + medication_order_concept_id + "&value_coded=" + antiretroviral_drugs_value_coded + "&obs_datetime=" + todays_date;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var art_prescription_obs = JSON.parse(this.responseText);
            if (art_prescription_obs.length > 0) {
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
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            cpt_dosage = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", url + "?patient_id=" + sessionStorage.patientID, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function getIPTDosage() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/ipd_dosage/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            ipt_dosage = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", url + "?patient_id=" + sessionStorage.patientID, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}


function preSelectRegimenSelection() {
    if (selectedRegimens) {
        var e = document.getElementById(selectedRegimens);
        selectRegimen(e);
    }
}

function validateRegimenSelection() {
    if (!selectedRegimens) {
        showMessage("Please select one of regimens shown or<br />build your own by selecting: <b>Custom</b>");
        return;
    }

    child_bearing_client = false;

    child_bearing_client = checkIfChildBearing();

    if (child_bearing_client) {
        showDTGwarning();
    } else {
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
    initiationBox.setAttribute('class', 'initiationBox');
    box.appendChild(initiationBox);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    var cssText = 'text-align: center; color: brown;';
    cssText += 'font-size: 14pt;font-weight: bolder;';
    cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;border-color: black;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxCell.innerHTML = 'Use of DTG or EFV in women of reproductive age';
    initiationBoxRow.appendChild(initiationBoxCell);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    var text = '<span style="color: black;">There is currently <u>no confirmation</u>';
    text += '</span> that <b>DTG</b> is safe in <u>very early preganancy</u><br />';
    text += 'DTG-based regimens are therefore not used as standard 1st line regimens for ';
    text += '<u>girls and women</u> who may get preganant'
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    initiationBoxCell.innerHTML = text;

    var cssText = 'text-align: center; margin-top: 5%;';
    cssText += 'font-size: 25px;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxRow.appendChild(initiationBoxCell);


    var buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'buttonContainer');
    box.appendChild(buttonContainer);

    var buttonContainerRow = document.createElement('div');
    buttonContainerRow.setAttribute('class', 'buttonContainerRow');
    buttonContainer.appendChild(buttonContainerRow);


    var cells = ['Select another regimen', 'Continue with regimen'];

    for (var i = 0; i < cells.length; i++) {
        var buttonContainerCell = document.createElement('div');
        buttonContainerCell.setAttribute('class', 'buttonContainerCell');
        buttonContainerCell.innerHTML = cells[i];
        buttonContainerCell.setAttribute('id', 'buttonContainerCell-blue');

        if (i == 0) {
            buttonContainerCell.setAttribute('onmousedown', 'cancelDTG();');
            buttonContainerCell.setAttribute('style', 'width: 100px;');
        } else {
            buttonContainerCell.setAttribute('onmousedown', 'cancelDTG();continueValidateRegimenSelection();');
            buttonContainerCell.setAttribute('style', 'background-color: tomato;width: 100px;');
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
    regimen_nine_or_eleven = (regimen == 11 || regimen == 9);
    if (regimen_nine_or_eleven && (w >= 3 && w <= 25)) {
        buildPalletBox();
    } else {
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
    initiationBox.setAttribute('class', 'initiationBox');
    box.appendChild(initiationBox);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    var cssText = 'text-align: center; color: brown;';
    cssText += 'font-size: 14pt;font-weight: bolder; border-color: black;';
    cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxCell.innerHTML = 'Pellets (cups) / Tabs';
    initiationBoxRow.appendChild(initiationBoxCell);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    var text = '<span style="color: black;">Prescribe LPV/r in <b>Pellets (cups)</b> or <b>Tablets</b>?</span> ';
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    initiationBoxCell.innerHTML = text;

    var cssText = 'text-align: center; margin-top: 5%;';
    cssText += 'font-size: 25px;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxRow.appendChild(initiationBoxCell);


    var buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'buttonContainer');
    box.appendChild(buttonContainer);

    var buttonContainerRow = document.createElement('div');
    buttonContainerRow.setAttribute('class', 'buttonContainerRow');
    buttonContainer.appendChild(buttonContainerRow);


    var cells = ['Pellets', 'Tabs'];

    for (var i = 0; i < cells.length; i++) {
        var buttonContainerCell = document.createElement('div');
        buttonContainerCell.setAttribute('class', 'buttonContainerCell');
        buttonContainerCell.setAttribute('style', 'width: 100px;');
        buttonContainerCell.innerHTML = cells[i];
        buttonContainerCell.setAttribute('id', 'buttonContainerCell-blue');

        buttonContainerRow.appendChild(buttonContainerCell);
        if (i == 0) {
            buttonContainerCell.setAttribute('onmousedown', 'prescribePelletsTabs("pellets");');
        } else {
            buttonContainerCell.setAttribute('onmousedown', 'prescribePelletsTabs("tabs");');
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
    if (sessionStorage.patientGender == 'M')
        return false;

    var regimen = parseInt(selectedRegimens, 10);
    var client_age = parseInt(sessionStorage.patientAge);

    if (regimen >= 12 && (client_age >= 14 && client_age <= 45))
        return true

    return false
}

function validateIntervalSelection() {
    if (!setSelectedInterval) {
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

    return months[i].substring(0, 3);
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

    var table = document.createElement('table');
    table.style = 'width: 100%;';
    frame.appendChild(table);

    var tr = document.createElement('tr');
    table.appendChild(tr);

    var cells = ['adults', 'peads'];
    for (var i = 0; i < cells.length; i++) {
        var td = document.createElement('td');
        td.setAttribute('id', cells[i] + '-meds');
        tr.appendChild(td);
    }

    addMedColumns();
    autoSelect();

    var nextButton = document.getElementById('nextButton');
    nextButton.setAttribute('onmousedown', 'validateCustomPrescription()');
}

function addMedColumns() {
    var adultDiv = document.createElement('div');
    adultDivCSS = 'overflow-x: hidden; height: 580px;';
    adultDivCSS += 'border: solid 1px;';
    adultDiv.setAttribute('style', adultDivCSS);
    adultDiv.setAttribute('class', 'scrollable');

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(customListCSS);

    var leftTD = document.getElementById('adults-meds');
    leftTD.appendChild(adultDiv);

    var ul = document.createElement('ul');
    ul.setAttribute('class', 'scrollableList');
    adultDiv.appendChild(ul);

    try {
        custom_regimen_ingredients = custom_regimen_ingredients.sort(function (a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
    } catch (x) {
    }

    for (var i = 0; i < custom_regimen_ingredients.length; i++) {

        var innerHTML = '<div style="display: table; border-spacing: 0px;"><div style="display: table-row"><div style="display: table-cell;"><img id="img';
        innerHTML += i + '" src="/public/touchscreentoolkit/lib/images/unticked.jpg" alt="[ ]"></div><div style="display: table-cell; vertical-align:      middle; text-align: left; padding-left: 15px;"';
        innerHTML += ' id="optionValue' + i + '">';
        innerHTML += custom_regimen_ingredients[i].name + "</div></div></div>";

        var li = document.createElement("li");
        li.setAttribute("id", i);
        li.setAttribute("tstvalue", custom_regimen_ingredients[i].drug_id);
        li.setAttribute("onmousedown", "null; updateCustomList(__$('optionValue' + this.id), this); ");
        li.setAttribute("style", "");
        var class_name = (i % 2 === 0 ? 'even' : 'odd');
        li.setAttribute("class", class_name + " custom-ingredients-list");
        li.setAttribute("drug_name", custom_regimen_ingredients[i].name);
        li.setAttribute("units", custom_regimen_ingredients[i].units);
        li.innerHTML = innerHTML;
        ul.appendChild(li);

        if (i == 40)
            break;

    }

    /* ............ */
    var peadsDiv = document.createElement('div');
    peadsDivCSS = 'overflow-x: hidden; height: 580px;';
    peadsDivCSS += 'border: solid 1px;';
    peadsDiv.setAttribute('style', adultDivCSS);
    peadsDiv.setAttribute('class', 'scrollable');

    var righTD = document.getElementById('peads-meds');
    righTD.appendChild(peadsDiv);

    var ul = document.createElement('ul');
    ul.setAttribute('class', 'scrollableList');
    peadsDiv.appendChild(ul);

    for (var i = 41; i < custom_regimen_ingredients.length; i++) {
        var class_name = (i % 2 === 0 ? 'even' : 'odd');

        var innerHTML = '<div style="display: table; border-spacing: 0px;"><div style="display: table-row"><div style="display: table-cell;"><img id="img';
        innerHTML += i + '" src="/public/touchscreentoolkit/lib/images/unticked.jpg" alt="[ ]"></div><div style="display: table-cell; vertical-align:      middle; text-align: left; padding-left: 15px;"';
        innerHTML += ' id="optionValue' + i + '">';
        innerHTML += custom_regimen_ingredients[i].name + "</div></div></div>";

        var li = document.createElement("li");
        li.setAttribute("id", i);
        li.setAttribute("tstvalue", custom_regimen_ingredients[i].drug_id);
        li.setAttribute("onmousedown", "null; updateCustomList(__$('optionValue' + this.id), this); ");
        li.setAttribute("style", "");
        li.setAttribute("units", custom_regimen_ingredients[i].units);
        li.setAttribute("drug_name", custom_regimen_ingredients[i].name);
        li.setAttribute("class", class_name + " custom-ingredients-list");
        li.innerHTML = innerHTML;
        ul.appendChild(li);

    }

    /* ............ */
}

function updateCustomList(e, element) {
    var selected = element.getAttribute('style');
    var img = document.getElementById('img' + element.id);

    if (selected.match(/lightblue/i)) {
        element.setAttribute("style", '');
        img.setAttribute('src', "/public/touchscreentoolkit/lib/images/unticked.jpg");

        var tempContainer = customRegimenIngredients;
        customRegimenIngredients = {}

        for (drug_id in tempContainer) {
            if (element.getAttribute('drug_name') != tempContainer[drug_id].name) {
                customRegimenIngredients[parseInt(drug_id)] = {
                    name: tempContainer[drug_id].name,
                    am: tempContainer[drug_id].am,
                    noon: tempContainer[drug_id].noon,
                    pm: tempContainer[drug_id].pm,
                    units: tempContainer[drug_id].units,
                    drug_id: drug_id
                }
            }
        }
    } else {
        element.setAttribute("style", 'background-color: lightblue');
        img.setAttribute('src', "/public/touchscreentoolkit/lib/images/ticked.jpg");

        if (customRegimenIngredients[parseInt(element.getAttribute('tstvalue'))] == undefined) {
            customRegimenIngredients[parseInt(element.getAttribute('tstvalue'))] = {
                name: element.getAttribute('drug_name'), drug_id: null,
                am: null, noon: null, pm: null, units: element.getAttribute('units')
            }
        }
    }

}

function isHashEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

var custom_regimen_ingredients = [];

function getMedication() {
    var url = apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/';
    url += 'programs/1/custom_regimen_ingredients';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var objs = JSON.parse(this.responseText);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].alternative_names.length == 0) {
                    var drug_name = objs[i].name;
                } else {
                    var drug_name = objs[i].alternative_names[0].short_name;
                }

                custom_regimen_ingredients.push({
                    name: drug_name, drug_id: objs[i].drug_id,
                    units: (objs[i].units.length < 1 ? '0' : objs[i].units)
                });
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

getMedication();

var selected_meds = {};

function checkIfDone() {
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmpty(str) {
    try {
        return (str.replace(/\s+/g, '').length < 1);
    } catch (e) {
        return true;
    }
}

function resetCustomRegimens() {
    if (selectedRegimens != "Unknown") {
        return;
    }

    selectedRegimens = null;
    //show_custom_regimens = false;
    customRegimenIngredients = {};
    givenRegimens["Unknown"] = null;

    var originalRegimens = {};

    for (var regimen in givenRegimens) {
        if (regimen == "Unknown")
            continue;

        originalRegimens[regimen] = givenRegimens[regimen];
    }

    givenRegimens = originalRegimens;
    selected_meds = {};
}


var patient_id = sessionStorage.patientID;

function submitRegimen() {
    var currentTime = moment().format(' HH:mm:ss');
    var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
    encounter_datetime += currentTime;

    var encounter = {
        encounter_type_id: 25,
        patient_id: patient_id,
        encounter_datetime: encounter_datetime
    }

    if (appointment_type.length < 1) {
        submitParameters(encounter, "/encounters", "treatmentObs");
    } else {
        submitParameters(encounter, "/encounters", "createAppointmentType");
    }
}

function createAppointmentType(encounter) {
    var obs = {
        encounter_id: encounter.encounter_id,
        observations: [
            {concept_id: 6784, value_text: appointment_type}
        ]
    };


    submitParameters(obs, "/observations", "treatmentObs");
}

function postRegimenOrders(encounter) {
    if (!encounter.encounter_id) {
        encounter_id = encounter[0].encounter_id;
    } else {
        encounter_id = encounter.encounter_id;
    }

    var drug_orders_params = {encounter_id: encounter_id, drug_orders: []}
    var start_date = new Date(sessionStorage.sessionDate);

    var start_date = sessionDate;
    var start_date_formated = getFormattedDate(start_date);
    var duration = parseInt(setSelectedInterval);
    var auto_expire_date = start_date.setDate(start_date.getDate() + duration);
    var auto_expire_date_formated = getFormattedDate(new Date(auto_expire_date));
    var drug_orders = givenRegimens[selectedRegimens];
    if (!drug_orders) {
        drug_orders = [];
    }
    var htn_drugs = []
    try {
        htn_drugs = JSON.parse(sessionStorage.htn_drugs)
    } catch (e) {

    }
    for (var i = 0; i <= htn_drugs.length - 1; i++) {
        var am_dose = "0";
        var drug_id = htn_drugs[i]["drug_id"];
        var drug_name = htn_drugs[i]["name"];
        var pm_dose = "1";
        var units = "tab(s)";

        var drug_order = {drug_name: drug_name, drug_id: drug_id, units: units, am: am_dose, pm: pm_dose}
        drug_orders.push(drug_order)
    }

    for (var drugName in medication_orders) {
        var am_dose = medication_orders[drugName]["am"];
        var drug_id = medication_orders[drugName]["drug_id"];
        var drug_name = medication_orders[drugName]["drug_name"];
        var pm_dose = medication_orders[drugName]["pm"];
        var units = medication_orders[drugName]["units"];

        var drug_order = {drug_name: drug_name, drug_id: drug_id, units: units, am: am_dose, pm: pm_dose}
        drug_orders.push(drug_order)
    }


    for (var i = 0; i < drug_orders.length; i++) {
        morning_tabs = parseFloat(drug_orders[i]["am"]);
        evening_tabs = parseFloat(drug_orders[i]["pm"]);
        frequency = "ONCE A DAY (OD)";
        equivalent_daily_dose = morning_tabs + evening_tabs;
        instructions = drug_orders[i].drug_name + ":- Morning: " + morning_tabs + " tab(s), Evening: " + evening_tabs + " tabs";

        if (evening_tabs == 0) {
            dose = morning_tabs;
        }

        if (morning_tabs == 0) {
            dose = evening_tabs;
        }

        if (morning_tabs > 0 && evening_tabs > 0) {
            frequency = "TWICE A DAY (BD)";
            dose = (morning_tabs + evening_tabs) / 2;
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

function treatmentObs(e) {
    if (selectedSwitchReason.length > 0) {
        try {
            var encounter_id = e.encounter_id;
            if (encounter_id == undefined) {
                encounter_id = e[0].encounter_id
            }
        } catch (i) {
        }

        var obs = {
            encounter_id: encounter_id,
            observations: [
                {concept_id: 1779, value_text: selectedSwitchReason}
            ]
        };

        submitParameters(obs, "/observations", "postRegimenOrders");
    } else {
        postRegimenOrders(e);
    }
}

function submitFastTrack(e) {
    var encounter = {
        encounter_type_id: 156,
        patient_id: patient_id,
        encounter_datetime: null
    }

    submitParameters(encounter, "/encounters", "postFastTrackAssesmentObs");
}

function postFastTrackAssesmentObs(encounter) {
    var obs = {
        encounter_id: encounter.encounter_id,
        observations: [
            {concept_id: 9561, value_coded: assessForFastTrackAnswer()}
        ]
    };

    submitParameters(obs, "/observations", "nextPage");
}

function assessForFastTrackAnswer() {
    value = __$("assess_for_ft").value;
    if (value.trim().toUpperCase() == "YES") {
        return 1065;
    } else {
        return 1066;
    }
}

function getFormattedDate(set_date) {
    var month = (set_date.getMonth() + 1);
    if (month < 10)
        month = "0" + month;

    var day = (set_date.getDate());
    if (day < 10)
        day = "0" + day;

    var year = (set_date.getFullYear());
    return year + "-" + month + "-" + day;
}

function nextPage() {
    // htn_drugs = JSON.parse(sessionStorage.htn_drugs)
    sessionStorage.removeItem("htn_drugs");
    nextEncounter(sessionStorage.patientID, 1);

}

function getCurrentRegimen() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/";
    url += "programs/1/patients/" + sessionStorage.patientID + "?date=";
    url += moment(sessionDate).format('YYYY-MM-DD');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
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
    } catch (i) {
        current_regimen = selectedRegimenIndex;
    }

    if (selectedRegimenIndex != current_regimen) {
        buildResonForSwitchinPopup();
    } else {
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
    switchingTableTitle.setAttribute('id', 'switching-table-caption');
    switchingTableTitle.innerHTML = "Main reason for regimen change"
    popBox.appendChild(switchingTableTitle);


    var switching_reasons = [
        'Policy change', 'Ease of administration (pill burden, swallowing)',
        'Drug drug interaction', 'Pregnancy intention',
        'Side effects', 'Treatment failure', 'Weight Change', 'Other'
    ];

    var res = switching_reasons;
    switching_reasons = [];
    for (var i = 0; i < res.length; i++) {
        if (sessionStorage.patientGender != 'F' && res[i] == 'Pregnancy intention')
            continue;

        switching_reasons.push(res[i]);
    }

    var switchingTable = document.createElement('div');
    switchingTable.setAttribute('class', 'switching-table');
    popBox.appendChild(switchingTable);

    for (var i = 0; i < switching_reasons.length; i++) {
        var switchingTableRow = document.createElement('div');
        switchingTableRow.setAttribute('class', 'switching-table-row');
        switchingTable.appendChild(switchingTableRow);

        var switchingTableCell = document.createElement('div');
        switchingTableCell.setAttribute('class', 'switching-table-cell switching-reasons');
        switchingTableCell.setAttribute('onclick', 'switchReason(this);');
        switchingTableCell.innerHTML = switching_reasons[i];
        switchingTableRow.appendChild(switchingTableCell);
    }

    var buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'buttonContainer');
    popBox.appendChild(buttonContainer);

    var buttonContainerRow = document.createElement('div');
    buttonContainerRow.setAttribute('class', 'buttonContainerRow');
    buttonContainer.appendChild(buttonContainerRow);

    var cells = ['Keep previous', 'Change'];

    for (var i = 0; i < cells.length; i++) {
        var buttonContainerCell = document.createElement('div');
        buttonContainerCell.setAttribute('class', 'buttonContainerCell');
        buttonContainerCell.setAttribute('style', 'width: 100px;');
        buttonContainerCell.innerHTML = cells[i];

        if (i == 0) {
            buttonContainerCell.setAttribute('id', 'buttonContainerCell-lightblue');
            buttonContainerCell.setAttribute('onmousedown', 'cancelSwitch();');
        } else if (i == 1) {
            buttonContainerCell.setAttribute('id', 'buttonContainerCell-blue');
            buttonContainerCell.setAttribute('onmousedown', 'switchMedication(this);');
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

    for (var i = 0; i < available_regimens.length; i++) {
        var reg = parseInt(available_regimens[i].id.match(/\d+/)[0]);
        if (reg == current_regimen) {
            prev_regimen = available_regimens[i];
        }
    }

    selectedSwitchReason = '';
    closePopUp();
    selectRegimen(prev_regimen);
}

function switchReason(e) {
    var reasons = document.getElementsByClassName('switching-reasons');
    for (var i = 0; i < reasons.length; i++) {
        reasons[i].style = "background-color: white;";
    }

    e.style = "background-color: lightblue;";
    selectedSwitchReason = e.innerHTML;
}

function switchMedication(e) {
    var reasons = document.getElementsByClassName('switching-reasons');
    var selection_made = false
    for (var i = 0; i < reasons.length; i++) {
        if (reasons[i].getAttribute('style'))
            selection_made = true;

    }

    if (selection_made) {
        closePopUp();
    }
}

function prepareForSubmitting() {
    var btn = document.getElementById("nextButton");
    //btn.setAttribute("onmousedown","validateEntries();");

    if (patient_is_fast_track) {
        var selectedARVs = medication_orders;
    } else {
        var selectedARVs = givenRegimens[selectedRegimens];
    }


    var order_date = new Date(sessionStorage.sessionDate);
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/";
    url += '/observations?person_id=' + sessionStorage.patientID;
    url += '&date=' + moment(order_date).format('YYYY-MM-DD') + '&page_size=1';
    url += '&concept_id=6987';


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var data = JSON.parse(this.responseText);
            var showSuggestion = false;

            for (var i = 0; i < selectedARVs.length; i++) {
                var selectedARV_id = selectedARVs[i].drug_id

                for (var x = 0; x < data.length; x++) {
                    var pillCountDrugID = data[x].order.drug_order.drug_inventory_id;
                    if (pillCountDrugID == selectedARV_id) {
                        showSuggestion = true;
                        break;
                    }
                }

                if (showSuggestion)
                    break;

            }

            if (showSuggestion) {
                buildSuggestion();
            } else {
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
    initiationBox.setAttribute('class', 'initiationBox');
    popBox.appendChild(initiationBox);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    var cssText = 'text-align: center; color: rgb(255, 165, 0);';
    cssText += 'font-size: 14pt;font-weight: bolder;';
    cssText += 'border-width: 0px 0px 1px 0px;border-style: solid;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxCell.innerHTML = 'Hanging pills recommendation';
    initiationBoxRow.appendChild(initiationBoxCell);

    var initiationBoxRow = document.createElement('div');
    initiationBoxRow.setAttribute('class', 'initiationBoxRow');
    initiationBox.appendChild(initiationBoxRow);

    var initiationBoxCell = document.createElement('div');
    var text = '<b style="color: green;">Add hanging pills?</b> ';
    initiationBoxCell.setAttribute('class', 'initiationBoxCell');
    initiationBoxCell.innerHTML = text;

    var cssText = 'text-align: center; margin-top: 5%;';
    cssText += 'font-size: 25px;';
    initiationBoxCell.setAttribute('style', cssText);
    initiationBoxRow.appendChild(initiationBoxCell);


    var buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'buttonContainer');
    popBox.appendChild(buttonContainer);

    var buttonContainerRow = document.createElement('div');
    buttonContainerRow.setAttribute('class', 'buttonContainerRow');
    buttonContainer.appendChild(buttonContainerRow);


    var cells = ['NO', 'YES'];

    for (var i = 0; i < cells.length; i++) {
        var buttonContainerCell = document.createElement('div');
        buttonContainerCell.setAttribute('class', 'buttonContainerCell');
        buttonContainerCell.setAttribute('style', 'width: 100px;');
        buttonContainerCell.innerHTML = cells[i];
        buttonContainerCell.setAttribute('id', 'buttonContainerCell-blue');

        if (i == 0) {
            buttonContainerCell.setAttribute('onmousedown', 'useHangingPills("No");');
        } else {
            buttonContainerCell.setAttribute('onmousedown', 'useHangingPills("Yes");');
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

function buildCustomDosagePage() {
    var f = document.getElementById('inputFrame' + tstCurrentPage);
    f.style = 'width: 96%; height: 88%;'

    var nextBtn = document.getElementById("nextButton");
    nextButton.setAttribute("onmousedown", "validateCustomPrescriptionDosageInputs();");

    var table = document.createElement('table');
    var tableCSS = 'width: 100%; font-size: 16px;';
    tableCSS += 'border-collapse: collapse';
    table.style = tableCSS;
    f.appendChild(table);
    var tr = document.createElement('tr');
    table.appendChild(tr);

    var ths = [
        ['Medication', null],
        ['Morning', '/assets/images/prescription/morning.png'],
        ['Noon', '/assets/images/prescription/noon.png'],
        ['Evening', '/assets/images/prescription/evening.png']
    ];

    for (var i = 0; i < ths.length; i++) {
        var th = document.createElement('th');
        th.setAttribute('class', 'custom-regimen-th');

        if (ths[i][1] != null) {
            var img = document.createElement('img');
            img.setAttribute('src', ths[i][1]);
            th.appendChild(img);
        }

        var span = document.createElement('span');
        span.innerHTML = '<br />' + ths[i][0];
        th.appendChild(span);

        if (i == 0)
            th.style = 'text-align: left; marging-left: 5px;'

        tr.appendChild(th)
    }

    for (var drug_id in customRegimenIngredients) {
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.setAttribute('class', 'custom-regimen-td');
        td.innerHTML = customRegimenIngredients[drug_id].name;
        td.style = 'text-align: left; marging-left: 5px;'
        tr.appendChild(td);

        var td = document.createElement('td');
        td.setAttribute('class', 'custom-regimen-td');
        var input = document.createElement('input');
        input.setAttribute('id', 'am-' + drug_id);
        input.setAttribute('type', 'text');
        input.setAttribute('onmousedown', 'enterCustomDosage(this)');
        input.setAttribute('class', 'dosage-inputs');
        //input.disabled = true;
        td.appendChild(input);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.setAttribute('class', 'custom-regimen-td');
        var input = document.createElement('input');
        input.setAttribute('id', 'noon-' + drug_id);
        input.setAttribute('type', 'text');
        input.setAttribute('onmousedown', 'enterCustomDosage(this)');
        input.setAttribute('class', 'dosage-inputs');
        //input.disabled = true;
        td.appendChild(input);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.setAttribute('class', 'custom-regimen-td');
        var input = document.createElement('input');
        input.setAttribute('id', 'pm-' + drug_id);
        input.setAttribute('type', 'text');
        input.setAttribute('class', 'dosage-inputs');
        input.setAttribute('onmousedown', 'enterCustomDosage(this)');
        td.appendChild(input);
        //input.disabled = true;
        tr.appendChild(td);
        table.appendChild(tr);
    }

    autoInput();
}

function enterCustomDosage(e) {
    document.getElementById('confirmatory-test-cover').style = 'display: inline;';
    var keypadDIV = document.createElement('div');
    keypadDIV.setAttribute('id', 'custom-keypad-container');
    createKeyPad(keypadDIV, e);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(keypadDIV);

}

function createKeyPad(e, cell) {
    var table = document.createElement('table');
    table.setAttribute("class", "prescription-keypad");

    var tr = document.createElement('tr');
    table.appendChild(tr);
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'custom-input-box');
    input.setAttribute('style', 'width: 100%;height: 70px;text-align: center;font-size: 50px;');
    var td = document.createElement('td');
    td.setAttribute('colspan', 3);
    td.appendChild(input);
    tr.appendChild(td);
    /* ........................................ */
    /* ........................................ */
    var keypad_attributes = [];
    keypad_attributes.push([1, 2, 3]);
    keypad_attributes.push([4, 5, 6]);
    keypad_attributes.push([7, 8, 9]);
    keypad_attributes.push([".", 0, "Del."]);
    keypad_attributes.push(["Done"]);
    //keypad_attributes.push(["Clear","%","/"]);

    for (var i = 0; i < keypad_attributes.length; i++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        for (var j = 0; j < keypad_attributes[i].length; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);

            var span = document.createElement('span');
            span.setAttribute("class", "keypad-buttons");
            span.setAttribute("onmousedown", "enterKeypadValue(this,'" + cell.id + "');");
            span.innerHTML = keypad_attributes[i][j];
            td.appendChild(span);

            if (keypad_attributes[i][j] == 'Done') {
                td.setAttribute('colspan', 3);
                span.setAttribute('id', 'add-custom-dose');
                span.setAttribute('style', 'width: 95%;');
            }
        }
    }

    e.appendChild(table);

}

function enterKeypadValue(e, cell_id) {
    var inputBox = document.getElementById('custom-input-box');
    var inputCELL = document.getElementById(cell_id);

    try {

        if (e.innerHTML.match(/Del/i)) {
            inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
        } else if (e.innerHTML.match(/Clear/i)) {
            inputBox.value = null;
            removeFromHash();
        } else if (e.innerHTML.match(/Done/i)) {
            closeCustomBox();
        } else {
            inputBox.value += e.innerHTML;
        }

    } catch (x) {
    }

    inputCELL.value = inputBox.value;
}

function closeCustomBox() {
    document.getElementById('confirmatory-test-cover').style = 'display: none;';
    var body = document.getElementsByTagName('body')[0];
    var div = document.getElementById('custom-keypad-container');
    body.removeChild(div);
}

function autoSelect() {
    var list = document.getElementsByClassName('custom-ingredients-list');
    for (var drug_id in customRegimenIngredients) {
        for (var i = 0; i < list.length; i++) {
            var liID = parseInt(list[i].getAttribute('tstvalue'));
            if (liID == parseInt(drug_id)) {
                updateCustomList(__$('optionValue' + list[i].id), list[i]);
            }
        }
    }
}

function validateCustomPrescription() {
    if (isHashEmpty(customRegimenIngredients)) {
        showMessage('Select one or more medications to continue.');
        return;
    }

    gotoNextPage();
}

function validateCustomPrescriptionDosageInputs() {
    var inputBoxes = document.getElementsByClassName('dosage-inputs');
    for (var i = 0; i < inputBoxes.length; i++) {
        if (isNumeric(inputBoxes[i].value) == false) {
            showMessage('Make sure all input boxes are filled correctly.<br />Enter valid numbers e.g; 1 or 2.5')
            return;
        } else {
            var drug_id = parseInt(inputBoxes[i].id.split('-')[1]);
            var period = inputBoxes[i].id.split('-')[0];
            customRegimenIngredients[drug_id][period] = parseFloat(inputBoxes[i].value);
        }
    }

    selectedRegimens = null;
    gotoNextPage();
}

function autoInput() {
    var list = document.getElementsByClassName('dosage-inputs');

    for (var drug_id in customRegimenIngredients) {
        for (var i = 0; i < list.length; i++) {
            var inID = parseInt(list[i].id.split('-')[1]);
            var period = list[i].id.split('-')[0];
            if (customRegimenIngredients[drug_id][period] != null && drug_id == inID) {
                list[i].value = customRegimenIngredients[drug_id][period];
            }
        }
    }
}

function setCustomRegimen() {
    selectedRegimens = 'Unknown';
    givenRegimens[selectedRegimens] = [];

    for (var drug_id in customRegimenIngredients) {
        givenRegimens['Unknown'].push({
            drug_name: customRegimenIngredients[drug_id].name,
            units: customRegimenIngredients[drug_id].units,
            am: customRegimenIngredients[drug_id].am,
            noon: customRegimenIngredients[drug_id].noon,
            pm: customRegimenIngredients[drug_id].pm,
            drug_id: drug_id
        });
    }
}

function getReasonForSwitch() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/observations";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var obs = JSON.parse(this.responseText);
            if (obs.length > 0) {
                document.getElementById('reason-for-change').innerHTML = obs[0].value_text;
            }
        }
    };
    xhttp.open("GET", url + "?concept_id=1779&person_id=" + sessionStorage.patientID, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

var fast_track_medications = [];

function loadFastTrackMedications() {
    if (patient_is_fast_track) {
        sessionStorage.setItem("fast_track_visit", "true");
        var session_date = moment(new Date(sessionStorage.sessionDate)).format('YYYY-MM-DD');
        var last_drugs_received_url = 'http://' + apiURL + ':' + apiPort + '/api/v1/patients/';
        last_drugs_received_url += sessionStorage.patientID + "/last_drugs_received?date=" + session_date + "?program_id=" + sessionStorage.programID;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
                var last_drugs_received = JSON.parse(this.responseText);
                var last_drugs_received_dosages = [];
                for (var key in last_drugs_received) {
                    last_drugs_received_dosages.push(last_drugs_received[key]["dosage_struct"]);
                }
                fast_track_medications = last_drugs_received_dosages;
                medication_orders = fast_track_medications;
                //selectedMeds = medication_orders;
                buildFastTrackMedicationTable(fast_track_medications);
            }
        };

        xhttp.open("GET", last_drugs_received_url, true);
        xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
        xhttp.setRequestHeader('Content-type', "application/json");
        xhttp.send();
    }
}

function buildFastTrackMedicationTable(){

    selectedMedicationDiv = document.getElementById("selected-medication");
    if (selectedMedicationDiv){
        selectedMedicationDiv.parentNode.removeChild(selectedMedicationDiv);
    }
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "height: 89%; width: 96%;";
    document.getElementById("clearButton").style = "display: none;";

    var table = document.createElement("table");
    table.setAttribute("id", "selected-medication");
    frame.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    tr.style = "background-color: lightgray;";
    thead.appendChild(tr);

    var theads = ["Drug name", "Units", "AM", "Noon", "PM"];
    for (var i = 0; i < theads.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = theads[i];
        if (i == 0)
            th.style = "text-align: left;"

        tr.appendChild(th);
    }


    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "selected-medication-tbody");
    table.appendChild(tbody);

    for (var drugName in medication_orders) {
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

        if (drug_name.match(/COTR/i)) {
            if (drug_name.match(/120/)) {
                tr.setAttribute("class", "peads-category");
            } else {
                tr.setAttribute("class", "adult-category");
            }
        }

        var td = document.createElement("td");
        td.innerHTML = drug_name;
        td.setAttribute("class", "numbers");
        td.setAttribute("class", "med-names");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = units;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = am_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = "0";
        td.setAttribute("class", "numbers");
        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = pm_dose;
        td.setAttribute("class", "numbers");
        tr.appendChild(td);
    }
}
