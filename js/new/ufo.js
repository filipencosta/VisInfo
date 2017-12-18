// Global Variables
var countries = [];
var old_country = ['USA'];
var dates =[1990,2014];
var metric = "gdp";


var strong_selection = ['#a239ca', '#f19f4d', '#B82601', '#f7ce3e', '#1e392a'];
var country_selection = [0, 1, 2, 3, 4];
var black = '#000000';
var highlight = '#eb6e80';

//files
var sightings_file_path="datafiles/groupbyCountryYear_addedZeros.csv"; //#sightings
var file_path="datafiles/allInfo_byYear.csv"; //#sightings
var Slopegraph_csv="/datafiles/slopegraph.csv";
var HeatMap_csv="/datafiles/heatmapfinalv2.csv";

// datasets
var LineGraph_countrydata=[];
var countrySort;

var ScatterPlot_data;

d3.queue()
	.defer(d3.json, '/datafiles/world_map_v2.json')
	.defer(d3.json, '/datafiles/number_sightings.json')
    .defer(d3.csv, '/datafiles/ufo.csv')
    .defer(d3.csv, '/datafiles/countrySort.csv')
    .defer(d3.csv, '/datafiles/allInfo_byYear.csv')
	.await(readyGo);



function readyGo(error, world, num_sightings, gpscoor, countrySort, allInfo){
    //map
    ready_map(world, num_sightings, gpscoor);

    //lineplot setup
    countrySort = countrySort;
    for (var i = 0; i < countrySort.length; i++) {
        LineGraph_countrydata.push({key: countrySort[i].country});
    }

    //ScatterPlot setupp
    allInfo.forEach(function(d) {
        d.year = +d.year;
        // d.year = parseDate(d.year);
        d.sightings = +d.sightings;
        d.gdp = +d.gdp;
        d.unemployment = +d.unemployment;
        d.internet = +d.internet;
        d.scifi = +d.scifi;
        // d.country = d.country;
    });
    ScatterPlot_data = allInfo;
    getData_genScatter(dates, countries, metric);
}




//Global Updater
function updateAll() {
    heatmapChart(HeatMap_csv,countries,dates);
    updateMap();
    updatePlots();
    slopegraph(Slopegraph_csv,countries,dates);
    changebuttoncountry();
    // gen_lineplots(dates,countries);
    // getData_genScatter(dates, countries, metric);
    //slopegraph(Slopegraph_csv,countries,dates);

}

function insert_country(newCountry) {
    if (countries.includes(newCountry)) {
        return false;
    } else {
        if (countries.length >= 5) {
            old_country = countries.shift();
            country_selection.push(country_selection.shift());
        }
        countries.push(newCountry);
        return true;
    }
}

function remove_country(country) {
    var index = countries.indexOf(country);
    if (index > -1) {
        old_country = country;
        countries.splice(index, 1);
        console.log(index);
        console.log(countries.length);
        if (index != (countries.length)) {
            var aux = country_selection[index];
            country_selection.splice(index, 1);
            country_selection.push(aux);
        }
        return true;
    }
    return false;
}

function colourOfCountry(country) {
    var index = countries.indexOf(country);
    if (index > -1) {
        return strong_selection[country_selection[index]];
    } else if (country == "world") {
        return highlight;
    }
    return black;
}

function resetCountries() {
    var countries = [];
    var country_selection = [0, 1, 2, 3, 4];
}
