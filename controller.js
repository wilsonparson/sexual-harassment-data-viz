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
      width: 960,
      height: 600,
      margin: {top: 40, right: 40, bottom: 40, left: 160},
      categories: model.targetRolesByRank,
      colorScale: statusColorScale,
      dotsPerBandWidth: 3,
      colorScaleParam: 'targetvalue'
    });
    chart.draw();

    //Move this somewhere cleaner
    // Discipline Legend
    d3.select('.legend .legend-items').selectAll('button')
      .data(model.targetRolesByRank)
      .enter()
      .append('button')
        .on('click', (d) => {
          d3.selectAll('circle')
            .filter((datum) => datum.cleantargetrole !== d)
              .attr('data-inactive', true);

          chart.data = model.getDataByDiscipline({
            sortValuesBy: chart.colorScaleParam,
            priorityValue: model.targetRolesByRank.indexOf(d)
          })
          chart.statusFilterValue = model.targetRolesByRank.indexOf(d);
          chart.drawBars();
        })
        .attr('class', 'target-perp-status')
        .attr('style', (d) => {
          return `background-color: ${chart.colorScale(d)}`;
        })
        .text((d) => d);

    powergapColorScale = d3.scaleSequential(d3.interpolateBrBG)
      .domain([-model.targetRolesByRank.length, model.targetRolesByRank.length]);

    // Powergap legend
    const powergapScale = [];
    for (let i=-model.targetRolesByRank.length+1, ii=model.targetRolesByRank.length; i<ii; i++) {
      powergapScale.push(i);
    }
    d3.select('.powergap-legend .legend-items').selectAll('div')
      .data(powergapScale)
      .enter()
      .append('div')
        .attr('style', (d) => {
          return `background-color: ${powergapColorScale(d)};`;
        })
        .text((d) => d);
     
  })
  .catch((error) => {
    throw error;
  });

d3.select('#show-target-role').on('click', () => {
  chart.data = model.getDataByDiscipline({sortValuesBy: 'targetvalue'});
  chart.colorScale = statusColorScale;
  chart.colorScaleParam = 'targetvalue';
  chart.drawBars();
});

d3.select('#show-perp-role').on('click', () => {
  chart.data = model.getDataByDiscipline({sortValuesBy: 'perpvalue'});
  chart.colorScale = statusColorScale;
  chart.colorScaleParam = 'perpvalue';
  chart.drawBars();
});

d3.select('#show-power-gap').on( 'click', () => {
  chart.data = model.getDataByDiscipline({sortValuesBy:'powergap'});
  chart.colorScale = powergapColorScale;
  chart.colorScaleParam = 'powergap';
  chart.drawBars();
});


