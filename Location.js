var selfLocation;
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
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                self.setLocation(position.coords.latitude, position.coords.longitude);
            },
            function () {
                //alert("IP TRACKING");
                self.acquireLocationIP();
            });
        } else {
            //alert("IP TRacking");
            this.acquireLocationIP();
        }
    },
    acquireLocationIP: function(){
        var scriptTag = document.createElement('SCRIPT');
        scriptTag.type = "application/javascript";
        var weatherAPI = "http://freegeoip.net/json/"+ "?callback=setLocationIP";

        scriptTag.src = weatherAPI;
        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    },
    setLocation: function (latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.weather.acquireWeatherData();
    },
    
}

function setLocationIP(data) {
    selfLocation.setLocation(data.latitude, data.longitude);
}