"use strict";

import express from "express";
const app = express();
import {testMiddleFunc1, testMiddleFunc2} from "./middle.mjs";
import cors from "cors";
import fetch from 'node-fetch';
import fs from "fs";
// import { waitForDebugger } from "inspector";

app.use(testMiddleFunc1); // this is just testing middle function for all requests
app.use(testMiddleFunc2); // this is just testing middle function for all requests
app.use(cors());

let optionsForStatic = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    // index: false,
    maxAge: '1d',
    redirect: true,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
};

app.use(express.static("dist", optionsForStatic));



// function appendData(data, path) {
//     let dataInString = JSON.stringify(data)
//     fs.writeFile("weatherData.json", dataInString, (err) => {
//         if (err) throw err;
//         console.log('Weather data written to file');
//     })
// }

// let defaultCityValues = {
//     name: "Москва",
//     area: "Москва",
//     country: "Россия",
//     latitude: 55.75222,
//     longitude: 37.61556,
//     timezone: "Europe/Moscow"
// };

// let defaultPath = `./cashedWeatherData/weatherDataLatitude${defaultCityValues.latitude}Longitude${defaultCityValues.longitude}.json`;

// setInterval(loadDataFromOpenMeteo(defaultCityValues, defaultPath), 3600000) // load data from callback once a hour 3600000

app.get("/weatherData", (req, res) => { // save JSON on server, then clients will take file from here
    
    function isFileExist(path) {
        try {
            if(!fs.existsSync(path)) {
                throw new TypeError("weatherData file wasn't found")
            };
            return path;
        } catch {
            return false;
        }
        
    }


    function loadDataFromOpenMeteo(cityValues, path) {
        // let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&windspeed_unit=ms&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2";
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${cityValues.latitude}&longitude=${cityValues.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&windspeed_unit=ms&daily=sunrise,sunset&timezone=${encodeURI(cityValues.timezone)}&past_days=2`;
        fetch(url)
            .then(response => {
    
                if (!response.ok) {
                    return null
                }
    
                let type = response.headers.get("content-type"); 
                if (type !== "application/json; charset=utf-8") {
                    throw new TypeError(`Expected JSON, got ${type}`)
                }
    
                return response.json();
            })
            .then(data => {
                if(data) {
                    // appendData(data, path); // json taken only from here, not from outside
    
                    // let dataInString = JSON.stringify(data)
                    // fs.writeFile("weatherData.json", dataInString, (err) => {
                    //     if (err) throw err;
                    //     console.log('Weather data written to file');
                    // })
    
                    let dataInString = JSON.stringify(data)
                    async function writeToFile() {
                        await fs.promises.writeFile(path, dataInString, (err) => {
                            if (err) throw err;
                            console.log('Weather data written to file');
                        });
                    }
                    
                    writeToFile().then(() => {
                        res.sendFile(path, { root: "."}); // not __dirname but "." because it's .mjs file
                        console.log(`New weather file sent, path ${path}`)
                    })
    
    
                } else {
                    console.log("Didn't get 2xx and not called appendData")
                }
                
            })
            .catch(e => console.error(e));
    
    }




    let path = `./cashedWeatherData/weatherDataLatitude${req.query.latitude}Longitude${req.query.longitude}.json`;

    // add timezone to weatherData before response + handle it on front side for current CLOCK
    
    // load loadDataFromOpenMeteo from here with req
    console.log("THIS IS LATITUDE" + req.query.latitude);
    console.log("THIS IS LATITUDE" + req.query.longitude);
    console.log("THIS IS LATITUDE" + req.query.timezone);

    let cityValues = {
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        timezone: req.query.timezone
    };

    
    
    if (isFileExist(path)) {
        if (!res.headersSent) {
            // res.type("application/json");
            res.sendFile(path, { root: "."}); // not __dirname but "." because it's .mjs file
            console.log(`Cashed weather file sent, path ${path}`)
        }
    } else {
        loadDataFromOpenMeteo(cityValues, path)
    }


    // if (!res.headersSent) {
    //     // res.type("application/json");
    //     res.sendFile("./weatherData.json", { root: "."}); // not __dirname but "." because it's .mjs file
    // }
});


app.get("/geoLocation", (req, res) => { // save JSON on server, then clients will take file from here
    // console.log(req)

    function isFileExist(path) {
        try {
            if(!fs.existsSync(path)) {
                throw new TypeError("geoLocation file wasn't found")
            };
            return path;
        } catch {
            return false;
        }
        
    }

    
    function requestNewGeoLocationJSON(cityName, path) {
        let url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&language=ru`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return null
                }
        
                let type = response.headers.get("content-type"); 
                if (type !== "application/json; charset=utf-8") {
                    throw new TypeError(`Expected JSON, got ${type}`)
                }
        
                return response.json();
            })
            .then(data => {
                if(data) {
                    let dataInString = JSON.stringify(data)
                    async function writeToFile() {
                        await fs.promises.writeFile(path, dataInString, (err) => {
                            if (err) throw err;
                            console.log('Geo data written to file');
                        });
                    }
                    
                    writeToFile().then(() => {
                        res.sendFile(path, { root: "."}); // not __dirname but "." because it's .mjs file
                        console.log(`New geo file sent, path ${path} for city ${req.query.name}`)
                    })
                    
                } else {
                    console.log("Didn't get 2xx and not called appendGeo")
                }
            })
            .catch(e => console.error(e));
    }


    
    let cityName = encodeURI(req.query.name);
    let path = `./cashedCitiesGeo/geoData${cityName}.json`;
    
    if (isFileExist(path)) {
        if (!res.headersSent) {
            // res.type("application/json");
            res.sendFile(path, { root: "."}); // not __dirname but "." because it's .mjs file
            console.log(`Cashed geo file sent, path ${path} for city ${req.query.name}`)
        }
    } else {
        requestNewGeoLocationJSON(cityName, path);
    }

});



const HTTP_PORT = process.env.port || 80;
app.listen(HTTP_PORT, (err) => { // change 3000 to 80 for HTTP
    if (err) {
        console.log(`there was error ${err}`);
        return;
    }
    console.log(`listening on port ${HTTP_PORT}`)
});