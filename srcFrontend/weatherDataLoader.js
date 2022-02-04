import Day from './classDay.js';
import {createPrevMainContainer, createMainContainerAndHeader, } from './mainDOM.js';

export function getWeatherData(cityValues) {
        
    // let url = "http://www.glebmark.com/weatherData";
    // let url = `http://www.glebmark.com/weatherData?latitude=${cityValues.latitude}&longitude=${cityValues.longitude}&timezone=${cityValues.timezone}`;
    let url = `http://localhost:3005/weatherData?latitude=${cityValues.latitude}&longitude=${cityValues.longitude}&timezone=${cityValues.timezone}&name=${cityValues.name}`;

    fetch(url)
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
        .catch(e => console.error(e));

        function appendData(data) {

            let prevMainContainer = document.getElementById("prevMainContainer");
            let mainContainer = document.getElementById("mainContainer");
            let header = document.getElementById("header");
            let footer = document.getElementById("footer");
            if (prevMainContainer && mainContainer) {
                prevMainContainer.remove();
                mainContainer.remove();
                header.remove();
                footer.remove();
            }

            let geoCurrentCity = document.getElementById("geoCurrentCity");
            // geoCurrentCity.innerText = data.cityName;
            let locationPicture = '<svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>';
            geoCurrentCity.innerHTML = `<span>${locationPicture}</span><div>\u00a0\u00a0${data.cityName}</div>`;

            createPrevMainContainer(); // called from ./mainDOM.js
            createMainContainerAndHeader(); // called from ./mainDOM.js

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
                window["day" + i].addTime(data.hourly.time.splice(0, currentDay.length), data.localTimeZone);

                window["day" + i].addWindspeed_10m(data.hourly.windspeed_10m.splice(0, currentDay.length));
                
                window["day" + i].addTemperature_2m(data.hourly.temperature_2m.splice(0, currentDay.length));

                window["day" + i].addPressure(data.hourly.pressure_msl.splice(0, currentDay.length));

                window["day" + i].addRelativehumidity_2m(data.hourly.relativehumidity_2m.splice(0, currentDay.length));

                window["day" + i].addWeatherCode(data.hourly.weathercode.splice(0, currentDay.length));
                
                if (i !== 1) { //exclude first day as it isn't possible calculate how first
                                // day differ from previous one because there isn't any -3 day from current (only -1 and -2)
                    window["day" + i].addSunriseSunsetDifference(data.daily.sunrise[i-1], data.daily.sunrise[i-2], data.daily.sunset[i-1], data.daily.sunset[i-2])
                }

                window["day" + i].addSunriseSunsetToday(data.daily.sunrise[i-1], data.daily.sunset[i-1]);

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
}