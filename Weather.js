/*	WEATHER
*	constructor(<onLoadFunction>,<latitude>, <longitude>): 
* 		-(if at least one of latitude or longitude is not defined, geo-location is triggered)
*		-onLoadfunction is triggered when data is loaded from weather API, can be empty
* 	varaibles
*
*/
function Weather(onLoadFunction, latitude, longtidue){
	this.onLoadFunction = function (){};
	if(!(onLoadFunction === undefined)){
		this.onLoadFunction = onLoadFunction;	
	}
	
	
	if(latitude === undefined || longitude === undefined){
		this.acquireLocation();
	}else{
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	this.data;
	
}

Weather.prototype = {
	constructor: Weather,
	
	/*Get geo-location from browser*/
	acquireLocation: function(){
		var self = this;
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function (position) {
		        self.setLocation(position.coords.latitude, position.coords.longitude);
		        self.acquireWeatherData();
		    });
		} else {
		    alert("Location cannot be acquired");
	   	}
	},
	
	/*Set longitude and latitude*/
	setLocation: function (latitude, longitude){
		this.latitude = latitude;
		this.longitude = longitude;
	},
	
	/*Get weather data from API over jquery getJSON function*/
	acquireWeatherData: function(){
		var weatherAPI="https://api.forecast.io/forecast/28f7a15e9084c4c8fc2222d23e910b49/"+this.latitude+","+this.longitude+"?callback=?";		
		var self = this;
		$.getJSON(weatherAPI, function (data) {
			alert(data);
			self.data = data;
			self.onLoadFunction();	
		});
	},
	
	/*return temperature of specified location in fahrenheits*/
	getTemperatureFahrenheit: function(){
		return this.data.currently.temperature;
	},
	/*return temperature of specified location in celsius*/
	getTemperatureCelsius: function(){
		return Math.floor(((this.getTemperatureFahrenheit()-32)/1.8)*10)/10;
	}
	
}
