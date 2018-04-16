'use strict';


class Chart {
  constructor(options) {
    this.data = options.data;
    this.container = options.container;
    this.legend = options.legend;
    this.infobox = options.infobox;
    this.title = options.title;
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;
    this.colorScale = options.colorScale;
    this.colorScaleParam = options.colorScaleParam;
    this.dotsPerBandWidth = options.dotsPerBandWidth;
    this.statusFilterValue = options.statusFilterValue;
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
    this.drawDots();
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
  }

  drawBars() {
    var bars = this.plot.selectAll('.bar')
      .data(this.data, (d) => d.key);

    bars.exit()
      .remove();

    bars
      .attr('transform', (d) => `translate(5,${this.yScale(d.key)+this.dotRadius})`);

    bars.enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', (d) => `translate(5,${this.yScale(d.key)+this.dotRadius})`);
  }

  drawDots() {
    var $this = this;

    var dots = this.plot.selectAll('.bar').selectAll('circle')
      // .data((d,i) => {
      //   return this.data[i].values;
      // }, (d) => d.label);
          .data((d,i) => {
            return d.values;
           }, (d) => d.label);
  
    dots.exit()
      .remove();
  
    dots
      .attr('r', this.dotRadius)
      .each( function (d) {
        // Only raise colored dots
        if (d[$this.colorScaleParam] == $this.statusFilterValue) {
          d3.select(this).raise();
        }
      })
      .transition()
        .attr('fill', (d) => {
          if (this.statusFilterValue &&
              d[this.colorScaleParam] != this.statusFilterValue) {
            return 'rgb(240,240,240)';
          } else {
            return this.colorScale(d[this.colorScaleParam]);
          }
        })
        .duration(1000)
      .transition()
        .attr('transform', (d,i) => {
          var coordinates = Chart.getDotCoordinates(i, this);
          return `translate(${coordinates.x}, ${coordinates.y})`;
        })
        .duration(1000);
  
    dots.enter().append('circle')
      .attr('transform', (d,i) => {
        var coordinates = Chart.getDotCoordinates(i, this);
        return `translate(${coordinates.x},${coordinates.y})`;
      })
      .attr('fill', (d) => this.colorScale(d[this.colorScaleParam]))
      .on('mouseover', (d) => {
        // TODO: No hover effects on grayed out circles
        var dot = d3.select(d3.event.target);
        var currentFill = dot.attr('fill');
        dot
          .raise()
          .transition()
            .attr('r', this.dotRadius * 1.8)
            .attr('stroke', (d) => d3.color(currentFill).darker(0.5))
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
        this.infobox
          .property('scrollTop', 0)
          .html(
          `<table class="table table-hover small">
            <tbody>
              <tr>
                <th>Target</th>
                <td>${d.cleantargetrole}</td>
              </tr>
              <tr>
                <th>Perpetrator</th>
                <td>${d.cleanperprole}</td>
              </tr>
              <tr>
                <th>Institution</th>
                <td>${d.institution}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>${d.event}</td>
              </tr>
              <tr>
                <th>Institutional Response</th>
                <td>${d.response}</td>
              </tr>
              <tr>
                <th>Punishment</th>
                <td>${d.punishment}</td>
              </tr>
              <tr>
                <th>Career Impact</th>
                <td>${d.career}</td>
              </tr>
              <tr>
                <th>Mental Impact</th>
                <td>${d.mental}</td>
              </tr>
              <tr>
                <th>Life Impact</th>
                <td>${d.life}</td>
              </tr>
            </tbody>
          </table>`
        );
      })
      .attr('r', 0)
        .transition()
          .attr('r', this.dotRadius)
          .duration(400)
          .delay((d,i) => i*2);
  }

  toggleLegend(legendName) {
    if (this.legend[legendName].style('display') != 'block'){
      for (let legendKey in this.legend){
        if (legendKey == legendName) {
          this.legend[legendKey]
          .style('display', 'block')
          .style('opacity', 0)
            .transition()
            .style('opacity', 1)
          .duration(1000);
        } else {
          this.legend[legendKey]
          .transition()
          .style('opacity', 0)
          .duration(1000)
          .style('display', 'none');
        }
      }
    }
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
