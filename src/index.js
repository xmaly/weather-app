var myData = "";
var unit = 'C';
const inputSearch = document.querySelector("input.search");

inputSearch.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        callWeatherApi(inputSearch.value);
    }
});

const callWeatherApi = async (location) => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=2cb54fa1ffff4f8ebdf154631232009&q=${location}`, {mode: 'cors'});
    const data = await response.json();
    myData = processJson(data);
    displayData(myData);
    return data;
};

const processJson = (json) => {
    const location = json["location"];
    const current = json["current"];

    const myData = {
        condition: current["condition"]["text"],
        city: location["name"],
        country: location["country"],
        temperature: {
            c: Math.round(current["temp_c"]),
            f: Math.round(current["temp_f"])
        },
        feelsLike: {
            c: Math.round(current["feelslike_c"]),
            f: Math.round(current["feelslike_f"])
        },
        humidity: current["humidity"]
    }

    return myData; 
};

const displayData = (data) => {
    var city = document.querySelector(".city");
    var temperature = document.querySelector(".temperature");
    var humidity = document.querySelector(".humidity-value");
    var condition = document.querySelector(".condition");
    var feelsLike = document.querySelector(".feels-like-value");
    var wind = document.querySelector(".wind-value");

    city.textContent = `${data.city}, ${data.country}`;
    temperature.innerHTML = `${data.temperature.c}<span class="bigger-index"><sup>°${unit}</sup></span>`;
    humidity.textContent = `${data.humidity}%`
    condition.textContent = data.condition;
    feelsLike.innerHTML = `${data.feelsLike.c}<span class="smaller-index"><sup> °${unit}</sup></span>`;
    wind.textContent = `${data.wind} kph`;
}

callWeatherApi("Brno").then(result => {
}).catch(error => console.log(error));

const updateUnits = (myData) => {
    if (unit == 'F') {
        temperature.innerHTML = `${myData.temperature.f}<span class="bigger-index"><sup>°${unit}</sup></span>`;
        feelsLike.innerHTML = `${myData.feelsLike.f}<span class="smaller-index"><sup> °${unit}</sup></span>`;
    } else {
        temperature.innerHTML = `${myData.temperature.c}<span class="bigger-index"><sup>°${unit}</sup></span>`;
        feelsLike.innerHTML = `${myData.feelsLike.c}<span class="smaller-index"><sup> °${unit}</sup></span>`;
    }
}

var temperatureToggle = document.querySelector("#temperature-toggle");

temperatureToggle.addEventListener("click", () => {
    if (temperatureToggle.checked) {
        unit = 'F';
    } else {
        unit = 'C';
    }

    displayData(myData);
});