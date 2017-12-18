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
	//$('#countries').val(['PRT','USA']).trigger('change');

	$('#countries').on('change.select2', function (e) {
			var newCountries=$('#countries').select2('data');
			countries=[];
			for(var i in newCountries){
				countries.push(newCountries[i].id);
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

var div2 = d3.select('#countries');
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
  		$('#countries').select2('close');
  	}
    // if ((e.target.id != 'select2-movie-container')&&($(e.target).attr('class')!='select2-selection__arrow')&&($(e.target).attr('role')!='presentation')) {
    //     $('#movie').select2('close');

    // }
   	// if(((typeof $(e.target).attr('class'))=='undefined')){
    // 		$('#countries').select2('close');
    // 	}
});
var changebuttoncountry=function(){
			$(document).ready(function() {
				//console.log(typeof countries);
				var finalcountries=[];
				for (var i in countries){
					console.log(countries[i]);
					finalcountries.push(countries[i]);
				}
				
				//console.log(finalcountries);
				//$("#countries").select2("val", countries[0]);
		 		//$('#countries').val(finalcountries).trigger('change'); // Select the option with a value of '1'
		 	//$('#countries').trigger('change'); // Notify any JS components that the value changed
			 });
		}


// $(document).ready(function() {
// 	$('#countries').val(['PRT','USA']); // Select the option with a value of '1'
// 	$('#countries').trigger('change'); // Notify any JS components that the value changed
// });
