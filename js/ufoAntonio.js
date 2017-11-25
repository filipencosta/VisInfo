var dispatch = d3.dispatch("movieEnter");
var dataset, full_dataset;
var selectedCircle, selectedBar;

//nota: quero apagar o "bars", deixar so' scatterplot, e mostrar coordenadas gps dos sightings

/*dispatch.on("movieEnter.bars", function(movie){
    if(selectedBar != null){
        selectedBar.attr("fill", "purple");
        console.log("QQ");
    }
    console.log(movie.title);
    selectedBar = d3.select("rect[title=\'"+movie.title+"\']")
    selectedBar.attr("fill", "red");
});*/
dispatch.on("movieEnter.scatterplot", function(movie){
    if(selectedCircle != null){
        selectedCircle.attr("fill", "purple");
        //console.log("WW");
    }
    console.log(movie.unique_id);
    console.log(movie.country);    
    selectedCircle = d3.select("circle[unique_id=\'"+movie.unique_id+"\']")
    selectedCircle.attr("fill", "red");
});

/*d3.json("oscar_winners.json", function (data) {
    full_dataset = data;    
    dataset = full_dataset.slice(0,35);
    //gen_bars();
    gen_scatterplot();
});*/


d3.csv("datafiles/ufo03.csv", function (data) {
    full_dataset = data;    
    dataset = full_dataset; // .filter(function (d) {return d.country=="USA" || d.country=="GBR"});//full_dataset.slice(0,35);
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
        dispatch.call("movieEnter", d, d);});

}*/

function gen_scatterplot() {
    var w = 600;
    var h = 300;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
		.attr("fill", "blue");
		
    
    var padding = 30;
    var bar_w = 15;
    var r = 2;

    var hscale = d3.scaleLinear()
                         .domain([70,-45])//NOTA: ele da forma automatica nao estava a lidar bem com os valores negativos
                       .range([padding,h-padding]);
    /*var hscale = d3.scaleLinear()
                         .domain([d3.max(dataset, function(d) {
				    return d.latitude;}),
                       d3.min(dataset, function(d) {
				    return d.latitude;})])
                       .range([padding,h-padding]);*/
			 
    var xscale = d3.scaleLinear()
                       .domain([-165,180])
                       .range([padding,w-padding]);
    /*var xscale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) {
				    return d.longitude;}),
                       d3.max(dataset, function(d) {
				    return d.longitude;})])
                       .range([padding,w-padding]);*/

    var yaxis = d3.axisLeft()
                  .scale(hscale);                  

    var xaxis = d3.axisBottom()
	.scale(xscale);
              //.ticks(dataset.length/2);
              
              
    //nao estou a ver o que eq isto faz! so' se era alguma interacao com o barplot
    /*var cscale = d3.scaleLinear()
         .domain([d3.min(dataset, function(d) { return  d.year;}),
                  d3.max(dataset, function(d) { return d.year;})])
         .range(["red", "blue"]);*/

   
   gY = svg.append("g")
   	.attr("transform","translate(288,0)")  //para o eixoY estar encostado 'a esq., deve ter aqui 30 (=0+padding);
	.attr("class","y axis")
	.call(yaxis);


    gX = svg.append("g")
   	.attr("transform","translate(0," + (((h-2*padding)/2)+padding+26) + ")") //para ficar encostado em baixo e' h-padding
	.call(xaxis);
	
   svg.selectAll("circle")
       .data(dataset)
     .enter().append("circle")
       .attr("r",r)
       .attr("fill","purple")     
       .attr("cx",function(d, i) {
			//if (d.longitude == 0) {return padding;}
                        return  xscale(d.longitude);
                 })
       .attr("cy",function(d) {
                 return hscale(d.latitude);
                 })
       .attr("unique_id", function(d) {return d.unique_id;})
       .attr("country", function(d) {return d.country;})
       .on("mouseover", function(d) {
        dispatch.call("movieEnter", d, d);});
	
	 
    
    


}