var byReleaseGraph = new Trove('#by-release')

byReleaseGraph.draw = function() {
  with(this.config) {

    var color = d3.scale.ordinal()
        .domain(['accepted', 'delivered', 'planned'])
        .range(["#669900", "#ffbb33", "#cccccc"]);

    var instruction = svg.append("text")
        .attr("class", "instruction")
        .attr("dy", "10")
        .text('Use ← and → keys to move between releases.')

    d3.csv("stories.csv", function(error, data) {
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

      // Produce a map from release tag, and status to points.
      data = d3.nest()
          .key(function(d) { return d.release; })
          .key(function(d) { return d.tag; })
          .key(function(d) { return d.status; })
          .rollup(function(v) { return v.map(function(d) { return d.points; }); })
          .map(data)

      function corceData(d){ return d ? d[0] : 0 }

      var maxTotal = 0
      for(release in data) {
        for(tag in data[release]) {
          var tagData = data[release][tag]
          var accepted = corceData(tagData.accepted)
          var accDelivered = accepted + corceData(tagData.delivered)
          var total = accDelivered + corceData(tagData.planned)
          data[release][tag] = [
            ['accepted', 0, accepted],
            ['delivered', accepted, accDelivered],
            ['planned', accDelivered, total]
          ]

          if(maxTotal < total) maxTotal = total
        }
      }
      // Update the y scale domains.
      y.domain([0, maxTotal]);

      // Axis label
      svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', 450)
        .attr('y', height + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .text('Features by primary label (i.e. first/epic label)');

      var tag = svg.append("g").attr("class", "tagContainer").selectAll(".tag")
          .data(tags)
        .enter().append("g")
          .attr("class", "tag")
          .attr("transform", function(tag) { return "translate(" + x(tag) + ",0)"; });

      var filler = [
        ['accepted', 0, 0],
        ['delivered', 0, 0],
        ['planned', 0, 0]
      ]
      tag.selectAll("rect")
          .data(function(tag) { return data[release][tag] || filler })
        .enter().append("rect")
          .style("fill", function(value){ return color(value[0]) })
          .attr("x", 0)
          .attr("width", barWidth)
          .attr("y", function(value) { return y(value[2]) })
          .attr("height", function(value) {
            return y(value[1]) - y(value[2]);
          });

      tag.append("text")
        .text(function(tag) { return tag; })
        .attr("y", function(tag, i) { return height + 10 } )
        .attr("x", function(tag) { return barWidth/2 - this.getComputedTextLength(); })
        .attr('transform', function(tag) {
          return "rotate(-45 " + barWidth/2 + " " + (height+10) + ")"
         })
        .attr('fill', 'black')

      // Add an axis to show the population values.
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + ",0)")
          .call(yAxis)
        .selectAll("g")
        .filter(function(value) { return !value; })
          .classed("zero", true);

      //legend
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

      // Allow the arrow keys to change the displayed release.
      window.focus();
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
          .data(function(tag) {
            return data[release][tag] || filler
          })
        .transition()
          .duration(750)
          .attr("class", function(value){ return value[0] })
          .attr("y", function(value) { return y(value[2]) })
          .attr("height", function(value) {
            return y(value[1]) - y(value[2]);
          });
      }
    });
  }
}

byReleaseGraph.draw()
