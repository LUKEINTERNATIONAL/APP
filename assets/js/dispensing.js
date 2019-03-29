var fetchedPrescriptions;
var ordersToPost;

function addModalDiv() {
    var iFrame = document.getElementById("inputFrame" + tstCurrentPage);
    var modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.setAttribute("id", "prescription-modal");
    modal.setAttribute("data-backdrop", "static");
    iFrame.appendChild(modal);

    var modal_content = document.createElement("div");
    modal_content.setAttribute("class", "modal-content");
    modal_content.setAttribute("id", "prescription-modal-content");
    modal.appendChild(modal_content)
}

function dispensingPage() {
    var iFrame = document.getElementById("inputFrame" + tstCurrentPage);
    var helpText = document.getElementById("helpText" + tstCurrentPage);
    iFrame.style = "height: 95%; width: 96%;";
    helpText.style = "display: none;";

    var demographics = document.createElement("div");
    demographics.setAttribute("class", "demographics-table");

    var demographics_row = document.createElement("div");
    demographics_row.setAttribute("class", "demographics-table-row");
    demographics.appendChild(demographics_row);

    var cells = ["left", "right"];
    for (var i = 0; i < cells.length; i++) {
        var demographics_cell = document.createElement("div");
        demographics_cell.setAttribute("class", "demographics-table-cell");
        demographics_cell.setAttribute("id", "demographics-table-" + cells[i]);
        demographics_row.appendChild(demographics_cell);
    }

    iFrame.appendChild(demographics)
    buildDemographicsTable()

    buildMainControllers();

    addModalDiv();
}

function buildDemographicsTable() {
    mainContainer = document.getElementById("demographics-table-left");
    var table = document.createElement("table");
    table.setAttribute("class", "demographics-table-data");

    var tr = document.createElement("tr");
    table.appendChild(tr);

    var td = document.createElement("td");
    td.setAttribute("class", "names");
    td.setAttribute("id", "gender-icon-td");
    var img = document.createElement("img");
    if (sessionStorage.patientGender == "F") {
        img.setAttribute("src", "/assets/images/female.gif");
    } else if (sessionStorage.patientGender == "M") {
        img.setAttribute("src", "/assets/images/male.gif");
    }

    img.setAttribute("id", "gender-icon");
    td.appendChild(img);
    tr.appendChild(td);

    var td = document.createElement("td");
    td.setAttribute("class", "names");
    var span = document.createElement("span");
    span.innerHTML = "<b>Name: " + sessionStorage.given_name + " " + sessionStorage.family_name + "</b>";
    td.appendChild(span);
    tr.appendChild(td)


    mainContainer.appendChild(table);


    /* .................................................... */
    var table = document.createElement("table");
    table.setAttribute("class", "demographics-table-data");

    var tr = document.createElement("tr");
    table.appendChild(tr);

    var th = document.createElement("th");
    th.setAttribute("class", "data-header");

    var span = document.createElement("span");
    span.innerHTML = "<b>Birthdate: " + sessionStorage.patientDOB + "</b>";
    th.appendChild(span);


    tr.appendChild(th)


    mainContainer.appendChild(table);
}

function beautifyPop() {
    var modalDiv = document.getElementById('prescription-modal-content');
    modalDiv.innerHTML = null;

    var mainContainer = document.createElement("div");
    mainContainer.setAttribute("class", "keypad-container-table");
    modalDiv.appendChild(mainContainer);

    var mainContainerRow = document.createElement("div");
    mainContainerRow.setAttribute("class", "keypad-container-table-row");
    mainContainer.appendChild(mainContainerRow);

    var cells = ["left", "right"];
    for (var i = 0; i < cells.length; i++) {
        var mainContainerCell = document.createElement("div");
        mainContainerCell.setAttribute("class", "keypad-container-table-cell");
        mainContainerCell.setAttribute("id", "keypad-container-table-cell-" + cells[i]);
        mainContainerRow.appendChild(mainContainerCell);
    }
}


