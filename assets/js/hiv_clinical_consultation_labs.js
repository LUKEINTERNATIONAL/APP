var labResultsHash = {};
var testOrdersHash = {};
var apiPort = sessionStorage.apiPort;
var apiURL = sessionStorage.apiURL;
var patientID = sessionStorage.patientID;
var iac = false;
var orderDate = {};
var monthNumbers  = {
  "Jan": 0, 
  "Feb": 1, 
  "Mar": 2, 
  "Apr": 3, 
  "May": 4, 
  "Jun" : 5,
  "Jul": 6, 
  "Aug" :7, 
  "Sep": 8, 
  "Oct": 9, 
  "Nov" : 10, 
  "Dec": 11
}

var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var laborderDate ;

function buildConsultationLabPage() {
    var frame = document.getElementById("inputFrame" + tstCurrentPage);
    frame.style = "width: 96%; height: 90%; background-color: lightyellow;"

    var orderTable = document.createElement("div");
    orderTable.setAttribute("class","order-table");
    frame.appendChild(orderTable);

    var orderTableRow = document.createElement("div");
    orderTableRow.setAttribute("class","order-table-row");
    orderTable.appendChild(orderTableRow);


    var cells = ["left","right"];
    for(var i = 0 ; i < cells.length ; i++){
        var orderTableCell = document.createElement("div");
        orderTableCell.setAttribute("class","order-table-cell");
        orderTableCell.setAttribute("id","order-table-cell-" + cells[i]);
        orderTable.appendChild(orderTableCell);
    }

    buildNavButtons();
    buildResultTable();
}

function buildNavButtons() {
  var navContainer  = document.getElementById("order-table-cell-left");
  var navButtons    = [
    ["Results","results.png"],
    ["Enter<br />Results","save.png"],
    ["Order","order.png"]
  ];

  var navTable      = document.createElement("table");
  navTable.setAttribute("id","nav-table");

  for(var i = 0 ; i < navButtons.length ; i++){
    var tr  = document.createElement("tr");
    var td  = document.createElement("td");
    tr.appendChild(td);

    var img = document.createElement("img");
    img.setAttribute("src", "/assets/images/" + navButtons[i][1]);
    img.setAttribute("draggable", "false");
    img.setAttribute("class","icons");

    var a   = document.createElement("a");
    a.setAttribute("class","navigation-buttons");
    a.setAttribute("id","nav-" + navButtons[i][0].toLowerCase());
    a.setAttribute("type", navButtons[i][0].toLowerCase());
    a.setAttribute("onmousedown","buildPage(this);");

    if(i != 0)
      a.setAttribute("style","color: black; background-color: #dddddd;");


    var p = document.createElement("p");
    p.innerHTML = navButtons[i][0];
    a.appendChild(img);
    a.appendChild(p);

    td.appendChild(a);
    navTable.appendChild(tr);

  }

  navContainer.appendChild(navTable)
}

function buildResultTable() {
    var container = document.getElementById("order-table-cell-right");
    var table = document.createElement("table");
    table.setAttribute("class","result-table");
    table.setAttribute("id","lab-result-table");
    container.appendChild(table);

    var tr = document.createElement("tr");
    table.appendChild(tr);

    var heads = ["Test","Order date","Test date","Results","Result given"];
    for(var i = 0 ; i < heads.length ; i++){
        var th = document.createElement("th");
        th.setAttribute("class","heads");
        th.innerHTML = heads[i];
        if(i == 0){
          th.setAttribute("id","test-names");
        }else if(i == 3){
          th.setAttribute("id","lab-results");
        }
        tr.appendChild(th);
    }
    
    var tbody = document.createElement("tbody");
    tbody.setAttribute("id","results-body");
    
    getOrders(tbody);
    table.appendChild(tbody);
   
    initLabResultsTable();
}

