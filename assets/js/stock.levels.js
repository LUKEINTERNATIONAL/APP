

function buildChart(l) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'width: 96%; height: 90%;';

  var div = document.createElement('div');
  div.setAttribute('id','chart-container');
  frame.appendChild(div);
  chartBuilder(frame.id);
}

function chartBuilder(container_id) {
    console.log(container_id)
    var drugs = [];
    var dataG = [];

    Highcharts.chart(container_id, {
      chart: {
        type: 'bar',
        borderWidth: 1,
        plotBorderWidth: 1,
        // Edit chart spacing
        spacingBottom: 15,
        spacingTop: 10,
        spacingLeft: 10,
        spacingRight: 10,
        // Explicitly tell the width and height of a chart
        height: 580

      },
      title: {
        style: {
          fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
          fontSize: '14px'
        },
        text: 'ARV Stock Levels At '
      },
      xAxis: {
        categories: drugs,
        title: {
          text: null,
          style: {
            font: "12px 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif"
          }

        },
        labels: {
          style: {
            color: '#000000',
            font: "12px Arial, 'Helvetica Neue', Helvetica, sans-serif;"
          },

          formatter: function () {
            if (!data_list[this.value]["active"])
            {
              return '<span style="fill: grey;">' + this.value + '</span>';
            }
            else if (data_list[this.value]["stocked_out"]) {

              return '<span style="fill: red;">' + this.value + '</span>';

            }
            else {
              return this.value;
            }
          }

        }
      },
      yAxis: {
        min: 0,
        max: 9,
        tickInterval: 1,
        title: {
          text: 'Months of Stock',
          align: 'high',
          style: {
            font: "13px 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif"
          }
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#000000',
            font: "13px 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif"
          }
        },
        plotBands: [{ // mark the weekend
            color: '#66CDAA',
            from: 2,
            to: 5
          },
          {
            color: 'rgb(225, 225, 225)',
            from: 0,
            to: 2
          },
          {
            color: 'rgb(225, 225, 225)',
            from: 5,
            to: 9
          }]
      },
      tooltip: {
        shared: true,
        useHTML: true,
        valueSuffix: ' ',
        formatter: function() {

          var stock_level_string = (this.y == 0) ? ' 0' : ' ' +
            ((parseInt(this.y) == 0) ? '' :  parseInt(this.y) + (parseInt(this.y) == 1 ? ' month ': ' months ')) +
            parseInt((this.y*30 % 30)) + ( parseInt((this.y*30 % 30)) == 1 ? " day" :  " days");

          return '<span  style= "font-weight: bold; font-size : 10px;">' +
            'Drug Name:  &nbsp&nbsp&nbsp&nbsp<span style="color: #097054; " >' + this.x + '</span> <br />' +
            'Months of stock:  &nbsp&nbsp&nbsp<span style="color: #097054; " >' + stock_level_string + '</span> <br />' +
            'Stock level:  &nbsp&nbsp&nbsp<span style="color: #097054; ">' + data_list[this.x]['stock_level'] + ' tins</span><br />' +
            'Consumption rate:  &nbsp&nbsp&nbsp<span style="color: #097054; ">' + data_list[this.x]['consumption_rate'] + ' tins/month</span> </span>';
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false
          }
        }
      },
      credits: {
        enabled: false
      },
      series: dataG,
      exporting: { enabled: false }


    });

  }

