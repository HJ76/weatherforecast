var locationsearch="";
var nvsearch = document.querySelector("#navbar-search");
var color;
// jquery toggle + -   but not working for dynamic html(html added by js)
var selectIds = $('#panel1,#panel2,#panel3,#panel4,#panel5');
$(function ($) {
    selectIds.on('shown.bs.collapse hidden.bs.collapse', function () {
        $(this).prev().find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
    })
});
//end jquery toggle
function checkweather()
{
    //Getting location from user
	var location = document.querySelector(".location1").value;
	//location name 
	locationsearch = location.toUpperCase();
	//get searchengine div
	var searchbar1 = document.querySelector("#searchengine");
	//clear searchengine content
	searchbar1.innerHTML="";
	var nvsearchdata=`<div class="row nvdata1">
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-0" ></div>\
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 topnav">\
 				<input type="text" placeholder="location" id="location" class="location1">\
 				<a class="searchbutton" href="#" onclick="checkweather()">\
      			<span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
    			</a>\
    		</div>\
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-0"></div>\
    </div>`;
    var animate=`<div class="loader"></div>`;
	nvsearch.innerHTML=nvsearchdata;
	var msgdiv = document.querySelector("#java1");
	var div=document.querySelector("#java2");
	div.innerHTML="";
	msgdiv.innerHTML=animate;
	//query url
	var queryURL = "http://localhost:3000/" + location;
	//query url: https://www.metaweather.com/api/location/search/?query=location

	//fetch data from qureyURL
	fetch(queryURL)
		.then(function (response){
			//converting data into json format
			return response.json();
		})
		.then(function(result){
			//calling function
			displaylocationresult(result);
		})
		.catch(function(error){
			//error handling
			console.log(error.message);
		});
}


