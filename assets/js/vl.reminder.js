
var arv_earliest_start_dates;

function dateDiffInMonths(d2, d1) {
  var d1Y = d1.getFullYear();
  var d2Y = d2.getFullYear();
  var d1M = d1.getMonth();
  var d2M = d2.getMonth();

  return (d2M+12*d2Y)-(d1M+12*d1Y);
}

function getARTstartedDate() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID;
  url += '/earliest_start_date';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      arv_earliest_start_dates = JSON.parse(this.responseText);
      checkIfVLresultsWithinBounds()
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

  //The VL reminder is suppose to work in realtime only hence the following check 
  //if(sessionStorage.sessionDate == moment().format('YYYY-MM-DD'))
    checkIFwithVLBounds();

}

var VLdate;

function checkIFwithVLBounds() {
  var rows = document.getElementsByClassName('lab-orders');
  for(var i = 0 ; i < rows.length ; i++){
    var test = rows[i].children[0];
    if(test.innerHTML.match(/viral/i)){
      var vlD = (rows[i].children[3].innerHTML);
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
  var cutoff = 12;
  var i = 0;

  console.log(period_on_art)

  while(i <= 36) {
    time_bounds.push({start: (cutoff), end: (cutoff + 12)});
    cutoff += 12
    i++
  }

  
  if(VLdate == undefined) {
    for(var i = 0 ; i < time_bounds.length ; i++){

      if(period_on_art >= time_bounds[i].start && period_on_art <= time_bounds[i].end){
        vlAlert(period_on_art);
        break;
      }
      if((period_on_art + 1) == time_bounds[i].start && (vlAlertReminderDone == false)){
        vlAlertReminder(period_on_art);
        break;
      }
    }
  }else{
    for(var i = 0 ; i < time_bounds.length ; i++){

      if(period_on_art >= time_bounds[i].start && period_on_art <= time_bounds[i].end){
        vlAlert(period_on_art);
        break;
      }
      if((period_on_art + 1) == time_bounds[i].start && (vlAlertReminderDone == false)){
        vlAlertReminder(period_on_art);
        break;
      }
    }
    /*
    var date1 = new Date(sessionStorage.sessionDate);
    var date2 = new Date(VLdate);
    var months_since_last_VL = dateDiffInMonths(date1, date2);
    for(var i = 0 ; i < time_bounds.length ; i++){
      if(period_on_art >= time_bounds[i].start && period_on_art <= time_bounds[i].end){
        console.log(time_bounds[i].start + " ---- " + time_bounds[i].end);
        var within_12_months = (months_since_last_VL >= 0 && months_since_last_VL <= 12);
        console.log(within_12_months)
        if(within_12_months == false){
          vlAlert(period_on_art);
          break;
        }
      }
    } */
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

  var cells = ['Remind later','Wait till<br />next milestone','Order VL'];

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
      buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();');
    }else if(i == 2) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-green');
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

var  vlAlertReminderDone = false;

function vlAlertReminder(period_on_art){
  vlAlertReminderDone = true;
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
  popUpBox.style  = 'background-color: lightyellow;display: inline;top: 10px;';
  popUpBox.innerHTML = null;

  var message = "VL check in one month time.<br />";
  message += "It has been <b style='color: red;'>" + period_on_art + " </b>months since ART treatment<br />"
  message += "was started on the <b style='color: black;'>";
  message += moment(new Date(arv_earliest_start_dates.earliest_start_date)).format('DD/MMM/YYYY') + '</b>';

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

  var cells = ['OK'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
    buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();');
    buttonContainerRow.appendChild(buttonContainerCell);
  }
}

function VLordered() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/observations?person_id=' + sessionStorage.patientID;
  url += '&date=' + sessionStorage.sessionDate;
  url += '&concept_id=6659';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      var obs = JSON.parse(this.responseText);
      var obs_datetimes;
      var obs_date;
      var results_given;

      for(var i = 0 ; i < obs.length ; i++){
        obs_date = new Date(  moment(obs[i].obs_datetime).format('YYYY-MM-DD') );
        if(obs_datetimes == undefined){
          obs_datetimes = obs_date;
          results_given = obs[i].value_coded;
        }else if (obs_date > obs_datetimes){
          obs_datetimes = obs_date;
          results_given = obs[i].value_coded;
        }
      }

      if(results_given == undefined) {
        calculateVLreminder();
      }else if(parseInt(results_given) == 1065){
        calculateVLreminder();
      }else if(parseInt(results_given) == 1066){
        var curr_date = new Date(sessionStorage.sessionDate);
        var months_passed = dateDiffInMonths(curr_date, obs_datetimes);
        
        if(months_passed >= 3) {
          calculateVLreminder();
        }else{
          if(askIfresultsAvailable_shown == false)
            askIfresultsAvailable(obs_datetimes);

        }

      }
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

var askIfresultsAvailable_shown = false;

function askIfresultsAvailable(obs_date) {
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
  popUpBox.style  = 'background-color: lightyellow;display: inline;top: 10px;';
  popUpBox.innerHTML = null;

  var message = "VL test ordered on<br />";
  message += "<b style='color: red;'>" + moment(obs_date).format('DD/MMM/YYYY') + "</b>";
  message += "<br />Check if the results are available";

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

  var cells = ['OK'];

  for(var i = 0 ; i < cells.length ; i++){
    var buttonContainerCell = document.createElement('div');
    buttonContainerCell.setAttribute('class','buttonContainerCell');
    buttonContainerCell.setAttribute('style','width: 100px;');
    buttonContainerCell.innerHTML = cells[i];

    //if(i == 0) {
      buttonContainerCell.setAttribute('id','buttonContainerCell-blue');
      buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();');
    /* }else if(i == 1) { 
      buttonContainerCell.setAttribute('id','buttonContainerCell-red');
      buttonContainerCell.setAttribute('onmousedown','cancelVLOrder();');
    } */

    buttonContainerRow.appendChild(buttonContainerCell);
  }

  askIfresultsAvailable_shown = true;
}

function checkIfVLresultsWithinBounds() {
  for(var i = 0 ; i < VLresults.length; i++){
    var results = VLresults[i].results;
    var rdate = VLresults[i].result_date;
    var row_id = VLresults[i].row_id;

    if(results.match(/>|=/)) {
      var actual_int = results.replace('=','').replace('>');
      if(parseFloat(actual_int) >= 938)
        document.getElementById(row_id).style = 'background-color: red; color: white;';

    }
  }
  VLordered();
}
//getARTstartedDate();