function getOrders(tbody) {

  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/programs/1/lab_tests/orders?patient_id=' + patientID;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {

    if (this.readyState == 4) {
      if (this.status == 200) {
        var results = JSON.parse(this.responseText);
        for (var x = 0; x < results.length; x++) {
          tbody.innerHTML += "<tr><td>"+results[x].lab_sample.lab_parameter.test_type.TestName.replace(/_/g, " ")+"</td><td>"+moment(results[x].OrderDate).format("DD/MMM/YYYY")+"</td><td> "+moment(results[x].OrderDate).format("DD/MMM/YYYY")+"</td><td></td><td></td></tr>" ;
        }
      }
    }
  };
  try {
    req.open('GET', url, true);
    req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
    req.send(null);
  } catch (e) {}
}

function buildEnterResultTable() {
  var rightContainer = document.getElementById("order-table-cell-right");
  
  var table = document.createElement("class","enter-results-table");
  rightContainer.appendChild(table);

  var tr = document.createElement("class","enter-results-table-row");
  table.appendChild(tr);


  var cells = ["left","right"];
  for(var i = 0 ; i < cells.length ; i++){
    var cell = document.createElement("class","enter-results-table-cell");
    cell.setAttribute("id","enter-results-table-cell-" + cells[i])
    tr.appendChild(cell);
  }

  addbTests(); 
  addKeyPad();
}

function addKeyPad() {
  var container = document.getElementById("enter-results-table-cell-right");

  var table = document.createElement("table");
  table.setAttribute("id","enter-results-keypad");
  container.appendChild(table);

  var cells = ["input-box","keypad-container","save"];
  for(var i = 0 ; i < cells.length ; i++){
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("id","enter-results-keypad-" + cells[i]);
    tr.appendChild(td);
    table.appendChild(tr);
  }

  var inputBox = document.createElement("input")
  inputBox.setAttribute("id","input-box-result");
  inputBox.setAttribute("type","text");
  
  var td = document.getElementById("enter-results-keypad-input-box");
  td.appendChild(inputBox);
  
  specialKeys(); 
}


function specialKeys() {
  var keypad_attributes = [];
  keypad_attributes.push([1,2,3,"<"]);
  keypad_attributes.push([4,5,6,"="]);
  keypad_attributes.push([7,8,9,">"]);
  keypad_attributes.push(["Neg",0,"Pos","Del."]);
  keypad_attributes.push(["Clear","%","/","Save"]);

  var table = document.createElement('table');
  table.setAttribute("class","specialKeys-keypad");

  for(var i = 0 ; i < keypad_attributes.length ; i++) {
    var tr = document.createElement("tr");
    table.appendChild(tr);

    for(var j = 0 ; j < keypad_attributes[i].length ; j++){
      var td = document.createElement('td');
      tr.appendChild(td);

      var span = document.createElement('span');
      span.setAttribute("class","keypad-buttons");
      span.setAttribute("onmousedown","enterTestKeypadValue(this);");
      span.innerHTML = keypad_attributes[i][j];

      if(keypad_attributes[i][j] == "Save") {
        span.setAttribute("id","keypad-save-btn");
        span.innerHTML = null;

        var img = document.createElement("img");
        img.setAttribute("src","/assets/images/save.png");
        var img_style = "width: 30px;height:30px;";
        img.setAttribute("style", img_style);
        span.appendChild(img);
        span.innerHTML += "<br /><span style='font-size: 18px;color: white;'>Save</span>";
        span.style = "background-color: green; background-image: linear-gradient(to bottom, green, green);";
      }

      td.appendChild(span);
    }
  }

  var td = document.getElementById("enter-results-keypad-keypad-container");
  td.appendChild(table);
}

