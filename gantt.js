var config = function() {
  var margin = {top: 80, right: 50, bottom: 110, left: 20},
      xOffset = 100,
      width = 960 - margin.left - margin.right - xOffset,
      height = 500 - margin.top - margin.bottom;

  var y = d3.scale.ordinal()
        .rangeRoundBands([0, height]);

  var x = d3.scale.linear()
       .range([0, width]);

  var xAxis = d3.svg.axis()
       .scale(x)
       .tickSize(height)

  var yAxis = d3.svg.axis()
       .scale(y)
       .orient("left")
       .tickSize(-width)
       .tickFormat('')

  return {
    margin: margin,
    width: width,
    height: height,
    x: x,
    y: y,
    xAxis: xAxis,
    yAxis: yAxis,
    xOffset: xOffset
  }
}

var ganttChart = new Trove('#gantt', config())

ganttChart.draw = function(){
  with(this.config) {
    var color = d3.scale.ordinal()
        .domain(['accepted', 'delivered', 'planned'])
        .range(["#669900", "#ffbb33", "#909090"]);


    d3.csv("stories.csv", function(error, data) {
      // Convert strings to numbers.
      data.forEach(function(d) { d.points = +d.points });

      // Compute the extent of the data set in releases.
      var releases = d3.set(data.map(function(d){ return d.release })).values()

      // Update the y scale domains.
      var tags = d3.set(data.map(function(d){ return d.tag })).values()
      y.domain(tags);
      var barHeight = Math.floor(height / tags.length) - 1

      // Produce a map from release tag, and status to points.
      data = d3.nest()
          .key(function(d) { return d.release; })
          .key(function(d) { return d.tag; })
          .key(function(d) { return d.status; })
          .rollup(function(d) { return d[0].points; })
          .map(data)

      var maxTotal = 0
      for(var release in data) {
        for(var tag in data[release]) {
          var y0 = 0
          data[release][tag] = color.domain().map(function(state){
            var points = data[release][tag][state]
            return { state: state, y0: y0, y1: y0 += (points ? points : 0)}
          })

          var total = data[release][tag][color.domain().length-1].y1
          if(maxTotal < total) maxTotal = total
        }
      }

      // Update the x scale domains.
      x.domain([0, maxTotal * releases.length]);
      xAxis.tickFormat(function(d) {
        if(d !== 0 && d%maxTotal === 0)
          return maxTotal + '/0';
        else
          return d%maxTotal
      })
      .ticks(maxTotal * releases.length)

      var release = svg.append("g").attr("class", "releaseContainer").selectAll(".release")
          .data(releases)
        .enter().append("g")
          .attr("class", "release")
          .attr("release-index", function(_, i) { return i })
          .attr("transform", function(_, i) { return "translate(" + (xOffset + x(i * maxTotal)) + ", 0)"; });

      var tag = release.selectAll(".tag")
          .data(tags)
        .enter().append("g")
          .attr("class", "tag")
          .attr("transform", function(tag) { return "translate(0, " + y(tag) + ")"; });

      var filler = color.domain().map(function(state){
        return { state: state, y0: 0, y1: 0 }
      })
      tag.selectAll("rect")
          .data(function(tag) {
            var release_index = +this.parentNode.parentNode.getAttribute('release-index')
            return data[releases[release_index]][tag] || filler
          })
        .enter().append("rect")
          .style("fill", function(d){ return color(d.state) })
          .attr("x", function(d) { return x(d.y0) })
          .attr("height", barHeight)
          .attr("y", 0)
          .attr("width", function(d) {
           return x(d.y1) - x(d.y0) ;
          });

    // x-Axis labels
    svg.selectAll('[release-index="0"] .tag').append("text")
      .text(function(d) { return d })
      .attr("y", 10 )
      .attr("x", function() { return -this.getComputedTextLength() - 10 })
      .attr('fill', 'black')

    // release labels on x-Axis
    release.append('text')
      .text(function(d) { return d })
      .attr('y', height + 30)
      .attr('x', function() { return x(maxTotal/2) - this.getComputedTextLength()/2 })

    // x-Axis lines
    var xLines = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + xOffset + ", 0)")
        .call(xAxis)
    xLines.selectAll("g")
      .filter(function(value) { return value % maxTotal === 0 && value !== (maxTotal * releases.length); })
        .classed("zero", true);
    xLines.append("text")
      .text("Features by primary label")
      .attr("class", "label")
      .attr("transform", "rotate(90)")
      .attr("y", -6)

    var yLines = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + xOffset + ", " + barHeight/2 + ")")
        .call(yAxis)
    yLines.selectAll("g")
      .filter(function(value) { return value === tags[tags.length - 1]; })
        .classed("zero", true);
    xLines.append("text")
      .text("Points per release")
      .attr("class", "label")
      .attr("y", height - 10)
      .attr("x", function() { return width - this.getComputedTextLength() })

      this.addLegend(color)
    }.bind(this));
  }
}

ganttChart.draw()
