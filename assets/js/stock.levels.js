

function buildChart(chart_type) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'width: 96%; height: 90%;';

  if(chart_type == 'pediatric')
    var src = '/views/stock_management/stock_levels_graph_paeds.html';

  if(chart_type == 'adult')
    var src = '/views/stock_management/stock_levels_graph_paeds.html';

  var chart   = document.createElement("embed");
  chart.setAttribute("src", src);
  chart.setAttribute("style","margin-left: 10px; height: 99%; width: 98%;");
  frame.appendChild(chart); 
}

