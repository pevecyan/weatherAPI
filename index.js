var weather; // Weather object in which we store weather and locatino data
var fahrenheit = false; // if fahrenheits are selected as showing temperature format

//weekdays short names for forecast selection
var weekdaysShort = [];
weekdaysShort[0] = "SUN";
weekdaysShort[1] = "MON";
weekdaysShort[2] = "TUE";
weekdaysShort[3] = "WED";
weekdaysShort[4] = "THU";
weekdaysShort[5] = "FRI";
weekdaysShort[6] = "SAT";

//weekdays names for forecast titles 
var weekdays = [];
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

//Currently selected day, 0 (right now), 1 (tomorrow), 2 (day after tomorrow), 3..., 4...
var selectedDay = 0;

//Function called when page loads
function onLoad() {
    weather = new Weather(weatherLoaded, -1);

}

//Function send to Weather and which is called after weather data is loaded
function weatherLoaded() {
    /*Preload images for each day in forecast*/
    img1 = new Image(128, 128);
    img1.src = "icons/" + weather.getDayIcon(1) + ".png";
    img2 = new Image(128, 128);
    img2.src = "icons/" + weather.getDayIcon(2) + ".png";
    img3 = new Image(128, 128);
    img3.src = "icons/" + weather.getDayIcon(3) + ".png";
    img4 = new Image(128, 128);
    img4.src = "icons/" + weather.getDayIcon(4) + ".png";
    /**/

    //Set current weather infomations
    document.getElementById("dayTitle").innerText = "Now"; //Title
    document.getElementById("weatherIcon").style.backgroundImage = "url(icons/" + weather.getIcon() + ".png)"; //Icon

    //current location
    var city = weather.location.city;
    if (city.length > 14) { city = city.substring(0, 14) + "..."; } //short city name length if too long for widget title 
    document.getElementById("WeatherTitle").innerText = city;


    document.getElementById("temperature").innerText = weather.getCelsius(weather.getTemperatureFahrenheit()) + "\xB0C"; //set current temperature
    document.getElementById("switchFormat").innerText = "\xB0F"; // And Fahrenheit button for changing temperature format

    //set short names for forecast days
    document.getElementById("day1").innerText = weekdaysShort[new Date(weather.getDayTime(1)).getDay()];
    document.getElementById("day2").innerText = weekdaysShort[new Date(weather.getDayTime(2)).getDay()];
    document.getElementById("day3").innerText = weekdaysShort[new Date(weather.getDayTime(3)).getDay()];
    document.getElementById("day4").innerText = weekdaysShort[new Date(weather.getDayTime(4)).getDay()];

}

//onMouseOver for switch format button
function switchFormatFocus(item) {
    item.className = "switchFormat switchFormatFocus";
}

//onMouseOut for swtich format button
function switchFormatUnFocus(item) {
    item.className = "switchFormat";
}

//onClick for switch format button
function changeFormat() {
    fahrenheit = !fahrenheit;
    updateTemperature();
    if (fahrenheit)
        document.getElementById("switchFormat").innerText = "\xB0C";
    else
        document.getElementById("switchFormat").innerText = "\xB0F";
}

//onMouseOver for forecast days buttons
function dayFocus(item) {
    item.className = "day dayFocus";
}

//onMouseOut for forecast days buttons
function dayUnFocus(item) {
    item.className = "day";
}

//onClick for forecast days button
function changeDay(id) {

    //check if weather current or for any other day
    if (id == selectedDay) {
        //SELECTED DAY == RIGHT NOW
        document.getElementById("dayTitle").innerText = "Now";//set title

        //Set temperature in celsius or fahrenheit
        if (!fahrenheit) {
            document.getElementById("temperature").innerText = weather.getCelsius(weather.getTemperatureFahrenheit()) + "\xB0C";//set temperature in celsius
        } else {
            document.getElementById("temperature").innerText = weather.getTemperatureFahrenheit() + "\xB0F";//set temperature in fahrenheit
        }

        document.getElementById("weatherIcon").style.backgroundImage = "url(icons/" + weather.getIcon() + ".png)";//set icon
        document.getElementById("day" + selectedDay).style.backgroundColor = "";//delete selection on previous selected forecast day

        selectedDay = 0; //set selected Day


    } else {

        document.getElementById("dayTitle").innerText = weekdays[new Date(weather.getDayTime(id)).getDay()];//set title
        document.getElementById("weatherIcon").style.backgroundImage = "url(icons/" + weather.getDayIcon(id) + ".png)";//set icon

        //set temperature in fahreheit or celsius
        if (!fahrenheit) {
            document.getElementById("temperature").innerText =
                Math.floor((weather.getCelsius(weather.getDayMaxTemperatureFahrenheit(id))) * 10) / 10 + "\xB0C"; //set temperature in celsius
            document.getElementById("switchFormat").innerText = "\xB0F";
        } else {
            document.getElementById("temperature").innerText =
                Math.floor(weather.getDayMaxTemperatureFahrenheit(id) * 10) / 10 + "\xB0F"; //set temperature in fahreheit
            document.getElementById("switchFormat").innerText = "\xB0C";
        }
        //Deselect old selection in forecast days
        if (selectedDay != 0) document.getElementById("day" + selectedDay).style.backgroundColor = "";
        selectedDay = id;
        document.getElementById("day" + selectedDay).style.backgroundColor = "#3690A0"; // and select new selection in forecast days
    }
}

//Update temparature after format is switched
function updateTemperature() {
    // if current weather
    if (selectedDay == 0) {
        if (!fahrenheit) {
            document.getElementById("temperature").innerText = weather.getCelsius(weather.getTemperatureFahrenheit()) + "\xB0C"; //set temperature in celsius
            document.getElementById("switchFormat").innerText = "\xB0F";
        } else {
            document.getElementById("temperature").innerText = weather.getTemperatureFahrenheit() + "\xB0F"; // set temperature in fahreheits
            document.getElementById("switchFormat").innerText = "\xB0C";
        }
    } else {
        if (!fahrenheit) {
            document.getElementById("temperature").innerText =
				Math.floor((weather.getCelsius(weather.getDayMaxTemperatureFahrenheit(selectedDay))) * 10) / 10 + "\xB0C"; //set tempature in celsius
            document.getElementById("switchFormat").innerText = "\xB0F";
        } else {
            document.getElementById("temperature").innerText =
				Math.floor((weather.getDayMaxTemperatureFahrenheit(selectedDay)) * 10) / 10 + "\xB0F"; //set tempature in fahreheits
            document.getElementById("switchFormat").innerText = "\xB0C";
        }
    }
}
