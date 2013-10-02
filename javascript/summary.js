var summaryGraph = new Trove('#summary')

summaryGraph.draw = function(){
  with(this.config) {

    var color = d3.scale.ordinal()
    .range(colorbrewer.Spectral[11])

    title.text('All Releases');

    d3.csv("../data/stories_aggregated.csv", function(error, data) {
      color.domain(d3.keys(data[0]).filter(function(key) {
        return key !== "tag";
      }));

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
      this.config.tagWidth = Math.floor(width / tags.length) - 1
      this.config.barWidth = Math.min(tagWidth, 45);

      // Update the y scale domains.
      y.domain([0, d3.max(data, function(d){ return d.total })]);

      var tag = svg.append("g")
        .attr("class", "tagContainer").selectAll(".tag")
          .data(data)
        .enter().append("g")
          .attr("class", "tag")
          .attr("transform", function(d) { return "translate(" + x(d.tag) + ",0)"; });

      tag.selectAll("rect")
          .data(function(d) { return d.points })
        .enter().append("rect")
          .attr("x", 0)
          .attr("width", barWidth)
          .attr("y", function(value) { return y(value.y1) })
          .attr("height", function(value) {
            return y(value.y0) - y(value.y1);
          })
          .style("fill", function(d){ return color(d.name) });

      var xLabelText = tag.append("text").text(function(d) { return d.tag })
      this.decorateAxes(xLabelText)
      this.addLegend(color)

    }.bind(this));
  }
};

summaryGraph.draw()
