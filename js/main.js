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

const weatherBox = document.getElementById("weather-box");
const weatherButton = document.getElementById("weather-button");
const zipInput = document.getElementById("zip-input");

let cityBox = document.getElementById("city-box");

let temperatureBox = document.getElementById("temperature-box");
let kBox = document.getElementById("k-box");
let cBox = document.getElementById("c-box");
let fBox = document.getElementById("f-box");

let conditionBox = document.getElementById("condition-box");
let iconBox = document.getElementById("icon-box");

export function init() {
    console.log("Initializing.")
    weatherButton.addEventListener("click", getWeather);
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
        showError("Bad ZIP code! Check what you've entered and try again!")
        return
    }

    const city = locationData.name
    const latitude = locationData.lat
    const longitude = locationData.lon

    //once we have our lat/lon, ping OpenWeather to get the weather data for the current moment
    const weatherData = await fetchWeather(latitude, longitude);
    //data should be an Object with a whole mess of information, the important ones are city, temp, condition, and the icon

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