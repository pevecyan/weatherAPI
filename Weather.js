/*	WEATHER
*	constructor(<onLoadFunction>,<updateTime>, <latitude>, <longitude>): 
*		<onLoadfunction>function, triggered when data is loaded from weather API, can be empty
*       <updateTime> time in seconds of interval when location will be updated and weather acquired (if -1 autoupdate disabled) 
* 		<latitude> <longtidue>(if at least one of latitude or longitude is not defined, geo-location is triggered)
*/
var selfWeather;
function Weather(onLoadFunction,updateTime, latitude, longitude){
	this.onLoadFunction = function (){};
	if(!(onLoadFunction === undefined)){
		this.onLoadFunction = onLoadFunction;	
	}

    /*Location object*/
	this.location = new Location(this,updateTime, latitude, longitude);

	this.data;
	selfWeather = this;
}

/*Set weather data*/
function setData(data){
	selfWeather.setData(data);
}

Weather.prototype = {
	constructor: Weather,
	
	/*Set longitude and latitude*/
	setLocation: function (latitude, longitude){
		this.latitude = latitude;
		this.longitude = longitude;
	},
	
    /*Set weather datat //jsonp callback function*/
	setData: function(data){
	    this.data = data;
	    if (this.location.city === undefined) {
	        this.location.city = this.getTimezone();
	    }
		this.onLoadFunction();
	},
	
	/*Get weather data from API with jsonp*/
	acquireWeatherData: function () {
	    var uri = "https://api.forecast.io/forecast/28f7a15e9084c4c8fc2222d23e910b49/" + this.location.latitude + "," + this.location.longitude + "?callback=setData&exclude=hourly flags";
	    callJSONP(uri, "weatherScript");
	},


	/*WEATHER INFOS - CURRENTLY */
	/*return temperature of specified location in fahrenheits*/
	getTemperatureFahrenheit: function(){
		return Math.floor((this.data.currently.temperature)*10)/10;
	},

	/*return pressure of specified location in hPa - milibars*/
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
	//<day> 0 - 7 (0 today, 1 tomorrow, ...)

	/*return time of specific day*/	
	getDayTime: function(day){
		return this.data.daily.data[day].time*1000;
	},
	
	/*return maximun temperature of specific day in fahrenheits*/
	getDayMaxTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMax)*10)/10;
	},

	/*return minimun temperature of specific day in fahrenheits*/
	getDayMinTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMin)*10)/10;
	},

	getDayIcon: function(day){
	    return this.data.daily.data[day].icon;
	},

    /*OTHER*/
    /*Convert and return temperature in celsius: example (weather.getCelsius(weather.getTemperatureFahrenheit()))
    input: temperature in fahrenheit*/
	getCelsius: function (tempFahrenheit) {
	    return Math.floor(((tempFahrenheit - 32) / 1.8) * 10) / 10;
	},

    /*Return custom value from weather api, documentation here: https://developer.forecast.io/docs/v2 (FLAGS AND HOURLY are disabled, for data saving*/
    /*Example <weather.getOtherValue("currently", "temperature")>*/
	getOtherValue: function () {
	    var value = this.data;
	    for (var i = 0; i < arguments.length; i++) {
	        value = value[arguments[i]];
	    }
        return value;
    }

}

//call jsonp request
function callJSONP(uri, scriptId) {

    //If already set, reload
    if (document.getElementById(scriptId)) {
        var scriptTag = document.getElementById(scriptId);
        document.getElementsByTagName('HEAD')[0].removeChild(scriptTag);
    }

    var scriptTag = document.createElement('SCRIPT');
    scriptTag.id = scriptId;
    scriptTag.type = "application/javascript";
    var weatherAPI = uri;
    scriptTag.src = weatherAPI;
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
}