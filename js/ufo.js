var dispatch = d3.dispatch("ufoEnter");
var dataset, full_dataset;
var selectedCircle, selectedBar;

//nota: quero apagar o "bars", deixar só scatterplot, e mostrar coordenadas gps dos sightings

/*dispatch.on("ufoEnter.bars", function(movie){
    if(selectedBar != null){
        selectedBar.attr("fill", "purple");
        console.log("QQ");
    }
    console.log(movie.title);
    selectedBar = d3.select("rect[title=\'"+movie.title+"\']")
    selectedBar.attr("fill", "red");
});*/
dispatch.on("ufoEnter.scatterplot", function(sighting){
    if(selectedCircle != null){
        selectedCircle.attr("fill", "purple");
    }
    console.log(sighting.city + " " + sighting.shape);
    selectedCircle = d3.select("circle[title=\'"+ sighting.city + " " + sighting.shape+ "\']")
    selectedCircle.attr("fill", "red");
});

/*d3.json("oscar_winners.json", function (data) {
    full_dataset = data;
    dataset = full_dataset.slice(0,35);
    //gen_bars();
    gen_scatterplot();
});*/

d3.csv("http://localhost:8000/datafiles/ufo.csv", function (data) {
    full_dataset = data;
    dataset = full_dataset.slice(0,35);
    //gen_bars();
    gen_scatterplot();
});


/*
function gen_bars() {
    var w = 600;
    var h = 300;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);


    var padding = 30;
    var bar_w = 15;

    var hscale = d3.scaleLinear()
                         .domain([10,0])
                         .range([padding,h-padding]);

    var xscale = d3.scaleLinear()
                         .domain([0,dataset.length])
                         .range([padding,w-padding]);


    var yaxis = d3.axisLeft()
                  .scale(hscale);

    var xaxis = d3.axisBottom()
              .scale(d3.scaleLinear()
              .domain([dataset[0].oscar_year,dataset[dataset.length-1].oscar_year])
              .range([padding+bar_w/2,w-padding-bar_w/2]))
              .tickFormat(d3.format("d"))
              .ticks(dataset.length/4);
              //.ticks(20);

    svg.append("g")
   	.attr("transform","translate(30,0)")
	.attr("class","y axis")
	.call(yaxis);

    svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
	.call(xaxis);


    svg.selectAll("rect")
    .data(dataset)
    .enter().append("rect")
    .attr("width",Math.floor((w-padding*2)/dataset.length)-1)
    .attr("height",function(d) {
                          return h-padding-hscale(d.longitude);
                   })
     .attr("fill","purple")
     .attr("x",function(d, i) {
                          return xscale(i);
                   })
     .attr("y",function(d) {
                   return hscale(d.longitude);
                   })
     .attr("title", function(d) {return d.title;})
     .on("mouseover", function(d) {
        dispatch.call("ufoEnter", d, d);});

}*/

function gen_scatterplot() {
    var w = 1200;
    var h = 300;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
		.attr("fill", "blue");


    var padding = 30;
    var bar_w = 15;
    var r = 5;

    var hscale = d3.scaleLinear()
                         .domain([d3.max(dataset, function(d) {
				    return d.longitude;}),
                       d3.min(dataset, function(d) {
				    return d.longitude;})])
                       .range([padding,h-padding]);

    var xscale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) {
				    return d.latitude;})/1000000,
                       d3.max(dataset, function(d) {
				    return d.latitude;})/1000000])
                       .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
                  .scale(hscale);

    var xaxis = d3.axisBottom()
	.scale(xscale)
              .ticks(dataset.length/2);


    //nao estou a ver o que eq isto faz! so' se era alguma interacao com o barplot
    /*var cscale = d3.scaleLinear()
         .domain([d3.min(dataset, function(d) { return  d.year;}),
                  d3.max(dataset, function(d) { return d.year;})])
         .range(["red", "blue"]);*/


   gY = svg.append("g")
   	.attr("transform","translate(30,0)")
	.attr("class","y axis")
	.call(yaxis);


    gX = svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
	.call(xaxis);

   svg.selectAll("circle")
       .data(dataset)
     .enter().append("circle")
       .attr("r",r)
       .attr("fill","purple")
       .attr("cx",function(d, i) {
			if (d.latitude == 0) {return padding;}
                        return  xscale(d.latitude/1000000);
                 })
       .attr("cy",function(d) {
                 return hscale(d.longitude);
                 })
       .attr("title", function(d) {return d.title;})
       .on("mouseover", function(d) {
        dispatch.call("ufoEnter", d, d);});






}
