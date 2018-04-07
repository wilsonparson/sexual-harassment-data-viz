'use strict';

const model = new Model('data.json');
var powergapColorScale
var chart;

model.loadData()
  .then((data) => {
    model.data = data;
    chart = new Chart({
      data: model.getDataByDiscipline({sortValuesBy:'targetvalue'}),
      container: document.querySelector('.chart-container'),
      width: 960,
      height: 600,
      margin: {top: 40, right: 40, bottom: 40, left: 160},
      categories: model.targetRolesByRank,
      colorScale: d3.scaleOrdinal()
          .domain(model.targetRolesByRank)
          .range(d3.schemeSet3),
      dotsPerBandWidth: 3,
      colorScaleParam: 'cleantargetrole'
    });
    chart.draw();

    //Move this somewhere cleaner
    // Discipline Legend

    // TODO: Use sorting to move selected dots over to y axis (leaving no holes)
    d3.select('.legend .legend-items').selectAll('button')
      .data(model.targetRolesByRank)
      .enter()
      .append('button')
        .on('click', (d) => {
          chart.filteringByStatus = true;
          var dots = d3.selectAll('circle');
          dots.filter((datum) => datum.cleantargetrole !== d)
            .transition()
              .attr('fill', 'rgb(240,240,240)')
              .duration(400)
          chart.filter = (datum) => datum.cleantargetrole === d;
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

document.querySelector('#show-power-gap').addEventListener( 'click', (e) => {
  chart.data = model.getDataByDiscipline({sortValuesBy:'powergap'});
  chart.colorScale = powergapColorScale;
  chart.colorScaleParam = 'powergap';
  chart.drawBars();
});
