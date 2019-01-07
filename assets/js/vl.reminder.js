
var arv_earliest_start_dates;

function dateDiffInMonths(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7 * 4);
  return Math.abs(Math.round(diff));
}

function getARTstartedDate() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID;
  url += '/earliest_start_date';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      arv_earliest_start_dates = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function calculateVLreminder() {
  if(arv_earliest_start_dates.earliest_start_date == null){
    return false;
  }

  var earliest_start_date = arv_earliest_start_dates.earliest_start_date
  var period_on_art;

  var date1 = new Date(sessionStorage.sessionDate);
  var date2 = new Date(earliest_start_date);

  //period_on_art = dateDiffInMonths(date1, date2);
  if(sessionStorage.sessionDate == moment().format('YYYY-MM-DD'))
    checkIFwithVLBounds();

}

var VLdate;

function checkIFwithVLBounds() {
  var rows = document.getElementsByClassName('lab-orders');
  for(var i = 0 ; i < rows.length ; i++){
    var test = rows[i].children[0];
    if(test.innerHTML.match(/viral/i)){
      var vlD = (rows[i].children[1].innerHTML);
      if(VLdate == undefined)
        VLdate = moment(vlD).format('YYYY-MM-DD');

      if(moment(vlD).format('YYYY-MM-DD') > VLdate){
        VLdate = moment(vlD).format('YYYY-MM-DD');
      }
   }

  }

  var earliest_start_date = (arv_earliest_start_dates.earliest_start_date)
  var date1 = new Date(sessionStorage.sessionDate);
  var date2 = new Date(earliest_start_date);
  var period_on_art = dateDiffInMonths(date1, date2);
  
  var time_bounds = [];
  time_bounds.push({start: 6, end: 12});
  var cutoff = 24;
  var i = 0;

  while(i <= 36) {
    time_bounds.push({start: (cutoff - 1), end: (cutoff + 12)});
    cutoff += 24
    i++
  }

  for(var i = 0 ; i < time_bounds.length ; i++){
    if(period_on_art >= time_bounds[i].start && period_on_art <= time_bounds[i].end){
      vlAlert(period_on_art);
      break;
    }
  }
}

function vlAlert(period_on_art){
  var popUpBox = document.getElementById('vl-popup-div');
  var coverDIV = document.getElementById('vl-cover-div');

  if(coverDIV == undefined) {
    var coverDIV = document.createElement('div')
    coverDIV.setAttribute('id','vl-cover-div');
    var popUpBox = document.createElement('div')
    popUpBox.setAttribute('id','vl-popup-div');

    var hmtlBody = document.getElementsByTagName("body")[0];
    hmtlBody.appendChild(popUpBox);
    hmtlBody.appendChild(coverDIV);
  }

  coverDIV.style = 'display: inline;top: 0px;';
  popUpBox.style  = 'display: inline;top: 10px;';
  popUpBox.innerHTML = null;

  var message = vlFirstMessage(period_on_art);

  var p = document.createElement('p');
  p.innerHTML = message;
  cssText = 'text-align: center;color: green; font-weight: bold; font-size: 2.3em;';
  cssText += 'margin-top: 10%;';
  p.style = cssText;
  popUpBox.appendChild(p);



  /* ............... buttons ............................... */
  var buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('class','buttonContainer');
  popUpBox.appendChild(buttonContainer);

  var buttonContainerRow = document.createElement('div');
  buttonContainerRow.setAttribute('class','buttonContainerRow');
  buttonContainer.appendChild(buttonContainerRow);

  var cells = ['Remind later','Order VL'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-red');
      buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();');
    }else if(i == 1) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();pressOrder();');
    }

    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

function vlFirstMessage(months){
  var message = "VL milestone has been reached<br />";
  message += "It has been <b style='color: red;'>" + months + " </b>months since ART treatment<br />"
  message += "was started on the <b style='color: black;'>";
  message += moment(new Date(arv_earliest_start_dates.earliest_start_date)).format('DD/MMM/YYYY') + '</b>';

  return message;
}

function cancelVLOrder() {
  var div = document.getElementById('vl-popup-div')
  div.innerHTML = null;
  div.style = 'display: none;';
  document.getElementById('vl-cover-div').style = 'display: none;';
}

getARTstartedDate();
