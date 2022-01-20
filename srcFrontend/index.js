import './style.css';
import './iconsSCSS/styleSunnyWeather.scss';
import './iconsSCSS/stylePartiallyCloudyWeather.scss';
import './iconsSCSS/styleScatteredCloudyWeather.scss';
import './iconsSCSS/styleBrokenCloudyWeather.scss';
import './iconsSCSS/styleMistWeather.scss';
import './iconsSCSS/styleRainWeather.scss';
import './iconsSCSS/styleRainyTwoWeather.scss';
import './iconsSCSS/styleSnowyWeather.scss';
import './iconsSCSS/styleThunderstormWeather.scss';

import Day from './classDay.js';
import {setStylesOnElement, } from './service.js';

// mainContainer is needed to fit all 7-9 dayContainers
let mainContainer = document.createElement('div');
mainContainer.id = "mainContainer";
let stylesMain = {
    width : "100%",
    height : "100%",
    position : "relative",
    top : "40px",
    display : "flex",
    minWidth : "0",
    flexDirection : "row",
    flexWrap : "wrap",
}
setStylesOnElement(mainContainer, stylesMain);
document.body.appendChild(mainContainer);

let header = document.createElement('header');
header.id = "header";
header.innerText = "Weather forecast for Moscow";
let stylesHeader = {
    minWidth : "100%",
    height : "30px",
    position : "fixed",
    border : "1px solid black",
    backgroundColor : "#b2c8ff",
    zIndex : "199",
    color : "#272932",
    fontSize : "20px",
    top : "-1px",
    left : "0px",
    display : "flex",
    alignItems : "center",
    justifyContent : "space-evenly",   
}
setStylesOnElement(header, stylesHeader);
document.body.appendChild(header);

let url = "http://www.glebmark.com/getWeatherData";
// let url = "http://localhost:3005/getWeatherData";

// fetch(url)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         appendData(data); // json taken only from here, not from outside
//     })
//     .catch(function (err) {
//         console.log(err);
//     });


fetch(url)
    .catch (e => wait(500).then(fetch(url))) // try second time if there was some network error
    .then(response => {
        if (!response.ok) {
            return null
        }

        let type = response.headers.get("content-type"); 
        if (type !== "application/json; charset=UTF-8") {
            throw new TypeError(`Expected JSON, got ${type}`)
        }

        return response.json();
    })
    .then(data => {
        if(data) {
            appendData(data); // json taken only from here, not from outside
        } else {
            console.log("Didn't get 2xx and not called appendData")
        }
        
    })
    .catch(e => {
        if (e instanceof TypeError) {
            // fetch() can fail this way if the internet connection is down
            console.log("Check your internet connection.");
            console.error(e);
        } else {
        // This must be some kind of unanticipated error 
            console.error(e);
        } });

function appendData(data) {
    // 7 - is just 7 days of week (in other version 9 - is 7 + 2 past days before)
    for(let i = 1; i <= 9; i++) {
        let date = "";
        try {
            date = data.hourly.time[0].substring(0, 10);
        }
        catch (TypeError) {
            console.log("API haven't gave values?")
        }
        let currentDay = data.hourly.time.filter(day => day.includes(date));

        // create Day objects from prototype class
        window["day" + i] = new Day(i);

        // load data to corresponding objects - instances of Day
        window["day" + i].addTime(data.hourly.time.splice(0, currentDay.length));

        window["day" + i].addWindspeed_10m(data.hourly.windspeed_10m.splice(0, currentDay.length));
        
        window["day" + i].addTemperature_2m(data.hourly.temperature_2m.splice(0, currentDay.length));

        window["day" + i].addPressure(data.hourly.pressure_msl.splice(0, currentDay.length));

        window["day" + i].addRelativehumidity_2m(data.hourly.relativehumidity_2m.splice(0, currentDay.length));

        window["day" + i].addWeatherCode(data.hourly.weathercode.splice(0, currentDay.length));
        
        if (i !== 1) { //exclude first day as it isn't possible calculate how first
                        // day differ from previous one because there isn't any -3 day from current (only -1 and -2)
            window["day" + i].addSunriseSunset(data.daily.sunrise[i-1], data.daily.sunrise[i-2], data.daily.sunset[i-1], data.daily.sunset[i-2])
        }

        window["day" + i].addCloudCover(data.hourly.cloudcover.splice(0, currentDay.length));
        
        



        // create DOM elements
        window["day" + i].createDayContainer();

        window["day" + i].createGeneralInfoContainer();

        window["day" + i].createLargeTempAndWeatherCodeContainer();
        
        window["day" + i].createDateContainer();
 
        window["day" + i].createSunriseSunsetContainer();

        window["day" + i].createWindCloudHumidityPressureContainer();

        window["day" + i].createTempContainer();

        window["day" + i].createInstanceSwiper();

        window["day" + i].createSwiperHours();

        console.log(window["day" + i]);

    }   
}