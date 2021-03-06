/**
 * @file Logic for weather widget
 */

/**
 * {@link Weather} object
 * @public
 */
var weather;

/**
 * Boolean variable, which define if fahrenheits as selected as showin temperature format.
 * @default false
 */
var fahrenheit = false; 

/**
 * Array of week days in short notation for widget forecast day selection.
 */
var weekdaysShort = [];
weekdaysShort[0] = "SUN";
weekdaysShort[1] = "MON";
weekdaysShort[2] = "TUE";
weekdaysShort[3] = "WED";
weekdaysShort[4] = "THU";
weekdaysShort[5] = "FRI";
weekdaysShort[6] = "SAT";

/**
 * Array of week days for forecast titles.
 */
var weekdays = [];
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";


/**
 * Currently selected day, 0 (right now), 1 (tomorrow), 2 (day after tomorrow)...
 * @default 0
 */
var selectedDay = 0;

/** 
 * Function called when page loads.
 * @function onLoad
 */
function onLoad() {
    weather = new Weather(weatherLoaded);

}

/** 
 * Function send to Weather and which is called after weather data is loaded.
 * @function weatherLoaded
 */
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

/**
 * Set focus color on switch button if mouse over.
 * @function switchFormatFocus
 */
function switchFormatFocus(item) {
    item.className = "switchFormat switchFormatFocus";
}

/**
 * Remove focus color from switch button.
 * @function switchFormatUnFocus
 */
function switchFormatUnFocus(item) {
    item.className = "switchFormat";
}

/**
 * Actions performed when switch format button clicked.
 * @function changeFormat
 */
function changeFormat() {
    fahrenheit = !fahrenheit;
    updateTemperature();
    if (fahrenheit)
        document.getElementById("switchFormat").innerText = "\xB0C";
    else
        document.getElementById("switchFormat").innerText = "\xB0F";
}

/**
 * Set focus color on day item if mouse over.
 * @function dayFocus
 * @params {HtmlElement} item - Item on which action is performed.
 */
function dayFocus(item) {
    item.className = "day dayFocus";
}

/**
 * Remove focus color from day item.
 * @function dayUnFocus
 * @params {HtmlElement} item - Item on which action is performed.
 */
function dayUnFocus(item) {
    item.className = "day";
}


/**
 * Change day of which is weather shown.
 * @function changeDay
 * @params {number} id - Number of selected day
*/
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

/**
 * Updates temperature aftwer format is switched.
 * @function updateTemperature
 */
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
