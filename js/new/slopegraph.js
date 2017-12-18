
var selectedLine;
//CODIGO SLOPEGRAPH
function findMax(lista){
    var maxElement=lista[0];
    var index;
    var lista2=lista;
    for(var i in lista2){
        if (maxElement.value < lista2[i].value){
            maxElement=lista2[i];
            index=i;
        }
    }
    lista2.splice(index,1);
    return [maxElement,lista2];
};
function originalcolor(classe){
    for(var i = 0 ; i<11;i++){
        d3.selectAll('.rightlabel-'+i).transition().style('opacity', 1);
        d3.selectAll('.leftlabel-'+i).transition().style('opacity', 1);
        d3.selectAll('.line-'+i).transition().style('opacity', 1);
        d3.selectAll('.rightlabel-'+i).style('fill', 'black');
        d3.selectAll('.leftlabel-'+i).style('fill', 'black');
        d3.selectAll('.line-'+i).style('stroke', 'black');
    }
};

function changecolor (classe){
    if (selectedLine!=null){
        d3.selectAll('.rightlabel-'+selectedLine).style('fill', 'Black');
        d3.selectAll('.leftlabel-'+selectedLine).style('fill', 'Black');
        d3.selectAll('.line-'+selectedLine).style('stroke', 'Black');
    }
    var line = this.getAttribute('class');
    d3.selectAll('.'+line).style('stroke', 'Red');
    d3.selectAll('.'+line).transition().style('opacity', 1);
    var temp=line.split('-');
    var number=temp[1];
    selectedLine=number;
    d3.selectAll('.rightlabel-'+number).style('fill', 'Red');
    d3.selectAll('.leftlabel-'+number).style('fill', 'Red');
    d3.selectAll('.rightlabel-'+number).transition().style('opacity', 1);
    d3.selectAll('.leftlabel-'+number).transition().style('opacity', 1);
    for(var i = 0 ; i<10;i++){
        if(i!=parseInt(number)){
            d3.selectAll('.rightlabel-'+i).transition().style('opacity', 0.1);
            d3.selectAll('.leftlabel-'+i).transition().style('opacity', 0.1);
            d3.selectAll('.line-'+i).transition().style('opacity', 0.1);
        }
    }

};

var margin = {top: 50, right: 0, bottom: 0, left: 0},
width = 550 - margin.left - margin.right,
height = 430 - margin.top - margin.bottom,
labelLength = 60;

