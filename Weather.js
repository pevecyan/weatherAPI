/*	WEATHER
*	constructor(<onLoadFunction>,<latitude>, <longitude>): 
* 		-(if at least one of latitude or longitude is not defined, geo-location is triggered)
*		-onLoadfunction is triggered when data is loaded from weather API, can be empty
* 	varaibles
*
*/
var selfWeather;
function Weather(onLoadFunction, latitude, longitude){
	this.onLoadFunction = function (){};
	if(!(onLoadFunction === undefined)){
		this.onLoadFunction = onLoadFunction;	
	}

	this.location = new Location(this, latitude, longitude);
	
	
	this.data;
	selfWeather = this;
}

function setData(data){
	selfWeather.setData(data);
}

Weather.prototype = {
	constructor: Weather,
	
	/*Get geo-location from browser*/
	
	
	/*Set longitude and latitude*/
	setLocation: function (latitude, longitude){
		this.latitude = latitude;
		this.longitude = longitude;
	},
	
	setData: function(data){
		this.data = data;
		this.onLoadFunction();
	},
	
	/*Get weather data from API over jquery getJSON function*/
	acquireWeatherData: function (onLoadFunction) {
	    if (document.getElementById("weatherScript")) {
	        var scriptTag = document.getElementById("weatherScript");
	        document.getElementsByTagName('HEAD')[0].removeChild(scriptTag);
	    }

	    var scriptTag = document.createElement('SCRIPT');
	    scriptTag.id = "weatherScript";
		scriptTag.type = "application/javascript";
		var weatherAPI = "https://api.forecast.io/forecast/28f7a15e9084c4c8fc2222d23e910b49/" + this.location.latitude + "," + this.location.longitude + "?callback=setData";
		 
		scriptTag.src = weatherAPI;
		document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
        
		
	},
	
	/*WEATHER INFOS - CURRENTLY */
	/*return temperature of specified location in fahrenheits*/
	getTemperatureFahrenheit: function(){
		return Math.floor((this.data.currently.temperature)*10)/10;
	},
	
	/*return temperature of specified location in celsius*/
	getTemperatureCelsius: function(){
		return Math.floor(((this.getTemperatureFahrenheit()-32)/1.8)*10)/10;
	},
	
	/*return pressure of specified lcoation in hPa*/
	getPressure: function(){
		return this.data.currently.pressure;
	},
	
	/*return humidity in scale from 1 to 0*/
	getHumidity: function(){
		return this.data.currently.humidity;
	},
	
	/*return wind speed of specified location in miles per hour*/
	getWindSpeedMiles: function(){
		return this.data.currently.windSpeed;
	},
	
	/*return wind speed of specified location in kilometers per hour*/
	getWindSpeedKilometers: function(){
		return Math.floor((this.getWindSpeedMiles()/0.62137)*100)/100;
	},
	
	/*return date and time when data was acquired*/
	getTime: function(){
		return new Date(this.data.currently.time*1000).toUTCString();
	},
	
	/*	return name of icon for the weather image 
	 * 	(clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night)*/
	getIcon: function(){
		return this.data.currently.icon;
	},
	
	/* return timezone, for exmaple America/New York*/
	getTimezone: function(){
		return this.data.timezone;
	},
	
	/*DAILY WEATHER INFOS*/
	
	/*return time of specific day*/	
	getDayTime: function(day){
		return this.data.daily.data[day].time*1000;
	},
	
	/*return maximun temperature of specific day in fahrenheits*/
	getDayMaxTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMax)*10)/10;
	},
	
	/*return maximun temperature of specific day in celsius*/
	getDayMaxTemperatureCelsius: function(day){
		return Math.floor(((this.getDayMaxTemperatureFahrenheit(day) - 32)/1.8)*10)/10;
	},
	
	/*return minimun temperature of specific day in fahrenheits*/
	getDayMinTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMin)*10)/10;
	},
	
	/*return minimun temperature of specific day in celsius*/	
	getDayMinTemperatureCelsius: function(day){
		return Math.floor(((this.getDayMinTemperatureFahrenheit(day) - 32)/1.8)*10)/10;
	},
}

