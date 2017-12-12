var div = d3.select('body').append('div');
var countrydata=[];

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

d3.csv("datafiles/countrySort.csv", function(error, data) {
   for (var i = 0; i < data.length; i++) {
        countrydata.push({key: data[i].country});
    }
});

// INPUT TO lineGraph
var countries = ['AFG', 'GBR'];
var dates =[1960,2014];
var file_path="datafiles/groupbyCountryYear_addedZeros.csv";
  
var linegraph = function(countries, dates, file_path) {
    d3.csv("datafiles/groupbyCountryYear_addedZeros.csv", function(error, data) {
      data.forEach(function(d) {
          d.yearInt = +d.year;
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
      
      
      // console.log(countries);
      // console.log(dates);
      // console.log(data);
      
      data = data.filter(function(d)
    {
        if(( countries.includes(d["country"]))  && (d["yearInt"] >= dates[0]) && (d["yearInt"] <= dates[1]))
        {
            return d;
        }

    })
    
    countrydata = countrydata.filter(function(d) //temporary, to filter countries displayed in dropdown box
    {
        if( countries.includes(d["key"]))
        {
            return d;
        }

    })
      

      var dataNested = d3.nest()
        .key(function (d) { return d.country })
        .entries(data)
        
      // console.log(dataNested);
      

      div.append('select')
          .attr('id','variableSelect')
          .on('change',variableChange)
        .selectAll('option')  
          .data(countrydata).enter()
        .append('option')
          .attr('value',function (d) { return d.key })
          .text(function (d) { return d.key })

          console.log(dataNested);
          
      //var dataFiltered = dataNested.filter(function (d) { return d.key===d3.select('#variableSelect').property('value') })
      var dataFiltered = dataNested.filter(function (d) { return d.key==="GBR" })

      dataFiltered.sort(function(a,b){return a.year - b.year;});
      
      //console.log(dataFiltered);
      //console.log(x);
      
      
      // x.domain([parseDate(1960),parseDate(2015)]);
      // y.domain([0,7000]);
      
      // x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
      // y.domain([0, d3.max(dataFiltered[0].values, function(d) { return d.value; })]);
      
      //y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.value; }));
      
      maxValues=[];
      maxYears=[];
      minYears=[];
      for (key in dataNested){
          maxValues.push(d3.max(dataNested[key].values, function(d){return d.value;}));
          maxYears.push(d3.max(dataNested[key].values, function(d){return d.year;}));
          minYears.push(d3.min(dataNested[key].values, function(d){return d.year;}));
      }
      
      x.domain([d3.min(minYears),d3.max(maxYears)]);
      y.domain([0, d3.max(maxValues)]);
      
      
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

      for (key in dataNested){
          // console.log(dataNested[key]);
          svg.append("path")
          .datum(dataNested[key].values)
          .attr("class", "line")
          .attr("d", line);
      }
          
          
      svg.append("path")
          .datum(dataFiltered[0].values)
          .attr("class", "line")
          .attr("d", line);

      svg.append("path")
          .datum(dataNested.filter(function (d) { return d.key==="AFG" })[0].values)
          .attr("class", "line")
          .attr("d", line);
          
      function variableChange() {
        var value = this.value
        var dataFiltered = dataNested.filter(function (d) { return d.key===value })
        x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
        y.domain([0, d3.max(dataFiltered[0].values, function(d) { return d.value; })]);
        //y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.value; }));
        d3.select('.xAxis').transition().duration(1000).call(xAxis)
        d3.select('.yAxis').transition().duration(1000).call(yAxis)
        d3.select('.line').datum(dataFiltered[0].values).attr('d',line)
        //console.log(dataFiltered);
         }

    });
}

linegraph(countries, dates, file_path);