function Trove(containerSelector, config) {

  function extend(destination, source) {
    for(var property in source) {
      if(source.hasOwnProperty(property))
        destination[property] = source[property]
    }
    return destination
  }

  function corceConfig(containerSelector){
    var margin = {top: 80, right: 50, bottom: 110, left: 20},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        barWidth = Math.floor(width / 19) - 1;
        //TODO: fix hardcoded 19

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .tickSize(-width)
        .tickFormat(function(d) { return d });

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(height)
        .tickFormat('');

    // An SVG element with a bottom-right origin.
    var svg = d3.select(containerSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // A label for the current release.
    var title = svg.append("text")
        .attr("class", "title")
        .attr("dy", "-30")

    return extend({
      margin: margin,
      width: width,
      height: height,
      barWidth: barWidth,
      x: x,
      y: y,
      yAxis: yAxis,
      xAxis: xAxis,
      svg: svg,
      title: title
    }, config)
  }

  this.config = corceConfig(containerSelector)
}

Trove.prototype.addLegend = function(color, legendXoffset){
  var legendXoffset = legendXoffset || 50;

  with(this.config) {
    var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width - legendXoffset) + "," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", 6)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  }
}

Trove.prototype.decorateAxes = function(tag) {
  with(this.config) {
    // x-Axis labels
    tag.attr("y", height + 10 )
      .attr("x", function() { return barWidth/2 - this.getComputedTextLength(); })
      .attr('transform', "rotate(-45 " + barWidth/2 + " " + (height+10) + ")")

    // y-Axis lines
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
      .selectAll("g")
      .filter(function(value) { return !value; })
        .classed("zero", true);

    // x-Axis unit label
    svg.append('text')
      .attr('class', 'label')
      .attr('x', function(){ return width - this.getComputedTextLength() - 65 } )
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .text('Features by first label');

    // x-Axis lines
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (barWidth - 10) + ",0)")
        .call(xAxis)
      .selectAll("g")
        .filter(function(value) {
          return value === x.domain()[x.domain().length - 1]; })
        .classed("zero", true)
        // y-Axis unit label
        .append('text')
          .attr('class', 'label')
          .attr("transform", "rotate(-90)")
          .attr('y', -5)
          .attr('text-anchor', 'end')
          .text('points');
  }
}
