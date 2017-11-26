var number_sightings;

var svg, map;

var years = [1960, 2014];
var m_width = 1000,
    width = 938,
    height = 600,
    country,
    state;

var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleThreshold()
    .domain([0, 100, 200, 500, 1000, 2000, 5000, 10000])
    .range(colorbrewer.YlGnBu[9]);
//d3.schemeBlues[9]
//colorbrewer.YlGnBu[9]

var x = d3.scaleLinear()
    .domain([0, 1000])
    .rangeRound([600, 860]);

d3.queue()
	.defer(d3.json, '/datafiles/world_map_v2.json')
	.defer(d3.json, '/datafiles/number_sightings.json')
	.await(ready_map);

function ready_map(error, us, sightings) {
    number_sightings = sightings;
    genMap();
    map.attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.countries).features)
    .enter()
    .append("path")
    .attr("fill", function(d) { return color(d.rate = total_sightings(d.id, years)); })
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("id", function(d) { return d.id; })
    .attr("d", path)
    .on("click", country_clicked);
}

function total_sightings(id, years) {
    var country = search(id, number_sightings);
    var number = 0;
    if (country) {
        for (var i = years[0]; i < years[1]; i++) {
            number += country[i];
        }
    }

    return number
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].country === nameKey) {
            return myArray[i];
        }
    }
}

function genMap() {
    svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);

    map = svg.append("g");

    g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return (x(d[1]) - x(d[0])); })
        .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Number of Sightings");

    g.call(d3.axisBottom(x)
        .tickSize(12)
        .tickPadding(3)
        .tickFormat(function(x, i) { return i ? x : x; })
        .tickValues(color.domain()))
      .select(".domain")
        .remove();
}

function zoom(xyz) {
  map.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#countries", "#states", "#cities"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".city")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function country_clicked(d) {
  map.selectAll(["#states", "#cities"]).remove();
  state = null;

  if (country) {
    map.selectAll("#" + country.id).style('display', null);
  }

  if (d && country !== d) {
    var xyz = get_xyz(d);
    country = d;
     zoom(xyz);
  } else {
    var xyz = [width / 2, height / 1.5, 1];
    country = null;
    zoom(xyz);
  }
}

$(window).resize(function() {
  var w = $("#map").width();
  svg.attr("width", w);
  svg.attr("height", w * height / width);
});
