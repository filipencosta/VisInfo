var number_sightings;
var topo_us;

var mapSVG, map;
var m_width = 1000,
    mapWidth = 938,
    mapHeight = 600,
    country,
    state;

var projection = d3.geoMercator()
    .scale(150)
    .translate([mapWidth / 2, mapHeight / 1.5]);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleThreshold()
    .domain([0, 5, 100, 200, 500, 1000, 5000, 10000])
    .range(colorbrewer.YlGnBu[9]);
//d3.schemeBlues[9]
//colorbrewer.YlGnBu[9]

function placeKey(Xmin, Xmax, ticks) {
    var r = [];
    var temp = Xmin;
    var diff = (Xmax-Xmin)/ticks;
    while (temp <= Xmax) {
        r.push(temp);
        temp = temp + diff;
    }
    return r;
}


var x = d3.scaleThreshold()
    .domain([0, 5, 100, 200, 500, 1000, 5000, 10000])
    .range(placeKey(0, 360, 10));
var yMap = d3.scaleThreshold()
    .domain([0, 5, 100, 200, 500, 1000, 5000, 10000])
    .range(placeKey(-325, 35, 10).reverse());

// var x = d3.scaleLinear()
//     .domain([0, 10000])
//     .rangeRound([600, 860]);

d3.queue()
	.defer(d3.json, '/datafiles/world_map_v2.json')
	.defer(d3.json, '/datafiles/number_sightings.json')
	.await(ready_map);

function ready_map(error, us, sightings) {
    number_sightings = sightings;
    topo_us = us;
    genMap();
    map.attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, topo_us.objects.countries).features)
    .enter()
    .append("path")
    .attr("fill", function(d) { return color(d.rate = total_sightings(d.id, dates)); })
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("id", function(d) { return d.id; })
    .attr("d", path)
    .on("click", country_clicked);
}

function updateMap() {
    var update = map.transition();
    update
    .selectAll("path")
    .duration(750)
    .attr("fill", function(d) { return color(d.rate = total_sightings(d.id, dates)); });
}

function total_sightings(id, years) {
    console.log(id);
    var country = search(id, number_sightings);
    var number = 0;
    if (country) {
        for (var i = years[0]; i < years[1]; i++) {
            if (country.hasOwnProperty(i)) {
                number += country[i];
            }
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
    mapSVG = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
        .attr("width", m_width)
        .attr("height", m_width * mapHeight / mapWidth)
        .attr("border", "solid");

    map = mapSVG.append("g");
    var temp = mapHeight-35;
    g = mapSVG.append("g")
    .attr("class", "key")
    .attr("transform", "translate(50 ," + temp +")");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", function(d) { return (x(d[1]) - x(d[0])); })
        .attr("y", function(d) { return -x(d[0]); })
        .attr("x", -10)
        .attr("width", 8)
        .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0] - 45)
        .attr("y", 20)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("# Sightings");

    g.call(d3.axisLeft(yMap)
        .tickSize(12)
        .tickPadding(3)
        .tickFormat(function(yMap, i) { return i ? yMap : yMap; })
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
  var w_scale = (bounds[1][0] - bounds[0][0]) / mapWidth;
  var h_scale = (bounds[1][1] - bounds[0][1]) / mapHeight;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (mapHeight / z / 6);
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
     countries=[country.id];
     heatmapChart(file_csv,countries,dates);
  } else {
    var xyz = [mapWidth / 2, mapHeight / 1.5, 1];
    country = null;
    zoom(xyz);
    countries=['USA'];
    heatmapChart(file_csv,countries,dates);
  }
}

$(window).resize(function() {
  var w = $("#map").width();
  mapSVG.attr("width", w);
  mapSVG.attr("height", w * mapHeight / mapWidth);
});