function displayKeyPad(order_id) {
    beautifyPop();
    var modalDiv = document.getElementById('keypad-container-table-cell-left');
    var table = document.createElement('table');
    table.setAttribute("class", "prescription-keypad");

    /* ........................................ */
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("colspan", "3");
    tr.appendChild(td);

    var input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("id", "prescription-input");
    input.setAttribute("class", "touchscreenTextInput");
    td.appendChild(input);
    table.appendChild(tr);
    /* ........................................ */


    var keypad_attributes = [];
    keypad_attributes.push([1, 2, 3]);
    keypad_attributes.push([4, 5, 6]);
    keypad_attributes.push([7, 8, 9]);
    keypad_attributes.push(["Del.", 0, "Clear"]);
    keypad_attributes.push(["&nbsp;", "Close", "&nbsp;"]);
    keypad_attributes.push(["Dispense"]);

    for (var i = 0; i < keypad_attributes.length; i++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        for (var j = 0; j < keypad_attributes[i].length; j++) {
            var td = document.createElement('td');
            // td.setAttribute("colspan", "3");


            tr.appendChild(td);

            var span = document.createElement('span');
            span.setAttribute("class", "keypad-buttons");
            span.setAttribute("onmousedown", "enterKeypadValue(this," + order_id + ");");
            span.innerHTML = keypad_attributes[i][j];
            if (keypad_attributes[i][j] == "&nbsp;") {
                span.setAttribute("class", "keypad-buttons keypad-buttons-hide");
            } else {
                span.setAttribute("class", "keypad-buttons");
            }

            if (keypad_attributes[i][j] == "Dispense") {
                td.setAttribute("colspan", "3");
                span.style.width = "100%";
                span.style.textAlign = "center";
                span.style.paddingTop = "20px";
                span.style.backgroundColor = "green";
            }
            else if (keypad_attributes[i][j] == "Close") {
                span.style.backgroundColor = "#c91c11";
            }
            td.appendChild(span);
        }
    }

    modalDiv.appendChild(table);
    document.getElementById('prescription-modal').style = "display: block;";

    addPopDescription(order_id);
}

function addPopDescription(order_id) {
    var mainContainer = document.getElementById("keypad-container-table-cell-right");
    var table = document.createElement("table");
    table.setAttribute("id", "popup-table");

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.innerHTML = "Medication:"
    var td = document.createElement("td");
    td.setAttribute("id", "medication-td");
    tr.appendChild(th)
    tr.appendChild(td)
    table.appendChild(tr);

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.innerHTML = "Amount needed:"
    var td = document.createElement("td");
    td.setAttribute("id", "amount-needed-td");
    tr.appendChild(th)
    tr.appendChild(td)
    table.appendChild(tr);

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.innerHTML = "Amount dispensed:"
    var td = document.createElement("td");
    td.setAttribute("id", "amount-dispensed-td");
    tr.appendChild(th)
    tr.appendChild(td)
    table.appendChild(tr);

    mainContainer.appendChild(table)

    var row = document.getElementById(order_id);
    var cells = row.getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) {
        if (j == 1) {
            document.getElementById("medication-td").innerHTML = cells[j].innerHTML;
        } else if (j == 2) {
            document.getElementById("amount-needed-td").innerHTML = cells[j].innerHTML;
        } else if (j == 3) {
            document.getElementById("amount-dispensed-td").innerHTML = cells[j].innerHTML;
        }
    }

}

function enterKeypadValue(e, order_id) {
    var inputBox = document.getElementById('prescription-input');

    try {

        if (e.innerHTML.match(/Del/i)) {
            inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
        } else if (e.innerHTML.match(/Clear/i)) {
            inputBox.value = null;
        } else if (e.innerHTML.match(/Dispense/i)) {
            var amount_dispensed = document.getElementById("prescription-input").value;
            manualDispensation(order_id, amount_dispensed);
            document.getElementById("prescription-modal").style = "display: none;";
        } else if (e.innerHTML.match(/Close/i)) {
            document.getElementById("prescription-modal").style = "display: none;";
        }
        else {
            inputBox.value += e.innerHTML;
        }

    } catch (x) {
    }

}

