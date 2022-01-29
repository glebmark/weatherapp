import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import iconSwitch from './iconsSwitcher.js';
import {setStylesOnElement, } from './service.js';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

export default class Day {
    constructor(dayNumber) {
        this.dayNumber = dayNumber;
        
    }

    
    addTemperature_2m(temperature_2m) {
        this.temp2m = temperature_2m;
        
        let sumDayDailyTemp2m = [...temperature_2m].splice(9); // exclude first 8 night hours
        this.averageDailyTemp2m = Math.round(sumDayDailyTemp2m.reduce((acc, v) => acc + v) / sumDayDailyTemp2m.length); 
        
    }
    
    addWindspeed_10m(windspeed_10m) {
        this.wind10m = windspeed_10m;

        let sumDayDailyWind10m = [...windspeed_10m].splice(9); // exclude first 8 night hours
        this.averageDailyWind10m = Math.round(sumDayDailyWind10m.reduce((acc, v) => acc + v) / sumDayDailyWind10m.length); 
    }

    addCloudCover(cloudcover) {
        this.cloudcover = cloudcover;

        let sumDayDailycloudcover = [...cloudcover].splice(9); // exclude first 8 night hours
        this.averageDailycloudcover = Math.round(sumDayDailycloudcover.reduce((acc, v) => acc + v) / sumDayDailycloudcover.length);    
    }

    addPressure(pressure) {
        this.pressure = pressure.map(v => v / 1.333); // convert hPa to mm hg

        let sumDayDailypressure = [...this.pressure].splice(9); // exclude first 8 night hours
        this.averageDailypressure = Math.round(sumDayDailypressure.reduce((acc, v) => acc + v) / sumDayDailypressure.length);    
    }

    addRelativehumidity_2m(relativehumidity_2m) {
        this.relativehumidity_2m = relativehumidity_2m;

        let sumDayDailyhumidity = [...relativehumidity_2m].splice(9); // exclude first 8 night hours
        this.averageDailyhumidity = Math.round(sumDayDailyhumidity.reduce((acc, v) => acc + v) / sumDayDailyhumidity.length);    
    }
    
    addTime (time) {
        this.time = time;

        // where -3 is minus current, yesterday, day before yesterday
        let date = new Date(new Date().getTime() + (this.dayNumber - 3) * (24 * 60 * 60 * 1000));
        let formatter = new Intl.DateTimeFormat("ru", {
            weekday: "long",
            // year: "numeric",
            month: "long",
            day: "numeric"
          });
        this.currentDateRussianFormat = formatter.format(date);

        // currentHour is used to match with hours in Current Day in array from JSON taken from Open Meteo
        this.currentHour = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Moscow' }).substring(12, 14).toString();
        let currentHourString = this.currentHour.toString();
        this.indexOfCurrentHour = this.time.findIndex(v => v.substring(11, 13) === currentHourString); 
    }

    addWeatherCode(weatherCode) {
        this.weatherCodeHourly = weatherCode;


        // this block is needed for calculation average weathercode
        this.weatherCodeHourlyWithoutNight = [...weatherCode].splice(9); // exclude first 8 night hours
        function getMostFrequent(arr) {
            const hashmap = arr.reduce( (acc, val) => {
             acc[val] = (acc[val] || 0 ) + 1
             return acc
          },{})
         return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
         }

        this.weatherCodeAverage = getMostFrequent(this.weatherCodeHourlyWithoutNight)
    }

