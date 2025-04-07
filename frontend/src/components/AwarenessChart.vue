<template>
  <div class="container">

    <!-- Cyberbullying Chart -->
    <h2>Cyberbullying Trend Among Youth (2014–2020)</h2>
    <svg ref="cyberChart" width="700" height="350"></svg>
    <div class="note red">
      <p> Cyberbullying rose from <strong>34.5%</strong> in 2014 to <strong>51%</strong> in 2020.</p>
      <p>This reflects a growing digital threat to youth. Parents should talk to their children and stay involved.</p>
    </div>

    <!-- Mental Health Chart -->
    <h2>Psychological Distress Among Youth Due to Cyberbullying (2014–2018)</h2>
    <svg ref="mentalChart" width="700" height="350"></svg>
    <div class="note blue">
      <p> Youth mental health issues rose from <strong>20.5%</strong> in 2014 to <strong>25.8%</strong> in 2018.</p>
      <p>Although the data ends in 2018, the upward trend emphasizes the need for digital safety education.</p>
      <p><strong>Data Source:</strong> Victorian Child and Adolescent Monitoring System (VCAMS)</p>
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

    this.drawLineChart(this.$refs.cyberChart, cyber, 'Cyberbullying', '#ff4c4c');
    this.drawBarChart(this.$refs.mentalChart, mental, '#4c9aff');
  },
  methods: {
    createTooltip() {
  return d3.select('body') // CHANGED from `.container` to `body`
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
    .style('z-index', '9999'); // Ensures visibility over charts
},

    drawLineChart(svgRef, data, label, color) {
      const svg = d3.select(svgRef);
      const margin = { top: 30, right: 20, bottom: 60, left: 60 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.year))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.percentage)])
        .nice()
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
        .y(d => y(+d.percentage));

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);

      const tooltip = this.createTooltip();

      g.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(+d.year))
        .attr('cy', d => y(+d.percentage))
        .attr('r', 5)
        .attr('fill', color)
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
        .domain([0, d3.max(data, d => +d.percentage)])
        .nice()
        .range([height, 0]);

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

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
  max-width: 800px;
  margin: auto;
  position: relative;
}
h2 {
  margin-top: 40px;
}
.info {
  background: #f0f8ff;
  border-left: 5px solid #4c9aff;
  padding: 15px;
  margin-bottom: 25px;
}
.note {
  margin-top: 10px;
  padding: 15px;
  border-left: 5px solid;
  background-color: #fff8dc;
}
.note.red {
  border-color: #ff4c4c;
}
.note.blue {
  border-color: #4c9aff;
}
svg {
  margin-bottom: 10px;
}
.bar:hover {
  opacity: 0.8;
  cursor: pointer;
}
.tooltip {
  position: absolute;
  display: none;
  background: #ffffff;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  color: #333;
  z-index: 1000;
}

</style>
