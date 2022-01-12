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
            break;
        case 1:
            weatherHTML = `<div class="partiallyCloudyContainer">
                            <div class="partiallyCloudyCanvas">
                                <div class="partiallyCloudySun">
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                    <div class="partiallyCloudyBeam"> </div>
                                </div>
                                <div class="partiallyCloudyCloud"></div>
                            </div>
                        </div>`;
            break;
        case 2:
            weatherHTML = `<div class="scatteredCloudyContainer">
                            <div class="scatteredCloudyCanvas">
                                <div class="scatteredCloudyClouds">
                                    <div class="scatteredCloudyCloud"></div>
                                    <div class="scatteredCloudyCloud"></div>
                                    <div class="scatteredCloudyCloud"></div>
                                </div>
                            </div>
                        </div>`;
            break;
        case 3:
            weatherHTML = `<div class="brokenCloudyContainer">
                            <div class="brokenCloudyCanvas">
                                <div class="brokenCloudyClouds">
                                    <div class="brokenCloudyCloud"></div>
                                    <div class="brokenCloudyCloud"></div>
                                    <div class="brokenCloudyCloud"></div>
                                </div>
                            </div>
                        </div>`;
            break;
        case 45:
        case 48:
            weatherHTML = `<div class="mistContainer">
            <div class="mistCanvas">
                <div class="mistMist">
                    <div class="mistMist-line"></div>
                    <div class="mistMist-line"></div>
                    <div class="mistMist-line"></div>
                    <div class="mistMist-line"></div>
                    <div class="mistMist-line"></div>
                </div>
            </div>
        </div>`;
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
            weatherHTML = `<div class="rainContainer">
            <div class="rainCanvas">
                <div class="rainSun">
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                    <div class="rainBeam"> </div>
                </div>
                <div class="rainCloud">
                    <div class="rainCloud-copy"></div>
                    <div class="rainRain">
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                        <div class="rainDrop"></div>
                    </div>
                </div>
            </div>
        </div>`;
            break;
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            weatherHTML = `<div class="rainyTwoContainer">
            <div class="rainyTwoCanvas">
                <div class="rainyTwoClouds">
                    <div class="rainyTwoCloud">
                        <div class="rainyTwoCloud-copy"></div>
                        <div class="rainyTwoRain">
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                        </div>
                    </div>
                    <div class="rainyTwoCloud">
                        <div class="rainyTwoCloud-copy"></div>
                        <div class="rainyTwoRain">
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                            <div class="rainyTwoDrop"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            weatherHTML = `<div class="snowyContainer">
            <div class="snowyCanvas">
                <div class="snowyCloud">
                    <div class="snowyCloud-copy"></div>
                    <div class="snowySnow">
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                        <div class="snowyFlake">
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                            <div class="snowyFlake-part"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            break;
        case 95:
        case 96:
        case 99:
            weatherHTML = `<div class="thunderstormContainer">
            <div class="thunderstormCanvas">
                <div class="thunderstormCloud">
                    <div class="thunderstormCloud-copy"></div>
                    <div class="thunderstormRain">
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormDrop"></div>
                        <div class="thunderstormLightning"></div>
                    </div>
                </div>
            </div>
        </div>`;
            break;
    }
    return weatherHTML;
}