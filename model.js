'use strict';

class Model {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.data = [];
  }

  loadData() {
    return new Promise((resolve, reject) => {
      d3.json(this.dataSource, (error, data) => {
        if (error) {
        	reject(error);
        } else {
        	resolve(data);
        }
      });
    });
  }

  get dataByDiscipline() {
    var data = d3.nest()
      .key((d) => d['cleandisciplinev2'])
      .entries(this.data);
    data.sort((a,b) => d3.descending(a.values.length, b.values.length));
    return data;
  }

  get targetRoles() {
    return d3.nest()
      .key((d) => d['cleantargetrole'])
      .entries(this.data);
  }

}
