'use strict';
const model = new Model('data.json');

model.loadData()
  .then((data) => {
    model.data = data;
    const chart = new Chart({
      data: model.dataByDiscipline,
      element: document.querySelector('.chart-container'),
      margin: {top: 40, right: 40, bottom: 40, left: 160}
    });
    chart.draw();
    window.chart = chart; //for testing
  })
  .catch((error) => {
    throw error;
  });