var svg_slope = d3.select("#slopegraph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("transform", "translate(-100, -50)");
svg_slope = svg_slope.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var slopegraph = function(data,country,year){

    $("[class*='line-']").remove();
    $("[class*='leftlabel-']").remove();
    $("[class*='rightlabel-']").remove();
    $("#slopegraph").empty();
    svg_slope = d3.select("#slopegraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.csv(data, function(data) {
        //if(error) throw error;
        return{
            year : +data.year,
            country : data.country,
            shape: data.shape,
            value : +data.value
        };
    } ,function(error, data) {
        var filteredData1 = data.filter(function(d)
        {

            if(( country.includes(d["country"])) && (d["year"] == year[0]))
            {
                return d;
            }

        })
        var filteredData2 = data.filter(function(d)
        {

            if(( country.includes(d["country"])) && (d["year"] == year[1]))
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
            return _.extend({}, item.key, {value: _.reduce(item.vals, function(memo, node) {
                return memo + Number(node.value);
            }, 0)});
        });
        ////////DATAGROUPER DECLARATION - END
        filteredData1 = DataGrouper.sum(filteredData1,["shape"]);
        filteredData2 = DataGrouper.sum(filteredData2,["shape"]);
        if ((filteredData1.length==0)&&(filteredData2.length==0)){
            svg_slope.append('text').text('NO SIGHTINGS REPORTED IN ' + dates + ' IN ' + countries);
            return;
        }
        else if((filteredData1.length==0)){
            svg_slope.append('text').text('NO SIGHTINGS REPORTED IN ' + dates[0] + ' IN ' + countries);
            return;
        }
        else if((filteredData2.length==0)){
            svg_slope.append('text').text('NO SIGHTINGS REPORTED IN ' + dates[1] + ' IN ' + countries);
            return;
        }
        var finalfilteredData1=[];
        var finalfilteredData2=[];
        var temp = JSON.parse(JSON.stringify(filteredData1));
        var maxtopleft=3;
        if(filteredData1.length<3){
            maxtopleft=filteredData1.length;
        }
        var maxtopright=3;
        if(filteredData2.length<3){
            maxtopright=filteredData2.length;
        }
        for(var i = 0; i<maxtopleft;i++){
            var aux= findMax(temp);
            finalfilteredData1.push(aux[0]);
            temp=aux[1];
        }
        var temp = JSON.parse(JSON.stringify(filteredData2));
        for(var i = 0; i<maxtopright;i++){
            var aux= findMax(temp);
            finalfilteredData2.push(aux[0]);
            temp=aux[1];
        }
        var present =0;
        for(var i in finalfilteredData1){
            for(var j in finalfilteredData2){
                if(finalfilteredData1[i].shape==finalfilteredData2[j].shape)
                present=1;
            }
            if(present==0){
                finalfilteredData2.push(finalfilteredData1[i]);
            }
            present=0;
        }
        var present =0;
        for(var i in finalfilteredData2){
            for(var j in finalfilteredData1){
                if(finalfilteredData2[i].shape==finalfilteredData1[j].shape)
                present=1;
            }
            if(present==0){
                finalfilteredData1.push(finalfilteredData2[i]);
            }
            present=0;
        }
        filteredData1=finalfilteredData1;
        filteredData2=finalfilteredData2;



        // concatenate the two table by the shape key;
        var values1=[];
        var values2=[];
        for (i in filteredData1){
            values1.push(filteredData1[i].value)
            for(k in filteredData2){
                if(filteredData1[i].shape==filteredData2[k].shape){
                    filteredData1[i]['value2']=filteredData2[k].value;
                    values2.push(filteredData2[k].value);
                    break;
                }
            }
        }
        var textdataleft = JSON.parse(JSON.stringify(values1));
        var textdataright = JSON.parse(JSON.stringify(values2));
        //textdataleft=textdataleft.sort(function(a, b){return a-b});
        //textdataright=textdataright.sort(function(a, b){return a-b});
        var notchanged=true;
        var aux_i;
        var aux_k;

        var filteredDataAll=filteredData1.concat(filteredData2);
        var maxValue = d3.max(filteredDataAll, function (d) { return d.value; } );
        var minValue = d3.min(filteredDataAll, function (d) { return d.value; } );

        var yScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([height,20]);

        // while(notchanged){
        //   notchanged=false;

        //   for(var i=0; i<textdataright.length;i++){
        //     for(var k=0; k<textdataright.length;k++){
        //     	console.log(yScale(textdataright[i])- yScale(textdataright[k]));
        //       if (i !=k){
        //         if((yScale(textdataright[i])- yScale(textdataright[k])>=0) && (textdataright[i] - textdataright[k]>=0) && notchanged==false){
        //      		textdataright[i]=textdataright[i]+40;
        //           	notchanged=true;
        //           	break;
        //         }
        //       }
        //     }

        //   }
        // }

        // var notchanged=true;
        // while(notchanged){
        //   notchanged=false;
        //   for(var i=0; i<textdataleft.length;i++){
        //     for(var k=0; k<textdataleft.length;k++){
        //       if (i !=k){
        //         if((yScale(textdataleft[i] - textdataleft[k])<=10) && (textdataleft[i] - textdataleft[k]>=0) && notchanged==false){
        // 			textdataleft[i]=textdataleft[i]+15;
        //           notchanged=true;
        //         }
        //       }
        //     }

        //   }
        // }




        //var scale = d3.scaleLinear().domain(d3.extent(filteredDataAll, function(d) { return d.value;})).range([0,height]);
        // var xScale = d3.scaleLinear()
        // .domain([0, 15])
        // .range([0, width]);

        // var scale = d3.scaleLinear().domain(d3.extent(d3.merge(data))).range([0, height]);

        for (var i =0; i<values1.length;i++){
            svg_slope.append('line')
            .style('stroke', 'black')
            .attr('x1', margin.left + labelLength)
            .attr('y1', yScale(values1[i]))
            .attr('x2', width - margin.right - labelLength)
            .attr('y2', yScale(values2[i]))
            .attr('class','line-'+i)
            .on("mouseover", changecolor)
            .on("mouseleave", originalcolor);
        }

        // LEFT LABEL

        for (var i =0; i<values1.length;i++){
            svg_slope.append('text')
            .attr('x',margin.left)
            .attr('y',yScale(values1[i]))
            .text(filteredData1[i].shape)
            .attr('class', 'leftlabel-' + i);
        }
        // RIGTH LABEL
        for (var i =0; i<values2.length;i++){
            svg_slope.append('text')
            .attr('x',width - margin.right-labelLength)
            .attr('y',yScale(values2[i]))
            .text(filteredData1[i].shape)
            .attr('class', 'rightlabel-' + i)

        }

        //TOP LEFT LABEL
        svg_slope.append('text')
        .attr('x',margin.left)
        .attr('y',0)
        .text(dates[0])
        .attr('class', 'leftlabel-top-label');
        //TOP RIGHT LABEL
        svg_slope.append('text')
        .attr('x',width - margin.right-labelLength)
        .attr('y',0)
        .text(dates[1])
        .attr('class', 'rightlabel-top-label');
    }

)};

slopegraph(Slopegraph_csv,countries,dates);
