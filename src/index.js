import './style.css';

import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

// fetch data
let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m&windspeed_unit=ms&timezone=Europe%2FMoscow";
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
    
    let mainContainer = document.createElement('div');
    mainContainer.id = "mainContainer2";
    mainContainer.style.border = "1px solid black";
    mainContainer.style.width = "100%";
    mainContainer.style.height = "500px";
    mainContainer.style.display = "flex";
    // mainContainer.style.minWidth = "0";
    mainContainer.style.flexDirection = "row";
    mainContainer.style.flexWrap = "wrap";
    mainContainer.style.justifyContent = "space-evenly";
    mainContainer.style.alignItems = "center";
    mainContainer.style.alignContent = "space-around";
    document.body.appendChild(mainContainer);


    class Day {
        constructor(dayNumber) {
            this.dayNumber = dayNumber;
        }


        // data.hourly.time.forEach(element => {
    //     console.log(element)
    // });

        addInstanceSwiper() {
            let dayNumber = this.dayNumber;
            window.setTimeout(function(){
                const swiper = new Swiper(`#mySwiper${dayNumber}`, {
                    //${this.dayNumber}
                    observer: true, 
                    observeParents: true,
                    slidesPerView: 3,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                    loop: true,
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
        
        addWindspeed_10m(windspeed_10m) {
            this.wind10m = windspeed_10m;
            // return 1;
        }

        addTemperature_2m(temperature_2m) {
            this.temp2m = temperature_2m;
        }

        addTime (time) {
            this.time = time;
        }

        addPrecipitation(precipitation) {
            this.precipitation = precipitation;
        }

        addRelativehumidity_2m(relativehumidity_2m) {
            this.relativehumidity_2m = relativehumidity_2m;
        }

        createDayContainer() {
            let mainContainer = document.getElementById("mainContainer2");
            let dayContainer = document.createElement('div');
            dayContainer.id = "dayContainer" + this.dayNumber;
            this.dayContainer = dayContainer;
            dayContainer.classList.add("dayContainerClass");
            dayContainer.style.border = "1px solid black";
            dayContainer.style.height = "100px";
            dayContainer.style.margin = "3px";
            dayContainer.style.display = "flex";
            // dayContainer.style.minWidth = "0";
            dayContainer.style.flexDirection = "row";
            dayContainer.style.flexWrap = "wrap";
            dayContainer.style.justifyContent = "space-evenly";
            dayContainer.style.alignItems = "center";
            mainContainer.appendChild(dayContainer);
        }

        createTempContainer() {
            let dayContainer = document.getElementById("dayContainer" + this.dayNumber);
            let tempContainer = document.createElement('div');
            tempContainer.id = "tempContainer" + this.dayNumber;
            this.tempContainer = tempContainer;
            tempContainer.classList.add("tempContainerClass");
            tempContainer.style.border = "1px solid black";
            tempContainer.style.height = "65px";
            tempContainer.style.width = "80%";
            tempContainer.style.margin = "3px";
            tempContainer.style.position = "relative";
            tempContainer.style.overflow = "hidden";
            dayContainer.appendChild(tempContainer);
        }

        createSwiperHours() {
            let swiper = document.createElement('div');
            let dayNumber = this.dayNumber;
            let temp2m = this.temp2m;
            // swiper.classList.add("swiper", `mySwiper${dayNumber}`);
            swiper.classList.add("swiper");
            swiper.id = `mySwiper${dayNumber}`
            swiper.style.border = "1px solid black";
            swiper.style.height = "50px";
            swiper.style.width = "85%";
            // tempContainer.style.margin = "3px";
            // tempDiv.style.overflowY = "scroll"
            // this.dayContainer.appendChild(tempDiv);
            // document.body.appendChild(tempDiv);
            let tempContainer = document.getElementById("tempContainer" + dayNumber);
            tempContainer.appendChild(swiper);

            let swiperWrapper = document.createElement('div');
            swiperWrapper.classList.add("swiper-wrapper");
            // tempSwiperList.style.listStyle = "none";
            // tempSwiperList.style.width = "200px";
            swiper.appendChild(swiperWrapper);
            
            this.time.forEach(function(hour, i) {  
                
                let tempListItem = document.createElement('div');
                tempListItem.classList.add('swiper-slide');
                //`fact-hour${dayNumber}`
                // tempListItem.style.display = "inline-block";
                // tempListItem.style.padding = "2px";
                let slideHour = hour.substring(11, 16).toString();
                let slideTemp2m = temp2m[i].toString();
                tempListItem.innerText = slideHour + "\n" + slideTemp2m;
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

            let buttonPrev = document.createElement('div');
            buttonPrev.classList.add("swiper-button-prev");
            buttonPrev.id = `arrowLeft${dayNumber}`;
            tempContainer.appendChild(buttonPrev);

        }
    }

    // 7 - is just 7 days of week (in other version 9 - is 7 + 2 past days before)
    for(let i = 1; i <= 7; i++) {
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

        // load data to corresponding days
        window["day" + i].addTime(data.hourly.time.splice(0, currentDay.length));

        window["day" + i].addInstanceSwiper();

        window["day" + i].addWindspeed_10m(data.hourly.windspeed_10m.splice(0, currentDay.length));
        
        window["day" + i].addTemperature_2m(data.hourly.temperature_2m.splice(0, currentDay.length));

        window["day" + i].addPrecipitation(data.hourly.precipitation.splice(0, currentDay.length));

        window["day" + i].addRelativehumidity_2m(data.hourly.relativehumidity_2m.splice(0, currentDay.length));

        // create DOM elements
        window["day" + i].createDayContainer();

        window["day" + i].createTempContainer();

        window["day" + i].createSwiperHours();

        console.log(window["day" + i])
    }   
}
// window.onload = textDisplay;
console.log("script loaded");
// swiper.update();