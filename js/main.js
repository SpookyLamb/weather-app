// needs to take a zip code and then produce the local weather
// should list out the following information:
//  -city
//  -temperature, in kelvin, celsius, and fahrenheit
//  -current weather condition, eg light rain
//  -an image decided by the current temperature, using the API's built-in icons (read the docs!)
// this should be accomplished by pinging the openweather API to get the weather for the given zip code
// should be able to take new zip codes to get new data
// needs to be responsive, using bootstrap, to get different layouts on mobile and desktop

const API_key = "f4cf630ad5da60d93c24ed78932800cb";

const docBody = document.getElementById("body");

//global vars for subdivisions
let appDiv;
let weatherButton;
let zipInput;
let weatherBox;
let cityBox;
let kBox;
let cBox;
let fBox;
let conditionBox;
let iconBox;

//common classes
const heading_classes = ["row", "bg-warning", "my-border", "d-flex", "justify-content-center", "align-items-center", "text-center", "align-middle", "fs-4", "fw-bold"]
const text_classes = ["row", "bg-white", "my-sub-border", "d-flex", "justify-content-center", "align-items-center", "text-center", "align-middle", "my-text"]

//const weatherBox = document.getElementById("weather-box");
//const weatherButton = document.getElementById("weather-button");
//const zipInput = document.getElementById("zip-input");

// let kBox = document.getElementById("k-box");
// let cBox = document.getElementById("c-box");
// let fBox = document.getElementById("f-box");

//let conditionBox = document.getElementById("condition-box");
//let iconBox = document.getElementById("icon-box");

export function init() {
    console.log("Initializing.")
    clear_child_elements(docBody)
    buildPage()
    weatherButton.addEventListener("click", getWeather);
}

function buildElement(tag, element_id, class_list, parent_node) {
    //takes tag (string), class_list (array of strings), element_id (string)
    //return the created node to be used elsewhere

    let node = document.createElement(tag)

    if (element_id) { //empty string is ignored
        node.id = element_id
    }

    if (class_list.length > 0) { //empty array is ignored
        for (let i = 0; i < class_list.length; i++) {
            node.classList.add( class_list[i] )
        }
    }

    parent_node.appendChild(node)

    return node
}

function buildPage() {
    //builds the basic page elements from top to bottom, adding them to the body
    
//  <div id="app" class="container col-12 col-md-6 bg-white vh-100">
    let node = buildElement("div", "app", ["container", "col-12", "col-md-6", "bg-white", "vh-100"], docBody)    
    appDiv = node

//     <div class="row">
//       <h1>Weather App</h1>
//     </div>

    node = buildElement("div", "", ["row"], appDiv)
    
    let parent = node
    node = buildElement("h1", "", [], parent)
    node.textContent = "Weather App"

//     <div class="row input-field">
//       <div class="col d-flex align-items-center justify-content-end">
//         <label for="zip-input">ZIP:&nbsp;</label>
//         <input type="text" id="zip-input" class="zip-input">
//       </div>
//       <div class="col d-flex align-items-center justify-content-start">
//         <button type="button" id="weather-button" class="btn btn-primary">Get Weather</button>
//       </div>
//     </div>

    node = buildElement("div", "", ["row", "input-field"], appDiv)
    
    parent = node
    node = buildElement("div", "", ["col", "d-flex", "align-items-center", "justify-content-end"], parent)
    
    let col = node
    node = buildElement("label", "", [], col)
    node.for = "zip-input"
    node.innerHTML = "ZIP:&nbsp;"

    node = buildElement("input", "zip-input", ["zip-input"], col)
    node.type = "text"
    zipInput = node

    node = buildElement("div", "", ["col", "d-flex", "align-items-center", "justify-content-start"], parent)
    col = node

    node = buildElement("button", "weather-button", ["btn", "btn-primary"], col)
    node.type = "button"
    node.textContent = "Get Weather"
    weatherButton = node

//     <div class="row d-flex flex-column weather-wrapper">
//       <div class="container d-flex flex-fill justify-content-start flex-column weather-box" id="weather-box">

    node = buildElement("div", "", ["row", "d-flex", "flex-column", "weather-wrapper"], appDiv)
    
    parent = node
    node = buildElement("div", "weather-box", ["container", "d-flex", "flex-fill", "justify-content-start", "flex-column", "weather-box"], parent)
    weatherBox = node
}