    addSunriseSunset(sunriseToday, sunriseYesterday, sunsetToday, sunsetYesterday) {
        // let sunriseT = Date.parse("2022-01-11T08:50");
        // let sunriseY = Date.parse("2022-01-10T08:51");
        let sunriseT = Date.parse(sunriseToday);
        let sunriseY = Date.parse(sunriseYesterday);
        let sunriseDelta = (sunriseT - sunriseY - 86400000)/1000/60;

        // let sunsetT = Date.parse("2022-01-11T16:24");
        // let sunsetY = Date.parse("2022-01-10T16:22");
        let sunsetT = Date.parse(sunsetToday);
        let sunsetY = Date.parse(sunsetYesterday);
        let sunsetDelta = (sunsetT - sunsetY - 86400000)/1000/60;
        
        sunriseDelta = sunriseDelta * -1; // it's needed for converting surplus or missing minutes in right way
        this.sunDailyDelta = sunriseDelta + sunsetDelta;

        // 3 is current day, 1 and 2 - previous two, 4...9 is subsequent days
        let minuteName = "";
        switch (this.sunDailyDelta) {
            case 0:    
            case 5:
            case 6:
                minuteName = "минут";
                break;
            case 1:
                minuteName = "минуту";
                break;
            case 2:
            case 3:
            case 4:
                minuteName = "минуты";
                break;
        }

        this.sunDailyDeltaText = "";
        if (Math.sign(this.sunDailyDelta) === 1) { // it's rising length of day from 22.Dec to 22.Jun
            this.sunDailyDeltaText = `<span style='font-size: 14px;'>${"\u00a0".repeat(2)}Световой день длиннее на 
            <span style='color: #a3e6d1;'>${this.sunDailyDelta + " " + minuteName}</span></span>`
        } else { // it's falling length of day from 22.Jun to 22.Dec
            this.sunDailyDeltaText = `<span style='font-size: 14px;'>${"\u00a0".repeat(2)}Световой день короче на 
            <span style='color: #FD5656;'>${this.sunDailyDelta + " " + minuteName}</span></span>`
        }

        
    }

    createDayContainer() {
        let mainContainer = document.getElementById("mainContainer");
        let prevMainContainer = document.getElementById("prevMainContainer");
        let dayContainer = document.createElement('div');
        dayContainer.id = "dayContainer" + this.dayNumber;
        this.dayContainer = dayContainer;
        dayContainer.classList.add("dayContainerClass");

        let styles = {
            border : "3px solid #b2c8ff",
            height : "300px",
            flexDirection : "row",
            flexWrap : "wrap",
            justifyContent : "space-evenly",
            alignItems : "flex-start",
            borderTopRightRadius : "60px 40px",
            borderTopLeftRadius : "60px 40px",
            borderBottomRightRadius : "60px 40px",
            borderBottomLeftRadius : "60px 40px",
        }
        setStylesOnElement(dayContainer, styles);
        
        if (this.dayNumber === 1 || this.dayNumber === 2) {
            dayContainer.style.display = "none";
            prevMainContainer.appendChild(dayContainer);
        } else {
            dayContainer.style.display = "flex";
            mainContainer.appendChild(dayContainer);
        }
    }

    createTempContainer() {
        let dayContainer = document.getElementById("dayContainer" + this.dayNumber);
        let tempContainer = document.createElement('div');
        tempContainer.id = "tempContainer" + this.dayNumber;

        let styles = {
            height : "65px",
            width : "80%",
            position :"relative",       
            overflow :"hidden",       
        }
        setStylesOnElement(tempContainer, styles);

        dayContainer.appendChild(tempContainer);
    }

    createInstanceSwiper() {
        let dayNumber = this.dayNumber;
        window.setTimeout(function(){
            const swiper = new Swiper(`#mySwiper${dayNumber}`, {
                observer: true, 
                observeParents: true,
                slidesPerView: 3,
                spaceBetween: 0,
                slidesPerGroup: 3,
                // loop: true,
                loopFillGroupWithBlank: true,
        
                pagination: {
                    el: `#swiperPagination${dayNumber}`,
                    clickable: true,
                },
                navigation: {
                    // nextEl: ".swiper-button-next",
                    nextEl: `#arrowRight${dayNumber}`,
                
                    // prevEl: ".swiper-button-prev",
                    prevEl: `#arrowLeft${dayNumber}`,
            },
                });
        }, 200);
    }

