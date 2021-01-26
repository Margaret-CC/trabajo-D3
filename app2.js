// I. Configuración
graf = d3.select('#graf')

ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 30, left: 50, right: 15, bottom: 120 }

ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

y = d3.scaleLinear()
          .range([alto, 0])

x = d3.scaleBand()
      .range([0, ancho])
      // d. Parámetros extras del escalador
      .paddingInner(0.1)
      .paddingOuter(0.3)

color = d3.scaleOrdinal()
          // .range(['red', 'green', 'blue', 'yellow'])
          // https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
          .range(d3.schemeDark2)

xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
yAxisGroup = g.append('g')
              .attr('class', 'eje')

// j. Título superior de la gráfica
titulo = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-5px')
          .attr('text-anchor', 'middle')
          .text('Ocupación anual de hoteles 5 estrellas')
          .attr('class', 'titulo-grafica')

dataArray = []

function render(data) {
 
  bars = g.selectAll('rect')
            .data(data)

  bars.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${y(0)}px`)
        .style('fill', '#000')
        .style('x', d => x(d.id) + 'px')
      .transition()
     
      .ease(d3.easeElastic)
      .duration(1500)
        .style('y', d => (y(d.ocupación)) + 'px')
        .style('height', d => (alto - y(d.ocupación)) + 'px')
        .style('fill', d => color(d.id))
        .style('width', d => `${x.bandwidth()}px`)

     
      yAxisCall = d3.axisLeft(y)
                    .ticks(3)
                    .tickFormat(d => `${d} m.`)
      yAxisGroup.call(yAxisCall)

      xAxisCall = d3.axisBottom(x)
      xAxisGroup.call(xAxisCall)
                .selectAll('text')
                .attr('x', '-8px')
                .attr('y', '-5px')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
}

// IV. Carga de datos
d3.csv('hoteles.csv')
.then(function(data) {
  data.forEach(d => {
    d.ocupación = +d.ocupación
    d.mes = +d.mes
    d.id = +d.id
  })

   data = data.slice(0, 5)

  this.dataArray = data

   maxy = d3.max(data, d => d.ocupación)

  y.domain([0, maxy])

   x.domain(data.map(d => d.mes))
  
  color.domain(data.map(d => d.ciudad))

  // V. Despliegue
  render(dataArray)
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

