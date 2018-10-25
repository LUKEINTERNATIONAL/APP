
function buildSummary() {
  var tar = document.getElementById("inputFrame" + tstCurrentPage);
  tar.style.display = "flex";
  tar.style.width = "96%";
  var leftSide = document.createElement("div");
  var rightSide = document.createElement("div");
  rightSide.setAttribute("id", "right-side");
  rightSide.style.width = "80%";
  rightSide.style.height = "500px";
  leftSide.setAttribute("id", "left-side");
  leftSide.innerHTML = "<div class='orders' onclick='buildOrders();'> Lab Tests </div>";
  leftSide.innerHTML += "<div class='orders' onclick='buildTests();'> Results </div>";
  leftSide.style.height = "500px";
  leftSide.style.width = "15%";
  leftSide.style.borderRight = "1px solid black";
  tar.appendChild(leftSide);
  tar.appendChild(rightSide);
}

function buildOrders() {
  var rightSide = document.getElementById("right-side");
  rightSide.style.display ="inline";
  rightSide.innerHTML = "<p class='orderList'> CD4 count test = not ordered </p><br><p class='orderList'> CRAG Test = not ordered </p><br><p class='orderList'> Urine LAM Test = not ordered </p>"
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
}

function testFunctions() {
  var innerLeft = document.getElementById("inner-left");
  innerLeft.innerHTML = "<div class='orders' onclick='buildKeyPad();'>CD4 Count Test</div>";
  innerLeft.innerHTML += "<div class='orders' onclick='buildOptions(this);'>CRAG Test</div>";
  innerLeft.innerHTML += "<div class='orders' onclick='buildOptions(this);'>Urine LAM Test</div>";
}

function buildOptions(element) {
  var top = document.createElement("div");
  top.setAttribute("class", "selections")
  top.setAttribute("id", "right-top");
  top.style.backgroundColor = "#efefef";
  top.style.color = "black";
  top.innerHTML = element.innerHTML;
  var positive = document.createElement("div");
  positive.setAttribute("id", "postive-div");
  positive.setAttribute("class", "selections");
  positive.innerHTML = "Positive";
  positive.setAttribute("onclick", "setActivities(this);this.style.backgroundColor='green'");
  var negative = document.createElement("div");
  negative.setAttribute("id", "negative-div");
  negative.setAttribute("class", "selections");
  negative.setAttribute("onclick", "setActivities(this);this.style.backgroundColor='green'");
  negative.innerHTML = "Negative";
  var innerRight = document.getElementById("inner-right");
  innerRight.innerHTML = "";
  innerRight.appendChild(top);
  innerRight.appendChild(negative);
  innerRight.appendChild(positive);
}

function setActivities(element){
  var elems = document.getElementsByClassName('selections');
  var currentTest = document.getElementById("right-top").innerHTML;
  sessionStorage.setItem(currentTest, element.innerHTML);
 for (let index = 0; index < elems.length; index++) {
   elems[index].style.backgroundColor = 'rgb(135, 144, 135)'
 }
}