function buildWeatherDisplay() {
    //base parent is weatherBox

    clear_child_elements(weatherBox) //kill any existing elements

//         <div class="row">
//           <div class="container display-box">
//             <div class="row bg-warning my-border d-flex justify-content-center align-items-center text-center align-middle fs-4 fw-bold">City</div>
//             <div class="row bg-white my-sub-border d-flex justify-content-center align-items-center text-center align-middle my-text" id="city-box"></div>
//           </div>
//         </div>

    let node = buildElement("div", "", ["row"], weatherBox)
    let parent = node

    node = buildElement("div", "", ["container", "display-box"], parent)
    parent = node

    node = buildElement("div", "", heading_classes, parent)
    node.textContent = "City"

    node = buildElement("div", "city-box", text_classes, parent)
    cityBox = node

//         <div class="row">
//           <div class="container display-box">
//             <div class="row bg-warning my-border d-flex justify-content-center align-items-center text-center align-middle fs-4 fw-bold">Temperature</div>
//             <div class="row bg-white my-sub-border">
//               <div class="col-4 d-flex justify-content-center align-items-center text-center align-middle my-text" id="k-box"></div>
//               <div class="col-4 d-flex justify-content-center align-items-center text-center align-middle my-text border-center" id="c-box"></div>
//               <div class="col-4 d-flex justify-content-center align-items-center text-center align-middle my-text" id="f-box"></div>
//             </div>
//           </div>
//         </div>

    node = buildElement("div", "", ["row"], weatherBox)
    parent = node

    node = buildElement("div", "", ["container", "display-box"], parent)
    parent = node

    node = buildElement("div", "", heading_classes, parent)
    node.textContent = "Temperature"

    node = buildElement("div", "", ["row", "bg-white", "my-sub-border"], parent)
    parent = node

    const temp_classes = ["col-4", "d-flex", "justify-content-center", "align-items-center", "text-center", "align-middle", "my-text"]
    node = buildElement("div", "k-box", temp_classes, parent)
    kBox = node

    node = buildElement("div", "c-box", temp_classes, parent)
    cBox = node
    cBox.classList.add("border-center") //extra class

    node = buildElement("div", "f-box", temp_classes, parent)
    fBox = node

//         <div class="row">
//           <div class="container display-box">
//             <div class="row bg-warning my-border d-flex justify-content-center align-items-center text-center align-middle fs-4 fw-bold">Condition</div>
//             <div class="row bg-white my-sub-border d-flex justify-content-center align-items-center text-center align-middle my-text text-capitalize" id="condition-box"></div>
//           </div>
//         </div>

    node = buildElement("div", "", ["row"], weatherBox)
    parent = node

    node = buildElement("div", "", ["container", "display-box"], parent)
    parent = node

    node = buildElement("div", "", heading_classes, parent)
    node.textContent = "Condition"

    node = buildElement("div", "condition-box", text_classes, parent)
    node.classList.add("text-capitalize")
    conditionBox = node

    buildIconBox()
}

function buildIconBox() {
//         <div class="row">
//           <div class="container display-box">
//             <div class="row bg-warning my-border d-flex justify-content-center align-items-center text-center align-middle fs-4 fw-bold">Other Info</div>
//             <div class="row bg-white my-sub-border d-flex justify-content-center align-items-center text-center align-middle my-text" id="icon-box"></div>
//           </div>
//         </div>

    let node = buildElement("div", "", ["row"], weatherBox)
    let parent = node

    node = buildElement("div", "", ["container", "display-box"], parent)
    parent = node

    node = buildElement("div", "", heading_classes, parent)
    node.textContent = "Other Info"

    node = buildElement("div", "icon-box", text_classes, parent)
    iconBox = node
}

async function getWeather() {
    //grab the info from zipInput, convert it to a number for a zip code
    let zip = zipInput.value
    console.log("ZIP Entered: " + zip)

    const country = "US"

    //ping OpenWeather to convert the zip code into latitude and longitude
    const locationData = await fetchLocation(zip, country);
    //data should be an Object with the following keys: zip, name, lat, lon, country
    
    //validate our location data
    if (locationData.cod) { //"cod" is their error property, if this is missing, then it's undefined, false, and fine
        console.error("Bad ZIP code!")
        clear_child_elements(weatherBox) //unbuild
        buildIconBox() //rebuild
        showError("Bad ZIP code! Check what you've entered and try again!")
        return
    }

    const city = locationData.name
    const latitude = locationData.lat
    const longitude = locationData.lon

    //once we have our lat/lon, ping OpenWeather to get the weather data for the current moment
    const weatherData = await fetchWeather(latitude, longitude);
    //data should be an Object with a whole mess of information, the important ones are city, temp, condition, and the icon

    buildWeatherDisplay()

    const temperature = weatherData.main.temp //kelvin by default, is a string
    const condition = weatherData.weather[0].description //grabs a more precise description, eg "light rain"
    const icon = weatherData.weather[0].icon
    
    console.log("City: " + city)
    console.log("Temperature: " + temperature)
    console.log("Condition: " + condition)
    console.log("Icon: " + icon)

    cityBox.textContent = city
    fillTemperature(temperature)
    conditionBox.textContent = condition
    fillImage(icon)
}

function showError(message) {
    //delete any existing children of iconBox
    clear_child_elements(iconBox)

    //change text content to the message
    iconBox.textContent = message
}

function clear_child_elements(parent_element) {
    // clears the child elements of a given element
  
    const node_list = Array.from(parent_element.childNodes); //grab a copy of the array to iterate across
    node_list.forEach((element) => element.remove());
}

function fillImage(iconCode) {
    //URL is https://openweathermap.org/img/wn/${iconCode}@2x.png
    
    //delete any existing children of iconBox
    clear_child_elements(iconBox)
    iconBox.textContent = "" //empty text content if there's an error

    //and then add an image element to it
    let node = document.createElement("img")
    node.classList.add("my-icon")
    node.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    iconBox.appendChild(node)
}

function fillTemperature(temperature) {
    //needs to fill in K, C, and F
    //comes as kelvin by default
    
    console.log("Temperature: " + temperature)

    const celsius = Math.round(temperature - 273.15) //K to C
    const fahrenheit = Math.round((9/5) * (temperature - 273) + 32) //K to F
    const kelvin = Math.round(temperature) //just need to round

    cBox.textContent = celsius + " C"
    fBox.textContent = fahrenheit + " F"
    kBox.textContent = kelvin + " K"
}

async function fetchLocation(zip, country) {
    //API call made with http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
    const apiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${country}&appid=${API_key}`

    try {
        const response = await fetch(apiUrl) 
        const data = await response.json()
        console.log('Location data: ', data)
        return data
    } catch (error) {
        console.log('Error: ', error)
    }
}

async function fetchWeather(latitude, longitude) {
    //API call made with https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`

    try {
        const response = await fetch(apiUrl) 
        const data = await response.json()
        console.log('Weather data: ', data)
        return data
    } catch (error) {
        console.log('Error: ', error)
    }

}

init()