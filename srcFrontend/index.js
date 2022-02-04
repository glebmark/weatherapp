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

import {createGeoContainer, } from './geocoding.js';
import {getWeatherData, } from './weatherDataLoader.js';

createGeoContainer(); // called from ./geocoding.js

let defaultCityValues = {
    name: "Москва",
    area: "Москва",
    country: "Россия",
    latitude: 55.75222,
    longitude: 37.61556,
    timezone: "Europe/Moscow"
};
getWeatherData(defaultCityValues); // called from ./weatherDataLoader.js