function showValidate(message) {
  if (message == null) {
    message = "is this a valid input"
  }

 
  messageBar.innerHTML = "";
  messageBar.innerHTML += "<p>" + ((message.match(/^Value\s/))?(message.replace(/^Value\s/, "The value is ")):message) +
            ". Have you conudcted intensive adherence councelling?</p><div style='display: block;'>" +
            "<button class='button' style='float: none;' onclick='iac=false;this.offsetParent.style.display=\"none\";' onmousedown='iac=false;this.offsetParent.style.display=\"none\";'"+
            "><span>Yes</span></button><button class='button' " +
            "style='float: none; right: 3px;' onmousedown='iac=true;this.offsetParent.style.display=\"none\"; '>" +
            "<span>No</span></button>";
            messageBar.style.display = "block";
}

function addbTests() {
  var ul = document.createElement("ul");
  ul.setAttribute("class", "test-selection");

  var activities = [
    ["Crag",23], ["Urine",22], ["CD4 count", 1231], ["Viral Load", 12]
  ];
  var even_odd;

  for(var i = 0 ; i < activities.sort().length ; i++){
    var li = document.createElement("li");
    even_odd = (( i & 1 ) ? "odd" : "even");

    li.setAttribute("id", i );
    li.setAttribute("value", activities[i][1]);
    li.setAttribute("onmousedown", "testSelection(this); ");
    li.setAttribute("class", "available-tests row-" + even_odd);
    li.innerHTML = activities[i][0];
    ul.appendChild(li); 
  }
  
  var container = document.getElementById("enter-results-table-cell-left");
  container.appendChild(ul); 
}

function testSelection(e) {
  var list = document.getElementsByClassName("available-tests");
  var even_odd;
  var inputBox = document.getElementById('input-box-result');
  inputBox.value = "";
  for(var i = 0 ; i < list.length ; i++){
    even_odd = (( i & 1 ) ? "odd" : "even");
    list[i].setAttribute("class", "available-tests row-" + even_odd);
  }

  var classAttr = e.getAttribute("class") + " list-selected";
  e.setAttribute("class", classAttr);
}

function buildNewOrderPage() {
  var rightContainer = document.getElementById("order-table-cell-right");
  var container = document.createElement("div");
  rightContainer.appendChild(container);

  var tests = [
    ["CD4 count", 23],["Crag",12],["Urine", 34],["Viral Load", 12]
  ];

  var table = document.createElement("table");
  table.setAttribute("class","test-table-selection");
  container.appendChild(table);

  for(var i = 0 ; i < tests.length ; i++){
    even_odd = (( i & 1 ) ? "odd" : "even");

    var tr = document.createElement("tr");
    tr.setAttribute("class", "available-tests-order row-" + even_odd);
    tr.setAttribute("id", "row-" + i);
    tr.setAttribute("onmousedown", "testOrders(this);");
    table.appendChild(tr)

    var td = document.createElement("td");
    var img = document.createElement("img");
    img.setAttribute("src","/public/touchscreentoolkit/lib/images/unticked.jpg");
    var img_style = "width: 45px;height:45px;";
    img.setAttribute("style", img_style);
    img.setAttribute("class", "check-boxes");
    img.setAttribute("id", "check-box-" + i);
    td.appendChild(img);
    td.setAttribute("style", "width: 31px;");
    tr.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = tests[i][0];
    tr.appendChild(td); 
  }

}

function newOrders() {
  var rightContainer = document.getElementById("order-table-cell-right");
  var modal = document.createElement("div");
  rightContainer.appendChild(modal);
  modal.id = "myModal";
  modal.innerHTML= "heloo";
  modal.setAttribute("class", "modal");
  modal.innerHTML = '  <div class="modal-content">'+
      '<span class="close-modal">&times;</span>'+
      '<div id="tests-div"><input class="tests-input" type="text" id="lab-tests" placeholder="lab-tests"/> '+
      '<ul id="tests-list" style="width: 96%;"> <ul></div> '+
      '<button class="green" style="margin: 5px; width: 150px; padding: 0px;" visibility: hidden; id="modal-next" onmousedown="showDates();" >'+
      '<span>Next</span></button>'+
      '<button class="green" style="margin: 5px; width: 150px; padding: 0px;" visibility: hidden; id="modal-submit" onmousedown="saveTests()" >'+
      '<span>Finish</span></button>'+
  '</div>';
  modal.style.display = "block";
  showKBD("programs/1/lab_tests/types/?search_string=", loadTests);
var span = document.getElementsByClassName("close-modal")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

}

