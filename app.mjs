"use strict";

import express from "express";
const app = express();
import {testMiddleFunc1, testMiddleFunc2} from "./middle.mjs";
import cors from "cors";
import fetch from 'node-fetch';
import fs from "fs";
import { waitForDebugger } from "inspector";

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

function loadDataFromOpenMeteo() {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&windspeed_unit=ms&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2"
    fetch(url)
        .catch (e => wait(500).then(fetch(url)))  // try second time if there was some network error
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
                appendData(data); // json taken only from here, not from outside
            } else {
                console.log("Didn't get 2xx and not called appendData")
            }
            
        })
        .catch(e => {
            if (e instanceof TypeError) {
                // fetch() can fail this way if the internet connection is down
                console.log("Check your internet connection.");
            } else {
            // This must be some kind of unanticipated error 
                console.error(e);
            } });

}

setInterval(loadDataFromOpenMeteo, 3600000) // load data from callback once a hour 3600000

function appendData(data) {
    let dataInString = JSON.stringify(data)
    fs.writeFile("weatherData.json", dataInString, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    })
}

app.get("/getWeatherData", (req, res) => { // save JSON on server, then clients will take file from here
    if (!res.headersSent) {
        // res.type("application/json");
        res.sendFile("./weatherData.json", { root: "."}); // not __dirname but "." because it's .mjs file
    }
});

app.get("/hey",(req, res) => { // testMiddleFunc1, testMiddleFunc2, 
    
    let s = "hi";
    res.send(`<p>${s}</p>`);

    // res.json({mem: "hi"});

    // res.sendFile("./path/to/file", err => console.log);

    // res.redirect(301, "/path/to/")

    // res.end();
});

// app.post("/", (req, res) => {

// })


const HTTP_PORT = process.env.port || 3005;
app.listen(HTTP_PORT, (err) => { // change 3000 to 80 for HTTP
    if (err) {
        console.log(`there was error ${err}`);
        return;
    }
    console.log(`listening on port ${HTTP_PORT}`)
});