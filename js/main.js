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

    //validate the zip code to make sure it's valid, display an error if it isn't
    //TODO

    let country = "US"

    //ping OpenWeather to convert the zip code into latitude and longitude
    const locationData = await fetchLocation(zip, country);
    //data should be an Object with the following keys: zip, name, lat, lon, country
    
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
    fillTemperature(temperature)
    console.log("Condition: " + condition)
    console.log("Icon: " + icon)

    cityBox.textContent = city
    conditionBox.textContent = condition
    iconBox.textContent = icon

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