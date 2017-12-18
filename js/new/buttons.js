// CODIGO BOTOES
$(document).ready(function() {

	$('.js-example-basic-multiple-2').select2({
		maximumSelectionLength: 1,
		allowClear: true,
		placeholder: {
			id: "-1",
			text: "Select Movie",
			selected:'selected'
		}
	});
	 $('.js-example-basic-multiple').select2({
		maximumSelectionLength: 5,
		allowClear: true,
		 placeholder: 'Select Country'
	});
	$('#movie').val(null).trigger('change');
	//$('#countries_select').val(['PRT','USA']).trigger('change');

	$('#countries_select').on('change', function (e) {
			var newCountries=$('#countries_select').select2('data');
			for(var i in newCountries){
				insert_country(newCountries[i].id);
				d3.select("#"+newCountries[i].id).transition().attr("stroke", colourOfCountry(newCountries[i].id)).attr("stroke-width", 1.5);
			}
			updateAll();

	});
	$('#movie').on('change.select2', function (e) {
			var newmovie=$('#movie').select2('data');
			if(newmovie.length !=0){
				var date=parseInt(newmovie[0].id);
				dates=[date-1,date+1]
				//updateAll();
				mySlider.setValues(dates[0], dates[1]);
			}


	});
});
var div = d3.select('#movie');
d3.csv("datafiles/MovieFinal.csv", function(data) {
	// for (var i = 0; i < data.length; i++) {
	//         moviedata.push(data[i].title,year+'/'+data[i].Year});
	//     }

  //.on('change',variableChange)
div.selectAll('option')
  .data(data).enter()
.append('option')
  .attr('value',function (d) { return d.Year})
  .text(function (d) { return d.title +' - '+ d.Year})

});

var div2 = d3.select('#countries_select');
d3.csv("datafiles/countrySort.csv", function(data) {
	// for (var i = 0; i < data.length; i++) {
	//         moviedata.push(data[i].title,year+'/'+data[i].Year});
	//     }


div2.selectAll('option')
  .data(data).enter()
.append('option')
  .attr('value',function (d) { return d.country})
  .text(function (d) { return d.country })

});
$(document).ready(function() {

 $('#movie').val(null).trigger('change');

});

$(document).click(function (e) {
    e.stopPropagation();
    //check if the clicked area is dropDown or not
  	if($(e.target)[0]==$('*')[0]){
  		$('#movie').select2('close');
  		$('#countries_select').select2('close');
  	}
    // if ((e.target.id != 'select2-movie-container')&&($(e.target).attr('class')!='select2-selection__arrow')&&($(e.target).attr('role')!='presentation')) {
    //     $('#movie').select2('close');

    // }
   	// if(((typeof $(e.target).attr('class'))=='undefined')){
    // 		$('#countries_select').select2('close');
    // 	}
});
var num_countries = 0;
var changebuttoncountry=function(){
			$(document).ready(function() {
				//console.log(typeof countries);
			$('#countries_select').val(countries).trigger('change.select2');});
		};


// $(document).ready(function() {
// 	$('#countries_select').val(['PRT','USA']); // Select the option with a value of '1'
// 	$('#countries_select').trigger('change'); // Notify any JS components that the value changed
// });
