function lookForTag() {
    let inputs = document.getElementsByTagName('input');

    //loop through the inputs to assign virtual-keyboard
    for (let i = 0; i < inputs.length; i++) {
        let keyup = inputs[i].getAttribute('onkeyup');
        if (keyup === undefined) {
            inputs[i].setAttribute('onfocus', 'popupVK(this);');
        } else {
            inputs[i].setAttribute('onfocus', keyup + '; popupVK(this);');
        }
    }
}

function popupVK(e) {
    let vl = document.getElementById('virtual-keyboard');
    let w = document.getElementsByTagName('body')[0];
    if (vl !== undefined) {
        w.removeChild(vl);
        return;
    }

    let div = document.createElement('div');
    div.setAttribute('id', 'virtual-keyboard');
    div.setAttribute('class', 'keyboard');
    let divStyle = "background-color: #F4F4F4;border: 2px solid #E0E0E0;";
    divStyle += "border-radius: 15px;height: 300px;position: absolute;";
    divStyle += "z-index: 991;width: 820px;";

    let l = e.getBoundingClientRect().left;
    //let divPos = ((50 / width)*100);
    let inputPos = e.getBoundingClientRect().top;
    inputPos = parseInt(inputPos);

    divStyle += "left: " + (l - 680) + "px;top: " + (inputPos + 31) + "px;";
    div.style = divStyle;

    keyboardKeys(e, div);


    w.appendChild(div);
}

function keyboardKeys(e, table) {
    let keypress = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l", "Del."],
        ["z", "x", "c", "v", "b", "n", "m", "Hide", "Caps"]
    ];

    //let table = document.createElement("div");
    //table.setAttribute("class","keyboard");

    for (let i = 0; i < keypress.length; i++) {
        let row = document.createElement("span");
        row.setAttribute("class", "buttonLine");
        table.appendChild(row);

        for (let x = 0; x < keypress[i].length; x++) {
            let cell = document.createElement("button");
            cell.setAttribute("class", "keyboardButton");
            row.appendChild(cell);

            cell.setAttribute("onmousedown", "keyPressed(this);");
            cell.innerHTML = "<span>" + keypress[i][x] + "</span>";


        }
    }

    targetInput = e;
}

function keyPressed(e) {
    let inputBox = targetInput;
    let value_string = e.innerHTML.replace('<span>', '');
    value_string = value_string.replace('</span>', '');

    try {

        if (value_string.match(/Del/i)) {
            inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
        } else if (e.innerHTML.match(/Caps/i)) {
        } else if (e.innerHTML.match(/Hide/i)) {
            let vl = document.getElementById('virtual-keyboard');
            let w = document.getElementsByTagName('body')[0];
            w.removeChild(vl);
        } else {
            inputBox.value += value_string;
        }

        try {
            $('input[type="search"]').val(inputBox.value).keyup();
        } catch (z) {
        }
    } catch (x) {
    }

}


function initializeTable() {
    
    data_table = $('#example').DataTable({
        fixedHeader: true,
        pageLength: 10,
        searching: false,
        paging: true,
        scrollY: 400,
        Processing: true,
        ServerSide: true,
        scroller: {
        loadingIndicator: true
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csv',
                title: 'MoH ' + sessionStorage.currentLocation + ': cohort disaggregated report ' + quarter
            },
            {
                extend: 'pdf',
                title: 'MoH' + sessionStorage.currentLocation + ': cohort disaggregated report ' + quarter
            }
        ]
    });
    lookForTag();
}

function getDrilledPatients() {
        var apiProtocol = sessionStorage.apiProtocol;
        var apiURL = sessionStorage.apiURL;
        var apiPort = sessionStorage.apiPort;
        var url_string = window.location;
        var parsedURL = new URL(url_string);
        var resource_id = parsedURL.searchParams.get("resource_id");
        var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/cohort_report_drill_down?";
        url += "id="+resource_id;
        url += "&date="+moment(sessionStorage.sessionDate).format("YYYY-MM-DD");
        url += "&program_id="+sessionStorage.programID; 

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
                var obj = JSON.parse(this.responseText);
                document.getElementById("report-cover").style = "display:none;";
                document.getElementById("spinner").style = "display:none;";
                buildDuplicates(obj); 
                /**
                 * Keeping the returned queries
                 */

                /**
                 * Displaying the returned results
                 */
                // renderData(obj);
                //addRows(obj);
            }
        };

        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
        xhttp.setRequestHeader('Content-type', "application/json");
        xhttp.send();
}
function buildDuplicates(object) {
        var table = document.getElementById("table-body");
        var cells = ["left", "right", "bottom-left", "bottom-right"];
        for (var i = 0; i < object.length; i++) {
            var obj = object[i];
            var dob = moment(obj["birthdate"]).format("DD/MMM/YYYY");
            var roundedAge = Math.round(moment().diff(obj["birthdate"], 'years', true));
            var patientDOB = moment(obj["birthdate"]).format("DD/MMM/YYYY");
            
            var full_name = object[i].given_name + " " + object[i].family_name;
            var gender = obj["gender"];
            var arv_number = obj["arv_number"];
            var full_age = patientDOB + " (" + roundedAge + ")";


            var tr = document.createElement("tr");
            addDetails(arv_number, tr);
            addDetails(full_name, tr);
            addDetails(gender, tr);
            addDetails(full_age, tr);
            
            var btn = document.createElement('button');
            btn.innerHTML = '<span>Select</span>';
            btn.setAttribute('class', 'button green');
            btn.setAttribute('onclick', "goToMasterCard('" + obj.person_id + "')");
            
            addDetails(btn, tr, true);
            table.appendChild(tr);
            
            // var tr = document.createElement("tr");
            // tr.style.width = "100%";
            // tr.style.fontSize = "20px";
            // var td = document.createElement("td");
            // td.innerHTML = "Name: " + object[i].given_name + " " + object[i].family_name;
            // td.innerHTML += " (" + gender + ") <br/>Age / DOB: " + patientDOB + " " + roundedAge;
            // tr.appendChild(td);
            // table.appendChild(tr);

            // orderTableCell.appendChild(table);
            // orderTableCell.setAttribute("class", "order-table-cell");
            // orderTableCell.setAttribute("id", object[i].patient_id);
            // orderTable.appendChild(orderTableCell);
        }
        initializeTable();
    }
function goToMasterCard(person_id) {
    window.location = "/views/patient/mastercard.html?patient_id="+ person_id;
}
function addDetails(data_element, tr, button) {
    var td = document.createElement("td");
    if (button == true) {
        td.appendChild(data_element);
        tr.appendChild(td);
    }else {
        td.innerHTML = data_element;
        tr.appendChild(td);
    }
}