function loadTests(string, checks){
  var url = 'http://'+apiURL+':'+apiPort+'/api/v1/'+string;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4) {
      if (this.status == 200) {
        var results = JSON.parse(this.responseText);
        var list = document.getElementById("tests-list");
        if (list.innerHTML != null) {
          list.innerHTML = null;
        }else {

        }
        if (checks == true) {
          var table = document.createElement("table");
          table.id = "test-select-table";
          list.appendChild(table);
          table.style.width = "100%";
          table.style.borderCollapse = "collapse";
          table.style.backgroundColor = "#fffee0";
          list.style.paddingLeft = "0";
          var className =  "row odd";
          for(var x = 0; x < results.length; x ++){ 
            if (x % 2 == 0) {
              className = "row-even";
            }else {
              className = "row-odd";
            }
            table.innerHTML += '<tr class="'+className+'" style="width: 100%;" id="row-'+results[x].ID+'" testID="'+results[x].ID+'" onclick="tick(this);"> <td style="width:5%;"> <img src="/public/touchscreentoolkit/lib/images/unticked.jpg" ticked="unticked" testID="'+results[x].ID+'" id="img-'+results[x].ID+'"> </td> <td style="width:90%;"> '+results[x].TestName+'</td> </tr>'; 
            testOrdersHash[results[x].ID] = "not ordered";
          }
          
        }else {
          for(var x = 0; x < results.length; x ++){ 
            list.innerHTML += "<li onmousedown='enterTest(this);' class='test-list-items' panel_id='"+results[x].Panel_ID+"'>" + results[x].TestName + "</li>";
          }
        }
      }
    }
  };
  try {
    req.open('GET', url, true);
    req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));
    req.send(null);
  } catch (e) {

  }
}

function loadLocations(string){
 document.getElementById("modal-next").style.visibility = "hidden";
document.getElementById("modal-submit").style.visibility = "visible";
  var url = 'http://'+apiURL+':'+apiPort+'/api/v1/locations?name='+string;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4) {
      if (this.status == 200) {
        var results = JSON.parse(this.responseText);
        var list = document.getElementById("tests-list");
        if (list.innerHTML != null) {
          list.innerHTML = null;
        }else {

        }
          for(var x = 0; x < results.length; x ++){ 
            list.innerHTML += "<li onmousedown='enterLocation(this);' class='test-list-items' location_id='"+results[x].location_id+"'>"+results[x].name+"</li>";
          }
        
      }
    }
  };
  try {
    req.open('GET', url, true);
    req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));
    req.send(null);
  } catch (e) {

  }

}

function enterLocation(element) {
  document.getElementById('lab-tests').value = element.innerHTML;
}
function saveTests() {
  submitOrders();
  
  // var e = document.getElementById("nav-results");
  // buildResultTable();
  // document.getElementById()
  // buildPage(e)
}


function tick(element) {
  var imgID =  "img-" + element.getAttribute("testID");
  var rowID =  "row-" + element.getAttribute("testID");
  var tickedImage = document.getElementById(imgID);
  var tickedRow = document.getElementById(rowID);
  if(tickedImage.getAttribute("ticked") === "ticked") {
    tickedImage.src = "/public/touchscreentoolkit/lib/images/unticked.jpg";
    tickedImage.setAttribute("ticked", "unticked");
    tickedImage.class = ("unticked");
    tickedRow.style.backgroundColor = "";
    testOrdersHash[(tickedImage.getAttribute("testID"))] = "not ordered";
  }else {
    testOrdersHash[(tickedImage.getAttribute("testID"))] = "ordered"; 
    tickedImage.setAttribute("ticked", "ticked");
    tickedImage.class = ("ticked");
    tickedImage.src = "/public/touchscreentoolkit/lib/images/ticked.jpg";
    tickedRow.style.backgroundColor = "lightblue";
  }
}