function buildMainControllers() {
    var iFrame = document.getElementById("inputFrame" + tstCurrentPage);

    var mainContainer = document.createElement("div");
    mainContainer.setAttribute("class", "controls-table");
    iFrame.appendChild(mainContainer);

    var mainContainerRow = document.createElement("div");
    mainContainerRow.setAttribute("class", "controls-table-row");
    mainContainer.appendChild(mainContainerRow);


    var cells = ["left", "right"];

    for (var i = 0; i < cells.length; i++) {
        var mainContainerCell = document.createElement("div");
        mainContainerCell.setAttribute("class", "controls-table-cell");
        mainContainerCell.setAttribute("id", "controls-table-cell-" + cells[i]);
        mainContainerRow.appendChild(mainContainerCell);
    }


    buildNavButtons();

    buildDispensingPage();
}

function manualDispensation(order_id, amount_dispensed) {
    postDispensation(order_id, amount_dispensed);
}

function scannedMedicationBarcode(barcode) {
    var drug_id = barcode.split("-")[0];
    var quantity = barcode.split("-")[1];

    var order_id = fetchedPrescriptions[drug_id];
    postDispensation(order_id, quantity);
}


function postDispensation(order_id, amount_dispensed) {
    if (isNaN(parseInt(order_id))) {
        return
    }

    if (isNaN(parseFloat(amount_dispensed))) {
        return
    }

    var drug_order = {
        dispensations: [{date: sessionStorage.sessionDate, drug_order_id: order_id, quantity: amount_dispensed,program_id: sessionStorage.programID }],
    }
    submitParameters(drug_order, "/dispensations", "doneDispensing");

    try {
        var cover = document.getElementById('submit-cover');
        cover.style = 'display: none;';
    } catch (e) {
    }
}

function doneDispensing(orders) {
    var e = document.getElementById("nav-prescribed");
    setPage(e);
    checkIfDoneDispensing = true;

    try {
        var cover = document.getElementById('submit-cover');
        cover.style = 'display: none;';
    } catch (e) {
    }
}

var checkIfDoneDispensing = false;

function dispensationDone() {
    var done = true;
    var amount_needed = document.getElementsByClassName("medication-amount-needed");

    for (var i = 0; i < amount_needed.length; i++) {
        var amount = amount_needed[i].children[0].innerHTML
        if (parseFloat(amount) > 0) {
            done = false;
        }
    }

    if (done == true) {
        var fast_track_visit = sessionStorage.getItem("fast_track_visit");
        if (fast_track_visit == "true") {
            sessionStorage.removeItem("fast_track_visit");
            abortFastTrackNextVisit();
        } else {
            gotoAppointmentEncounterType();
        }
    }
}

function abortFastTrackNextVisit() {
    submiFastTracktDispensationEncounter();
}

function submiFastTracktDispensationEncounter() {
    var currentTime = moment().format(' HH:mm:ss');
    var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
    encounter_datetime += currentTime;

    var encounter = {
        encounter_type_name: 'DISPENSING',
        encounter_type_id: 54,
        patient_id: sessionStorage.patientID,
        encounter_datetime: encounter_datetime
    };

    submitParameters(encounter, "/encounters", "postFastTrackObs");
}

function postFastTrackObs(encounter) {
    var fast_track_concept_id = 8471; //TODO change concept_id
    var fast_track_visit_concept_id = 9688;
    var yes_concept_id = 1065;
    var no_concept_id = 1066;

    var obs = {
        encounter_id: encounter["encounter_id"],
        observations: [
            {concept_id: fast_track_concept_id, value_coded: no_concept_id, comments: "fast track done"},
            {concept_id: fast_track_visit_concept_id, value_coded: yes_concept_id}
        ]
    };

    submitParameters(obs, "/observations", "gotoAppointmentEncounterType")
}

function gotoAppointmentEncounterType() {
  if(parseInt(sessionStorage.programID) == 1) {  
    document.location = "/views/patient/appointment.html?patient_id=" + sessionStorage.patientID;
  }else{
    document.location = "/views/patient_dashboard.html?patient_id=" + sessionStorage.patientID;
  }
}


