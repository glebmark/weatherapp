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

// mainContainer is needed to fit first 2 dayContainers
let prevMainContainer = document.createElement('div');
prevMainContainer.id = "prevMainContainer";
let stylesPrevMain = {
    width : "100%",
    height : "70px",
    position : "relative",
    top : "40px",
    display : "flex",
    minWidth : "0",
    flexDirection : "row",
    flexWrap : "wrap",
    
    // border : "3px solid #b2c8ff",
    // height : "70px",
    // borderTopRightRadius : "60px 40px",
    // borderTopLeftRadius : "60px 40px",
    // borderBottomRightRadius : "60px 40px",
    // borderBottomLeftRadius : "60px 40px",

}
setStylesOnElement(prevMainContainer, stylesPrevMain);


let stylesButtons = {
    border : "3px solid #b2c8ff",
    height : "50px",
    borderTopRightRadius : "60px 40px",
    borderTopLeftRadius : "60px 40px",
    borderBottomRightRadius : "60px 40px",
    borderBottomLeftRadius : "60px 40px",
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

let buttonDayBeforeYesterday = document.createElement('div');
buttonDayBeforeYesterday.classList.add("buttonsPrevContainerClass");
buttonDayBeforeYesterday.id = "buttonDayBeforeYesterday";
// buttonDayBeforeYesterday.style.display = "none";  
// buttonDayBeforeYesterday.innerText = "Ранее"            
setStylesOnElement(buttonDayBeforeYesterday, stylesButtons);
prevMainContainer.appendChild(buttonDayBeforeYesterday);


let buttonYesterday = document.createElement('div');
buttonYesterday.classList.add("buttonsPrevContainerClass");
buttonYesterday.id = "buttonYesterday";
// buttonYesterday.style.backgroundColor = "transparent";
// buttonYesterday.style.position = "absolute"; 
// buttonYesterday.style.display = "none";
buttonYesterday.innerText = "Ранее"          
buttonYesterday.style.display = "flex";  
setStylesOnElement(buttonYesterday, stylesButtons);
prevMainContainer.appendChild(buttonYesterday);


document.body.appendChild(prevMainContainer);

document.querySelectorAll(".buttonsPrevContainerClass").forEach(button => {
    
    button.addEventListener("click", () => {
        
        buttonYesterday.style.backgroundColor = "transparent";
        buttonYesterday.style.color = "inherit";
        
        
        buttonYesterday.innerText = "Позавчера" // only for mobile, then rewrite for desktop down below


        let mql = window.matchMedia('(min-width: 768px)');

        function screenTest(e) {
          if (e.matches) {
            /* the viewport is 768 pixels wide or more */

            buttonDayBeforeYesterday.innerText = "Позавчера"
            buttonDayBeforeYesterday.style.display = "flex";

            buttonYesterday.innerText = "Вчера" 


            // animation of Yesterday button to the right
            let id = null;
            let pos = 0;
            clearInterval(id);
            id = setInterval(frame, 5);
            function frame() {
                if (pos >= 540) {
                    clearInterval(id);
                } else {
                    pos += 3; 
                    // buttonYesterday.style.top = pos + "px"; 
                    buttonYesterday.style.left = pos + "px"; 
                }
            }    

          } else {
            /* the viewport is less than 768 pixels wide */
            
            prevMainContainer.style.height = "150px";
            prevMainContainer.style.transition = "all 1s";
            prevMainContainer.style.transitionTimingFunction = "ease";

            setTimeout(() => {
                buttonYesterday.innerText = "Вчера";
                buttonDayBeforeYesterday.innerText = "Позавчера";
                buttonDayBeforeYesterday.style.display = "flex";
            }, 1000)
            
          }
        }
        
        screenTest(mql);
        mql.addEventListener('change', screenTest, false);

        
        
    
        setTimeout(() => {
            prevMainContainer.style.height = "";

            buttonDayBeforeYesterday.style.height = "300px";
            buttonDayBeforeYesterday.style.transition =  "all 1s",
            buttonDayBeforeYesterday.style.transitionTimingFunction = "ease",
            buttonDayBeforeYesterday.style.position = "static";
            
            
            buttonYesterday.style.height = "300px";
            buttonYesterday.style.transition =  "all 1s",
            buttonYesterday.style.transitionTimingFunction = "ease"
            buttonYesterday.style.position = "static";
    

            

        }, 1500)


        setTimeout(() => {
            buttonDayBeforeYesterday.style.display = "none";
            buttonYesterday.style.display = "none";
            let dayContainer1 = document.getElementById("dayContainer1");
            dayContainer1.style.display = "flex";
            let dayContainer2 = document.getElementById("dayContainer2");
            dayContainer2.style.display = "flex";

            
            
        }, 2500)
        
        
        
        
        // prevMainContainer.style.display = "flex";
        // prevMainContainer.style.height = "100%";
        
    })
})

console.log(document.querySelectorAll(".buttonsPrevContainerClass"))





// mainContainer is needed to fit 7 dayContainers
let mainContainer = document.createElement('div');
mainContainer.id = "mainContainer";
let stylesMain = {
    width : "100%",
    // height : "100%",
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


