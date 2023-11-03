var weatherInfo = document.getElementById("weather-info");
var btn = document.getElementById("btn");
var cityInput = document.getElementById("cityInput");

btn.addEventListener("click", function () {
    var city = cityInput.value;
    console.log(city);
    if (city == "") // empty city name
    {
        emptyCity();
        return;
    }

    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=4c1c22797d4a15471c45e0a099c7a0ee&units=metric');
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText);
        renderHTML(ourData);
    };
    ourRequest.send();
});

function emptyCity() {
    var htmlString = "<p>ERROR: please enter a city name.</p></br>"
    weatherInfo.insertAdjacentHTML('beforeend', htmlString);
}

function renderHTML(data) {
    var htmlString = "";
    var error = data.cod;
    if (error != "200")
    {
        if (error == "404")
        {
            htmlString += "<p>ERROR CODE "+ error + ". Can't find city name.</p>";
        }
        else htmlString += "<p>ERROR CODE "+ error +"</p>";
    }
    else
    {
        htmlString += "<p>The weather in " + data.name + " is " + data.weather[0].description + ".</br>The temperature is " + data.main.temp + "°C with a wind speed of " + data.wind.speed + "m/s.</p>";
    }

    weatherInfo.insertAdjacentHTML('beforeend', htmlString);
}