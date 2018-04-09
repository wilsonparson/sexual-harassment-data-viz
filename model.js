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

 /**
 * @description
 * Returns d3 nested array with keys => academic discipline.
 * Keys are sorted in descending order of the length of their values array.
 * Values are sorted in ascending order of the key specified by
 * options.sortValuesBy.
 *
 * @param {Object} options
 * @param {String} options.sortValuesBy The key by which to sort values
 * @param {Number} options.priorityValue Priority value to be placed first
 *    in sorted return array
 */
  getDataByDiscipline(options) {
    var dataByDiscipline = d3.nest()
      .key((d) => d['cleandisciplinev2'])
      .sortValues((a,b) => {
        return Model.compareWithPriority(a,b,options);
      })
      .entries(this.data);
    dataByDiscipline.sort((a,b) =>
        d3.descending(a.values.length, b.values.length));
    return dataByDiscipline;
  }

  get targetRolesByRank() {
    let targetRolesByRank = d3.nest()
      .key((d) => d['cleantargetrole'])
      .entries(this.data);
    targetRolesByRank.sort((a,b) =>
        d3.ascending(a.values[0].targetvalue, b.values[0].targetvalue));
    return targetRolesByRank.map(datum => datum.key);
  }

 /**
 * @description
 * Comparison method to be used in array.sort with priority exception.
 *
 * @param {Number} a Comparator 1
 * @param {Number} b Comparator 2
 * @param {Object} options
 * @param {String} options.sortValuesBy Key by which to sort values (objects)
 * @param {Number} options.priorityValue Value to be placed first in sorted
 *    return array
 */
  static compareWithPriority(a,b,options) {
    if (!options.priorityValue) {
      return d3.ascending(a[options.sortValuesBy], b[options.sortValuesBy]);
    } else {
      if (a[options.sortValuesBy] == options.priorityValue &&
          b[options.sortValuesBy] == options.priorityValue) {
        return 0;
      }
      if (a[options.sortValuesBy] == options.priorityValue) {
        return -1;
      }
      if (b[options.sortValuesBy] === options.priorityValue) {
        return 1;
      }
      return d3.ascending(a[options.sortValuesBy], b[options.sortValuesBy]);
    }
  }

}
