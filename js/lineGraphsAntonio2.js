//NOTA: isto pressupoe q o .html tenha area1, buttons_area, area2

// var div = d3.select('body').append('div');

var countries = ['AFG', 'GBR', 'PRT','ESP'];
countries.push('world');
var dates =[1960,2014];

var gen_lineplots = function (dates, countries){
    
var div = d3.select('#buttons_area');

var countrydata=[];


var margin = {top: 10, right: 10, bottom: 30, left: 25},
    width = (450 - margin.left - margin.right)/2.5;
    height = (250 - margin.top - margin.bottom);

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
    .scale(y)
    .ticks(0);
    ;//.tickFormat(formatPct);

var metric;
var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d[metric]); });

var svg = d3.select("#area1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataFiltered = {}
var dataNested = {}
var color = ["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]; 
// console.log(color);

d3.csv("datafiles/countrySort.csv", function(error, data) {
   for (var i = 0; i < data.length; i++) {
        countrydata.push({key: data[i].country});
    }
});

// INPUT TO lineGraph
// var countries = ['AFG', 'GBR', 'PRT','ESP'];
// countries.push('world');
// var dates =[1960,2014];
var sightings_file_path="datafiles/groupbyCountryYear_addedZeros.csv"; //#sightings
// var file_path="datafiles/internet_formatted_addedZeros.csv"; //%internet access
var file_path="datafiles/allInfo_byYear.csv"; //#sightings

var x_min,x_max;
  
var linegraph = function(countries, dates, file_path, canvas, my_metric) {
    d3.csv(file_path, function(error, data) {
      data.forEach(function(d) {
          d.yearInt = +d.year;
          d.year = parseDate(d.year);
          d.sightings = +d.sightings;
          d.gdp = +d.gdp;
          d.unemployment = +d.unemployment;
          d.internet = +d.internet;
          d.scifi = +d.scifi;
      });
      

      
      // console.log(countries);
      // console.log(dates);
      // console.log(data[0][my_metric]);
      // console.log("x_max: ",x_max);
      data = data.filter(function(d)
    {
        if(( countries.includes(d["country"]))  && (d["yearInt"] >= dates[0]) && (d["yearInt"] <= dates[1]))
        {
            return d;
        }
        
        // if (file_path==sightings_file_path){
            // if(( countries.includes(d["country"]))  && (d["yearInt"] >= dates[0]) && (d["yearInt"] <= dates[1]))
            // {
                // return d;
            // }
        // }
        // else{//max and min year were previously computed
            // if(( countries.includes(d["country"]))  && (d["year"] >= x_min) && (d["year"] <= x_max))
            // {
                // return d;
            // }
        // }

    })
    
    countrydata = countrydata.filter(function(d) //temporary, to filter countries displayed in dropdown box
    {
        if( countries.includes(d["key"]))
        {
            return d;
        }
    })
      
      // console.log(countrydata);

      var dataNested = d3.nest()
        .key(function (d) { return d.country })
        .entries(data)
        
      // console.log(dataNested);
      

      // div.append('select')
          // .attr('id','variableSelect')
          // .on('change',variableChange)
        // .selectAll('option')  
          // .data(countrydata).enter()
        // .append('option')
          // .attr('value',function (d) { return d.key })
          // .text(function (d) { return d.key })

          // console.log(dataNested);
          
      //var dataFiltered = dataNested.filter(function (d) { return d.key===d3.select('#variableSelect').property('value') })
      // var dataFiltered = dataNested.filter(function (d) { return d.key==="GBR" })

      // dataFiltered.sort(function(a,b){return a.year - b.year;});
      
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
          maxValues.push(d3.max(dataNested[key].values, function(d){return d[my_metric];}));
          maxYears.push(d3.max(dataNested[key].values, function(d){return d.year;}));
          minYears.push(d3.min(dataNested[key].values, function(d){return d.year;}));
      }
      
      if (file_path==sightings_file_path){
          x_min=d3.min(minYears);
          x_max=d3.max(maxYears);
      }
            
      x.domain([d3.min(minYears),d3.max(maxYears)]);
      y.domain([0, d3.max(maxValues)]);
      
      
      canvas.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      canvas.append("g")
          .attr("class", "yAxis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Cumulative Return");


     
     canvas.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text(my_metric);
          
      i=0;
      metric=my_metric;
      for (key in dataNested){
          // console.log(dataNested[key]);
          canvas.append("path")
          .datum(dataNested[key].values)
          .attr("class", "line")
          .attr("d", line)
          .style("stroke",color[i]);
          i+=7;//martelada so' pq o array de cores muda gradualmente de cor, acho. Com i++ era tudo verde
      }
          
          
      // canvas.append("path")
          // .datum(dataFiltered[0].values)
          // .attr("class", "line")
          // .attr("d", line);

      // canvas.append("path")
          // .datum(dataNested.filter(function (d) { return d.key==="AFG" })[0].values)
          // .attr("class", "line")
          // .attr("d", line);
          
      // function variableChange() {
          // canvas.selectAll("*").remove();
        // // var value = this.value
        // // var dataFiltered = dataNested.filter(function (d) { return d.key===value })
        // // x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
        // // y.domain([0, d3.max(dataFiltered[0].values, function(d) { return d.value; })]);
        // // //y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.value; }));
        // // d3.select('.xAxis').transition().duration(1000).call(xAxis)
        // // d3.select('.yAxis').transition().duration(1000).call(yAxis)
        // // d3.select('.line').datum(dataFiltered[0].values).attr('d',line)
        // // //console.log(dataFiltered);
         // }

    });
}

linegraph(countries, dates, file_path, svg, "sightings");

var svg2 = d3.select("#area2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

var metrics={"GDP":"gdp","unemployment":"unemployment","internet access":"internet","sci-fi movie releases":"scifi"};
// var file_path="datafiles/internet_formatted_addedZeros.csv"; //%internet access
// linegraph(countries, dates, file_paths["GDP"],svg2);

linegraph(countries, dates, file_path,svg2,"gdp");


social_variables=["GDP","unemployment","internet access","sci-fi movie releases"];
// console.log(social_variables);

div.append('select')
          .attr('id','variableSelect')
          .on('change',variableChange)
        .selectAll('option')  
          .data(social_variables).enter()
        .append('option')
          .attr('value',function (d) { return d })
          .text(function (d) { return d })

function variableChange() {
          svg2.selectAll("*").remove();//clean previous plot
          var value = this.value //get social variable chosen by user
          linegraph(countries, dates, file_path,svg2,metrics[value]);//draw new plot
          
          //scatterplot:
          d3.select("#scatterplot").selectAll("*").remove();//clean previous plot
          gen_scatterplot(metrics[value]);
          // linegraph(countries, dates, file_path,svg2,metrics[value]);//draw new plot
         }
}

gen_lineplots(dates,countries);