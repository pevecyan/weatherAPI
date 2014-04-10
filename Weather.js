/**
 * @file Weather API 
 */

var selfWeather;


/** 
 * Weather API
 * @class
 * @classdesc Gets weather data from specified location
 * @constructor
 * @param {function} onLoadFuncction - Function which is called when weather data loads.
 * @param {number} [latitude = current location latitude] - Latitude of location, from where weather data will be acquired. 
 * @param {number} [longitude = current location longitude] - Longitude of location, from where weather data will be acquired. 
 */
function Weather(onLoadFunction, latitude, longitude){
	this.onLoadFunction = function (){};
	if(!(onLoadFunction === undefined)){
		this.onLoadFunction = onLoadFunction;	
	}

    /**
     * {@link Location} object
     * @public
     */
	this.location = new Location(this, latitude, longitude);

    /**
     * Weather data
     * @public
     */
	this.data;

	selfWeather = this;
}


/** 
 * Sets data to Weather object
 * @function setData
 * @param {Object} data - Data which will be set to Weather object data memeber
 */
function setData(data){
	selfWeather.setData(data);
}

/**
 * Weather prototype
 */
Weather.prototype = {
	constructor: Weather,
	
    /** 
     * Sets data
     * @param {Object} data - Data which will be set to Weather object data memeber
     */
	setData: function(data){
	    this.data = data;
	    if (this.location.city === undefined) {
	        this.location.city = this.getTimezone();
	    }
		this.onLoadFunction();
	},
	
    /** 
     * Get weather data from API
    */
	acquireWeatherData: function () {
	    var uri = "https://api.forecast.io/forecast/28f7a15e9084c4c8fc2222d23e910b49/" + this.location.latitude + "," + this.location.longitude + "?callback=setData&exclude=hourly flags";
	    callJSONP(uri, "weatherScript");
	},


    /*WEATHER INFOS - CURRENT*/

    /**
     * Returns temperature of specified location in fahrenheits
     * @returns {number}
     */
	getTemperatureFahrenheit: function(){
		return Math.floor((this.data.currently.temperature)*10)/10;
	},

    /** 
     * Returns pressure of specified location in hPa - milibars
     * @returns {number}
     */
	getPressure: function(){
		return this.data.currently.pressure;
	},
	
    /**
     * Returns humidity in scale from 1 to 0
     * @returns {number}
     */
	getHumidity: function(){
		return this.data.currently.humidity;
	},
	
    /** 
     * Returns wind speed of specified location in miles per hour
     * @returns {number}
     */
	getWindSpeedMiles: function(){
		return this.data.currently.windSpeed;
	},
	
    /** 
     * Returns wind speed of specified location in kilometers per hour
     * @returns {number}
     */
	getWindSpeedKilometers: function(){
		return Math.floor((this.getWindSpeedMiles()/0.62137)*100)/100;
	},
	
    /**
     * Returns date and time when data was acquired
     * @returns {number}
     */
	getTime: function(){
		return new Date(this.data.currently.time*1000).toUTCString();
	},
	
    /**
     * Returns name of icon for the weather image - (clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night)
     * @returns {string}
     */
	getIcon: function(){
		return this.data.currently.icon;
	},
	
    /** 
     * Returns timezone, - America/New York, etc.
     * @returns {string}
     */
	getTimezone: function(){
		return this.data.timezone;
	},
	

	/*DAILY WEATHER INFOS*/
	/*day - from 0 to 7 (0 today, 1 tomorrow, ...) */

    /**
     * Returns time of specific day
     * @param {number} day - Number of day from today (tomorrow - 1)
     * @returns {number}
     */
	getDayTime: function(day){
		return this.data.daily.data[day].time*1000;
	},
	
    /**
     * Returns maximun temperature of specific day in fahrenheits
     * @param {number} day - Number of day from today (tomorrow - 1)
     * @returns {number}
     */
	getDayMaxTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMax)*10)/10;
	},

    /**
     * Returns minimum temperature of specific day in fahrenheits
     * @param {number} day - Number of day from today (tomorrow - 1)
     * @returns {number}
     */
	getDayMinTemperatureFahrenheit: function(day){
		return Math.floor((this.data.daily.data[day].temperatureMin)*10)/10;
	},

    /**
     * Returns name of icon for the weather image of specific day
     * @param {number} day - Number of day from today (tomorrow - 1)
     * @returns {string}
     */
	getDayIcon: function(day){
	    return this.data.daily.data[day].icon;
	},

    /*OTHER*/
    /**
     * Returns temperature in celsius converted from fahreheits

     * @param {number} tempFahrenheit - Temperature in fahreheits
     * @returns {number}
     */
	getCelsius: function (tempFahrenheit) {
	    return Math.floor(((tempFahrenheit - 32) / 1.8) * 10) / 10;
	},

    /**
     * Returns custom value from weather api, documentation here: https://developer.forecast.io/docs/v2 (FLAGS and HOURLY are disabled, for data saving)
     * @example <caption> Returns current temperature </caption>
     * weather.getOtherValue("currently", "temperature");
     * @param {...string} [arguments] - Arguments
     */
	getOtherValue: function () {
	    var value = this.data;
	    for (var i = 0; i < arguments.length; i++) {
	        value = value[arguments[i]];
	    }
        return value;
    }

}

/**
 * Calls JSONP request 
 * @function callJSONP
 * @param {string} uri - Url of api or script you want to request
 * @param {string} scriptId - Id of the html script element which you want to create or reload
 */
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