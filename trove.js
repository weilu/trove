function Trove(containerSelector) {
  function config(containerSelector){
    var margin = {top: 80, right: 50, bottom: 110, left: 20},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        barWidth = Math.floor(width / 19) - 1;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .tickSize(-width)
        .tickFormat(function(d) { return d + " points"; });

    // An SVG element with a bottom-right origin.
    var svg = d3.select(containerSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // A label for the current release.
    var title = svg.append("text")
        .attr("class", "title")
        .attr("dy", "-20")

    return {
      margin: margin,
      width: width,
      height: height,
      barWidth: barWidth,
      x: x,
      y: y,
      yAxis: yAxis,
      svg: svg,
      title: title
    }
  }

  this.config = config(containerSelector)
}

Trove.prototype.addLegend = function(color){
  with(this.config) {
    var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 28)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 34)
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
      .attr('fill', 'black')

    // x-Axis unit label
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('x', 450)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Features by primary label (i.e. first/epic label)');

    // y-Axis lines
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
      .selectAll("g")
      .filter(function(value) { return !value; })
        .classed("zero", true);
  }
}
