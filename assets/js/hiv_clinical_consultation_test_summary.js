var testResults = {};


function buildSummary() {
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  tar.style.display = "flex";
  tar.style.width = "96%";
  var leftSide = document.createElement("div");
  var rightSide = document.createElement("div");
  rightSide.setAttribute("id", "right-side");
  rightSide.style.width = "100%";
  rightSide.style.height = "600px";
  leftSide.setAttribute("id", "left-side");
  leftSide.innerHTML = "<div id='lab-tests' class='orders-button' onclick='buildOrders();'> Summary </div>";
  leftSide.innerHTML += "<div id='lab-results' class='orders-button orders-button-disabled' onclick='buildTests();'> Results </div>";
  leftSide.innerHTML += "<div id='lab-orders' class='orders-button orders-button-disabled' onclick='getOrders();'> Orders </div>";
  leftSide.style.height = "600px";
  leftSide.style.width = "15%";
  leftSide.style.borderRight = "1px solid black";
  tar.appendChild(leftSide);
  tar.appendChild(rightSide);
  // // buildPage(e)
  // var e = document.getElementById("nav-results");
  // buildPage(e)
  buildOrders();
}

function buildOrders() {
  var rightSide = document.getElementById("right-side");
  rightSide.style.display ="inline";
  rightSide.innerHTML = null;
  var table = document.createElement("table");
  table.setAttribute("id", "ordersTable");
  table.className = "tests-table";
  // table.style.width = "100%";
  table.innerHTML= ("<th class='headers orders-td' style='width:33%; text-align:left; padding-left:10px;'>Tests</th> <th class='headers orders-td' style='width:15%;'> Order Date </th> <th class='headers orders-td' style='15%;'> Result Date </th> <th class='headers orders-td' style='width:35%; text-align:right; padding-right:10px;'> Result </th>")
  var btn = document.getElementById("lab-results");
  btn.setAttribute("class", "orders-button orders-button-disabled");
  btn = document.getElementById("lab-orders");
  btn.setAttribute("class", "orders-button orders-button-disabled");
  btn = document.getElementById("lab-tests");
  btn.setAttribute("class", "orders-button");
  var tests = [["CRAG", "2018-10-10","2018-11-10", "Positive"], ["CD4", "2018-10-10","2018-10-10", ">200"], ["Urine LAM", "2018-10-10","2018-10-10", "Positive"]];
  
  rightSide.appendChild(table);
  addSummaryDetails(tests);
}

function addSummaryDetails(tests) {
  var table = document.getElementById("ordersTable");
  for(var i = 0; i < tests.length; i++) {
    table.innerHTML += "<tr> <td class='orders-td' style='text-align:left;padding-left: 10px;'>"+tests[i][0]+"</td><td class='orders-td'>"+tests[i][1]+"</td><td class='orders-td'>"+tests[i][2] + "</td> <td class='orders-td' style='text-align:right; padding-right: 10px;'>"+tests[i][3] + "</td></tr>"
  }
}

function buildTests() {
  
  var innerLeft = document.createElement("div");
  innerLeft.style.width = "20%";
  innerLeft.setAttribute("id", "inner-left");
  innerLeft.style.borderRight = "solid 1px black";
  var innerRight = document.createElement("div");
  innerRight.style.width = "80%";
  innerRight.setAttribute("id", "inner-right");
  var rightSide = document.getElementById('right-side');
  rightSide.innerHTML = "";
  rightSide.style.display = "flex";
  rightSide.appendChild(innerLeft);
  rightSide.appendChild(innerRight);
  testFunctions();
  var btn = document.getElementById("lab-tests");
  btn.setAttribute("class", "orders-button orders-button-disabled");
  btn = document.getElementById("lab-orders");
  btn.setAttribute("class", "orders-button orders-button-disabled");
  btn = document.getElementById("lab-results");
  btn.setAttribute("class", "orders-button");
  buildKeyPad();
}

function testFunctions() {
  var innerLeft = document.getElementById("inner-left");
  innerLeft.innerHTML = "<div class='tests orders-button' onclick='buildKeyPad();highlightBTN(this);'>CD4 Count Test</div>";
  innerLeft.innerHTML += "<div test='CRAG' class='tests orders-button orders-button-disabled' onclick='buildOptions(this);highlightBTN(this);'>CRAG Test</div>";
  innerLeft.innerHTML += "<div test='Urine LAM' class='tests orders-button orders-button-disabled' onclick='buildOptions(this);highlightBTN(this);'>Urine LAM Test</div>";
}

function highlightBTN(e) {
  var btns = document.getElementsByClassName("tests");
  for(var i = 0 ; i < btns.length ; i++){
    btns[i].setAttribute("class","tests orders-button orders-button-disabled");
  }
  e.setAttribute("class","tests orders-button");
}

function buildOptions(element) {
  var innerRight = document.getElementById("inner-right");
  innerRight.innerHTML = null;

  var container = document.createElement("div");
  container.setAttribute("style","width: 99%;");
  innerRight.appendChild(container);

  var ul = document.createElement("ul");
  ul.setAttribute("id","result-list");
  container.appendChild(ul);

/*
<li id="1" tstvalue="Yes" class="odd" tag="odd" onmousedown="" onclick="null; updateTouchscreenInputForSelect(this); " style="background-color: lightblue;">Yes</li>

ddd
*/

  var lists = ["Negative","Positive"];
  for(var i = 0 ; i < lists.length ; i++){
    var li = document.createElement("li");
    li.setAttribute("class","result-list odd");
    li.innerHTML = lists[i];
    li.setAttribute("value", lists[i]);


    li.setAttribute("id", (i + 1));
    li.setAttribute("tstvalue", lists[i]);
    li.setAttribute("onmousedown", "selectTestResult(this);");
    li.setAttribute("test", element.getAttribute("test"));
    

    ul.appendChild(li);
  }

}

function selectTestResult(e){
  var list = document.getElementsByClassName("result-list");
  for(var i = 0 ; i < list.length ; i++){
    list[i].setAttribute("style","background-color: clear;");
  }
  e.setAttribute("style","background-color: lightblue;");

  testResults[e.getAttribute("test")] = e.innerHTML;
}