    createSwiperHours() {
        let swiper = document.createElement('div');
        let dayNumber = this.dayNumber;
        let temp2m = this.temp2m;
        swiper.classList.add("swiper");
        swiper.id = `mySwiper${dayNumber}`
        swiper.style.height = "65px";
        swiper.style.width = "85%";
        let tempContainer = document.getElementById("tempContainer" + dayNumber);
        tempContainer.appendChild(swiper);

        let swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add("swiper-wrapper");
        swiper.appendChild(swiperWrapper);
        
        this.time.forEach(function(hour, i) {  
            
            let tempListItem = document.createElement('div');
            tempListItem.classList.add('swiper-slide');
            // tempListItem.style.display = "inline-block";
            let slideHour = hour.substring(11, 16).toString();
            let slideTemp2m = temp2m[i].toString();
            tempListItem.innerText = slideHour + "\n" + slideTemp2m + "\u00B0";
            swiperWrapper.appendChild(tempListItem);
        });

        let pagination = document.createElement('div');
        pagination.classList.add("swiper-pagination");
        pagination.id = `swiperPagination${dayNumber}`;
        tempContainer.appendChild(pagination);

        let buttonNext = document.createElement('div');
        buttonNext.classList.add("swiper-button-next");
        buttonNext.id = `arrowRight${dayNumber}`;
        tempContainer.appendChild(buttonNext);

        let svgArrowRight = document.createElement('span');
        svgArrowRight.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#b2c8ff"><g><rect fill="none" height="24" width="24"/></g><g><path d="M22,12c0-5.52-4.48-10-10-10C6.48,2,2,6.48,2,12s4.48,10,10,10C17.52,22,22,17.52,22,12z M4,12c0-4.42,3.58-8,8-8 c4.42,0,8,3.58,8,8s-3.58,8-8,8C7.58,20,4,16.42,4,12z M16,12l-4,4l-1.41-1.41L12.17,13H8v-2h4.17l-1.59-1.59L12,8L16,12z"/></g></svg>'
        buttonNext.appendChild(svgArrowRight);


        let buttonPrev = document.createElement('div');
        buttonPrev.classList.add("swiper-button-prev");
        buttonPrev.id = `arrowLeft${dayNumber}`;
        tempContainer.appendChild(buttonPrev);

        let svgArrowLeft = document.createElement('span');
        svgArrowLeft.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#b2c8ff"><g><rect fill="none" height="24" width="24"/></g><g><path d="M2,12c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10S17.52,2,12,2C6.48,2,2,6.48,2,12z M20,12c0,4.42-3.58,8-8,8 c-4.42,0-8-3.58-8-8s3.58-8,8-8C16.42,4,20,7.58,20,12z M8,12l4-4l1.41,1.41L11.83,11H16v2h-4.17l1.59,1.59L12,16L8,12z"/></g></svg>';
        buttonPrev.appendChild(svgArrowLeft);

    }

