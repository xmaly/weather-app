interface WeatherData {
  condition: string;
  city: string;
  country: string;
  temperature: {
    c: number;
    f: number;
  };
  feelsLike: {
    c: number;
    f: number;
  };
  humidity: string;
  wind: string;
}

interface WeatherApiData {
  location: {
    name: string;
    country: string;
  };
  current: {
    condition: {
      text: string;
    };
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    humidity: string;
    wind_kph: string;
  };
}

let myData: WeatherData | undefined = undefined;
let unit = "C";
const inputSearch = document.querySelector("input.search") as HTMLInputElement;

inputSearch?.addEventListener("keyup", (e) => {
  if ((e as KeyboardEvent).key === "Enter") {
    e.preventDefault();
    handleSearch(inputSearch.value);
    inputSearch.value = "";
  }
});

const handleSearch = (value: string) => {
  callWeatherApi(value)
    .then((data) => {
      if (data) {
        myData = processJson(data);
        if (myData) {
          displayData(myData);
        }
      }
    })
    .catch((error) => console.log(error));
};

const callWeatherApi = async (location: string) => {
  const errorMsg = document.querySelector(".error-msg") as HTMLDivElement;
  if (!errorMsg) {
    console.error("Error message element not found");
    return null;
  }

  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=2cb54fa1ffff4f8ebdf154631232009&q=${location}`,
    { mode: "cors" }
  );
  if (!response.ok) {
    errorMsg.style.opacity = "1";
    errorMsg.innerHTML = `Given city wasn't found.`;
    return null;
  }
  errorMsg.style.opacity = "0";
  errorMsg.innerHTML = "";
  const data = await response.json();

  return data;
};

const processJson = (json: WeatherApiData) => {
  if (!json) {
    return;
  }

  const location = json["location"];
  const current = json["current"];

  myData = {
    condition: current["condition"]["text"],
    city: location["name"],
    country: location["country"],
    temperature: {
      c: Math.round(current["temp_c"]),
      f: Math.round(current["temp_f"]),
    },
    feelsLike: {
      c: Math.round(current["feelslike_c"]),
      f: Math.round(current["feelslike_f"]),
    },
    humidity: current["humidity"],
    wind: current["wind_kph"],
  };

  return myData;
};

const displayData = (data: WeatherData) => {
  const city = document.querySelector(".city");
  const temperature = document.querySelector(".temperature");
  const humidity = document.querySelector(".humidity-value");
  const condition = document.querySelector(".condition");
  const feelsLike = document.querySelector(".feels-like-value");
  const wind = document.querySelector(".wind-value");

  if (!city || !temperature || !humidity || !condition || !feelsLike || !wind) {
    console.error("One or more elements not found");
    return;
  }

  city.textContent = `${data.city}, ${data.country}`;
  humidity.textContent = `${data.humidity}%`;
  condition.textContent = data.condition;
  wind.textContent = `${data.wind} kph`;

  const temperatureValue =
    unit === "F" ? data.temperature.f : data.temperature.c;
  const feelsLikeValue = unit === "F" ? data.feelsLike.f : data.feelsLike.c;

  temperature.innerHTML = `${temperatureValue}<span class="bigger-index"><sup>°${unit}</sup></span>`;
  feelsLike.innerHTML = `${feelsLikeValue}<span class="smaller-index"><sup> °${unit}</sup></span>`;
};

var temperatureToggle = document.querySelector(
  "#temperature-toggle"
) as HTMLInputElement;

temperatureToggle?.addEventListener("click", () => {
  if (temperatureToggle?.checked) {
    unit = "F";
  } else {
    unit = "C";
  }
  if (myData) {
    displayData(myData);
  }
});

handleSearch("Brno");