function enterTest(element) {
  loadTests("/programs/1/lab_tests/types?panel_id="+element.getAttribute("panel_id"), true);
  var inputBox = document.getElementById("lab-tests");
  inputBox.value = "test selected = " + element.innerHTML;
  document.getElementById("modal-next").style.visibility ="visible";
  hideKBD();
  document.getElementById("tests-list").style.height = "100%";
  document.getElementById("tests-div").style.height = "70%";
  
}

function showDates() {
  var d = new Date();
  document.getElementById("tests-list").innerHTML = '<div id="dateselector" style="margin-left: 20%; margin-top: 15%;" class="dateselector">'+ 			
  '<table><tbody> <tr> <td> <div style="display: inline;"> <button id="dateselector_nextDay" onmousedown="addDay();"><span>+</span></button> '+
  '<input id="dateselector_day" type="text" value=""> <button id="dateselector_preDay" onmousedown="minusDay();"><span>-</span></button> </div> '+
  '</td><td> <div style="display: inline;"> <button id="dateselector_nextMonth" onmousedown="plusMonth();"><span>+</span></button>  '+
  '<input id="dateselector_month" type="text" value=""> <button id="dateselector_preMonth" onmousedown="minusMonth();"><span>-</span></button> '+
  '</div> </td><td> <div style="display: inline;"> <button id="dateselector_nextYear" onmousedown="plusYear();"><span>+</span></button> '+
  '<input id="dateselector_year" type="text" value=""> <button id="dateselector_preYear" onmousedown="minusYear();"><span>-</span></button> '+
  '</div> </td><td> <button id="today" class="red"  style="width: 150px;"><span onmousedown="enterDate(this)">Today</span></button>'+ 			
  '<!--button id="num" onmousedown="updateKeyColor(this);press(this.id);" style="width: 150px;"><span>Num</span></button-->'+
  '<button id="Unknown" style="width: 150px;"><span onmousedown="enterDate(this)">Unknown</span></button></td></tr></tbody></table></div>';
  setDate(d);
  document.getElementById("modal-next").addEventListener("mousedown", function() {
    orderDate.testDate = document.getElementById("lab-tests").value;
    document.getElementById("lab-tests").setAttribute("placeholder", "lab location");
    document.getElementById("tests-div").style.height = "45%";
    document.getElementById("tests-list").style.height = "80%";
    document.getElementById("lab-tests").value = "";
    document.getElementById("tests-list").innerHTML = "";
   
    showKBD("", loadLocations);
  })
}



function addDay() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).add(1, 'days').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d);
}

function minusDay() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).subtract(1, 'days').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d);
}

function plusMonth() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).add(1, 'months').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d);
}

function minusMonth() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).subtract(1, 'months').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d);
}

function plusYear() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).add(1, 'years').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d);
}

function minusYear() {
  var year = document.getElementById("dateselector_year").value
  var month = document.getElementById("dateselector_month").value;
  var day = document.getElementById("dateselector_day").value;
  var fullDate = month + "-" + day + "-" + year;
  var f = new Date(fullDate);
  d = moment(f).subtract(1, 'years').format("MM/DD/YYYY");
  d = new Date(d);
  setDate(d); 
}

function setDate(givenDate) {
  var maxDate = new Date();
  var minYear = new Date(sessionStorage.patientDOB);
  minYear = new Date(minYear);
  if (givenDate > maxDate ) {
   inputDate(maxDate);
  }else if (givenDate < maxDate){
    inputDate(givenDate);
  }
  if(givenDate < minYear) {
    inputDate(minYear);
  }
}

