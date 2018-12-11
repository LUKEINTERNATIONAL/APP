function getWeights() {
  passedData = [];
  var url = 'http://'+apiURL+':'+apiPort+'/api/v1/observations/?person_id='+sessionStorage.patientID+'&concept_id=5089';
          var req = new XMLHttpRequest();
          req.onreadystatechange = function(){
          
          if (this.readyState == 4) {
          if (this.status == 200) {
              var results = JSON.parse(this.responseText);
              var length = results.length;
              sessionStorage.currentWeight = results[0].value_numeric;
              getHeight();
              try {
                sessionStorage.previousWeight = results[1].value_numeric;;
              }catch(e) {
                sessionStorage.previousWeight = 0;
              }
            
              //  = 
              for (let index = 0; index < results.length; index++) {
                passedData.push([moment(results[index].obs_datetime).format("YYYY-MM-DD"), results[index].value_numeric]);
              }
              formatData(passedData);  
              }
          }
          };
          try {
              req.open('GET', url, false);
              req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));
              req.send(null);
              setValues();
          } catch (e) {

          }
}
function getHeight() {
  var url = 'http://'+apiURL+':'+apiPort+'/api/v1/observations/?person_id='+sessionStorage.patientID+'&concept_id=5090';
          var req = new XMLHttpRequest();
          req.onreadystatechange = function(){
          
          if (this.readyState == 4) {
          if (this.status == 200) {
              var results = JSON.parse(this.responseText);
              sessionStorage.currentHeight = results[0].value_numeric;
              }
          }
          };
          try {
              req.open('GET', url, false);
              req.setRequestHeader('Authorization',sessionStorage.getItem('authorization'));
              req.send(null);
          } catch (e) {

          }
          
}
function buildWeightHistory() {
  var frame = document.getElementById("inputFrame" + tstCurrentPage);
  frame.style = "width: 96%; height: 89%;";

  var container = document.createElement("div");
  container.setAttribute("class","chart-container-table");
  frame.appendChild(container);
  
  var containerRow = document.createElement("div");
  containerRow.setAttribute("class","chart-container-row");
  container.appendChild(containerRow);

  var cells = ["left","right"];

  for(var i = 0 ; i < cells.length ; i++){
    var containerCell = document.createElement("div");
    containerCell.setAttribute("class","chart-container-cell");
    containerCell.setAttribute("id","chart-container-" + cells[i]);
    if(i == 1) {
      containerCell.innerHTML = weightSummaryTable();
    }

    containerRow.appendChild(containerCell);
    getWeights();
  }

  
}

function setValues() {
  var weight = sessionStorage.currentWeight;
  var height = sessionStorage.currentHeight;
  sessionStorage.weightLoss = 0;
  if (weight < sessionStorage.previousWeight) {
    var decrease = sessionStorage.previousWeight - weight;
    var weightPercentage = (decrease/sessionStorage.previousWeight)*100;
      document.getElementById('weight-percentage').innerHTML += Math.round(weightPercentage) + "% <img src='/assets/images/drop-down-arrow.svg' height='50px' width='50px'> </img>";
    
    sessionStorage.setItem("weightLoss", Math.round(weightPercentage));
  }
  else if (weight > sessionStorage.previousWeight) {
    var decrease = sessionStorage.previousWeight - weight;
    var weightPercentage = (decrease/sessionStorage.previousWeight)*100;
    if (weightPercentage < 0) {
      weightPercentage = weightPercentage * -1;
    }
    if (sessionStorage.previousWeight != 0) {
    document.getElementById('weight-percentage').innerHTML += Math.round(weightPercentage) + "% <img src='/assets/images/drop-up-arrow.svg' height='50px' width='50px'> </img>";
    }
  }
  var gender;
  var bmindex = (weight /height/ height) * 10000;
  var bmindex = Math.round( bmindex * 10 ) / 10;
  sessionStorage.bmi = bmindex;
  if (sessionStorage.patientGender === "F") {
    gender = "female";
  }else if (sessionStorage.patientGender === "M") {
    gender = "male";
  } 
  getBMIResult(gender, sessionStorage.patientAge, bmindex);
  if (sessionStorage.previousWeight != 0) { 
    document.getElementById("initial-weight").innerHTML += sessionStorage.previousWeight;
  }
  
  document.getElementById("latest-weight").innerHTML += sessionStorage.currentWeight;
  document.getElementById("patient-age").innerHTML += sessionStorage.patientAge;
  document.getElementById('patient-bmi').innerHTML += bmindex;
  document.getElementById('patient-bmiResult').style.backgroundColor = sessionStorage.bmiColor;
  document.getElementById('patient-bmiResult').innerHTML += sessionStorage.bmiResult;

}
function weightSummaryTable() {
  
  var table = "<table id='weight-summary-table' >";
  table += "<tr><th>Previous Weight</th> <th id='initial-weight'>&nbsp;</th></tr>";
  table += "<tr><th>Latest Weight</th><th id='latest-weight'>&nbsp;</th></tr>";
  table += "<tr><th>Latest Weight change</th><th id='weight-percentage'>&nbsp;</th></tr>";
  table += "<tr><th>Patient's age</th><th id='patient-age'>&nbsp;</th></tr>";
  table += "<tr><th>Patient BMI</th><th id='patient-bmi'>&nbsp;</th></tr>";
  table += "<tr><td id='patient-bmiResult' style='height: 70px;color: white;text-align: center; ' colspan=2>&nbsp;</td></tr>";
  
  return table;
}

function fallbackHandler(options) {
  if (options.type !== 'image/svg+xml' && isEdgeBrowser ||
    options.type === 'application/pdf' && isMSBrowser) {
      addText(options.type + ' fell back on purpose');
  } else {
    throw 'Should not have to fall back for this combination. ' + options.type;
  }
}

function plotChart(data) {

  Highcharts.chart('chart-container-left', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Weight trail (for 2 year period)'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Weight (kg)'
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 10
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: 'Weight',
        data: data,
        dataLabels: {
          enabled: true,
          formatter: function(){
          var index = this.series.data.indexOf(this.point);
          var secondYa = this.series.chart.series[0].yData[index - 1];
          if (secondYa == 0 || secondYa == undefined) {
            return "";
          }
          var firstY = this.y;
          return (((secondYa/firstY)*100)-100).toFixed(2)+' %';
          }
      }
      }]
    });

}

function formatData(obs) {
  data = [];
  for(var i = 0; i < obs.length; i++) {
    data.push([ getDateWithFormat(obs[i][0]), obs[i][1] ]);
  }
  plotChart(data);
}

function getDateWithFormat(d) {
  newDate = new Date(d);
  var day = newDate.getDate();
  var monthIndex = newDate.getMonth();
  var year = newDate.getFullYear();

  return Date.UTC(year,monthIndex,day);

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return day + "/" + months[monthIndex] + '/' + year;
  return day + "/" + months[monthIndex] + '/' + year;
}

function getDateWithFormat(d) {
  newDate = new Date(d);
  var day = newDate.getDate();
  var monthIndex = newDate.getMonth();
  var year = newDate.getFullYear();

  return Date.UTC(year,monthIndex,day);

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return day + "/" + months[monthIndex] + '/' + year;
  return day + "/" + months[monthIndex] + '/' + year;
}

function dataG() {
  var correctedWeights = [];
    
  for(var i = 0; i < weights.length; i++) {
    correctedWeights.push(weights[i][1]);
  }
  return [{name: 'Weight', data: correctedWeights}];
}

function getDates() {
  dates = [];
  for(var i = 0; i < weights.length; i++) {
    dates.push(weights[i][0]);
  }
  return dates;
}