    createGeneralInfoContainer() {
        let dayContainer = document.getElementById("dayContainer" + this.dayNumber);
        let generalInfoContainer = document.createElement('div');
        generalInfoContainer.id = "generalInfoContainer" + this.dayNumber;
        generalInfoContainer.classList.add("generalInfoContainerClass");

        let dayNumberString = this.dayNumber.toString()

        // let styles = {
        //     height : "200px",
        //     width : "100%",
        //     position : "relative",
        //     overflow : "hidden",
        //     // border : "1px solid white",
        //     display : "grid",
        //     gridTemplateColumns: "repeat(5, 1fr)",
        //     gridTemplateRows: "repeat(6, 1fr)",
        //     gridTemplateAreas : `
        //     "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString}"
        //     "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
        //     "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
        //     "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
        //     "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
        //     "${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ."
        //     `,
        // }


        let styles = {};
        let mql = window.matchMedia('(min-width: 768px)');

        function screenTest(e) {
          if (e.matches) {
            /* the viewport is 768 pixels wide or more */
            styles = {
                height : "200px",
                width : "100%",
                position : "relative",
                overflow : "hidden",
                // border : "1px solid white",
                display : "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gridTemplateRows: "repeat(6, 1fr)",
                gridTemplateAreas : `
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} . ."
                `, // there 3 SunSC, while in mobile 5
            }
          } else {
            /* the viewport is less than 768 pixels wide */
            styles = {
                height : "200px",
                width : "100%",
                position : "relative",
                overflow : "hidden",
                // border : "1px solid white",
                display : "grid",
                gridTemplateColumns: "repeat(6, 1fr)", // added one more column
                gridTemplateRows: "repeat(6, 1fr)",
                gridTemplateAreas : `
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString} ${'DateC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'LTaWCC' + dayNumberString} ${'LTaWCC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString} ${'WCHPC' + dayNumberString}"
                "${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ${'SunSC' + dayNumberString} ."
                `,
            }
          }
        }
        
        screenTest(mql);
        mql.addEventListener('change', screenTest, false);



        
        setStylesOnElement(generalInfoContainer, styles);

        dayContainer.appendChild(generalInfoContainer);
    }

    createLargeTempAndWeatherCodeContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let LargeTempAndWeatherCodeContainer = document.createElement('div');
        LargeTempAndWeatherCodeContainer.id = "LargeTempAndWeatherCodeContainer" + this.dayNumber;
        LargeTempAndWeatherCodeContainer.style.gridArea = "LTaWCC" + this.dayNumber;

        let styles = {
            marginLeft :"3px",       
            // border : "1px solid white",
            display : "flex",
            flexDirection : "row",
            justifyContent : "space-evenly",
            alignItems : "center",
        }

        setStylesOnElement(LargeTempAndWeatherCodeContainer, styles);

        let dayDailyTemp2m = document.createElement('div');
        dayDailyTemp2m.classList.add("dayDailyTemp2m");
        // dayDailyTemp2m.style.order = "3";
        LargeTempAndWeatherCodeContainer.appendChild(dayDailyTemp2m);


        let dailyWeatherCodeMainContainer = document.createElement('div');
        dailyWeatherCodeMainContainer.classList.add("dailyWeatherCodeMainContainer");
        // height has been moved to style.css
        dailyWeatherCodeMainContainer.style.width = "60%";
        // dailyWeatherCodeMainContainer.style.order = "0";

        let dailyWeatherCode = document.createElement('div');
        dailyWeatherCode.classList.add("mainWeatherIconSCSSContainer");
        
        
        // this block needed only for test of weather SCSS animation
        // let testWeatherCode = 0;
        // switch (this.dayNumber) {
        //     case 1:
        //         testWeatherCode = 0;
        //         break;
        //     case 2:
        //         testWeatherCode = 1;
        //         break;
        //     case 3:
        //         testWeatherCode = 2;
        //         break;
        //     case 4:
        //         testWeatherCode = 3;
        //         break;
        //     case 5:
        //         testWeatherCode = 48;
        //         break;
        //     case 6:
        //         testWeatherCode = 56;
        //         break;
        //     case 7:
        //         testWeatherCode = 67;
        //         break;
        //     case 8:
        //         testWeatherCode = 85;
        //         break;
        //     case 9:
        //         testWeatherCode = 99;
        //         break;
        // }

        
        // 3 is current day, 1 and 2 - previous two, 4...9 is subsequent days
        if (this.dayNumber === 3) {
            // call method of current day
            dayDailyTemp2m.innerText = this.temp2m[this.indexOfCurrentHour] + "\u00B0";
            dailyWeatherCode.innerHTML = iconSwitch(this.weatherCodeHourly[this.indexOfCurrentHour]); // called from iconsSwitcher.js
        } else {
            // call method for other days
            dayDailyTemp2m.innerText = this.averageDailyTemp2m + "\u00B0";
            dailyWeatherCode.innerHTML = iconSwitch(this.weatherCodeAverage); // called from iconsSwitcher.js
        }

        