function inputDate(givenDate) {
  var d = new Date(givenDate);
    var month = d.getMonth();
    var day = d.getDate();
    var year = d.getFullYear();
    var monthInput = document.getElementById("dateselector_month");
    var dayInput = document.getElementById("dateselector_day");
    var yearInput = document.getElementById("dateselector_year");
    monthInput.setAttribute("value", month_names[month]);
    dayInput.setAttribute("value", day);
    yearInput.setAttribute("value", year);
    document.getElementById("lab-tests").value = moment(d).format("DD/MMM/YYYY");
    laborderDate = d; 
}
function buildPage(e) {
  
  var cells = document.getElementsByClassName("navigation-buttons");
  for(var i = 0 ; i < cells.length ; i++){
    cells[i].setAttribute("style","color: black; background-color: #dddddd;");
  }
  e.setAttribute("style","color: white; background-color: #5ca6c4;");

  var rightContainer = document.getElementById("order-table-cell-right");
  rightContainer.innerHTML = null;

  if(e.getAttribute("type") == "enter<br />results"){
    buildEnterResultTable();
  }else if(e.getAttribute("type") == "results"){
    buildResultTable();
  }else if(e.getAttribute("type") == "order"){
    newOrders();
  }

}

function enterDate (e) {
    var inputBox = document.getElementById("lab-tests");
    if(e.innerHTML.match(/unknown/i)){
      inputBox.value = "unknown";
    }else if(e.innerHTML.match(/today/i)){
      var d = new Date();
      inputDate(d);
    }
    else{
        inputBox.value += e.innerHTML;
    }
}

function checkIfTestSelected() {
  var testList = document.getElementsByClassName("available-tests");
  var test;

  for(var i = 0 ; i < testList.length ; i++){
    if(testList[i].getAttribute("class").match(/selected/i)){
      test = testList[i];
    }
  }

  return test;
}

function submitOrders() {

  var encounter = {
      encounter_type_id:  57,
      patient_id: patientID,
      encounter_datetime: null
  }

  submitParameters(encounter, "/encounters", "setOrders");
}

function setOrders(encounter) {
  
  keys = Object.keys(testOrdersHash);
  for (let index = 0; index < keys.length; index++) {
    if (testOrdersHash[keys[index]] == "ordered") {
      postOrders(keys[index], encounter.encounter_id);
    }
  }
  
  
}

