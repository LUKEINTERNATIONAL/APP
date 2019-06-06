
var ftALertCSS = document.createElement('span');
ftALertCSS.innerHTML = "<style>\
#box-cover{\
  display: none;\
  position: absolute;\
  background-color: black;\
  width: 100%;\
  height: 102%;\
  left: 0%;\
  top: 0%;\
  z-index: 990;\
  opacity: 0.65;\
}\
#popup-box {\
  display: none;\
  background-color: #F4F4F4;\
  border: 2px solid #E0E0E0;\
  border-radius: 15px;\
  height: 80%;\
  padding: 5px;\
  position: absolute;\
  top: 50px;\
  width: 98%;\
  /*margin-left: 430px;*/\
  left: 10;\
  z-index: 991;\
}\
.buttonContainer {\
  width: 97%;\
  display: table;\
  position: absolute;\
  bottom: 0px;\
  padding: 10px;\
  border-collapse: separate;\
  border-spacing: 5px 10px;\
}\
.buttonContainerRow {\
  display: table-row;\
}\
.buttonContainerCell {\
  display: table-cell;\
  border-width: 1px;\
  border-style: solid;\
  text-align: center;\
  vertical-align: middle;\
  box-shadow: 0 8px 6px -6px black;\
  height: 100px;\
  font-weight: bold;\
  font-size: 20px;\
  color: white;\
}\
#buttonContainerCell-green {\
  background-color: rgb(34, 139, 34);\
}\
#buttonContainerCell-blue {\
  background-color: rgb(79, 148, 205);\
}\
#buttonContainerCell-red {\
  background-color: tomato;\
}\
</style>";

var previousActionFT;

function setUpFTalert(e) {
  previousActionFT = e.getAttribute('onmousedown');
  if(previousActionFT == null || previousActionFT.length < 1){
    previousActionFT = e.getAttribute('onclick');
  }

  e.setAttribute('onmousedown','isOnFT();');
  e.setAttribute('onclick','');
  buildFTalertBox();
}

function buildFTalertBox() {
  var box = document.createElement('div');
  box.setAttribute('id','popup-box');
  
  var textDIV = document.createElement('div');
  box.appendChild(textDIV);

  textDIV.innerHTML = "Client is on <b>Fast Track</b> visit<br />"
  textDIV.innerHTML += "Is the client <b>OK</b> to continue?"
  var css = "top: 25%;position: absolute;left: 30%;font-size: 30px;"
  textDIV.style = css;

  var boxCover = document.createElement('div');
  boxCover.setAttribute('id','box-cover');

  var pBody = document.getElementsByTagName('body')[0];
  
  pBody.appendChild(ftALertCSS);
  pBody.appendChild(box);
  pBody.appendChild(boxCover);
}

function isOnFT() {
  var box = document.getElementById('popup-box');
  var boxCover = document.getElementById('box-cover');

  box.style = 'display: inline;';
  boxCover.style = 'display: inline;';



  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  box.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Stop','Continue'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-red');
      buttonContainerCell.setAttribute('onmousedown','cancelFT();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-green');
      buttonContainerCell.setAttribute('onmousedown','continueWithFT();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

function continueWithFT() {
  eval(previousActionFT);
  var box = document.getElementById('popup-box');
  var boxCover = document.getElementById('box-cover');
  box.style = "display: none;";
  boxCover.style = 'display: none;'
}

function cancelFT() {
  var patient_id = sessionStorage.patientID;
  if (patient_id.length < 1 || patient_id == null || patient_id == 'null'){
    var url = new URL(location.href);
    patient_id = parseInt(url.searchParams.get("patient_id"));
  }

  var url = sessionStorage.apiProtocol+ '://'+apiURL+':'+apiPort+'/api/v1/cancel_fast_track';
  url += '?person_id=' + patient_id + '&date=' + sessionStorage.sessionDate;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4) {
      if (this.status == 200) {
        eval(previousActionFT);
        var box = document.getElementById('popup-box');
        var boxCover = document.getElementById('box-cover');
        box.style = "display: none;";
        boxCover.style = 'display: none;'
      }
    }
  };
  try {
    req.open('POST', url, true);
    req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));
    req.send(null);
  } catch (e) {

  }
}