function displaylocationresult(result)
{	
	//get message div
	var msgdiv = document.querySelector("#java1");
	//get result div
	var div=document.querySelector("#java2");
	//print result in console
	console.log(result);
	//print result.message in console
	console.log(result.message);
	//checking result
	if (result.message)
	{
		div.innerHTML = "";
		msgdiv.innerHTML = "";
		// if wrong location entered give message
		msgdiv.innerHTML = `<div class="alert alert-danger alert-dismissible " role="alert">\
							<button type="button" class="close" data-dismiss="alert">x</button>\
							<strong> oops!</strong>${result.message}\
							</div>`;
	}
	else{
	//clear result div
	div.innerHTML="";
	msgdiv.innerHTML="";
	//get result.consolidated_weather data
	const weather=result.consolidated_weather;
	//print weather in console
	console.log(weather);

	var i=0;
	//calling cloud to get weather_state_attr
	cloud(result,i);
	//rounding values 
	var temp=Math.round(weather[i].the_temp);
	var matemp=Math.round(weather[i].max_temp);
	var mitemp=Math.round(weather[i].min_temp);
	var wind=Math.round(weather[i].wind_speed);
	//putting html data in variable
	var currentday=`<div class="jumbotron container jumbo">
      					<div class="row">
      						<div class="col-lg-1 col-md-1 col-sm-1 col-xs-0"></div>
          					<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 jumbo-location"><div style="font-size: 70px;">${locationsearch}</div></div>
          					<div class="col-lg-3 col-md-3col-sm-3 col-xs-12 jumbo-mmtemp"><i class="fa fa-long-arrow-down" style="font-size:24px"></i> ${mitemp}&degC	<i class="fa fa-long-arrow-up" style="font-size:24px"></i> ${matemp}&degC</div>  
      					</div>
      					<div class="row jumbo-data">
      						<div class="col-lg-1 col-md-1 col-sm-1 col-xs-0"></div>
        					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 jumbo-data-data">
        						<div style="padding-top: 10px;">${weather[i].applicable_date}</div>
        						<div style="padding-top: 10px;"><i class="wi wi-strong-wind"></i> Wind Speed:${wind}Km/h</div>
        						<div style="padding-top: 10px;"><span class="glyphicon glyphicon-tint"></span>Humidity: ${weather[i].humidity}%</div>
        						<div style="padding-top: 10px;"><i class="fa fa-tachometer" style="font-size:24px"></i> ${weather[i].predictability}%</div>
        					</div>
        					<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 jumbo-cloud">
        						<i class="wi wi-${color}" style="font-size: 150px;"></i>
        					</div>
        					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 jumbo-temp">${temp}&deg</div>
      					</div>
      					<div class="row jumbo-data">
      						<div class="col-12 jumbo-state">${weather[i].weather_state_name}</div>  
      					</div>
  					</div>`;

  	//appending variable "currentday" data into result div 
	$("#java2").append(currentday);
	//loop to get weather data for next 5 days
	for(var i=1; i<weather.length;i++)
	{
		//rounding values
		var temp=Math.round(weather[i].the_temp);
		var matemp=Math.round(weather[i].max_temp);
		var mitemp=Math.round(weather[i].min_temp);
		var wind=Math.round(weather[i].wind_speed);
		//calling cloud function to get weather_state_attr
		cloud(result,i);
		console.log(weather[i].weather_state_name);
		//putting html code in variable
		var nextday=`<div class="panel-group" id="accordion" style="border:none; box-shadow: none;">\
    					<div class="panel panel-default container" style="border:none; box-shadow: none;  padding-left:0px; padding-right:0px;">\
        					<div class="panel-heading row" style="background-color:#446b82; border-radius:15px;">\
        						<div class="col-lg-2 col-md-2 col-sm-6 col-xs-12" style="font-size: 16px; margin-top: 5px; color:white;">${weather[i].applicable_date}</div>\
      							<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style="text-align: center;">\
        							<div style="color:white;"><i class="wi wi-${color}" style="font-size: 24px; color:white;"></i>\
                    				<span style="font-size: 20px; padding-left: 2px; color:white;">${weather[i].weather_state_name}</span>\
                    				</div>\
      							</div>\
      							<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style="text-align: center;">\
        							<i class="fa fa-thermometer" style="font-size:24px; color:white;"></i>\
            						<span style="font-size: 20px; color:white;"><span>${temp}&degC</span></span>\
      							</div>\
      							<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style="text-align: center;">\
        							<i class="fa fa-tachometer" style="font-size:24px; color:white;"></i>\
        							<span style="font-size: 20px; color:white;">${weather[i].predictability}%</span>\
      							</div>\
      							<div class="col-lg-1 col-md-1 col-sm-6 col-xs-12">\
       								<h4 class="panel-title">\
                						<a class="accordion-toggle" id="base${i}" data-toggle="collapse" href="#panel${i}" ><i class="glyphicon glyphicon-plus" style="color:white;"></i></a>\
            						</h4>\
      							</div>\
       						</div>\
       						</div>
       					<div id="panel${i}" class="panel-collapse collapse container" style="background-color:#639dbf; opacity: 0.90; border-bottom-right-radius:15px; border-bottom-left-radius:15px;">\
        					<div class="panel-body">\
    							<div class="row">\
    								<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="text-align: left; font-size: 50px; color:white;">${locationsearch}</div>\
            						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="font-size: 20px; color:white;">\
            							<div style="padding-top: 10px;"><i class="fa fa-long-arrow-down" style="font-size:24px"></i> ${mitemp}&degC	<i class="fa fa-long-arrow-up" style="font-size:24px"></i> ${matemp}&degC</div>\
            							<div style="padding-top: 10px;"><i class="wi wi-strong-wind"></i> Wind Speed:${wind}Km/h</div>\
            							<div style="padding-top: 10px;"><span class="glyphicon glyphicon-tint"></span>Humidity: ${weather[i].humidity}%</div>\
            						</div>\
            						<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="text-align: center; padding: 20px;">\
            							<i class="wi wi-${color}" style="font-size: 100px; color:white;"></i>\
            						</div>\
								</div>\	   	
    						</div>\
    					</div>\

					</div>`;
		//appending nextday data in result div
		$("#java2").append(nextday);
	}
	console.log(result);
	}

}
//function defination
function cloud(result,j)
{	
	const weather=result.consolidated_weather;
	console.log(weather);
	if (weather[j].weather_state_abbr=="sn")
	{
		color="snow";
	}
	else if (weather[j].weather_state_abbr=="sl")
	{
		color="sleet";
	}
	else if (weather[j].weather_state_abbr=="h")
	{
		color="hail";
	}
	else if (weather[j].weather_state_abbr=="t")
	{
		color="thunderstorm";
	}
	else if (weather[j].weather_state_abbr=="hr")
	{
		color="rain";
	}
	else if (weather[j].weather_state_abbr=="lr")
	{
		color="rain-mix";
	}
	else if (weather[j].weather_state_abbr=="s")
	{
		color="showers";
	}
	else if (weather[j].weather_state_abbr=="hc")
	{
		color="cloudy";
	}
	else if (weather[j].weather_state_abbr=="lc")
	{
		color="cloud";
	}
	else if (weather[j].weather_state_abbr=="c")
	{
		color="day-sunny";
	}
}