function postOrders(test_type_id, encounter_id) {
  var date = new Date(orderDate.testDate);
  var http = new XMLHttpRequest();
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/programs/1/lab_tests/orders?patient_id=' + patientID;
  var params = JSON.stringify({
    encounter_id: encounter_id,
    test_type_id: test_type_id,
    date: date
  });
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.onreadystatechange = function () { //Call a function when the state changes.
    if (http.readyState == 4) {
      if (http.status == 201) {
        try {
          document.getElementById("myModal").style.visibility = "hidden";
          document.getElementById("modal-next").style.visibility = "hidden";
          document.getElementById("popupBox").style.visibility = "hidden";
        }catch(e) {

        }
        
        var e = document.getElementById("nav-results");
        buildPage(e)
      } else if (http.status == 404) {
        alert('error submitting lab test');
      } else {
        alert('error' + http.status);
      }
    }
  }
  http.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
  http.send(params);

}
function enterTestKeypadValue(e) {
  var inputBox = document.getElementById('input-box-result');

  var selected = checkIfTestSelected();
 
  if(selected == undefined) {
    showMessage("Please select test first");
    return;
  }

  try{

    if(e.innerHTML.match(/Del/i)){
      if(inputBox.value.match(/Positive/i) || inputBox.value.match(/Negative/i))
        return;

      inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
    }else if(e.innerHTML.match(/Clear/i)){
      inputBox.value = null;
    }else if(e.innerHTML.match(/Neg/i)){
      inputBox.value = null;
      inputBox.value = "Negative";
    }else if(e.innerHTML.match(/Pos/i)){
      inputBox.value = null;
      inputBox.value = "Positive";
    }else if(e.innerHTML.match(/Save/i)){
      validateResults(selected.innerHTML, inputBox.value);
    }else{
      if(inputBox.value.match(/Positive/i) || inputBox.value.match(/Negative/i))
        return;

      inputBox.value += htmlDecode(e.innerHTML);
    }

  }catch(x) {
    return;
  }

  if(isEmpty(inputBox.value)) {
    labResultsHash[selected.innerHTML] = null;
  }else{
    labResultsHash[selected.innerHTML] = inputBox.value;
  }
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function isEmpty(str){
  try {
    return (str.replace(/\s+/g, '').length < 1);
  }catch(e){
    return true;
  }
}

function validateResults(testName, value) {
  
  if(testName === "CD4 count") {
    var cd4Regex = /^(<|>|=)([0-9]){0,3}$/;
    if(value.match(cd4Regex) != null) {
      labResultsHash[testName] = value;
      value = value.replace(/>|<|=/, "");
      if(value < 200) {
        showMessage("Order Urine LAM or Crag tests")  
      }else {
        showMessage("Saved");
      }
      
    }else {
      showMessage("Invalid Input");
    }
  }

  if(testName === "Viral Load") {
    var cd4Regex = /^(<|>|=)([0-9]){0,4}$/;
    if(value.match(cd4Regex) != null) {
      labResultsHash[testName] = value;
      value = value.replace(/>|<|=/, "");
      if(value > 150 && value < 1000) {
        showValidate("Potential treatment failure. Switch to intensive Adherence Councelling");  
      }else {
        iac = false;
        showMessage("Saved");
      }
      
    }else {
      showMessage("Invalid Input");
    }
  }

  if (testName === "Crag") {
    var cragRegex = /^(positive|negative)$/;
    if(value.toLowerCase().match(cragRegex) != null) {
      labResultsHash[testName] = value;
      if(value.toLowerCase() === "negative") {
        showMessage("Do other investigations like CSF analysis");  
      }else if (value.toLowerCase() === "positive") {
        showMessage("Start patient on Cryptococcal treatment");
      }
      
    }else {
      showMessage("Invalid Input");
    }
  }

  if(testName === "Urine") {
    var urineRegex = /^(positive|negative)$/;
    if(value.toLowerCase().match(urineRegex) != null) {
      labResultsHash[testName] = value;
      if(value.toLowerCase() === "negative") {
        showMessage("Order other tests like Sputum microscopy, Chest XRay, GenExpert");  
      }else if (value.toLowerCase() === "positive") {
        showMessage("Start/Refer patient for TB treatment");
      }
    }else {
      showMessage("Invalid Input");
    }
  }
}

function testOrders(e) {
  var id = e.id.replace("row-","");
  var test = "";
  var selectedCheckBox = document.getElementById("check-box-" + id);
  switch (parseInt(id)) {
    case 0: 
      test = "CD4 count";
      break;
    case 1: 
      test = "Crag";
      break;
    case 2: 
      test = "Urine";
      break;
    case 3: 
      test = "Viral Load";
      break;
  }

  if(selectedCheckBox.getAttribute("src").match(/unticked/i)){
    selectedCheckBox.setAttribute("src", "/public/touchscreentoolkit/lib/images/ticked.jpg");
    testOrdersHash[test] = "ordered";
    e.style = "background-color: lightblue;";
  }else{
    selectedCheckBox.setAttribute("src", "/public/touchscreentoolkit/lib/images/unticked.jpg");
    testOrdersHash[test] = "not ordered";
    e.style = "background-color: '';";
  }
}

function activateModal() {
  // Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
}