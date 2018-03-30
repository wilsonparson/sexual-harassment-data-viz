'use strict';
const model = new Model('data.json');
var chart;

model.loadData()
  .then((data) => {
    model.data = data;
    chart = new Chart({
      data: model.getDataByDiscipline(),
      element: document.querySelector('.chart-container'),
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
    d3.select('.legend-items').selectAll('div')
      .data(["Null", "K-12", "Undergraduate Student", "Graduate Student", "Masters Student", "PhD Student", "Postdoc", "Faculty", "Assistant Professor", "Associate Professor", "Professor", "Administrative"])
      .enter()
      .append('div')
        .attr('style', (d) => {
          return `background-color: ${chart.colorScale(d)}`;
        })
        .text((d) => d);

    document.querySelectorAll('circle').forEach((element) => {
      element.addEventListener('mouseover', (e) => {
        d3.selectAll('.tooltip').remove();
        var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .attr('style', `left: ${e.x}px; top: ${e.y}px;`);
        tooltip.append('p')
          .text('Incident:');
        tooltip.append('p')
          .text('Resolution:');
      });
      element.addEventListener('mouseout', (e) => {
        //d3.selectAll('.tooltip').remove();
      });
    });
  })
  .catch((error) => {
    throw error;
  });

document.querySelector('button').addEventListener( 'click', (e) => {
  chart.data = model.getDataByDiscipline('powergap');
  chart.colorScale = d3.scaleSequential(d3.interpolateBrBG)
    .domain([-model.targetRolesByRank.length, model.targetRolesByRank.length]);
  chart.colorScaleParam = 'powergap';
  chart.draw();
});
