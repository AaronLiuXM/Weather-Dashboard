var APIkey = "b2604b2647ad3e126a9c4584d0e61251";
var userFormEl = document.querySelector("#user-form");
var cityEl = document.querySelector(".city-name");
var formInputEl = document.querySelector(".form-input");
var tempEl = document.querySelector("#temperature");
var iconEl = document.querySelector(".icon");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var UVEl = document.querySelector("#uv-index");

// get weather function
function getWeather(city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIkey;

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      this.displayWeather(data);
    });
  });
}

function displayWeather(data) {
  var { name } = data;
  var { icon } = data.weather[0];
  var { temp, humidity } = data.main;
  var { speed } = data.wind;
  console.log(name, icon, temp, humidity, speed);

  //current weather display on page
  cityEl.innerHTML = name;
  tempEl.innerHTML = temp + "F°";
  iconEl.src = "https://openweathermap.org/img/wn/" + icon + ".png";
  windEl.innerHTML = speed + "MPH";
  humidityEl.innerHTML = humidity + "%";

  //UV index
  var UVapiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    data.coord.lat +
    "&lon=" +
    data.coord.lon +
    "&appid=" +
    APIkey;

  fetch(UVapiUrl).then(function (response) {
    response.json().then(function (uv) {
      var { uvi } = uv.current;
      UVEl.innerHTML = uvi;
    });
  });
}
userFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  var searchResult = formInputEl.value.trim("");

  if (searchResult) {
    getWeather(searchResult);
    cityEl.value = "";
  } else {
    alert("Please enter a city name");
  }
});
