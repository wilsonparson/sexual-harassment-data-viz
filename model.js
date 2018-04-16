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
   * Keys are sorted in descending order of the length of their values array,
   * unless a priority value is provided. If a priority value is provided,
   * keys are sorted by number of objects in their values array
   * with the specified value.
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
    // Sort keys
    dataByDiscipline.sort((a,b) => d3.descending(a.values.length,
        b.values.length));
    return dataByDiscipline;
  }

  static sortKeysByFilteredStatus(data, key, value) {
    data.sort((a,b) => {
      return Model.compareTotalValues(a, b, key, value);
    });
    return data; 
  }

  /**
   * @description
   * Returns array of strings of target/perp statuses in ascending order of rank
   */
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
   * Comparison method to be used for sorting bars based on total values for 
   * a given key. Returns comparator with most values for the given key.
   * @param {Object} a Comparator 1
   * @param {Object} b Comparator 2
   * @param {String} key Key to be used for comparison of values
   * @param {Number} value Target value used for comparison
   */
  static compareTotalValues(a,b,key,value) {
    var totalA = a.values.reduce((n, incident) => {
      return n + (incident[key] == value)
    }, 0);
    var totalB = b.values.reduce((n, incident) => {
      return n + (incident[key] == value)
    }, 0);
    return d3.descending(totalA, totalB);
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
