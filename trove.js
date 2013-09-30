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

