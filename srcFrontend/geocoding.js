import {setStylesOnElement, } from './service.js';
import {getWeatherData, } from './weatherDataLoader.js';
import {createOverlay, } from './mainDOM.js';


export function createGeoContainer() {

    let geoMainContainer = document.createElement('div');
    geoMainContainer.id = "geoMainContainer";
    let stylesGeoMainContainer = {
        width: "100%",
        display : "flex",
        flexDirection : "row",
        flexWrap : "wrap",

    }
    setStylesOnElement(geoMainContainer, stylesGeoMainContainer);


    let geoContainer = document.createElement('div');
    geoContainer.id = "geoContainer";
    let stylesGeoContainer = {
        height : "100px",
        position : "relative",
        top : "35px",
        display : "flex",
        flexDirection : "row",
        flexWrap : "wrap",
        padding: "10px",
        justifyContent: "space-around",
        alignItems: "center",
        boxSizing: "border-box",
        border : "3px solid #b2c8ff",
        borderTopRightRadius : "60px 40px",
        borderTopLeftRadius : "60px 40px",
        borderBottomRightRadius : "60px 40px",
        borderBottomLeftRadius : "60px 40px",

    }
    setStylesOnElement(geoContainer, stylesGeoContainer);


    let geoForm = document.createElement('form');
    geoForm.id = "geoForm";
    geoForm.style.zIndex = "199";

    let geoTextInput = document.createElement('input');
    geoTextInput.id = "geoTextInput";
    geoTextInput.type = "text";
    geoTextInput.placeholder = "Москва";
    geoTextInput.name = "city";
    geoTextInput.value = "";
    geoTextInput.style.textIndent = "10px";
    geoTextInput.style.width = "67%";

    let geoTextButton = document.createElement('input');
    geoTextButton.id = "geoTextButton";
    geoTextButton.type = "button";
    geoTextButton.value = "Найти";
    geoTextButton.style.width = "27%";
    geoTextButton.style.marginLeft = "5px";

    let stylesGeoText = {
        height : "30px",
        border : "1px solid #b2c8ff",
        borderTopRightRadius : "60px 40px",
        borderTopLeftRadius : "60px 40px",
        borderBottomRightRadius : "60px 40px",
        borderBottomLeftRadius : "60px 40px",
        background: "none",
        color: "inherit",
        fontSize: "inherit",
    }
    setStylesOnElement(geoTextInput, stylesGeoText);
    setStylesOnElement(geoTextButton, stylesGeoText);


    geoTextButton.addEventListener("click", requestGeoLocation);
    geoTextInput.addEventListener("keydown", requestGeoLocation);
    geoTextInput.addEventListener("click", requestGeoLocation); // it's for rare situation when user typed in some characters then clicked around the rows, but still on table and then user decided return to textInput

    function requestGeoLocation(event) {
        if (event.key === "Enter") {
            console.log("it's Enter");
            event.preventDefault();
        }

        // this block still here in case if it will be better to stop requesting Geo on each typing in order to lower amount of requests to Open Meteo
        // if (keydown.key) {
        //     if (keydown.key !== "Enter") {
        //         console.log("it's return")
        //         return
        //     }
        // }
        
        let conditionsArray = [
            event.key === "Meta", 
            // event.key === "Backspace",
            event.key === "Alt",
            event.key === "Control",
            event.key === "Shift",
            event.key === " ",
        ]

        if (!conditionsArray.includes(true) && (geoTextInput.value.length >= 6 || event.key === "Enter" || event.type === "click")) {
            // let url = `http://www.glebmark.com/geoLocation?name=${geoTextInput.value}`;
            let url = `http://localhost:3005/geoLocation?name=${geoTextInput.value}`;
            
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
                    appendGeo(data);
                } else {
                    console.log("Didn't get 2xx and not called appendGeo")
                }
            })
            .catch(e => console.error(e));
        }
    }


    function appendGeo(data) {
        if(!data.results) {
            console.log("Didn't get geo data.results")
            return
        }


        let oldOverlay = document.getElementById("overlay");
        if (oldOverlay) {
            oldOverlay.remove();
        }         
        let overlay = createOverlay();
        

        let oldGeoListOfAllAvailableCities = document.getElementById("geoListOfAllAvailableCities");
        if (oldGeoListOfAllAvailableCities) {
            oldGeoListOfAllAvailableCities.remove();
        }         

        let geoListOfAllAvailableCities = document.createElement('div');
        geoListOfAllAvailableCities.id = "geoListOfAllAvailableCities";
        let stylesgeoListOfAllAvailableCities = {
            padding: "20px",
            position : "absolute",
            display : "flex",
            zIndex: "199",
            left: "-3px",
            top: "75px",
            backgroundColor: "#272932",
            flexDirection : "row",
            justifyContent: "space-around",
            alignItems: "flex-start",
            border : "3px solid #b2c8ff",
            borderTopRightRadius : "60px 40px",
            borderTopLeftRadius : "60px 40px",
            borderBottomRightRadius : "60px 40px",
            borderBottomLeftRadius : "60px 40px",
        }
        setStylesOnElement(geoListOfAllAvailableCities, stylesgeoListOfAllAvailableCities);


        let table = document.createElement('table');
        table.id = "tableCities"
        table.style.borderSpacing = "0";
        let tableHead = document.createElement('thead');
        let tableHeadrow = document.createElement('tr');
        let tableHeaderName = document.createElement('th');
        tableHeaderName.innerText = "Город";
        let tableHeaderArea = document.createElement('th');
        tableHeaderArea.innerText = "Область";
        let tableHeaderCountry = document.createElement('th');
        tableHeaderCountry.innerText = "Страна";



        let tableHeaderLatitude = document.createElement('th');
        tableHeaderLatitude.innerText = "Широта";
        let tableHeaderLongitude = document.createElement('th');
        tableHeaderLongitude.innerText = "Долгота";
        

        let tableBody = document.createElement('tbody');
        data.results.forEach(city => {
            let tableBodyRow = document.createElement('tr');
            tableBodyRow.classList.add("tableBodyRow");


            tableBodyRow.addEventListener("click", () => {
                let cityValues = {
                    name: city.name,
                    area: city.admin1,
                    country: city.country,
                    latitude: city.latitude,
                    longitude: city.longitude,
                    timezone: city.timezone
                };

                getWeatherData(cityValues); // called from weatherDataLoader.js
                overlay.remove();
                geoListOfAllAvailableCities.remove();
            })


            let tableBodyName = document.createElement('td');
            tableBodyName.innerText = city.name;
            let tableBodyArea = document.createElement('td');
            tableBodyArea.innerText = city.admin1;
            let tableBodyCountry = document.createElement('td');
            tableBodyCountry.innerText = city.country;
            let tableBodyLatitude = document.createElement('td');
            tableBodyLatitude.innerText = city.latitude;
            let tableBodyLongitude = document.createElement('td');
            tableBodyLongitude.innerText = city.longitude;


            let mql = window.matchMedia('(min-width: 768px)');
            function screenTest(e) {
              if (e.matches) {
                /* the viewport is 768 pixels wide or more */
                tableBodyRow.append(tableBodyName, tableBodyArea, tableBodyCountry, tableBodyLatitude, tableBodyLongitude);    
              } else {
                /* the viewport is less than 768 pixels wide */
                tableBodyRow.append(tableBodyName, tableBodyArea, tableBodyCountry);    
              }
            }
            screenTest(mql);
            mql.addEventListener('change', screenTest, false);

            tableBody.appendChild(tableBodyRow);
        })
        

        let mql = window.matchMedia('(min-width: 768px)');
        function screenTest(e) {
          if (e.matches) {
            /* the viewport is 768 pixels wide or more */
            tableHeadrow.append(tableHeaderName, tableHeaderArea, tableHeaderCountry, tableHeaderLatitude, tableHeaderLongitude);
          } else {
            /* the viewport is less than 768 pixels wide */
            tableHeadrow.append(tableHeaderName, tableHeaderArea, tableHeaderCountry);
          }
        }
        screenTest(mql);
        mql.addEventListener('change', screenTest, false);

        
        tableHead.appendChild(tableHeadrow);
        table.append(tableHead, tableBody);
        geoListOfAllAvailableCities.appendChild(table);
        geoForm.appendChild(geoListOfAllAvailableCities);
        // document.body.appendChild(overlay);
        

        document.addEventListener("click", event => {
            console.log(event)
            if (event.target.id === "geoListOfAllAvailableCities" || 
            event.target.tagName === "TH" ||
            event.target.tagName === "TR") {
                console.log("this is geoListOfAllAvailableCities or TH or TR, can't conceal it")
            } else {
                // geoListOfAllAvailableCities.style.display = "none";
                let oldOverlay = document.getElementById("overlay");
                if (oldOverlay) {
                    oldOverlay.remove();
                }

                let oldGeoListOfAllAvailableCities = document.getElementById("geoListOfAllAvailableCities");
                if (oldGeoListOfAllAvailableCities) {
                    oldGeoListOfAllAvailableCities.remove();
                }
            }
        })
    }


    let geoCurrentCity = document.createElement('div');
    geoCurrentCity.id = "geoCurrentCity";
    let stylesGeoCurrentCity = {
        width : "40%",
        height : "50px",
        display : "flex",
        flexDirection : "row",
        justifyContent: "flex-start",
        alignItems: "center",
    }
    setStylesOnElement(geoCurrentCity, stylesGeoCurrentCity);


    geoForm.append(geoTextInput, geoTextButton);
    geoContainer.appendChild(geoForm);
    geoContainer.appendChild(geoCurrentCity);
    geoMainContainer.appendChild(geoContainer);
    document.body.appendChild(geoMainContainer);
}