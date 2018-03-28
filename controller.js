'use strict';

const DATA_SOURCE = 'data-top-disciplines.json';

d3.json(DATA_SOURCE, (error, data) => {
  if (error) throw error;
  const chart = new Chart({
    data: data,
    title: 'Chart Title Here',
    element: document.querySelector('.chart-container'),
    margin: {top: 40, right: 40, bottom: 40, left: 40}
  });
  chart.draw();
  window.chart = chart; //for testing only
  console.log(chart);
});

function getDataByDiscipline(data) {
  // TODO: Update this copied function
  var dataByDiscipline = d3.nest()
    .key((d) => d['cleandisciplinev2'])
    .rollup((leaves) => {
      var value = {};
      value['Average IMDB Rating'] = d3.mean(leaves, (d) => d['IMDB Rating']);
      value['Average Production Budget'] = d3.mean(leaves, (d) => d['Production Budget']);
      value['Movie Count'] = leaves.length;
      value['Major Genres'] = d3.set(leaves, (d) => d['Major Genre']);
      return value;
    })
    .entries(data);
  DATA_BY_DIRECTOR = dataByDirector;
  return dataByDirector;
}