        dailyWeatherCodeMainContainer.appendChild(dailyWeatherCode);
        LargeTempAndWeatherCodeContainer.appendChild(dayDailyTemp2m);
        LargeTempAndWeatherCodeContainer.appendChild(dailyWeatherCodeMainContainer);
        
        generalInfoContainer.appendChild(LargeTempAndWeatherCodeContainer);

    }

    createDateContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let dateContainer = document.createElement('div');

        let styles = {    
                // border : "1px solid white",
                gridArea : "DateC" + this.dayNumber,
            }

        setStylesOnElement(dateContainer, styles);

        

        // 3 is current day, 1 and 2 - previous two, 4...9 is subsequent days
        let dateText = "";
        switch (this.dayNumber) {
            case 1:
                dateText = "Позавчера";
                break;
            case 2:
                dateText = "Вчера";
                break;
            case 3:
                dateText = "Сегодня";
                break;
            case 4:
                dateText = "Завтра";
                break;
            case 5:
                dateText = "Послезавтра";
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                dateText = "Не скоро";
                break;
        }

        let dateActualDate = `<span>${dateText} <br> ${this.currentDateRussianFormat}</span>
        ${this.dayNumber === 3 ? `<span id="clock" 
                style="color: #a3e6d1;"></span>` : ""
            }`;

        dateContainer.innerHTML = dateActualDate;
        generalInfoContainer.appendChild(dateContainer);
        

        if (this.dayNumber === 3) {
            let time = {};

            (function () {
            
            
            (function tick () {
                let clock = document.getElementById('clock');
                let seconds, minutes, d = new Date();
                time.weekday = d.getDay();
                time.day = d.getDate();
                time.month = d.getMonth() + 1; //JS says jan = 0
                time.year = d.getFullYear();
                time.minutes = d.getMinutes();
                time.hours = d.getHours(); //eastern time zone
                time.seconds = d.getSeconds();
                time.ms = d.getMilliseconds();
                
                minutes = (time.minutes < 10 ? '0' + time.minutes : time.minutes);
                seconds = (time.seconds < 10 ? '0' + time.seconds : time.seconds);
                
                clock.innerText = `${"\u00a0".repeat(1)}` + time.hours + ':' + minutes + ':' + seconds;
                
                window.setTimeout(tick, 1000);

            }()); // Note the parens here, we invoke these functions right away
            }()); // This one keeps clock away from the global scope
            // console.log(time.ms); // We have access to all those properties via a single variable.
        }

    }

    createSunriseSunsetContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let sunriseSunsetContainer = document.createElement('div');
        // sunriseSunsetContainer.id = "sunriseSunsetContainer" + this.dayNumber;
        sunriseSunsetContainer.classList.add("sunriseSunsetContainerClass");
        sunriseSunsetContainer.style.gridArea = "SunSC" + this.dayNumber;

        let styles = {      
            // border : "1px solid white",
        }

        setStylesOnElement(sunriseSunsetContainer, styles);

        if (this.dayNumber !== 1) {  //exclude first day as it isn't possible calculate how first
            // day differ from previous one because there isn't any -3 day from current (only -1 and -2)
            sunriseSunsetContainer.innerHTML = this.sunDailyDeltaText;
        }
        
        generalInfoContainer.appendChild(sunriseSunsetContainer);
    }

    createWindCloudHumidityPressureContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let windCloudHumidityPressureContainer = document.createElement('div');
        
        windCloudHumidityPressureContainer.style.gridArea = "WCHPC" + this.dayNumber;

        let styles = {
            // border : "1px solid white",
            display: "flex",
            flexFlow : "column wrap",
            justifyContent : "space-around",
            alignItems : "center",
        }

        setStylesOnElement(windCloudHumidityPressureContainer, styles);
        


        let windCloudHumidityPressureStyles = {
            // border : "1px solid white",
            height: "50px",
            width: "110px",
            display: "flex",
            flexDirection : "row",
            justifyContent : "flex-start",
            alignItems : "center",
        }

        let windContainer = document.createElement('div');
        setStylesOnElement(windContainer, windCloudHumidityPressureStyles);
        let windImage = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M14.5,17c0,1.65-1.35,3-3,3s-3-1.35-3-3h2c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1H2v-2h9.5 C13.15,14,14.5,15.35,14.5,17z M19,6.5C19,4.57,17.43,3,15.5,3S12,4.57,12,6.5h2C14,5.67,14.67,5,15.5,5S17,5.67,17,6.5 S16.33,8,15.5,8H2v2h13.5C17.43,10,19,8.43,19,6.5z M18.5,11H2v2h16.5c0.83,0,1.5,0.67,1.5,1.5S19.33,16,18.5,16v2 c1.93,0,3.5-1.57,3.5-3.5S20.43,11,18.5,11z"/></g></g></svg>`;

        let cloudContainer = document.createElement('div');
        setStylesOnElement(cloudContainer, windCloudHumidityPressureStyles);
        let cloudImage = `<svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`;

        let humidityContainer = document.createElement('div');
        setStylesOnElement(humidityContainer, windCloudHumidityPressureStyles);
        let humidityImage = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="36px" viewBox="0 0 20 20" width="36px" fill="#FFFFFF"><rect fill="none" height="20" width="20"/><path d="M10,2c0,0-6.5,5.16-6.5,9.5c0,3.59,2.91,6.5,6.5,6.5s6.5-2.91,6.5-6.5C16.5,7.16,10,2,10,2z M7.03,11.93 c0.24,1.66,1.79,2.77,3.4,2.54c0.3-0.04,0.57,0.19,0.57,0.49c0,0.28-0.2,0.47-0.42,0.5c-2.23,0.31-4.22-1.23-4.54-3.39 C6,11.77,6.23,11.5,6.54,11.5C6.79,11.5,7,11.68,7.03,11.93z"/></svg>`;

        let pressureContainer = document.createElement('div');        
        setStylesOnElement(pressureContainer, windCloudHumidityPressureStyles);
        // let pressureImage = `<svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/></svg>`;
        let pressureImage = `<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/></svg>`;

        // 3 is current day, 1 and 2 - previous two, 4...9 is subsequent days
        if (this.dayNumber === 3) {
            // call method of current day
            windContainer.innerHTML = `${windImage} \u00a0 ${this.wind10m[this.indexOfCurrentHour].toString().substring(0, 3)} м/с `;
            cloudContainer.innerHTML = `${cloudImage} \u00a0 ${this.cloudcover[this.indexOfCurrentHour]} %`;
            humidityContainer.innerHTML = `${humidityImage} \u00a0 ${this.relativehumidity_2m[this.indexOfCurrentHour]} % `;
            pressureContainer.innerHTML = `${pressureImage} \u00a0 ${this.pressure[this.indexOfCurrentHour].toString().substring(0, 3)} мм \u00a0\u00a0 рт. ст.`;
        } else {
            // call method for other days
            windContainer.innerHTML = `${windImage} \u00a0 ${this.averageDailyWind10m.toString().substring(0, 3)} м/с `; 
            cloudContainer.innerHTML = ` ${cloudImage} \u00a0 ${this.averageDailycloudcover} %`; 
            humidityContainer.innerHTML = `${humidityImage} \u00a0 ${this.averageDailyhumidity} % `; 
            pressureContainer.innerHTML = `${pressureImage} \u00a0 ${this.averageDailypressure.toString().substring(0, 3)} мм \u00a0\u00a0\u00a0 рт. ст.`; 
        }

        windCloudHumidityPressureContainer.append(windContainer, cloudContainer, humidityContainer, pressureContainer);

        generalInfoContainer.appendChild(windCloudHumidityPressureContainer);
    }
}