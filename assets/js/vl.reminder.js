
var vl_info;

function getARTstartedDate() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID;
  url += '/vl_info?date=' + sessionStorage.sessionDate;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
      vl_info = JSON.parse(this.responseText);
      if(Object.keys(vl_info).length > 0)
        processVLalert();

    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function processVLalert() {
  var eligibile = vl_info.eligibile;
  var earliest_start_date = moment(vl_info.earliest_start_date).format('DD/MMM/YYYY');
  var milestone = vl_info.milestone;
  var period_on_art = vl_info.period_on_art;

  if(eligibile == false) 
    return;

  milestoneAlert();   
}

function milestoneAlert() {
}
