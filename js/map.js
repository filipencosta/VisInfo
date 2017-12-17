var number_sightings;
var topo_us;

var mapSVG, map;
var m_width = 1000,
    mapWidth = 1000,
    mapHeight = 600,
    country,
    state;

var projection = d3.geoMercator()
    .scale(150)
    .translate([mapWidth / 2, mapHeight / 1.45]);
var UFOimages;

var mapZOOM = d3.zoom()
    .scaleExtent([1, 12])
    .on("zoom", zoomed);

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
    .defer(d3.csv, '/datafiles/ufo.csv')
	.await(ready_map);

function ready_map(error, us, sightings, ufos) {
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
    .attr("d", path).
    on("click", country_clicked);

    d3.select("#reset").on("click", reset);
    ready_csv(ufos);
}

function ready_csv(ufos) {
    var coor;
    ufos = ufos.slice(0, 1000);
    UFOimages.selectAll("image")
        .data(ufos).enter()
        .append("image")
        .attr("year", function (d) { return d.Year; })
        .attr("x", function (d) { coor = projection([d.longitude, d.latitude]); return coor[0]; })
        .attr("y", function (d) { coor = projection([d.longitude, d.latitude]); return coor[1]; })
        .attr("height", "3px")
        .attr("width", "3px")
        .attr("xlink:href", "images/ufo2.png");
}

function zoomed() {
    var zoomlevel = 3;
  map.attr("transform", d3.event.transform);
  UFOimages.attr("transform", d3.event.transform);
  if (d3.event.transform.k < zoomlevel) {
      UFOimages.transition().duration(750).attr("hidden", "True");
  }
  if (d3.event.transform.k >= zoomlevel) {
      UFOimages.transition().duration(750).attr("hidden", null);
  }
}

function nozoom() {
  d3.event.preventDefault();
}

function updateMap() {
    var update = map.transition();
    update.selectAll("path")
    .duration(750)
    .attr("fill", function(d) { return color(d.rate = total_sightings(d.id, dates)); });

    UFOimages.selectAll("image").attr("hidden", function(d) {if(parseInt(d.Year) >= dates[0] && parseInt(d.Year) <= dates[1]) {return null;} else {return "True";} })
}

function total_sightings(id, years) {
    var country = search(id, number_sightings);
    var number = 0;
    if (country) {
        for (var i = years[0]; i < years[1]; i++) {
            if (country.hasOwnProperty(i)) {
                number += country[i];
            }
        }
    }

    return number;
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].country === nameKey) {
            return myArray[i];
        }
    }
}

function genMap() {
    mapSVG = d3.select("#map").on("touchstart", nozoom)
    .on("touchmove", nozoom).append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
        .attr("width", m_width)
        .attr("height", m_width * mapHeight / mapWidth)
        .attr("border", "solid");
    mapSVG.call(mapZOOM);
    map = mapSVG.append("g");
    var temp = mapHeight-35;
    UFOimages = mapSVG.append("g").attr("hidden", "True");
    g = mapSVG.append("g")
    .attr("class", "key")
    .attr("transform", "translate(50 ," + temp +")");
    g.append("rect").attr("height", 300).attr("width", 60).attr("x", -50).attr("y", -275).attr("fill", "white");
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
var old_country = ['USA'];
function country_clicked(d) {
    if (d3.event.defaultPrevented) { return; }
  map.selectAll(["#states", "#cities"]).remove();
  state = null;

  if (country) {
    map.selectAll("#" + country.id).style('display', null);
  }

  if (d && country !== d) {
    var xyz = get_xyz(d);
    country = d;
     //zoom(xyz);
     countries=[country.id];
     heatmapChart(file_csv,countries,dates);
     d3.select("#mapid").text(country.id);
     d3.select("#"+country.id).transition().attr("stroke", "red").attr("stroke-width", 1.5);
     d3.select("#"+old_country).transition().attr("stroke", "black").attr("stroke-width", 0.2);
     old_country = country.id;
  } else {
    //var xyz = [mapWidth / 2, mapHeight / 1.5, 1];
    //country = null;
    //zoom(xyz);
    //countries=['USA'];
    //heatmapChart(file_csv,countries,dates);
  }

}

function reset() {
    d3.select("#mapid").text("Nothing yet :)");
  d3.select("#"+old_country).transition().attr("stroke", "black").attr("stroke-width", 0.2);
  countries=['USA'];
  var xyz = [mapWidth / 2, mapHeight / 1.45, 1];
  country = null;
  zoom(xyz);
  mapSVG.selectAll("circle").transition().duration(750).attr("transform", null);
  heatmapChart(file_csv,countries,dates);
}

$(window).resize(function() {
  var w = $("#map").width();
  mapSVG.attr("width", w);
  mapSVG.attr("height", w * mapHeight / mapWidth);
});
