var selfLocation;
/*function Location(<weather>, <latitude>, <longitude>)*/
//<weather> weather object
//<updateTime> time in seconds of interval when location will be updated and weather acquired (if -1 autoupdate disabled)
//-(if at least one of latitude or longitude is not defined, geo-location is triggered)
// 
function Location(weather,updateTime, latitude, longitude) {
    this.weather = weather;

    if (updateTime === undefined) {
        this.updateTime = 20000;
    }else{
        this.updateTime = updateTime;
    }

    if (latitude === undefined || longitude === undefined) {
        this.startAcquiringLocation();
    } else {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    

    selfLocation = this;
    
}

Location.prototype = {
    constructor: Location,

    //Get geolocation from GPS or IP
    acquireLocation: function () {
        console.log("updejtam poziicjo");

        var self = this;

        //GPS WatchPosition options
        options = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 0
        };

        //try gps location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                self.setLocation(position.coords.latitude, position.coords.longitude);  
            },

            //if gps not enabled, ip tracking
            function () {
                //alert("IP TRACKING");
                self.acquireLocationIP();
                
            });

            //if gps not enabled, ip tracking
        } else {
            //alert("IP TRacking");
            self.acquireLocationIP();
            
        }
    },
    
    //Get location every 20 seconds
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
        var self = this;
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
                self.setLocation(data.latitude, data.longitude);
            }
        }
        xmlhttp.open("GET", "http://freegeoip.net/json/", true);
        xmlhttp.send();


        /*
        var scriptTag = document.createElement('SCRIPT');
        scriptTag.type = "application/javascript";
        var weatherAPI = "http://freegeoip.net/json/"+ "?callback=setLocationIP";

        scriptTag.src = weatherAPI;
        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
        */
    },

    //set location from IP or GPS to this object
    setLocation: function (latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        
        this.weather.acquireWeatherData();
    },
    
}
