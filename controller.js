'use strict';

const model = new Model('data.json');
var statusColorScale;
var powergapColorScale;
var chart;

model.loadData()
  .then((data) => {
    model.data = data;
    statusColorScale = d3.scaleOrdinal()
      .domain(model.targetRolesByRank)
      .range(d3.schemeSet3);

    chart = new Chart({
      data: model.getDataByDiscipline({sortValuesBy:'targetvalue'}),
      container: document.querySelector('.chart-container'),
      legend: {
        status: d3.select('.legend-status'),
        powergap: d3.select('.legend-powergap')
      },
      infobox: d3.select('.infobox'),
      width: 1000,
      height: 600,
      margin: {top: 10, right: 40, bottom: 40, left: 100},
      categories: model.targetRolesByRank,
      colorScale: statusColorScale,
      dotsPerBandWidth: 3,
      colorScaleParam: 'targetvalue'
    });
    chart.draw();

    //Move this somewhere cleaner
    // Discipline Legend
    d3.select('.legend-status .legend__items').selectAll('button')
      .data(model.targetRolesByRank)
      .enter()
      .append('button')
        .on('mouseover', () => {
          var btn = d3.select(d3.event.target);
          var currentFill = btn.style('background-color');
          btn.style('background-color', () => d3.color(currentFill).darker(0.25));
        })
        .on('mouseout', (d) => {
          d3.select(d3.event.target).style('background-color',
            d => chart.colorScale(d));
        })
        .on('click', (d) => {
          chart.data = model.getDataByDiscipline({
            sortValuesBy: chart.colorScaleParam,
            priorityValue: model.targetRolesByRank.indexOf(d)
          })
          chart.statusFilterValue = model.targetRolesByRank.indexOf(d);
          chart.drawBars();
          chart.drawDots();
          resetBlurb();
        })
        .attr('class', 'btn')
        .style('background-color', (d) => chart.colorScale(d))
        .text((d) => d);

    powergapColorScale = d3.scaleSequential(d3.interpolateBrBG)
      .domain([-model.targetRolesByRank.length, model.targetRolesByRank.length]);

    // Powergap legend
    const powergapScale = [];
    for (let i=-model.targetRolesByRank.length+1, ii=model.targetRolesByRank.length; i<ii; i++) {
      powergapScale.push(i);
    }
    d3.select('.legend-powergap .legend__items').selectAll('span')
      .data(powergapScale)
      .enter()
      .append('span')
        .attr('style', (d) => {
          return `background-color: ${powergapColorScale(d)};`;
        })
        .text((d) => d);

  })
  .catch((error) => {
    throw error;
  });

d3.select('.controls').on('click', function() {
  d3.select(this).selectAll('button').classed('active', false);
  d3.select(d3.event.target).classed('active', true)
});
d3.select('#show-target-role').on('click', showTargetStatus);
d3.select('#show-perp-role').on('click', showPerpStatus);
d3.select('#show-powergap').on('click', showPowerGap);
d3.select('body').on('click', () => {
  if (d3.event.target.nodeName == 'svg' || d3.event.target.nodeName == 'DIV') {
    if (chart.statusFilterValue != null) {
      resetChart();
    } else {
      d3.selectAll('.selected').classed('selected', false);
      resetBlurb();
    }
  }
});

function resetChart() {
  if (chart.colorScaleParam == 'perpvalue') {
    showPerpStatus();
  } else if (chart.colorScaleParam == 'powergap') {
    showPowerGap();
  } else {
    showTargetStatus();
  }
}

function resetBlurb() {
  if (chart.colorScaleParam == 'perpvalue') {
    chart.displayPerpetratorBlurb();
  } else if (chart.colorScaleParam == 'powergap') {
    chart.displayPowerGapBlurb();
  } else {
    chart.displayTargetBlurb();
  }
}

function showTargetStatus() {
  chart.statusFilterValue = null;
  chart.data = model.getDataByDiscipline({sortValuesBy: 'targetvalue'});
  chart.colorScale = statusColorScale;
  chart.colorScaleParam = 'targetvalue';
  chart.drawBars();
  chart.drawDots();
  chart.toggleLegend('powergap','status');
  chart.displayTargetBlurb();
}

function showPerpStatus() {
  chart.statusFilterValue = null;
  chart.data = model.getDataByDiscipline({sortValuesBy: 'perpvalue'});
  chart.colorScale = statusColorScale;
  chart.colorScaleParam = 'perpvalue';
  chart.drawBars();
  chart.drawDots();
  chart.toggleLegend('powergap','status');
  chart.displayPerpetratorBlurb();
}

function showPowerGap() {
  chart.statusFilterValue = null;
  chart.data = model.getDataByDiscipline({sortValuesBy: 'powergap'});
  chart.colorScale = powergapColorScale;
  chart.colorScaleParam = 'powergap';
  chart.drawBars();
  chart.drawDots();
  chart.toggleLegend('status','powergap');
  chart.displayPowerGapBlurb();
}


