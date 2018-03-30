'use strict';

class Chart {
  constructor(options) {
    this.data = options.data;
    this.element = options.element;
    this.title = options.title;
    this.margin = options.margin;
    this.colorScale = options.colorScale;
    this.colorScaleParam = options.colorScaleParam;
    this.dotsPerBandWidth = options.dotsPerBandWidth;
    this.transition = {
      duration: '400ms'
    };
  }

  draw() {
    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.element.offsetWidth)
      .attr('height', this.plotHeight + this.margin.top + this.margin.bottom);
    this.plot = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.createXScale();
    this.createYScale();
    this.drawXAxis();
    this.drawYAxis();
  //  this.drawBars();
    this.drawDots();
  }

  update() {
    this.drawDots();
  }

  createXScale() {
    this.xScale = d3.scaleLinear()
      .range([0, this.plotWidth])
      .domain([0, d3.max(this.data, (d) => d.values.length)]);
  }

  createYScale() {
    this.yScale = d3.scaleBand()
      .domain(this.data.map((d) => d.key))
      .range([0, (this.dotsPerBandWidth * this.data.length * this.dotRadius *2)])
      .paddingInner(0.2)
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
    this.plot.append('g')
      .attr('transform', 'translate(0,-5)')
      .call(d3.axisTop(this.xScale));
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

  drawDots() {
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
              .attr('r', this.dotRadius)
              .attr('cx', (d,i) => {
                return Chart.getDotCoordinates(i, this).x;
              })
              .attr('cy', (d,i) => {
                return Chart.getDotCoordinates(i, this).y;
              })
              .attr('fill', (d) => {
                if (this.colorScaleParam === 'powergap') {
                  return this.colorScale(Math.abs(d.powergap));
                } else {
                  return this.colorScale(d.cleantargetrole);
                }
              });
  }

  get dotRadius() {
    return this.plotWidth / d3.max(this.data, (d) => d.values.length)
      * this.dotsPerBandWidth / 2; // half for radius
  }

  static getDotCoordinates(index, chart) {
    let coordinates = {};
    coordinates.x = (chart.yScale.bandwidth() / chart.dotsPerBandWidth)
      * (Math.floor(index/chart.dotsPerBandWidth));
    coordinates.y = (chart.yScale.bandwidth() / chart.dotsPerBandWidth)
      * (index % chart.dotsPerBandWidth);
    return coordinates;
  }

  get plotWidth() {
    return this.element.offsetWidth
      - this.margin.left
      - this.margin.right;
  }

  get plotHeight() {
    // return this.element.offsetHeight
    //   - this.margin.top
    //   - this.margin.bottom;
    return this.dotsPerBandWidth * this.data.length * this.dotRadius * 2;
  }

}
