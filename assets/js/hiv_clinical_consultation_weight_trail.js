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
  }


  buildChart();
}

function weightSummaryTable() {
  var table = "<table id='weight-summary-table'>";
  table += "<tr><th>Initial Weight</th></tr>";
  table += "<tr><td id='initial-weight'>&nbsp;</td></tr>";
  table += "<tr><th>Latest Weight</th></tr>";
  table += "<tr><td id='latest-weight'>&nbsp;</td></tr>";
  table += "<tr><th>Patient's age</th></tr>";
  table += "<tr><td id='patient-age'>&nbsp;</td></tr>";


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


function buildChart() {
  passedData = [];
  passedData.push(['2018-01-15', 48.9]);
  passedData.push(['2018-06-08', 58.9]);
  passedData.push(['2018-07-12', 68.9]);
  passedData.push(['2018-08-19', 78.9]);
  passedData.push(['2018-10-16', 85.9]);

  formatData(passedData);  
}

function plotChart(data) {

  Highcharts.chart('chart-container-left', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Weight trail (for 2 year priod)'
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
        data: data
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
