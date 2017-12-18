var metric="gdp";
var dataset;


var getData_genScatter = function(dates, countries,metric){
    var data = ScatterPlot_data.filter(function(d)
    {
        if((d["year"] >= dates[0]) && (d["year"] <= dates[1]) && d["country"]!="world")
        {
            return d;
        }
    })

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
        return _.extend({}, item.key,
        {sightings: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node.sightings);}, 0)},
        {gdp: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node.gdp);}, 0)},
        {unemployment: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node.unemployment);}, 0)},
        {internet: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node.internet);}, 0)},
        {scifi: _.reduce(item.vals, function(memo, node) {
            return memo + Number(node.scifi);}, 0)}
        );
    });
    ////////DATAGROUPER DECLARATION - END

    // console.log(data);

    dataset = DataGrouper.sum(data,["country"]);
    dataset.forEach(function(d){
        if( countries.includes(d["country"])){d.highlight=true;}
        else{d.highlight=false;}
    });



    // console.log(dataset);
    gen_scatterplot(metric);
}


function gen_scatterplot(metric){

    var data = dataset;

    var margin = { top: 20, right: 20, bottom: 30, left: 30 };
    var scatterplot_width = (600 - margin.left - margin.right)/3;
    var scatterplot_height = 480 - margin.top - margin.bottom;

    var tooltip = d3.select("#scatterplot").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var scatterplot_x = d3.scaleLog()
          .range([0, scatterplot_width])
          .nice();

    var y = d3.scaleLinear()
        .range([scatterplot_height, 0]);

    var xAxis = d3.axisBottom(scatterplot_x).ticks(0),
        yAxis = d3.axisLeft(y).ticks(0);

    var brush = d3.brush().extent([[0, 0], [scatterplot_width, scatterplot_height]]).on("end", brushended),
        idleTimeout,
        idleDelay = 350;

    var svg = d3.select("#scatterplot").append("svg")
                .attr("width", scatterplot_width + margin.left + margin.right)
                .attr("height", scatterplot_height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", scatterplot_width )
        .attr("height", scatterplot_height )
        .attr("x", 0)
        .attr("y", 0);

    // var tip = d3.tip()
      // .attr("class", "d3-tip")
      // .offset([-10, 0])
      // .html(function(d) {
        // return sightings + ": " + d[sightings] + "<br>" + metric + ": " + d[metric];
      // });


    var xExtent = d3.extent(data, function (d) { return d.sightings; });
    var yExtent = d3.extent(data, function (d) { return d[metric]; });
    var sc_domain = d3.extent(data, function (d) { return d.sightings; });
    if (sc_domain[0] == 0) {
        sc_domain[0] = 1;
    }
    scatterplot_x.domain(sc_domain).nice();
    y.domain(d3.extent(data, function (d) { return d[metric]; })).nice();
    var scatter = svg.append("g")
         .attr("id", "scatterplot")
         .attr("clip-path", "url(#clip)");

    scatter.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return scatterplot_x(d.sightings); })
        .attr("cy", function (d) { return y(d[metric]); })
        .attr("opacity", 0.5)
        // .style("fill", "#4292c6");
        .style("fill", function(d) {if (d.highlight){return "#FF0000"} else{return "#D3D3D3"}});
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide);

    // x axis
    svg.append("g")
       .attr("class", "x axis")
       .attr('id', "axis--x")
       .attr("transform", "translate(0," + scatterplot_height + ")")
       .call(xAxis);

    svg.append("text")
     .style("text-anchor", "end")
        .attr("x", scatterplot_width)
        .attr("y", scatterplot_height - 8)
     .text("sightings (log-scale)");

    // y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text(metric);

    scatter.append("g")
        .attr("class", "brush")
        .call(brush);

    function brushended() {

        var s = d3.event.selection;
        if (!s) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
            scatterplot_x.domain(d3.extent(data, function (d) { return d.sightings; })).nice();
            y.domain(d3.extent(data, function (d) { return d[metric]; })).nice();
        } else {

            scatterplot_x.domain([s[0][0], s[1][0]].map(scatterplot_x.invert, scatterplot_x));
            y.domain([s[1][1], s[0][1]].map(y.invert, y));
            scatter.select(".brush").call(brush.move, null);
        }
        zoom();
    }

    function idled() {
        idleTimeout = null;
    }

    function zoom() {

        var t = scatter.transition().duration(750);
        svg.select("#axis--x").transition(t).call(xAxis);
        svg.select("#axis--y").transition(t).call(yAxis);
        scatter.selectAll("circle").transition(t)
        .attr("cx", function (d) { return scatterplot_x(d.sightings); })
        .attr("cy", function (d) { return y(d[metric]); });
    }

}
