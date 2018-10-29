var labResultsHash = {};
var testOrdersHash = {};
var apiPort = sessionStorage.apiPort;
var apiURL = sessionStorage.apiURL;
var patientID = sessionStorage.patientID;

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

    var heads = ["Test","Order date","Test date","Results","Result given to client"];
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
    tbody.innerHTML= "<tr><td>CD4</td><td>2012</td><td>friday</td><td>Positive</td><td>positive</td></tr>" ;
    table.appendChild(tbody);
   
    initLabResultsTable();
}

function getOrders(tbody) {
  var url = 'http://' + apiURL + ':' + apiPort + '/api/v1/programs/orders?patient_id=' + patientID;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {

    if (this.readyState == 4) {
      if (this.status == 200) {
        var results = JSON.parse(this.responseText);
        for (var x = 0; x < results.length; x++) {
          // console.log(results);
          tbody.innerHTML("<td></td> <td></td><td></td>" );
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


function addbTests() {
  var ul = document.createElement("ul");
  ul.setAttribute("class", "test-selection");

  var activities = [
    ["Grag",23], ["Urine",22], ["CD4 count", 1231]
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
  console.log(e.id);
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
  /*var style = "border-style: solid; border-width: 1px;";
  style += "margin: 30px; border-radius: 25px;";
  container.style = style; */

  var tests = [
    ["CD4 count", 23],["Crag",12],["Urine", 34]
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
    buildNewOrderPage();
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

function enterTestKeypadValue(e) {
  var inputBox = document.getElementById('input-box-result');

  var selected = checkIfTestSelected();
  labResultsHash = [selected.innerHTML, inputBox.value];
  console.log(labResultsHash);
 
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
      
      showMessage("Save");
      labResultsHash[selected.innerHTML] = inputBox.value;
      console.log(labResultsHash);
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


function testOrders(e) {
  var id = e.id.replace("row-","");
  var selectedCheckBox = document.getElementById("check-box-" + id);

  if(selectedCheckBox.getAttribute("src").match(/unticked/i)){
    selectedCheckBox.setAttribute("src", "/public/touchscreentoolkit/lib/images/ticked.jpg");
    e.style = "background-color: lightblue;";
  }else{
    selectedCheckBox.setAttribute("src", "/public/touchscreentoolkit/lib/images/unticked.jpg");
    e.style = "background-color: '';";
  }
  console.log(e.innerHTML);
}
