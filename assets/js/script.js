var APIkey = "b2604b2647ad3e126a9c4584d0e61251";
var userFormEl = document.querySelector("#user-form");
var cityEl = document.querySelector(".city-name");
var formInputEl = document.querySelector(".form-input");
var tempEl = document.querySelector("#temperature");
var iconEl = document.querySelector(".icon");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var UVEl = document.querySelector("#uv-index");
var dailyForecast = document.querySelector("#daily-forecast");
var searchHistoryEl = document.querySelector(".searchHistory");
var prebtn = document.querySelector(".prebtn");

var cities = JSON.parse(localStorage.getItem("cities")) || [];
var todayDate = moment().format("L");
var cityIndex = 0;

// init page
function startPage() {
  let citiesStorage = localStorage.getItem("cities");
  if (citiesStorage) {
    cities = JSON.parse(citiesStorage);
    console.log(cities);
    renderCities();
  }
}

// search and save city then pass value to api
function searchCity(event) {
  event.preventDefault();
  searchResult = formInputEl.value.trim("");

  if (searchResult) {
    saveCity(searchResult);
    getWeather(searchResult);
  } else {
    alert("Please enter a city name");
  }
}

// get weather function
function getWeather(searchResult) {
  city = searchResult.target || searchResult;
  city = searchResult.target ? city.getAttribute("data-city") : searchResult;

  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&cnt=20&units=imperial&appid=" +
    APIkey;

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      this.displayWeather(data);
      var lat = data.city.coord.lat;
      var lon = data.city.coord.lon;

      fiveDayForcast(lat, lon);
    });
  });
}

//show current weather info to card
function displayWeather(data) {
  var { name } = data.city;
  var { icon } = data.list[0].weather[0];
  var { temp, humidity } = data.list[0].main;
  var { speed } = data.list[0].wind;
  console.log(name, icon, temp, humidity, speed);

  //current weather display on page
  cityEl.innerHTML = name + " (" + todayDate + ")";
  tempEl.innerHTML = temp + "F°";
  iconEl.src = "https://openweathermap.org/img/w/" + icon + ".png";
  windEl.innerHTML = speed + "MPH";
  humidityEl.innerHTML = humidity + "%";

  //UV index
  var UVapiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    data.city.coord.lat +
    "&lon=" +
    data.city.coord.lon +
    "&exclude=minutely,hourly,alerts&appid=" +
    APIkey;

  fetch(UVapiUrl).then(function (response) {
    response.json().then(function (data) {
      var { uvi } = data.current;
      UVEl.innerHTML = uvi;
    });
  });
}

// get 5 days weather info
function fiveDayForcast(lat, lon) {
  var fiveDayapi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" +
    APIkey;

  fetch(fiveDayapi).then(function (response) {
    response.json().then(function (data) {
      dailyForecast.innerHTML = "";
      data.daily.forEach((day, index) => {
        if (index === 0 || index > 5) {
          return;
        }
        var forecastDate = new Date(day.dt * 1000);
        var forecastTemp = day.temp.day;
        var forecastWind = day.wind_speed;
        var forecastHumidity = day.humidity;
        var forecastIcon =
          "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
        var forecastCard = document.createElement("div");
        var cardDate = document.createElement("h3");
        var cardIcon = document.createElement("img");
        var cardTemp = document.createElement("p");
        var cardWind = document.createElement("p");
        var cardHumidity = document.createElement("p");

        //append card to container
        forecastCard.setAttribute("class", "card");
        dailyForecast.append(forecastCard);

        cardIcon.setAttribute("src", forecastIcon);
        cardIcon.setAttribute("class", "card-icon");

        //append data to card
        forecastCard.append(cardDate);
        forecastCard.append(cardIcon);
        forecastCard.append(cardTemp);
        forecastCard.append(cardWind);
        forecastCard.append(cardHumidity);

        cardDate.innerHTML = new Intl.DateTimeFormat("en-US").format(
          forecastDate
        );
        cardIcon.innerHTML = forecastIcon;
        cardTemp.innerHTML = `Temp: ${forecastTemp}`;
        cardWind.innerHTML = `Wind: ${forecastWind}`;
        cardHumidity.innerHTML = `Humidity: ${forecastHumidity}`;
      });
    });
  });
}

// save search to local storage
function saveCity(searchResult) {
  if (!cities.includes(searchResult)) {
    cities.push(searchResult);
  }
  localStorage.setItem("cities", JSON.stringify(cities));
  renderCities();
}

// display search history with clickable button
function renderCities() {
  searchHistoryEl.textContent = "";
  cities = cities.slice(Math.max(cities.length - 5, 0));
  cities.forEach((city) => {
    var btn = document.createElement("button");
    searchHistoryEl.prepend(btn);
    btn.setAttribute("class", "btn");
    btn.setAttribute("data-city", city);

    btn.innerHTML = city;
  });
}

userFormEl.addEventListener("submit", searchCity);

searchHistoryEl.addEventListener("click", () => getWeather(event));

startPage();
