var selfLocation;
/*function Location(<weather>, <latitude>, <longitude>)*/
//-(if at least one of latitude or longitude is not defined, geo-location is triggered)
// 
function Location(weather, latitude, longitude) {
    this.weather = weather;
    
    if (latitude === undefined || longitude === undefined) {
        this.acquireLocation();
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
        
        var self = this;

        //GPS WatchPosition options
        options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };

        //try gps location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                navigator.geolocation.watchPosition(function (position) {
                    self.setLocation(position.coords.latitude, position.coords.longitude);
                    console.log("Spreminjam poziicjo");
                }, function () { }, options);

                self.setLocation(position.coords.latitude, position.coords.longitude);
            },
            //if gps not enabled, ip tracking
            function () {
                //alert("IP TRACKING");
                self.acquireLocationIP();
                self.startAcquiringLocationIP();
            });

            //if gps not enabled, ip tracking
        } else {
            //alert("IP TRacking");
            self.acquireLocationIP();
            self.startAcquiringLocationIP();
        }
    },
    //Get iplocation every 20 seconds
    startAcquiringLocationIP: function () {
        var self = this;
        var interval = setInterval(function () { self.acquireLocationIP();  }, 20000);
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
