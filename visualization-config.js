const DATA_SOURCE = 'data-dirty.json';

d3.json(DATA_SOURCE, (error, data) => {
  if (error) throw error;
  window.chart = new Chart({
    data: data,
    title: 'Chart Title Here',
    parentElement: document.querySelector('.chart-container'),
    margin: {top: 40, right: 40, bottom: 100, left: 70}
  });
  console.log(chart);
});