function addPrescriptions(data) {

    for (var i = 0; i < data.length; i++) {
        var order_id = data[i].order_id;
        var drug_id = data[i].drug_inventory_id;
        var medication = data[i].drug.name;
        var amount_needed = data[i].amount_needed;
        var quantity = data[i].quantity;

        var complete_pack = calculate_complete_pack(data[i], amount_needed) - (quantity || 0)
        fetchedPrescriptions[drug_id] = order_id;
        complete_pack = complete_pack < 0 ? 0 : complete_pack;

        setDataTable.row.add([addDeleteBTN(order_id), addValue(order_id, medication), addValue(order_id, complete_pack), addValue(order_id, quantity), '']).node().id = order_id;
        setDataTable.draw();
        addClassIMGcontainter(order_id);
    }
}

function addClassIMGcontainter(order_id) {
    var row = document.getElementById(order_id);
    var td = row.getElementsByTagName("td")[0];
    td.setAttribute("class", "delete-container");

    var td = row.getElementsByTagName("td")[2];
    td.setAttribute("class", "medication-amount-needed");
}

function addDispBTN(order_id) {
    //var row = document.getElementById(order_id);
    //row.setAttribute("onmousedown", "displayKeyPad('" + order_id + "');");
    var span = document.createElement("span");
    var btn = document.createElement("button");
    btn.setAttribute("class", "dispense-button btn btn-primary");
    btn.setAttribute("onmousedown", "displayKeyPad('" + order_id + "');");
    btn.innerHTML = "Dispense";
    span.appendChild(btn);
    return span.innerHTML;
}


function addValue(order_id, value) {
    //var row = document.getElementById(order_id);
    //row.setAttribute("onmousedown", "displayKeyPad('" + order_id + "');");
    var span = document.createElement("span");
    var btn = document.createElement("p");
    // btn.setAttribute("class","dispense-button btn btn-primary");
    btn.setAttribute("onmousedown", "displayKeyPad('" + order_id + "');");
    btn.innerHTML = value;
    span.appendChild(btn);
    return span.innerHTML;
}

function deleteOrder(row) {
    var order_id = row.id;
    alert(document.getElementById(order_id).innerHTML);
}

function addDeleteBTN(order_id) {
    /*
    var span = document.createElement("span");
    var img  = document.createElement("img");
    img.setAttribute("class","delete-icon");
    img.setAttribute("onmousedown","deleteOrder(this);");
    img.setAttribute("id", order_id);
    img.setAttribute("src", "../../assets/images/delete.png");
    span.appendChild(img);
    return span.innerHTML;
    */
    return "&nbsp;"
}

function getPrescriptions() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort;
    url += "/api/v1/drug_orders?patient_id=" + sessionStorage.patientID;
    url += "&date=" + sessionStorage.sessionDate;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            fetchedPrescriptions = {}
            addPrescriptions(obj);
            if (checkIfDoneDispensing == true) {
                dispensationDone();
                checkIfDoneDispensing = false;
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function buildDispensingPage() {
    var rightContainer = document.getElementById("controls-table-cell-right");

    var medList = document.createElement("div");
    medList.setAttribute("id", "medList-container");

    var table = document.createElement("table");
    table.setAttribute("id", "med-list");
    table.setAttribute("class", "uk-table uk-table-hover uk-table-striped");
    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var headers = ["&nbsp;", "Medication", "Amount need", "Amount dispensed", "&nbsp;"];

    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        if (i == 1)
            th.style = "width: 50%;"

        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    medList.appendChild(table);
    rightContainer.appendChild(medList);


    /* ............................................. */

    var barcodeDiv = document.createElement("div");
    barcodeDiv.setAttribute("id", "barcode-container");
    barcodeDiv.setAttribute("class", "barcode");
    barcodeDiv.setAttribute("functionName", "scannedMedicationBarcode");


    rightContainer.appendChild(barcodeDiv);
    inserBarcodeScan();
}


function buildNavButtons() {
    var navContainer = document.getElementById("controls-table-cell-left");
    var navButtons = [
        ["Prescribed", "rx.png"],
        ["History", "history.png"]
    ];

    var navTable = document.createElement("table");
    navTable.setAttribute("id", "nav-table");

    for (var i = 0; i < navButtons.length; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        tr.appendChild(td);

        var img = document.createElement("img");
        img.setAttribute("src", "../../assets/images/prescription/" + navButtons[i][1]);
        img.setAttribute("draggable", "false");
        img.setAttribute("class", "icons");

        var a = document.createElement("a");
        a.setAttribute("class", "nav-buttons");
        a.setAttribute("id", "nav-" + navButtons[i][0].toLowerCase());
        a.setAttribute("onmousedown", "setPage(this);");

        if (i != 0)
            a.setAttribute("style", "color: black; background-color: #dddddd;");


        var p = document.createElement("p");
        p.innerHTML = navButtons[i][0];
        a.appendChild(img);
        a.appendChild(p);

        td.appendChild(a);
        navTable.appendChild(tr);

    }

    navContainer.appendChild(navTable)

}

function setPage(e) {
    var buttons = document.getElementsByClassName("nav-buttons");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style = "color: black; background-color: #dddddd;"
    }

    e.style = "color: white; background-color: #5ca6c4;";
    buildPage(e);

}

