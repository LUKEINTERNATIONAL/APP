var side_effects_history = {};

function consultationHistory() {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'width: 96%; height: 90%;';

  var table = document.createElement('table');
  table.setAttribute('id', 'consultation-history-table');
  frame.appendChild(table);


  var headers = ['Date','Condition'];
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var tr = document.createElement('tr');
  thead.appendChild(tr);

  for(var i = 0 ; i < headers.length ; i++) {
    var th = document.createElement('th');
    th.innerHTML = headers[i];
    tr.appendChild(th);
  }

  loadSE(side_effects_history);
}

function pullPastConditions() {

  var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
  url += '/programs/1/patients/' + sessionStorage.patientID;
  url += '/medication_side_effects?date=' + sessionStorage.sessionDate;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
          var obs = JSON.parse(this.responseText);
          side_effects_history = obs;
      }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();

}

function loadSE(data) {
  var table = document.getElementById('consultation-history-table');
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for(obs_date in data) {
    var tr = document.createElement('tr');
    tbody.appendChild(tr);

    td = document.createElement('td');
    td.innerHTML = moment(obs_date).format('DD/MMM/YYYY');
    tr.appendChild(td);

    var conditions = data[obs_date];
    td = document.createElement('td');
    tr.appendChild(td);
   
    min_table = document.createElement('table');
    min_table.setAttribute('class','min-consultation-history-tables');
    td.appendChild(min_table);
    
    for(concept_id in conditions) {
      var min_tr = document.createElement('tr');
      min_table.appendChild(min_tr);

      min_td = document.createElement('td');
      min_td.innerHTML = conditions[concept_id].name;
      min_tr.appendChild(min_td);

      min_td = document.createElement('td');

      try {
        var drug_induced = conditions[concept_id].drug_induced == false ? 'Not drug-induced' : 'Drug-induced';
        min_td.innerHTML = '(' + drug_induced + ')';
      }catch(i){
      }

      if (conditions[concept_id].drug != 'N/A') {
        min_td.innerHTML += '  :' + conditions[concept_id].drug;
      }
      min_tr.appendChild(min_td);
    }
  }

  if(isHashEmpty(data)) {
    var tr = document.createElement('tr');
    tbody.appendChild(tr);

    var td = document.createElement('td');
    td.setAttribute('colspan', 2);
    td.innerHTML = 'No past Side effects / Contraindications';
    td.style = 'text-align: center;font-size: 25px;';
    tr.appendChild(td);
  }
    


}
  
  
pullPastConditions();
