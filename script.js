const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const mainContainer = document.querySelector(".main-container");

const weatherInfoSection = document.querySelector(".weatherinfo");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const apiKey = "40d754e7cb1e1d72032ddab552dcd093";

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

cityInput.addEventListener("input", () => {
  if (cityInput.value.trim() !== "") {
    cityInput.parentElement.classList.add("active");
  } else {
    cityInput.parentElement.classList.remove("active");
  }
});

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
    cityInput.parentElement.classList.remove("active");
  }
});
cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
    cityInput.parentElement.classList.remove("active");
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

function getweatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  cityInput.disabled = true;
  searchBtn.disabled = true;

  weatherInfoSection.classList.remove("show");

  const weatherData = await getFetchData("weather", city);

  cityInput.disabled = false;
  searchBtn.disabled = false;

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  // console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  currentDateTxt.textContent = getCurrentDate();

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  humidityValueTxt.textContent = humidity + " %";
  conditionTxt.textContent = main;
  windValueTxt.textContent = Math.round(speed * 1.60934) + "km/h";
  weatherSummaryImg.src = `assets/weather/${getweatherIcon(id)}`;

  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);

  setTimeout(() => {
    weatherInfoSection.classList.add("show");
  }, 1000);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  // console.log(forecastsData);

  forecastItemsContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    // console.log(forecastWeather);

    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastWeather);
    }
  });

  async function updateForecastsItems(weatherData) {
    const {
      dt_txt: date,
      weather: [{ id }],
      main: { temp },
    } = weatherData;

    const dateTaken = new Date(date);
    const options = {
      day: "2-digit",
      month: "short",
    };

    const dateResult = dateTaken.toLocaleDateString("en-US", options);
    const forcastItem = ` <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img
              src="assets/weather/${getweatherIcon(id)}"
              alt=""
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
          </div>`;

    forecastItemsContainer.insertAdjacentHTML("beforeend", forcastItem);
    // console.log(weatherData);
  }
}
function showDisplaySection(sectionToShow) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  sectionToShow.style.display = "flex";

  if (
    sectionToShow === weatherInfoSection ||
    sectionToShow === notFoundSection
  ) {
    mainContainer.classList.add("expanded");
  } else {
    mainContainer.classList.remove("expanded");
  }
  setTimeout(() => {
    sectionToShow.classList.add("show");
  }, 200);
}
