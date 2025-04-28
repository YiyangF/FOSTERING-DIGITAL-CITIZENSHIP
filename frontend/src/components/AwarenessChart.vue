<template>
  <div class="container">
    <!-- Cyberbullying Section -->
    <div class="chart-text-wrapper">
      <svg ref="cyberChart" width="600" height="400"></svg>
      <div class="chart-text">
        <h2>Cyberbullying Trend Among Youth (2014–2020)</h2>
        <p><strong>Cyberbullying rose</strong> from <strong>34.5%</strong> in 2014 to <strong>51%</strong> in 2020.</p>
        <p>This reflects a growing digital threat to youth. Parents should talk to their children and stay involved.</p>
      </div>
    </div>

    <!-- Mental Health Section -->
<div class="chart-text-wrapper reverse">
  <div class="chart-text">
    <h2>Psychological Distress Among Youth Due to Cyberbullying (2014–2018)</h2>
    <p><strong>Youth mental health issues</strong> rose from <strong>20.5%</strong> in 2014 to <strong>25.8%</strong> in 2018.</p>
    <p>Although the data ends in 2018, the upward trend emphasizes the need for digital safety education.</p>
    <p><strong>Data Source:</strong> Victorian Child and Adolescent Monitoring System (VCAMS)</p>
  </div>
  <svg ref="mentalChart" width="600" height="350"></svg>
</div>
  </div>
</template>


<script>
import * as d3 from 'd3';

export default {
  name: 'AwarenessChart',
  async mounted() {
    const cyber = await fetch('http://localhost:3001/api/cyberbullying').then(r => r.json());
    const mental = await fetch('http://localhost:3001/api/mental-health').then(r => r.json());

    this.drawArrowLineChart(this.$refs.cyberChart, cyber, '#ff4c4c');
    this.drawBarChart(this.$refs.mentalChart, mental, '#4c9aff');
  },
  methods: {
    createTooltip() {
      return d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#ffffff')
        .style('padding', '6px 12px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)')
        .style('font-size', '13px')
        .style('color', '#333')
        .style('display', 'none')
        .style('z-index', '9999');
    },

    drawArrowLineChart(svgRef, data, color) {
      const svg = d3.select(svgRef);
      const margin = { top: 30, right: 60, bottom: 60, left: 60 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear()
        .domain([d3.min(data, d => +d.year) - 0.3, d3.max(data, d => +d.year) + 0.3])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.percentage) * 1.1]).nice()
        .range([height, 0]);

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format('d')));

      g.append('g')
        .call(d3.axisLeft(y));

      svg.append("text")
        .attr("transform", `translate(${margin.left + width / 2}, ${height + margin.top + 40})`)
        .style("text-anchor", "middle")
        .text("Year");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", 0 - (margin.top + height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Percentage (%)");

      const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d.percentage))
        .curve(d3.curveLinear);

      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "line-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.3);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 1);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'url(#line-gradient)')
        .attr('stroke-width', 8)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('filter', 'url(#drop-shadow)')
        .attr('d', line);

      const defs = svg.append("defs");
      const filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

      filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");

      filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "offsetBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      const last = data[data.length - 1];
      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(500)())
        .attr('fill', color)
        .attr('transform', `translate(${x(last.year) + 10},${y(last.percentage) - 6}) rotate(-55)`);

      const tooltip = this.createTooltip();

      g.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(+d.year))
        .attr('cy', d => y(+d.percentage))
        .attr('r', 10)
        .attr('opacity', 0)
        .on('mouseover', function (event, d) {
          tooltip.style('display', 'block')
            .html(`<strong>Year:</strong> ${d.year}<br><strong>Value:</strong> ${d.percentage}%`);
        })
        .on('mousemove', function (event) {
          tooltip
            .style('top', (event.pageY - 40) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('display', 'none');
        });
    },

    drawBarChart(svgRef, data, color) {
      const svg = d3.select(svgRef);
      const margin = { top: 30, right: 20, bottom: 60, left: 60 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.percentage)]).nice()
        .range([height, 0]);

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

      g.append('g')
        .call(d3.axisLeft(y));

      // Add X-axis Label
svg.append("text")
  .attr("transform", `translate(${margin.left + width / 2}, ${height + margin.top + 40})`)
  .style("text-anchor", "middle")
  .text("Year");

// Add Y-axis Label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 15)
  .attr("x", 0 - (margin.top + height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Percentage (%)");


      const tooltip = this.createTooltip();

      g.selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.year))
  .attr('y', d => y(+d.percentage))
  .attr('width', x.bandwidth())
  .attr('height', d => height - y(+d.percentage))
  .attr('fill', color)
  .style('filter', 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))') // ⭐ ADD THIS
  .on('mouseover', function (event, d) {
    tooltip
      .style('display', 'block')
      .html(`<strong>Year:</strong> ${d.year}<br><strong>Value:</strong> ${d.percentage}%`);
    d3.select(this).attr('fill', d3.rgb(color).darker(1));
  })
  .on('mousemove', function (event) {
    tooltip
      .style('top', (event.pageY - 40) + 'px')
      .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function () {
    tooltip.style('display', 'none');
    d3.select(this).attr('fill', color);
  });
    }
  }
};
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.chart-text-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  gap: 30px;
}

svg {
  flex: 0 0 50%;
  max-width: 600px;
  height: auto;
}

.chart-text {
  flex: 0 0 40%;
  text-align: left;
}

.chart-text h2 {
  font-size: 1.6rem;
  margin-bottom: 15px;
  color: #003366;
}

.chart-text p {
  font-size: 1rem;
  color: #333333;
  margin-bottom: 10px;
}

.tooltip {
  position: absolute;
  display: none;
  background: #ffffff;
  padding: 10px 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  pointer-events: none;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  color: #222;
  z-index: 1000;
  transition: all 0.2s ease;
}

.tooltip strong {
  color: #007bff;
}


</style>