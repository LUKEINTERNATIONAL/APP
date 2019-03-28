
function populateMedicationHistory() {
  var wBody = document.getElementsByTagName('body')[0];
  
  try {
    var div1 = document.getElementById('med-history-cover');
    var div2 = document.getElementById('med-history-box');
    wBody.removeChild(div1);
    wBody.removeChild(div2);
  }catch(e){
  }
    
  var span = document.createElement('span');
  span.innerHTML = "<style>\
    #med-history-cover {\
    position: absolute;\
    background-color: black;\
    width: 100%;\
    height: 102%;\
    left: 0%;\
    top: 0%;\
    z-index: 990;\
    opacity: 0.65;\
  }\
#med-history-box {\
  background-color: #F4F4F4;\
  border: 2px solid #E0E0E0;\
  border-radius: 9px;\
  height: 95%;\
  padding: 5px;\
  position: absolute;\
  top: 5px;\
  width: 98%;\
  left: 1%;\
  z-index: 991;\
}\
#med-footer {\
  padding: 15px;\
  text-align: right;\
  border-top: 1px solid #e5e5e5;\
  bottom: 1px;\
  position: absolute;\
  width: 100%;\
}\
#med-footer-button {\
}\
#med-history-table {\
  width: 100%;\
}\
#med-history-table th {\
  background-color: teal;\
  color: white;\
  border-style: solid;\
  border-width: 1px;\
}\
.date-columns {\
  text-align: center;\
  width: 50px;\
}\
.quantity-columns {\
  text-align: right;\
  width: 50px;\
  padding-right: 5px;\
}\
.medication-columns {\
  text-align: left;\
  width: 25%; !important\
  padding-left: 5px;\
}\
#medication-history-tbody td {\
  border-style: solid;\
  border-width: 0px 0px 1px 0px;\
}\
</style>";
  
  var medHistoryBox = document.createElement('div');
  medHistoryBox.setAttribute('id','med-history-box');

  var medHistoryCover = document.createElement('div');
  medHistoryCover.setAttribute('id','med-history-cover');

  wBody.appendChild(medHistoryCover);
  wBody.appendChild(medHistoryBox);
  wBody.appendChild(span);

  addMedFooter(medHistoryBox);
  addMedTable(medHistoryBox);
}

function addMedFooter(container) {
  var footer = document.createElement('div');
  footer.setAttribute('id','med-footer');
  container.appendChild(footer);

  var close_button = document.createElement('button');
  close_button.setAttribute('class','button navButton red');
  close_button.setAttribute('id','med-footer-button');
  close_button.setAttribute('onmousedown','closeMedHistory();');
  close_button.innerHTML = '<span>&nbsp;&nbsp;&nbsp;&nbsp;Close&nbsp;&nbsp;&nbsp;&nbsp;</span>';
  footer.appendChild(close_button);
}

function closeMedHistory() {
  var wBody = document.getElementsByTagName('body')[0];
  var div1 = document.getElementById('med-history-cover');
  var div2 = document.getElementById('med-history-box');
  wBody.removeChild(div1);
  wBody.removeChild(div2);
}

function addMedTable(container) {
  var table = document.createElement('table');
  table.setAttribute('id','med-history-table');
  container.appendChild(table);

  var thead = document.createElement('thead');
  table.appendChild(thead);

  var tr = document.createElement('tr');
  thead.appendChild(tr);

  var cells = ['Medication','Start date','End date','Amount given'];
  for(var i = 0 ; i < cells.length ; i++){
    var th = document.createElement('th');
    th.innerHTML = cells[i];
    tr.appendChild(th);

    if(i == 1 || i == 2)
      th.setAttribute('class','date-columns');
    
    if(i == 3)
      th.setAttribute('class','quantity-columns');

    if(i == 0)
      th.setAttribute('class','medication-columns');

  }

  var tbody = document.createElement('tbody');
  tbody.setAttribute('id','medication-history-tbody');
  table.appendChild(tbody);

  initiateDataTable();
  fetchMedicationOrders();
}
            
var ordersTable;            
function initiateDataTable() {
  ordersTable = jQuery('#med-history-table').DataTable( {
    fixedHeader: true,
    searching: false,
    paging: false,
    scrollY: 555,
    scroller: {
      loadingIndicator: true
    }
  } );
}

function fetchMedicationOrders() {
  var url = apiProtocol + "://" + apiURL + ":" + apiPort;
  url +="/api/v1/drug_orders?patient_id=" + sessionStorage.patientID;
  url += "&page_size=100000";
  //url += "&date=" + sessionStorage.sessionDate;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      addOrders(obj);
    }
  };

  xhttp.open("GET", url , true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function addOrders(data) {
  for(var i = 0 ; i < data.length ; i++){
    var order_id      = data[i].order_id;
    var drug_id       = data[i].drug_inventory_id;
    var medication    = data[i].drug.name;
    var start_date    = moment(data[i].order.start_date).format('DD/MMM/YYYY');
    var end_date      = moment(data[i].order.auto_expire_date).format('DD/MMM/YYYY');
    var quantity      = data[i].quantity;

    ordersTable.row.add([medication, start_date, end_date,  quantity, '&nbsp;']).node().id = order_id;
    ordersTable.draw();
    addClasses(order_id);

    $(".dataTables_scrollHeadInner").css({"width":"100%"});
    $(".table ").css({"width":"100%"});
  }

}

function addClasses(order_id) {
  var row = document.getElementById(order_id);
  var td = row.getElementsByTagName("td")[1];
  td.setAttribute("class","date-columns");

  td = row.getElementsByTagName("td")[2];
  td.setAttribute("class","date-columns");

  td = row.getElementsByTagName("td")[3];
  td.setAttribute("class","quantity-columns");

  td = row.getElementsByTagName("td")[0];
  td.setAttribute("class","medication-columns");

}
