function summary(){
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
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
  var svg = d3.select("#summary").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // A sliding container to hold the bars by tag.
  var tagContainer = svg.append("g")
      .attr("class", "tagContainer");

  var color = d3.scale.category20()

  var title = svg.append("text")
      .attr("class", "title")
      .attr("dy", ".71em")
      .text('All Releases');

  d3.csv("stories_aggregated.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "tag"; }));

    // calculates points per tag per release begin and end values
    data.forEach(function(d) {
      var y0 = 0
      d.points = color.domain().map(function(name) {
        return { name: name, y0: y0, y1: y0 += +d[name] }
      })
      d.total = d.points[d.points.length - 1].y1
    });

    // Update the x scale domains.
    var tags = data.map(function(d){ return d.tag })
    x.domain(tags);
    y.domain([0, d3.max(data, function(d){ return d.total })]);

    // Add an axis to show the population values.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
      .selectAll("g")
      .filter(function(value) { return !value; })
        .classed("zero", true);

    var tag = tagContainer.selectAll(".tag")
        .data(data)
      .enter().append("g")
        .attr("class", "tag")
        .attr("transform", function(d) { return "translate(" + x(d.tag) + ",0)"; });

    tag.selectAll("rect")
        .data(function(d) { return d.points })
      .enter().append("rect")
        .attr("class", function(value){ return value.name }) // TODO: remove this or fill
        .attr("x", 0)
        .attr("width", barWidth)
        .attr("y", function(value) { return y(value.y1) })
        .attr("height", function(value) {
          return y(value.y0) - y(value.y1);
        })
        .style("fill", function(d){ return color(d.name) });

    tag.append("text")
      .attr("y", function(_, i) {
        return i%2 == 0 ? height + 10 : height + 20
      } )
      .attr("x", function(_) { return barWidth/2; })
      .attr('fill', 'black')
      .text(function(d) { return d.tag; });

    //legend
    var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
     .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  });
};

summary()
