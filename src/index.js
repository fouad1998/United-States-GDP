import * as d3 from 'd3'
import './style.scss'

function draw(dataFetched) {
  const height = 512
  const width = 1024
  const SVG = d3
    .select('#root')
    .attr('width', width)
    .attr('height', height)
    .attr('margin', '80px 0')
  const DATA = dataFetched.data.map(d => [d[0], +d[1]])
  const MAX = d3.max(DATA, d => d[1])

  const margin = { top: 20, bottom: 20, left: 80, right: 20 }
  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const xValue = d => d[0]
  const yValue = d => +d[1]

  const xScale = d3.scaleBand().domain(DATA.map(xValue)).range([0, innerWidth]).padding(0.1)
  const yScale = d3.scaleLinear().domain([0, MAX]).range([0, innerHeight]).nice()

  const plot = function () {
    function reformateDate(date) {
      const DATE = date.split('-').map(d => +d)
      const Q =
        DATE[1] >= 1 && DATE[1] <= 3
          ? 'Q1'
          : DATE[1] >= 4 && DATE[1] <= 6
          ? 'Q2'
          : DATE[1] >= 7 && DATE[1] <= 9
          ? 'Q3'
          : 'Q4'
      return `${DATE[0]} ${Q}`
    }
    const plotG = SVG.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    plotG
      .selectAll('rect')
      .data(DATA)
      .enter()
      .append('rect')
      .attr('x', d => xScale(xValue(d)))
      .attr('y', d => innerHeight - yScale(yValue(d)))
      .attr('height', d => yScale(yValue(d)))
      .attr('width', xScale.bandwidth())
      .attr('class', 'bar')
      .attr('data-date', d => xValue(d))
      .attr('data-gdp', d => yValue(d))
      .on('mouseover', function () {
        tooltip.attr('display', 'block')
      })
      .on('mouseout', function () {
        tooltip.attr('display', 'none')
      })
      .on('mousemove', function () {
        const xPos =
          d3.mouse(this)[0] + 200 < width ? d3.mouse(this)[0] + 10 : d3.mouse(this)[0] - 100
        const yPos = d3.mouse(this)[1]
        tooltip
          .attr('x', xPos)
          .attr('y', yPos)
          .attr('data-date', this.getAttribute('data-date'))
          .select('text')
          .attr('x', xPos)
          .attr('y', yPos)
          .text(
            `${reformateDate(this.getAttribute('data-date'))}\n${this.getAttribute('data-gdp')}`
          )
      })
    const tooltip = SVG.append('g').attr('display', 'none').attr('id', 'tooltip')
    tooltip.append('text')
  }

  function axes() {
    const minYear = d3.min(DATA, d => +d[0].split('-')[0])
    const maxYear = d3.max(DATA, d => +d[0].split('-')[0]) + 0.75

    // X AXIS
    const xScaleAlternative = d3.scaleLinear().domain([minYear, maxYear]).range([0, innerWidth])
    const xTicketFormat = number => (number % 5 === 0 ? number : '')
    const xAxis = d3.axisBottom(xScaleAlternative).tickFormat(xTicketFormat)
    SVG.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
      .attr('id', 'x-axis')
      .call(xAxis)

    // Y AXIS
    const yScaleAlternative = d3.scaleLinear().domain([0, MAX]).range([innerHeight, 0]).nice()
    const yAxis = d3.axisLeft(yScaleAlternative)
    const yAxisG = SVG.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top} )`)
      .attr('id', 'y-axis')
    yAxisG
      .append('text')
      .attr('x', -137)
      .attr('y', 22)
      .style('transform', 'rotate(-90deg)')
      .attr('fill', 'black')
      .text('Gross Domestic Product')
    yAxisG.call(yAxis)
  }

  function title() {
    SVG.append('text')
      .attr('fill', 'black')
      .attr('x', width / 2)
      .attr('y', margin.top * 2)
      .attr('id', 'title')
      .text('United States GDP')
  }

  axes()
  plot()
  title()
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(response => draw(response))
