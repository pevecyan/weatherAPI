/*  LOCATION
*   constructor Location(<weather>, <latitude>, <longitude>)
*       <weather> weather object
*       <updateTime> time in seconds of interval when location will be updated and weather acquired (if -1 autoupdate disabled)
*       <latitude><longitude> (if at least one of latitude or longitude is not defined, geo-location is triggered)
*/
function Location(weather,updateTime, latitude, longitude) {
    this.weather = weather;

    //Setting update time
    if (updateTime === undefined) {
        this.updateTime = 20000;
    }else{
        this.updateTime = updateTime;
    }

    //Setting latitude and longitude, if not in arguments start acquiring
    if (latitude === undefined || longitude === undefined) {
        this.acquireLocation();
    } else {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    this.city;
    
}

Location.prototype = {
    constructor: Location,

    //Get geolocation from GPS or IP
    acquireLocation: function () {
        console.log("updejtam poziicjo");

        //GPS WatchPosition options
        options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };


        //try gps location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) { this.setLocation(position.coords.latitude, position.coords.longitude); }.bind(this),
                //if gps not enabled, ip tracking
                function () { this.acquireLocationIP(); }.bind(this));

            //WatchPosition, triggers on every location change
            navigator.geolocation.watchPosition(
                function (position) {
                    //on success
                    alert("yaay");
                    var newLatitude = position.coords.latitude * (Math.PI / 180);;
                    var newLongitude = position.coords.longitude * (Math.PI / 180);;

                    var oldLatitude = this.latitude * (Math.PI / 180);;
                    var oldLongitude = this.longitude * (Math.PI / 180);;
                    //calculate distance between new and old location

                    var distance = Math.acos(Math.sin(newLatitude) * Math.sin(oldLatitude) +
                        Math.cos(newLatitude) * Math.cos(oldLatitude) * Math.cos(newLongitude - oldLongitude)) * 6375;

                    distance = Math.floor(distance * 1000000)/1000;
                    if (distance == NaN) distance = 0;

                    //alert(distance);
                    //if distance equal/more than 1000m, update location and weather
                    if (distance >= 1000) {
                        this.setLocation(position.coords.latitude, position.coords.longitude);
                    }
                    //$destination = acos(sin($destination_lat)*sin($origin_lat)+cos($destination_lat)*cos($origin_lat)*cos($destination_lon - $origin_lon))*6375;
                }.bind(this),
                function () {
                    //on error
                }.bind(this), options);

            


            //if gps not enabled, ip tracking
        } else {
            this.acquireLocationIP();
        }
    },
    
    //Get location every <this.updateTime> seconds
    startAcquiringLocation: function () {
        var self = this;
        this.acquireLocation();
        if (self.updateTime != -1) {
            var interval = setInterval(function () { self.acquireLocation(); }, self.updateTime*1000);
        }
    },

    //Get location from IP
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
                this.setLocation(data.latitude, data.longitude);
            }
        }.bind(this);
        xmlhttp.open("GET", "http://freegeoip.net/json/", true);
        xmlhttp.send();
    },

    //set latitude and longitude from IP or GPS
    setLocation: function (latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        
        this.getLocationName();
    },

    //get name of acquired location
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
        
       
    }
}
