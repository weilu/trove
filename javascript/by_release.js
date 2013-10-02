var byReleaseGraph = new Trove('#by-release')

byReleaseGraph.draw = function() {
  with(this.config) {

    var color = d3.scale.ordinal()
        .domain(['accepted', 'delivered', 'planned'])
        .range(["#669900", "#ffbb33", "#909090"]);

    var instruction = svg.append("text")
        .attr("class", "instruction")
        .attr("dy", "10")
        .text('Use ← and → keys to move between releases.')

    d3.csv("../data/stories.csv", function(error, data) {
      // Convert strings to numbers.
      data.forEach(function(d) { d.points = +d.points });

      // Compute the extent of the data set in releases.
      var releases = d3.set(data.map(function(d){ return d.release })).values(),
          release_index = releases.length - 1,
          release = releases[release_index]
      title.text('Release: ' + release);

      // Update the x scale domains.
      var tags = d3.set(data.map(function(d){ return d.tag })).values()
      x.domain(tags);
      this.config.tagWidth = Math.floor(width / tags.length) - 1
      this.config.barWidth = Math.min(tagWidth, 45);

      // Produce a map from release tag, and status to points.
      data = d3.nest()
          .key(function(d) { return d.release; })
          .key(function(d) { return d.tag; })
          .key(function(d) { return d.status; })
          .rollup(function(d) { return d[0].points; })
          .map(data)

      var maxTotal = 0
      for(release in data) {
        for(tag in data[release]) {
          var y0 = 0
          data[release][tag] = color.domain().map(function(state){
            var points = data[release][tag][state]
            return { state: state, y0: y0, y1: y0 += (points ? points : 0)}
          })

          var total = data[release][tag][color.domain().length-1].y1
          if(maxTotal < total) maxTotal = total
        }
      }

      // Update the y scale domains.
      y.domain([0, maxTotal]);

      var tag = svg.append("g").attr("class", "tagContainer").selectAll(".tag")
          .data(tags)
        .enter().append("g")
          .attr("class", "tag")
          .attr("transform", function(tag) { return "translate(" + x(tag) + ",0)"; });

      var filler = color.domain().map(function(state){
        return { state: state, y0: 0, y1: 0 }
      })
      tag.selectAll("rect")
          .data(function(tag) { return data[release][tag] || filler })
        .enter().append("rect")
          .style("fill", function(d){ return color(d.state) })
          .attr("x", 0)
          .attr("width", barWidth)
          .attr("y", function(d) { return y(d.y1) })
          .attr("height", function(d) {
            return y(d.y0) - y(d.y1);
          });

      var xLabelText = tag.append("text").text(function(d) { return d })
      this.decorateAxes(xLabelText)
      this.addLegend(color)

      // Allow the arrow keys to change the displayed release.
      d3.select(window).on("keydown", function() {
        switch (d3.event.keyCode) {
          case 37:
            release_index = Math.max(0, release_index - 1);
            instruction.style('opacity', '0')
            break;
          case 39:
            release_index = Math.min(releases.length - 1, release_index + 1);
            instruction.style('opacity', '0')
            break;
        }
        update();
      });

      function update() {
        var release = releases[release_index]
        if (!(release in data)) return;
        title.text("Release: " + release);

        tag.selectAll("rect")
          .data(function(tag) { return data[release][tag] || filler })
        .transition()
          .duration(750)
          .style("fill", function(d){ return color(d.state) })
          .attr("y", function(d) { return y(d.y1) })
          .attr("height", function(d) {
            return y(d.y0) - y(d.y1);
          });
      }
    }.bind(this));
  }
}

byReleaseGraph.draw()
