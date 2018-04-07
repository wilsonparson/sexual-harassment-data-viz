'use strict';


class Chart {
  constructor(options) {
    this.data = options.data;
    this.container = options.container;
    this.title = options.title;
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.colorScale = options.colorScale;
    this.colorScaleParam = options.colorScaleParam;
    this.dotsPerBandWidth = options.dotsPerBandWidth;
    this.transition = {
      duration: '400ms'
    };
  }

  draw() {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.plot = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.createXScale();
    this.createYScale();
    this.drawXAxis();
    this.drawYAxis();
    this.drawBars();
  }

  update() {
    this.drawDots();
  }

  createXScale() {
    this.xScale = d3.scaleLinear()
      .range([0, this.plotWidth + 10])
      .domain([0, d3.max(this.data, (d) => d.values.length)]);
  }

  createYScale() {
    this.yScale = d3.scaleBand()
      .domain(this.data.map((d) => d.key))
      .range([0, this.plotHeight])
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

    bars.enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', (d) => `translate(5,${this.yScale(d.key)+this.dotRadius})`);

    var dots = this.plot.selectAll('.bar').selectAll('circle')
      .data((d,i) => {
        return this.data[i].values;
      }, (d) => d.label);
  
    dots.exit()
      .remove();
  
    dots
      .attr('r', this.dotRadius)
      .transition()
        .attr('fill', (d) => this.colorScale(d[this.colorScaleParam]))
        .duration(1500)
      .transition()
        .attr('transform', (d,i) => {
          var coordinates = Chart.getDotCoordinates(i, this);
          return `translate(${coordinates.x}, ${coordinates.y})`;
        })
        .duration(1500);
  
    dots.enter().append('circle')
      .attr('transform', (d,i) => {
        var coordinates = Chart.getDotCoordinates(i, this);
        return `translate(${coordinates.x},${coordinates.y})`;
      })
      .attr('fill', (d) => this.colorScale(d[this.colorScaleParam]))
      .on('mouseover', () => {
        var dot = d3.select(d3.event.target);
        var currentFill = dot.attr('fill');
        dot
          .moveToFront()
          .transition()
            .attr('r', this.dotRadius * 1.8)
            .attr('stroke', (d) => d3.color(currentFill).darker())
            .duration(50)
      })
      .on('mouseout', () => {
        d3.select(d3.event.target)
          .transition()
            .attr('r', this.dotRadius)
            .attr('stroke', null)
            .duration(200)
      })
      .on('click', (d) => {
        console.log(d);
      })
      .attr('r', 0)
        .transition()
          .attr('r', this.dotRadius)
          .duration(400)
          .delay((d,i) => i*2)

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
    return this.width
      - this.margin.left
      - this.margin.right;
  }

  get plotHeight() {
    return this.height
      - this.margin.top
      - this.margin.bottom;
  }
}
