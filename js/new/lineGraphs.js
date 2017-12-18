//NOTA: isto pressupoe q o .html tenha area1, buttons_area, area2

// var LineGraph_div = d3.select('body').append('LineGraph_div');


var LineGraph_div = d3.select('#buttons_area');
var LineGraph_margin = {top: 10, right: 10, bottom: 30, left: 25};
var LineGraph_width = (450 - LineGraph_margin.left - LineGraph_margin.right)/2.5;
var LineGraph_height = (250 - LineGraph_margin.top - LineGraph_margin.bottom);

//var parseDate = d3.timeParse("%Y-%m-%d");
var parseDate = d3.timeParse("%Y");
var formatPct = d3.format('.0%');

var LineGraph_x = d3.scaleTime()
.range([0, LineGraph_width]);

var LineGraph_y = d3.scaleLinear()
.range([LineGraph_height, 0]);

var LineGraph_xAxis = d3.axisBottom()
.scale(LineGraph_x);

var LineGraph_yAxis = d3.axisLeft()
.scale(LineGraph_y)
.ticks(0);
//.tickFormat(formatPct);


var LineGraph_line = d3.line()
.x(function(d) { return LineGraph_x(d.year); })
.y(function(d) { return LineGraph_y(d[metric]); });

var dataFiltered = {};
var dataNested = {};
var color = ["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"];
var x_min,x_max;


var LineGraph_svg = d3.select("#area1").append("svg")
.attr("width", LineGraph_width + LineGraph_margin.left + LineGraph_margin.right)
.attr("height", LineGraph_height + LineGraph_margin.top + LineGraph_margin.bottom)
.append("g")
.attr("transform", "translate(" + LineGraph_margin.left + "," + LineGraph_margin.top + ")");

function linegraph(countries, dates, file_path, canvas, my_metric) {
    var countries_line = countries;
    //countries_line.push('world');
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
            if(( countries_line.includes(d.country) || d.country == "world")  && (d.yearInt >= dates[0]) && (d.yearInt <= dates[1]))
            {
                return d;
            }
        });

        var countrydata = LineGraph_countrydata.filter(function(d) //temporary, to filter countries displayed in dropdown box
        {
            if( countries_line.includes(d.key))
            {
                return d;
            }
        });

        // console.log(LineGraph_countrydata);

        var dataNested = d3.nest()
        .key(function (d) { return d.country; })
        .entries(data);


        maxValues=[];
        maxYears=[];
        minYears=[];
        for (var key in dataNested){
            maxValues.push(d3.max(dataNested[key].values, function(d){return d[my_metric];}));
            maxYears.push(d3.max(dataNested[key].values, function(d){return d.year;}));
            minYears.push(d3.min(dataNested[key].values, function(d){return d.year;}));
        }

        if (file_path==sightings_file_path){
            x_min=d3.min(minYears);
            x_max=d3.max(maxYears);
        }

        LineGraph_x.domain([d3.min(minYears),d3.max(maxYears)]);
        LineGraph_y.domain([0, d3.max(maxValues)]);


        canvas.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + LineGraph_height + ")")
        .call(LineGraph_xAxis);

        canvas.append("g")
        .attr("class", "yAxis")
        .call(LineGraph_yAxis)
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

        canvas.append("g").attr("id", "lines");

    });
};






linegraph(countries, dates, file_path, LineGraph_svg, "sightings");

var LineGraph_svg2 = d3.select("#area2").append("svg")
.attr("width", LineGraph_width + LineGraph_margin.left + LineGraph_margin.right)
.attr("height", LineGraph_height + LineGraph_margin.top + LineGraph_margin.bottom)
.append("g")
.attr("transform", "translate(" + LineGraph_margin.left + "," + LineGraph_margin.top + ")");

var metrics={"GDP":"gdp","unemployment":"unemployment","internet access":"internet","sci-fi movie releases":"scifi"};
// var file_path="datafiles/internet_formatted_addedZeros.csv"; //%internet access
// linegraph(countries, dates, file_paths["GDP"],svg2);

linegraph(countries, dates, file_path,LineGraph_svg2,metric);


social_variables=["GDP","unemployment","internet access","sci-fi movie releases"];

LineGraph_div.append('select')
.attr('id','variableSelect')
.on('change',variableChange)
.selectAll('option')
.data(social_variables).enter()
.append('option')
.attr('value',function (d) { return d; })
.text(function (d) { return d; });

function variableChange() {
    var value = this.value; //get social variable chosen by user
    metric = metrics[value];
    linegraph_update(countries, dates, file_path,LineGraph_svg2,metrics[value]);//draw new plot

    //scatterplot:
    d3.select("#scatterplot").selectAll("*").remove();//clean previous plot
    gen_scatterplot(metrics[value]);
    // linegraph(countries, dates, file_path,svg2,metrics[value]);//draw new plot
}

function linegraph_update(countries, dates, file_path, canvas, my_metric) {
    var countries_line = countries;
    //countries_line.push('world');
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
            if(( countries_line.includes(d.country) || d.country == "world")  && (d.yearInt >= dates[0]) && (d.yearInt <= dates[1]))
            {
                return d;
            }
        });

        var countrydata = LineGraph_countrydata.filter(function(d) //temporary, to filter countries displayed in dropdown box
        {
            if( countries_line.includes(d.key))
            {
                return d;
            }
        });

        // console.log(LineGraph_countrydata);

        var dataNested = d3.nest()
        .key(function (d) { return d.country; })
        .entries(data);


        maxValues=[];
        maxYears=[];
        minYears=[];
        for (var key in dataNested){
            maxValues.push(d3.max(dataNested[key].values, function(d){return d[my_metric];}));
            maxYears.push(d3.max(dataNested[key].values, function(d){return d.year;}));
            minYears.push(d3.min(dataNested[key].values, function(d){return d.year;}));
        }

        if (file_path==sightings_file_path){
            x_min=d3.min(minYears);
            x_max=d3.max(maxYears);
        }

        LineGraph_x.domain([d3.min(minYears),d3.max(maxYears)]);
        LineGraph_y.domain([0, d3.max(maxValues)]);

        canvas.select(".xAxis").transition().duration(750)
        .attr("transform", "translate(0," + LineGraph_height + ")")
        .call(LineGraph_xAxis);

        canvas.select(".yAxis")
        .transition().duration(750)
        .call(LineGraph_yAxis);


        i=0;
        metric=my_metric;
        var lines = canvas.select("g#lines").selectAll("path").data(dataNested);

        lines.transition().duration(750)
        .attr("d", function (d) { return LineGraph_line(d.values); })
        .style("stroke", function (d) { return colourOfCountry(d.key); });

        lines.exit().remove();

        lines.enter().append("path")
        .attr("class", "line")
        .attr("d", function (d) { return LineGraph_line(d.values); })
        .style("stroke", function (d) { return colourOfCountry(d.key); })
        .merge(lines);
    });
};


function updatePlots() {
    //LineGraph_svg.selectAll("*").remove();//clean previous plot
    linegraph_update(countries, dates, file_path, LineGraph_svg, "sightings");

    //LineGraph_svg2.selectAll("*").remove();//clean previous plot
    linegraph_update(countries, dates, file_path, LineGraph_svg2, metric);//draw new plot

    //scatterplot:
    d3.select("#scatterplot").selectAll("*").remove();//clean previous plot
    getData_genScatter(dates, countries, metric);
}
