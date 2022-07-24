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

var todayDate = moment().format("MM/DD/YYYY");
var cityIndex = 0;

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
    });
  });
}

function displayWeather(data) {
  var name = searchResult.toUpperCase();
  var { icon } = data.list[0].weather[0];
  var { temp, humidity } = data.list[0].main;
  var { speed } = data.list[0].wind;
  console.log(name, icon, temp, humidity, speed);

  //current weather display on page
  cityEl.innerHTML = name + " (" + todayDate + ")";
  tempEl.innerHTML = temp + "F°";
  iconEl.src = "https://openweathermap.org/img/wn/" + icon + ".png";
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

function saveCity(searchResult) {
  if (!cities.includes(searchResult)) {
    cities.push(searchResult);
  }
  localStorage.setItem("cities", JSON.stringify(cities));
  renderCities();
}

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
