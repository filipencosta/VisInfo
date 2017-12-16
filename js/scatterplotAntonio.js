var dataset, full_dataset;
var xscale, hscale;
var xaxis,yaxis;
var gX, gY;
var container;
var zoom = d3.zoom()
    .scaleExtent([1,10])
    .on("zoom", zoomed);
    
function zoomed() {
    // create new scale ojects based on event
      var new_xScale = d3.event.transform.rescaleX(xscale)
      var new_yScale = d3.event.transform.rescaleY(hscale)
      // update axes
  gX.call(xaxis.scale(new_xScale));
  gY.call(yaxis.scale(new_yScale));
    container.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
}

d3.csv("datafiles/groupbyCountryYear.csv", function (data) {
    data.forEach(function(d) {
          d.year = +d.year;
          // d.year = parseDate(d.year);
          //day : +data.day;
          //hour : +data.hour;
          d.value = +d.value;
      });
    full_dataset = data;    
    dataset = full_dataset;//full_dataset.slice(0,35);
    gen_scatterplot();
});

function gen_scatterplot() {
    var w = 600;
    var h = 300;
    
    var padding = 30;
    var innerW = w-2*padding;
    var innerH = h-2*padding;
    var r = 2;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
		.attr("fill", "blue")
        .append("g")
        // .attr("transform","translate(" +padding+","+padding +   ")")
        // .call(zoom)
        ;
        
    
        
    // container = svg.append("g");
    container = svg.append("svg")
      .classed("objects", true)
      .attr("width", innerW)
      .attr("height", innerH)
      .call(zoom)
      ;
	
 

    // var hscale = d3.scaleLinear()
                         // .domain([70,-45])//NOTA: ele da forma automatica nao estava a lidar bem com os valores negativos
                       // .range([padding,h-padding]);
    hscale = d3.scaleLinear()
                         .domain([d3.max(dataset, function(d) {
				    return d.value;}),
                       d3.min(dataset, function(d) {
				    return d.value;})])
                       .range([padding,h-padding]);
			 
    // var xscale = d3.scaleLinear()
                       // .domain([-165,180])
                       // .range([padding,w-padding]);
    xscale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) {
				    return d.year;}),
                       d3.max(dataset, function(d) {
				    return d.year;})])
                       .range([padding,w-padding]);

    yaxis = d3.axisLeft()
                  .scale(hscale);                  

    xaxis = d3.axisBottom()
	.scale(xscale);
              //.ticks(dataset.length/2);

   
   gY = svg.append("g")
   	.attr("transform","translate("+padding+",0)")  //para o eixoY estar encostado 'a esq., deve ter aqui 30 (=0+padding);
	.attr("class","y axis")
	.call(yaxis);


    gX = svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")") //para ficar encostado em baixo e' h-padding
	.call(xaxis);
	
   container.selectAll("circle")
       .data(dataset)
     .enter().append("circle")
       .attr("r",r)
       .attr("fill","purple")     
       .attr("cx",function(d, i) {
			//if (d.longitude == 0) {return padding;}
                        return  xscale(d.year);
                 })
       .attr("cy",function(d) {
                 return hscale(d.value);
                 })
       .attr("value", function(d) {return d.value;})
       .attr("year", function(d) {return d.year;})
       .attr("country", function(d) {return d.country;})
       ;
       // .on("mouseover", function(d) {
        // dispatch.call("movieEnter", d, d);});
}