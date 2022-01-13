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

    addWindspeed_10m(windspeed_10m) {
        this.wind10m = windspeed_10m;
    }

    addTemperature_2m(temperature_2m) {
        this.temp2m = temperature_2m;

        let sumDayDailyTemp2m = [...temperature_2m].splice(9); // exclude first 8 night hours
        this.averageDailyTemp2m = Math.round(sumDayDailyTemp2m.reduce((acc, v) => acc + v) / sumDayDailyTemp2m.length); 
        
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

    addPrecipitation(precipitation) {
        this.precipitation = precipitation;
    }

    addRelativehumidity_2m(relativehumidity_2m) {
        this.relativehumidity_2m = relativehumidity_2m;
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
            this.sunDailyDeltaText = `<span style='font-size: 14px;'>Световой день длиннее на 
            <span style='color: #a3e6d1;'>${this.sunDailyDelta + " " + minuteName}</span></span>`
        } else { // it's falling length of day from 22.Jun to 22.Dec
            this.sunDailyDeltaText = `<span style='font-size: 14px;'>Световой день короче на 
            <span style='color: #FD5656;'>${this.sunDailyDelta + " " + minuteName}</span></span>`
        }

        
    }

    

    createDayContainer() {
        let mainContainer = document.getElementById("mainContainer");
        let dayContainer = document.createElement('div');
        dayContainer.id = "dayContainer" + this.dayNumber;
        this.dayContainer = dayContainer;
        dayContainer.classList.add("dayContainerClass");

        let styles = {
            border : "3px solid #b2c8ff",
            height : "300px",
            display : "flex",
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

        mainContainer.appendChild(dayContainer);
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

    addInstanceSwiper() {
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
        let weatherCodeHourly = this.weatherCodeHourly;
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
        //, `swiper-pagination${dayNumber}`
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
        let styles = {
            height : "200px",
            width : "100%",
            position : "relative",
            overflow : "hidden",
            border : "1px solid white",
            display : "flex",
            flexDirection : "row",
            flexWrap : "wrap",
            justifyContent : "flex-start",
            alignItems : "flex-start",
        }
        setStylesOnElement(generalInfoContainer, styles);

        dayContainer.appendChild(generalInfoContainer);
    }

    createLargeTempAndWeatherCodeContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let LargeTempAndWeatherCodeContainer = document.createElement('div');
        LargeTempAndWeatherCodeContainer.id = "LargeTempAndWeatherCodeContainer" + this.dayNumber;

        let styles = {
            height : "120px",
            width : "42%",
            marginLeft :"3px",       
            border : "1px solid white",
            display : "flex",
            flexDirection : "row",
            justifyContent : "space-evenly",
            alignItems : "center",
        }
        setStylesOnElement(LargeTempAndWeatherCodeContainer, styles);

        let dayDailyTemp2m = document.createElement('div');
        dayDailyTemp2m.style.fontSize = "32px";
        LargeTempAndWeatherCodeContainer.appendChild(dayDailyTemp2m);

        let dailyWeatherCodeMainContainer = document.createElement('div');
        dailyWeatherCodeMainContainer.style.height = "100%";
        dailyWeatherCodeMainContainer.style.width = "60%";

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
        // dailyWeatherCode.innerHTML = iconSwitch(testWeatherCode); // called from iconsSwitcher.js
        }

        

        LargeTempAndWeatherCodeContainer.appendChild(dayDailyTemp2m);
        dailyWeatherCodeMainContainer.appendChild(dailyWeatherCode);
        LargeTempAndWeatherCodeContainer.appendChild(dailyWeatherCodeMainContainer);
        
        generalInfoContainer.appendChild(LargeTempAndWeatherCodeContainer);

    }

    createDateContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let dateContainer = document.createElement('div');
        dateContainer.id = "dateContainer" + this.dayNumber;

        let styles = {
            height : "45px",
            width : "55%",
            marginLeft :"3px",       
            marginTop :"6px",       
            border : "1px solid white",
            fontSize : "18px",
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

        
        
        // currentHourAndMinutes is used to display user current time in Current Day container
        // setTimeout(this.currentHourAndMinutes(), 1000)
        // this.currentHourAndMinutes = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Moscow' }).substring(12, 17).toString();
        
        
        // function display_c(){
        //     setTimeout('display_ct()', 1000)
        // }
        
        // let timeRefreshable = display_ct();

        // function display_ct() {
        //     let x = new Date();
        //     document.getElementById('heh').innerHTML = x;
        //     display_c();
        //     // return 
            
        // }

        

        let dateActualDate = `<span>${dateText} <br> ${this.currentDateRussianFormat}</span>
        ${this.dayNumber === 3 ? `<span id="clock" 
                style="color: #a3e6d1; font-size: 25px; line-height: 10px"></span>` : ""
            }`;

        // if (this.dayNumber === 3) {
        //     // add hour and minutes for current day
        //     dateActualDate += `<span style="color:red; font-size:30px;"> ${this.currentHourAndMinutes}</span>`;
        // }

        dateContainer.innerHTML = dateActualDate;
        // dateContainer.innerText = `\u0421\u0435\u0433\u043eдня \n ${this.time[0].substring(0, 10)} ${this.currentHourAndMinutes}`;
        

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
                
                clock.innerText = `${"\u00a0".repeat(2)}` + time.hours + ':' + minutes + ':' + seconds;
                
                window.setTimeout(tick, 1000);

            }()); // Note the parens here, we invoke these functions right away
            }()); // This one keeps clock away from the global scope
            // console.log(time.ms); // We have access to all those properties via a single variable.
        }

    }

    createSunraiseSunsetContainer() {
        let generalInfoContainer = document.getElementById("generalInfoContainer" + this.dayNumber);
        let sunraiseSunsetContainer = document.createElement('div');
        sunraiseSunsetContainer.id = "sunraiseSunsetContainer" + this.dayNumber;

        let styles = {
            height : "25px",
            width : "50%",
            marginLeft :"3px",       
            marginTop :"6px",       
            border : "1px solid white",
            fontSize : "18px",
            alignSelf : "flex-end",
        }
        setStylesOnElement(sunraiseSunsetContainer, styles);

        if (this.dayNumber !== 1) {  //exclude first day as it isn't possible calculate how first
            // day differ from previous one because there isn't any -3 day from current (only -1 and -2)
            sunraiseSunsetContainer.innerHTML = this.sunDailyDeltaText;
        }
        
        generalInfoContainer.appendChild(sunraiseSunsetContainer);
    }

}