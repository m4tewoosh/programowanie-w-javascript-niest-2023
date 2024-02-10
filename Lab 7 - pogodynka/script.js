const form = document.getElementById("form");
const submitButton = document.getElementById("submitButton");
const weatherElement = document.getElementById("weather");

const cityInput = document.getElementById("cityInput");
const API_KEY = "4cfd4ba1c34f4042910ca3cf0d5e122b";

const fetchCityWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  const weather = await response.json();

  return weather;
};

const removeCity = (cityToRemove) => {
  const cities = JSON.parse(localStorage.getItem("cities"));
  const newCities = [...cities].filter((city) => city !== cityToRemove);
  localStorage.setItem("cities", JSON.stringify(newCities));

  while (weatherElement.firstChild) {
    weatherElement.removeChild(weatherElement.firstChild);
  }

  init();
};

const displayCityWeather = async (city) => {
  const weather = await fetchCityWeather(city);

  const {
    main: { temp, humidity },
    weather: weatherIcon,
  } = weather;

  const { icon } = weatherIcon[0];

  const cityWeatherWrapper = document.createElement("div");
  cityWeatherWrapper.className = "cityWeather";

  const cityNameElement = document.createElement("p");
  cityNameElement.innerHTML = city;
  cityWeatherWrapper.appendChild(cityNameElement);

  const temperatureElement = document.createElement("p");
  temperatureElement.innerHTML = `Temperatura: ${temp}°C`;
  cityWeatherWrapper.appendChild(temperatureElement);

  const humididtyElement = document.createElement("p");
  humididtyElement.innerHTML = `Wilgotność: ${humidity}%`;
  cityWeatherWrapper.appendChild(humididtyElement);

  const iconElement = document.createElement("img");
  iconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  cityWeatherWrapper.appendChild(iconElement);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Usuń miasto";
  removeButton.onclick = () => removeCity(city);

  cityWeatherWrapper.appendChild(removeButton);

  weatherElement.appendChild(cityWeatherWrapper);
};

const handleSubmit = (city) => {
  const firstCity = !localStorage.getItem("cities");

  if (firstCity) {
    const cities = [city];
    localStorage.setItem("cities", JSON.stringify(cities));
  } else {
    const cities = JSON.parse(localStorage.getItem("cities"));

    if (cities.length === 10) {
      alert("Masz juz 10 miast!");
      return;
    }

    const newCities = [...cities, city];
    localStorage.setItem("cities", JSON.stringify(newCities));
  }

  displayCityWeather(city);
};

submitButton.onclick = (e) => {
  const city = cityInput.value;

  if (!city) {
    alert("Brak miasta!");
    return;
  }

  cityInput.value = "";
  e.preventDefault();
  handleSubmit(city);
};

const init = () => {
  const cities = localStorage.getItem("cities");

  if (!cities) {
    return;
  }

  const parsedCities = JSON.parse(cities);

  parsedCities.forEach((city) => displayCityWeather(city));
};

init();
