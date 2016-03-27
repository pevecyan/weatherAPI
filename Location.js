/**
 * @file Location API 
 */


/**
 * Location API
 * @class
 * @classdesc Gets location and name of place
 * @constructor
 * @param {object} weather - Weather object.
 * @param {number} [latitude = current location latitude] - Latitude of location, from where weather data will be acquired. 
 * @param {number} [longitude = current location longitude] - Longitude of location, from where weather data will be acquired. 
 */
function Location(weather, latitude, longitude) {
    /**
     * {@link Weather} object
     * @public 
     */
    this.weather = weather;
    
    /**
     * Name of the city of current location
     *@public
     */
    this.city;

    /** 
     * Time when location was updated.
     * @public
     */
    this.timeOfLastLocation = new Date(); // time of last location update

    //Setting latitude and longitude, if not in arguments start acquiring
    if (latitude === undefined || longitude === undefined) {
        this.latitude = 0;
        this.longitude = 0;
        this.acquireLocation();
    } else {
        setLocation(latitude,longitude);
    }


    setInterval(function () { this.updateLocation(); }.bind(this), 1000 * 10); //interval to check if enough time passed to update weather and location
}

/**
 * Location prototype
 */ 
Location.prototype = {
    constructor: Location,

    /**
     * Method called from 10 seconds timer
     */
    updateLocation: function (){
        //console.log("t" + (new Date().getTime() / 1000 / 60 - this.timeOfLastLocation.getTime() / 1000 / 60));
        this.acquireLocation();
    },

    /**
     * Starts getting current location
     */
    acquireLocation: function () {
        //console.log("updejtam poziicjo");

        //try gps location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var toMinutes = 1 / 60000;
                    if ((new Date().getTime() *toMinutes - this.timeOfLastLocation.getTime() *toMinutes) > 30) {
                        this.setLocation(position.coords.latitude, position.coords.longitude);
                        console.log("NEW WEATHER BECAUSE OF TIME ELAPSED SINCE LAST UPDATE");
                    } else { 
                        if (this.isNewUpdateRequired(position.coords.latitude, position.coords.longitude)) {
                            this.setLocation(position.coords.latitude, position.coords.longitude);
                            console.log("NEW LOCATION; BECAUSE TO FAR AWAY");
                        }
                    }
                }.bind(this),
                //if gps not enabled, ip tracking
                function () {
                    this.acquireLocationIP();
                }.bind(this));

            
            


            //if gps not enabled, ip tracking
        } else {
            this.acquireLocationIP();
        }
    },
 
    /**
     * Acquires location from device ip address
     */
    acquireLocationIP: function () {
        console.log("Updejtam ip lokacijo");

        //ajax ip location call
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                //alert(data);
                if (this.isNewUpdateRequired(data.lat, data.lon)) {
                    this.setLocation(data.lat, data.lon);
                }
            }
        }.bind(this);
        xmlhttp.open("GET", "http://ip-api.com/json/", true);
        xmlhttp.send();
    },

    /**
     * Sets latitude and longitude from received data.
     * @params {number} latitude - Latitdue of current location.
     * @params {number} longitude - Longitude of current location.
     */
    setLocation: function (latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;

        this.timeOfLastLocation = new Date();//Save time when location was set
        this.getLocationName();
    },

    /** 
     * Gets name of acquired location based on geolocation with reverse-geocoding API
     */
    getLocationName: function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                //alert(data);
                this.city = data.geonames[0].adminName1;
                this.weather.acquireWeatherData();
            } else if (xmlhttp.status == 404) {
                this.weather.acquireWeatherData();
            }
        }.bind(this);
        xmlhttp.open("GET", "http://api.geonames.org/findNearbyPlaceNameJSON?lat="+this.latitude+"&lng="+this.longitude+"&username=pevecyan", true);
        xmlhttp.send();
        
       
    },

    /**
     * Returns true if distance between old and new location is more than 1000 meters or else
     * @params {number} latitude - Latitude of the new location.
     * @params {number} longitude - Longitude of the new location.
     * @returns {boolean}
     */
    isNewUpdateRequired: function (latitude, longitude) {
        var newLatitude = latitude * (Math.PI / 180);;
        var newLongitude = longitude * (Math.PI / 180);;

        var oldLatitude = this.latitude * (Math.PI / 180);;
        var oldLongitude = this.longitude * (Math.PI / 180);;
        //calculate distance between new and old location

        var distance = Math.acos(Math.sin(newLatitude) * Math.sin(oldLatitude) +
            Math.cos(newLatitude) * Math.cos(oldLatitude) * Math.cos(newLongitude - oldLongitude)) * 6375;

        distance = Math.floor(distance * 1000000) / 1000;
        if (distance == NaN) distance = 0;

        //alert(distance);
        //if distance equal/more than 1000m, update location and weather
        if (distance >= 1000) {
            //this.setLocation(position.coords.latitude, position.coords.longitude);
            return true;
            console.log("NEW LOCATION; BECAUSE TO FAR AWAY");
        } else {
            return false;
        }
    }
}
