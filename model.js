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

  getDataByDiscipline(options) {
    var dataByDiscipline = d3.nest()
      .key((d) => d['cleandisciplinev2'])
      .sortValues((a,b) => d3.ascending(a[options.sortValuesBy], b[options.sortValuesBy]))
      .entries(this.data);
    dataByDiscipline.sort((a,b) => d3.descending(a.values.length, b.values.length));
    return dataByDiscipline;
  }

  get targetRolesByRank() {
    let targetRolesByRank = d3.nest()
      .key((d) => d['cleantargetrole'])
      .entries(this.data);
    targetRolesByRank.sort((a,b) => d3.ascending(a.values[0].targetvalue, b.values[0].targetvalue));
    return targetRolesByRank.map(datum => datum.key);
  }
}
