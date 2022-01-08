export default function iconSwitch(weatherCodeString) {
    let weatherHTML = ``;
    let weatherCode = parseInt(weatherCodeString); 
    switch (weatherCode) {
        
        case 0:
            weatherHTML = `<div class="sunnyContainer">
            <div class="sunnyCanvas">
                <div class="sunnySun">
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                    <div class="sunnyBeam"> </div>
                </div>
            </div>
        </div>`;
        console.log(weatherHTML);
            break;
        case 1:
            weatherHTML = `partially cloudy`;
            console.log(weatherHTML);
            break;
        case 2:
            weatherHTML = `scattered clouds`;
            console.log(weatherHTML);
            break;
        case 3:
            weatherHTML = "broken clouds";
            console.log(weatherHTML);
            break;
        case 45:
        case 48:
            weatherHTML = `mist`;
            console.log(weatherHTML);
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
            weatherHTML = `Rain`;
            console.log(weatherHTML);
            break;
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            weatherHTML = `rainy (two clouds with rain)`;
            console.log(weatherHTML);
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            console.log("IT WORKKKK");
            weatherHTML = `snowy`;
            console.log(weatherHTML);
            break;
        case 95:
        case 96:
        case 99:
            weatherHTML = `thunderstorm`;
            console.log(weatherHTML);
            break;
    }
    console.log(weatherHTML);
    return weatherHTML;
}