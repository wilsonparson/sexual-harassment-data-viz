'use strict';

class Chart {
  constructor(options) {
    this.data = options.data;
    this.parentElement = options.parentElement;
    this.title = options.title;
    this.margin = options.margin;
  }

  get width() {
    return this.parentElement.offsetWidth
      - this.margin.left
      - this.margin.right;
  }

  get height() {
    return this.parentElement.offsetHeight
      - this.margin.left
      - this.margin.right;
  }

  draw() {
    return;
  }

}
