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
    this.displayTargetBlurb(true);
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
      .data((d,i) => {
        return d.values;
        }, (d) => d.label);
  
    dots.exit()
      .remove();
  
    dots
      .attr('data-initial-index', (d,i) => i)
      .attr('r', this.dotRadius)
      .each( function (d) {
        // Only raise colored dots
        if (d[$this.colorScaleParam] == $this.statusFilterValue) {
          d3.select(this).raise();
        }
      })
      .classed('disabled', true)
      .transition()
        .attr('stroke', null)
        .attr('fill', (d) => this.colorScale(d[this.colorScaleParam]))
        .style('opacity', (d) => {
          if (this.statusFilterValue != null &&
              d[this.colorScaleParam] != this.statusFilterValue) {
            return 0.1;
          } else {
            return 1;
          }
        })
        .duration(1000)
      .transition()
        .attr('transform', (d,i) => {
          var coordinates = Chart.getDotCoordinates(i, this);
          return `translate(${coordinates.x}, ${coordinates.y})`;
        })
        .duration(1000)
        .on('end', function(d) { // Re-enable hover after transition
          if ($this.statusFilterValue == null ||
              d[$this.colorScaleParam] == $this.statusFilterValue) {
            d3.select(this).classed('disabled', false);
          } else {
            d3.select(this).classed('disabled', true);
          }
        });
  
    dots.enter().append('circle')
      .attr('data-initial-index', (d,i) => i)
      .classed('disabled', true)
      .attr('fill', (d) => this.colorScale(d[this.colorScaleParam]))
      .attr('r', this.dotRadius)
      .on('mouseover', (d) => {
        var dot = d3.select(d3.event.target);
        var currentFill = dot.attr('fill');
        dot
          .raise()
          .transition()
            .attr('r', this.dotRadius * 1.8)
            .attr('stroke', (d) => d3.color(currentFill).darker(0.5))
            .duration(50);
        d3.select('.selected').raise(); // Always keep clicked dot on top
      })
      .on('mouseout', () => {
        var dot = d3.select(d3.event.target);
        if (!dot.classed('selected')) {
          dot.transition()
            .attr('r', this.dotRadius)
            .attr('stroke', null)
            .duration(200);
        }
      })
      .on('click', function(d) {
        $this.populateIncidentTable(d);
        d3.select('.selected')
          .classed('selected', false)
          .classed('disabled', false)
          .transition()
            .attr('r', $this.dotRadius)
            .attr('stroke', null)
            .attr('transform', function () {
              var initialIndex = d3.select(this).attr('data-initial-index');
              var {x,y} = Chart.getDotCoordinates(initialIndex, $this);
              return `translate(${x},${y})`;
            })
            .duration(400);
        
        var dot = d3.select(this);
        dot.classed('selected', true);
        dot.classed('disabled', true);
        dot.each(function hover() {
          var selectedDot = d3.select(this);
          var initialIndex = selectedDot.attr('data-initial-index');
          var {x,y} = Chart.getDotCoordinates(initialIndex, $this); 
          if (!selectedDot.classed('selected')) {
            selectedDot.transition()
              .attr('transform', `translate(${x},${y})`)
              .attr('r', $this.dotRadius)
              .attr('stroke', null)
              .duration(200)
              .ease(d3.easeQuad)
              return;
          } 
          selectedDot
            .transition()
              .attr('transform', `translate(${x},${y-2})`)
              .duration(400)
              .ease(d3.easeQuad)
            .transition()
              .attr('transform', `translate(${x},${y+1})`)
              .duration(400)
              .ease(d3.easeQuad)
            .on('end', hover);
        })
      })
      .attr('transform', (d,i) => {
        var {x,y} = Chart.getDotCoordinates(i, this);
        return `translate(${x+1400},${y})`;
      })
      .transition()
        .attr('transform', (d,i) => {
          var coordinates = Chart.getDotCoordinates(i, this);
          return `translate(${coordinates.x},${coordinates.y})`;
        })
        .duration(1000)
        .delay((d,i) => i*5*Math.random())
      .on('end', function (d) {
        d3.select(this).classed('disabled', false);
      });
  }

  toggleLegend(legendToHide, legendToShow) {
    if (this.legend[legendToShow].style('display') != 'block'){
      this.legend[legendToHide]
        .transition()
          .style('opacity', 0)
          .duration(500)
        .on('end', () => {
          this.legend[legendToHide]
            .style('display', 'none');

          this.legend[legendToShow]
            .style('display', 'block')
            .style('opacity', 0)
            .transition()
              .style('opacity', 1)
            .duration(1000);
        });
    }
  }

  populateIncidentTable(d) {
    this.infobox.select('.infobox__content')
      .property('scrollTop', 0)
      .html(
        `<h3>Incident #${d.id}</h3>
        <div class="overflow-scroll">
          <table class="table table-hover">
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
          </table>
        </div>`
        );
  }

  displayTargetBlurb(delay=false) {
    if (delay) {
      this.infobox
        .transition()
          .style('opacity', 1)
          .duration(2000)
          .delay(2000);
    }
    this.infobox.select('.infobox__content')
      .property('scrollTop', 0)
      .html(
        `<h3>Target Status</h3>
          <p>Highlighted here is the rank of the target and subject area of the reported harassment incident. Graduate students were separated into three categories depending on whether they reported themselves as general graduate students, Masters students, or PhD students. Additionally, visiting and adjunct professors were given the rank of faculty—which includes lecturers, instructors, and research technicians—because of their temporary and often untenured status at a university.</p>

          <p>In each academic discipline, graduate students appear to face the most harassment compared to those above and below them in rank. It should be noted that while the data communicates that there is more sexual harassment in academic disciplines such as English, history, or art, this is potentially caused by two factors:</p>

          <ol>
            <li>these fields normally possess a larger majority of the student population and,</li>
            <li>targets in these certain disciplines, may feel more agency and less fear about reporting harassment.</li>
          </ol>

          <p>For example, there is a low number of harassment accounts reported in STEM disciplines but this doesn’t indicate that there is a lower frequency of harassment in STEM disciplines but potentially that victims in these disciplines fear the repercussions of reporting these incidences.</p>
      `);
  }

  displayPerpetratorBlurb() {
    this.infobox.select('.infobox__content')
      .property('scrollTop', 0)
      .html(
        `<h3>Perpetrator Status</h3>
          <p>Highlighted here is the rank of the perpetrator and their field of study. In higher education, professors with tenure are endowed with power over the career trajectories of other junior faculty and unfortunately, that opens up to the possibility of abuse. As evident by the data here, full tenured professors make up a large majority of the the perpetrators in these incidents of sexual harassment.</p>

          <p>Regarding university faculty, we ranked administrators (deans, chairs/heads of departments) above tenured professors, associate and assistant professors (both non-tenured and tenured) and faculty (lecturers, instructors, visiting and adjunct professors, and research technicians) below.</p>`
      );
  }

  displayPowerGapBlurb() {
    this.infobox.select('.infobox__content')
      .property('scrollTop', 0)
      .html(
        `<h3>Power Gap</h3>
          <p>In a field that’s extremely hierarchical, academia often empowers tenured professors with the ability to determine the fate and success of both graduate students and junior faculty. In fact, an alarming majority of these reported incidents involved unequal relationships and harassment from those in positions of power above the target(s). Ranking the targets and perpetrators from 1-11 that ranged from K-12 to University/College Administrators, we determined the power gap value by subtracting the target’s value from the perpetrator’s value.</p>
        `
      );
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
