import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

export default class Day {
    constructor(dayNumber) {
        this.dayNumber = dayNumber;
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
    
    addWindspeed_10m(windspeed_10m) {
        this.wind10m = windspeed_10m;
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
        let mainContainer = document.getElementById("mainContainer");
        let dayContainer = document.createElement('div');
        dayContainer.id = "dayContainer" + this.dayNumber;
        this.dayContainer = dayContainer;
        dayContainer.classList.add("dayContainerClass");
        dayContainer.style.border = "3px solid #b2c8ff";
        dayContainer.style.height = "300px";
        dayContainer.style.display = "flex";
        dayContainer.style.flexDirection = "row";
        dayContainer.style.flexWrap = "wrap";
        dayContainer.style.justifyContent = "space-evenly";
        // dayContainer.style.justifyContent = "flex-start";
        dayContainer.style.alignItems = "flex-start";
        dayContainer.style.borderTopRightRadius = "60px 40px";
        dayContainer.style.borderTopLeftRadius = "60px 40px";
        dayContainer.style.borderBottomRightRadius = "60px 40px";
        dayContainer.style.borderBottomLeftRadius = "60px 40px";
        mainContainer.appendChild(dayContainer);
    }

    createGeneralInfoContainer() {
        let dayContainer = document.getElementById("dayContainer" + this.dayNumber);
        let generalInfoContainer = document.createElement('div');
        // generalInfoContainer.id = "generalInfoContainer" + this.dayNumber;
        generalInfoContainer.classList.add("tempContainerClass");
        generalInfoContainer.style.height = "200px";
        generalInfoContainer.style.width = "80%";
        generalInfoContainer.style.position = "relative";
        generalInfoContainer.style.overflow = "hidden";
        dayContainer.appendChild(generalInfoContainer);
    }


    createTempContainer() {
        let dayContainer = document.getElementById("dayContainer" + this.dayNumber);
        let tempContainer = document.createElement('div');
        tempContainer.id = "tempContainer" + this.dayNumber;
        // this.tempContainer = tempContainer;
        tempContainer.classList.add("tempContainerClass");
        tempContainer.style.height = "65px";
        tempContainer.style.width = "80%";
        tempContainer.style.position = "relative";
        tempContainer.style.overflow = "hidden";
        dayContainer.appendChild(tempContainer);
    }

    createSwiperHours() {
        let swiper = document.createElement('div');
        let dayNumber = this.dayNumber;
        let temp2m = this.temp2m;
        swiper.classList.add("swiper");
        swiper.id = `mySwiper${dayNumber}`
        swiper.style.height = "50px";
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
}