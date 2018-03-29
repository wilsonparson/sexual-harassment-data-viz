'use strict';

class Chart {
  constructor(options) {
    this.data = options.data;
    this.element = options.element;
    this.title = options.title;
    this.margin = options.margin;
    this.transition = {
      duration: '400ms'
    };
  }

  draw() {
    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.element.offsetWidth)
      .attr('height', this.element.offsetHeight);
    this.plot = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.createXScale();
    this.createYScale();
    this.drawXAxis();
    this.drawYAxis();
  //  this.drawBars();
    this.createColorScale();
    this.drawSquares();
  }

  createXScale() {
    this.xScale = d3.scaleLinear()
      .range([0, this.plotWidth])
      .domain([0, d3.max(this.data, (d) => d.values.length)]);
  }

  createYScale() {
    this.yScale = d3.scaleBand()
      .domain(this.data.map((d) => d.key))
      .range([0, this.plotHeight])
      .paddingInner(0.1)
      .paddingOuter(0.1);
  }

  drawYAxis() {
    this.plot.append('g')
      .attr('id', 'y-axis')
      .call(d3.axisLeft(this.yScale))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
  }

  drawXAxis() {
    this.plot.append('g')
      .attr('transform', `translate(0, ${this.plotHeight})`)
      .call(d3.axisBottom(this.xScale));
  }

  createColorScale() {
  }

  drawBars() {
    var bars = this.plot.selectAll('.bar')
      .data(this.data, (d) => d.key);

    bars.exit()
      .remove();
   
    bars
      .attr('width', (d) => this.plotWidth - this.xScale(d.values.length))
      .attr('height', this.yScale.bandwidth())
      .attr('x', 0)
      .attr('y', (d) => this.yScale(d.key));

   
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d) => this.yScale(d.key))
        .attr('width', (d) => this.plotWidth - this.xScale(d.values.length))
        .attr('height', this.yScale.bandwidth());
  }

  drawSquares() {
    var bars = this.plot.selectAll('.bar')
      .data(this.data, (d) => d.key);
    //
    // bars.exit()
    //   .remove();
    //
    // bars
    //   .attr('width', (d) => this.plotWidth - this.xScale(d.values.length))
    //   .attr('height', this.yScale.bandwidth())
    //   .attr('x', 0)
    //   .attr('y', (d) => this.yScale(d.key));
    //
    //
    bars.enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', (d) => `translate(5,${this.yScale(d.key)})`)
          .selectAll('rect')
            .data((d) => d.values)
            .enter().append('circle')
              .attr('r', this.yScale.bandwidth() / 4 / 2)
              .attr('cx', (d,i) => {
                return (this.yScale.bandwidth()/4) * (Math.floor(i/4));
              })
              .attr('cy', (d,i) => {
                return (this.yScale.bandwidth()/4) * (i%4);
              });
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

}
