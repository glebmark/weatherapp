"use strict";

// only for test
const testMiddleFunc1 = (req, res, next) => {
    console.log(req.method);
    // console.log(req.path); // just path of the url
    // console.log(`it's requested URL: ${req.url}`);

    // console.log(req.headers);
    // console.log(req.ip);
    // console.log(req.protocol);
    // console.log(req.query); //query string
    // console.log(req.subdomains);
    // console.log(req.params);
    next();
}

let counterAPIreqestsToOpenMeteo = 0;
function amIexceedAPIlimit(req, res, next) {
    counterAPIreqestsToOpenMeteo++;
    console.log("Request to Open Meteo number " + counterAPIreqestsToOpenMeteo)
    next();
}

export {testMiddleFunc1, amIexceedAPIlimit};