function buildPage(e) {
    leftContainer = document.getElementById("controls-table-cell-right");
    leftContainer.innerHTML = null;

    if (e.innerHTML.match(/Prescribed/i)) {
        buildDispensingPage();
        initDataTable();
        getPrescriptions();
    } else if (e.innerHTML.match(/History/i)) {
        buildMedicationHistory();
        initDataTable();
        loadHostory();
    }

}

function buildMedicationHistory() {
    var rightContainer = document.getElementById("controls-table-cell-right");

    var table = document.createElement("table");
    table.setAttribute("id", "med-list");
    table.setAttribute("class", "uk-table uk-table-hover uk-table-striped");
    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var headers = ["Medication", "Date", "Amount dispensed"];

    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        if (i == 0)
            th.style = "width: 50%;"

        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    rightContainer.appendChild(table);

}

function loadHostory() {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/drug_orders";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            addRows(obj);
        }
    };
    xhttp.open("GET", (url + "?patient_id=" + sessionStorage.patientID), true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function addRows(data) {
    for (var i = 0; i < data.length; i++) {
        var order_id = data[i].order_id;
        var drug_id = data[i].drug_inventory_id;
        var medication = data[i].drug.name;
        var quantity = data[i].quantity;
        var start_date = data[i].order.start_date;

        start_date = formatDate(start_date);

        setDataTable.row.add([medication, start_date, quantity]).node().id = order_id;
        /*var table = $('#example').DataTable();

        $('#example tbody').on('click', 'tr', function () {
            var data = table.row( this ).data();
            alert( 'You clicked on '+data[0]+'\'s row' );
        } );*/
        setDataTable.draw();
    }
}

function formatDate(date_str) {
    var passed_date = new Date(date_str);
    var full_year = passed_date.getFullYear();
    var full_month = passed_date.getMonth();
    var full_day = passed_date.getDay();

    var months = new Array();
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";

    if (parseInt(full_day) < 10)
        full_day = "0" + full_day;

    return (full_day + "/" + months[full_month] + "/" + full_year);
}

function calculate_complete_pack(drug, units) {
    var drug_order_barcodes = drug.barcodes.sort(function (a, b) {
        return a.tabs - b.tabs;
    }); //sorting in an ascending order by tabs
    if (drug_order_barcodes.length == 0 || parseFloat(units) == 0.0) {
        return units;
    }

    for (var i = 0; i <= drug_order_barcodes.length - 1; i++) {
        if (parseInt(drug_order_barcodes[i].tabs) >= units) {
            return drug_order_barcodes[i].tabs;
        }
    }

    var smallest_available_tab = parseInt(drug_order_barcodes[0].tabs)
    var complete_pack = parseInt(drug_order_barcodes[drug_order_barcodes.length - 1].tabs)

    while (complete_pack < units.to_f) {
        complete_pack += smallest_available_tab
    }

    return complete_pack

}
