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
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// A sliding container to hold the bars by tag.
var tagContainer = svg.append("g")
    .attr("class", "tagContainer");

// A label for the current release.
var title = svg.append("text")
    .attr("class", "title")
    .attr("dy", ".71em")
    .text('Current release');

d3.csv("stories.csv", function(error, data) {

  // Convert strings to numbers.
  data.forEach(function(d) { d.points = +d.points });

  // Compute the extent of the data set in releases.
  var releases = d3.set(data.map(function(d){ return d.release })).values(),
      release_index = releases.length - 1,
      release = releases[release_index]
  title.text(release);

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

  // Add an axis to show the population values.
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis)
    .selectAll("g")
    .filter(function(value) { return !value; })
      .classed("zero", true);

  // Add labeled rects for each tag (so that no enter or exit is required).
  var tag = tagContainer.selectAll(".tag")
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
      .attr("class", function(value){ return value[0] })
      .attr("x", 0)
      .attr("width", barWidth)
      .attr("y", function(value) { return y(value[2]) })
      .attr("height", function(value) {
        return y(value[1]) - y(value[2]);
      });

  // Add labels to show age (separate; not animated).
  svg.selectAll(".tagLabel")
      .data(tags)
    .enter().append("text")
      .attr("class", "tagLabel")
      .attr("x", function(tag) { return x(tag) + barWidth/2; })
      .attr("y", height + 4)
      .attr("dy", ".71em")
      .text(function(tag) { return tag; });

  // Allow the arrow keys to change the displayed release.
  window.focus();
  d3.select(window).on("keydown", function() {
    switch (d3.event.keyCode) {
      case 37: release_index = Math.max(0, release_index - 1); break;
      case 39: release_index = Math.min(releases.length - 1, release_index + 1); break;
    }
    update();
  });

  function update() {
    var release = releases[release_index]
    if (!(release in data)) return;
    title.text(release);

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
