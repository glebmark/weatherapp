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

// mainContainer is needed to fit all 7-9 dayContainers
let mainContainer = document.createElement('div');
mainContainer.id = "mainContainer";
// mainContainer.style.border = "1px solid black";
mainContainer.style.width = "100%";
mainContainer.style.height = "100%";
mainContainer.style.position = "relative";
mainContainer.style.top = "40px";
mainContainer.style.display = "flex";
mainContainer.style.minWidth = "0";
mainContainer.style.flexDirection = "row";
mainContainer.style.flexWrap = "wrap";
// mainContainer.style.justifyContent = "flex-start";
// mainContainer.style.alignItems = "center";
// mainContainer.style.alignContent = "flex-start";
document.body.appendChild(mainContainer);

let header = document.createElement('header');
header.id = "header";
// mainContainer.style.border = "1px solid black";
header.style.minWidth = "100%";
header.style.height = "30px";
header.style.position = "fixed";
header.style.border = "1px solid black";
header.style.backgroundColor = "#b2c8ff";
header.style.zIndex = "199";
header.style.color = "#272932";
header.style.fontSize = "20px";
header.style.top = "-1px";
header.style.left = "0px";
header.style.display = "flex";
header.style.alignItems = "center";
header.style.justifyContent = "space-evenly";
header.innerText = "Weather forecast"
document.body.appendChild(header);

let o = {};
console.log(o)


// fetch data
// let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2";
// let url = "http://www.glebmark.com/getWeatherData";
let url = "http://localhost:3005/getWeatherData";

// let url = 'logs.json';
// const url = require('./logs.json');

fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendData(data); // json taken only from here, not from outside
    })
    .catch(function (err) {
        console.log(err);
    });

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

        window["day" + i].addInstanceSwiper();

        window["day" + i].addWindspeed_10m(data.hourly.windspeed_10m.splice(0, currentDay.length));
        
        window["day" + i].addTemperature_2m(data.hourly.temperature_2m.splice(0, currentDay.length));

        window["day" + i].addPrecipitation(data.hourly.precipitation.splice(0, currentDay.length));

        window["day" + i].addRelativehumidity_2m(data.hourly.relativehumidity_2m.splice(0, currentDay.length));

        window["day" + i].addWeatherCode(data.hourly.weathercode.splice(0, currentDay.length));
        


        

        // create DOM elements
        window["day" + i].createDayContainer();

        window["day" + i].createGeneralInfoContainer();

        window["day" + i].createLargeTempAndWeatherCodeContainer();

        window["day" + i].createDateContainer();

        window["day" + i].createTempContainer();

        window["day" + i].createSwiperHours();

        console.log(window["day" + i])
    }   
}
// window.onload = textDisplay;
console.log("script loaded");
// swiper.update();