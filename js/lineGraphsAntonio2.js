var div = d3.select('body').append('div')

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//var parseDate = d3.timeParse("%Y-%m-%d");
var parseDate = d3.timeParse("%Y");
var formatPct = d3.format('.0%')

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);
    ;//.tickFormat(formatPct);

var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataFiltered = {}
var dataNested = {}

// d3.json("datafiles/mock_data2.json", function(error, data) {
  // data.forEach(function(d) {
    // d.date = parseDate(d.date);
    // d.cror = +d.cror;
    // d.value = 0;//+d.value;
  // });
  
d3.csv("datafiles/groupbyCountryYear.csv", function(error, data) {
  data.forEach(function(d) {
      d.year = parseDate(d.year);
      //day : +data.day;
      //hour : +data.hour;
      d.value = +d.value;
  });
  
  ////////DATAGROUPER DECLARATION - BEGIN
    var DataGrouper = (function() {
    var has = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function(data, names) {
        return _.reduce(data, function(memo, item) {
            var key = _.pick(item, names);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    var group = function(data, names) {
        var stems = keys(data, names);
        return _.map(stems, function(stem) {
            return {
                key: stem,
                vals:_.map(_.where(data, stem), function(item) {
                    return _.omit(item, names);
                })
            };
        });
    };

    group.register = function(name, converter) {
        return group[name] = function(data, names) {
            return _.map(group(data, names), converter);
        };
    };

    return group;
}());
DataGrouper.register("sum", function(item) {
    return _.extend({}, item.key, {value: _.reduce(item.vals, function(memo, node) {
        return memo + Number(node.value);
    }, 0)});
});
////////DATAGROUPER DECLARATION - END
    
    //JA ESTA NO PREPROCESSAMENTO
    //data = DataGrouper.sum(data,["year","country"]);
  

  var dataNested = d3.nest()
    .key(function (d) { return d.country })
    .entries(data)
    
  //console.log(dataNested);

  div.append('select')
      .attr('id','variableSelect')
      .on('change',variableChange)
    .selectAll('option')  
      .data(dataNested).enter()
    .append('option')
      .attr('value',function (d) { return d.key })
      .text(function (d) { return d.key })

  var dataFiltered = dataNested.filter(function (d) { return d.key===d3.select('#variableSelect').property('value') })
  //var dataFiltered = dataNested.filter(function (d) { return d.key==="USA" })

  dataFiltered.sort(function(a,b){return a.year - b.year;});
  
  //console.log(dataFiltered);
  console.log(x);
  
  x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
  y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.value; }));

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Cumulative Return");

  svg.append("path")
      .datum(dataFiltered[0].values)
      .attr("class", "line")
      .attr("d", line);

  function variableChange() {
  	var value = this.value
   	var dataFiltered = dataNested.filter(function (d) { return d.key===value })
    x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
    y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.value; }));
    d3.select('.xAxis').transition().duration(1000).call(xAxis)
    d3.select('.yAxis').transition().duration(1000).call(yAxis)
    d3.select('.line').datum(dataFiltered[0].values).attr('d',line)
    //console.log(dataFiltered);
	 }

});