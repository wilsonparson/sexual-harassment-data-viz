'use strict';

class Chart {
  constructor(options) {
    this.data = options.data;
    this.element = options.element;
    this.title = options.title;
    this.margin = options.margin;
  }

  get plotWidth() {
    return this.element.offsetWidth
      - this.margin.left
      - this.margin.right;
  }

  get plotHeight() {
    return this.element.offsetHeight
      - this.margin.left
      - this.margin.right;
  }

  draw() {
    d3.select(this.element).append('svg')
      .attr('width', this.element.offsetWidth)
      .attr('height', this.element.offsetHeight)
        .append('g')
          .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  

}
