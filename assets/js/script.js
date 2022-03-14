console.log("Reading Script!");

var cityValue,
  allNames,
  cityName,
  API,
  detailAPI,
  text,
  date,
  historyArr = [];

//Capitalize each word
function capitalize_Words(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function saveSearch() {
  var Num,
    foundCity = false;

  //Checks through each city and if the city is there, it'll return
  for (let Num = 0; Num < historyArr.length; Num++) {
    // console.log("City Value: ", cityValue, " City Name: ", cityName);
    if (cityName === historyArr[Num]) {
      foundCity = true;
    }
  }

  if (foundCity == false) {
    //If to the max of 10 then it'll delete 9 and move every city up one
    if (historyArr.length === 10) {
      var lastCity;
      lastCity = historyArr[9];
      localStorage.removeItem(lastCity);

      $("#his9").remove();

      for (let i = historyArr.length; i > 0; i--) {
        historyArr[i + 1] = historyArr[i];
      }
    }

    console.log("Displaying new Button");
    //Will Display the city name in previous cities searched for
    $("#city-list").append("<button id=his" + Num + ">" + cityName + "</p>");
    //Puts value and name in local storage
    localStorage.setItem(cityName, cityValue);
  }
}

//Display the save search history
function getHistoryStorage() {
  //Loops through the local storage and displays it in the array so it can be display after
  for (let i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    historyArr[i] = key;
  }
  //Goes through each name in the array and appends them in <p>
  jQuery.each(historyArr, function (i, val) {
    $("#city-list").append("<button id=his" + i + ">" + val + "</button>");
  });
}

function searchCity() {
  var cityLon, cityLat;

  //Fills in the city value API
  API =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityValue +
    "&appid=7d65ba6254830bdb15ac499b220e2fa2&units=imperial";

  //Fetches the API
  fetch(API)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Will display error message if API can't be reached
      if (data.cod == 404) {
        $("#errorMessage").empty();
        $("#errorMessage")
          .append(
            "<p> There was an error looking for the city. Please recheck your spelling </p>"
          )
          .css("padding-top", "1rem");
      } else {
        //Saves the city that is searchable
        saveSearch();
        //Hides error message
        $("#errorMessage").empty();

        //Gets the lat and longitude to gather a 5 day forecast
        cityLon = data.city.coord.lon;
        cityLat = data.city.coord.lat;

        detailAPI =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=minutely,hourly&appid=7d65ba6254830bdb15ac499b220e2fa2&units=imperial";

        //From lat and longitude number, it'll get more info about it and will be in data
        fetch(detailAPI)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            //Empties the info if any info is in there
            $("#cityDetails").empty();

            let unix_timestamp = data.current.dt;
            var day = new Date(unix_timestamp * 1000);

            //Displays the city basics info
            $("#cityDetails").append(
              "<img src=http://openweathermap.org/img/wn/" +
                data.current.weather[0].icon +
                "@2x.png />" +
                "<div style=display:flex;align-items:center;padding:0.5rem;>" +
                "<h1>" +
                cityName +
                "</h1>" +
                "<h1 style=margin-left:1rem;>" +
                day.toDateString() +
                "</h1>" +
                "</div>" +
                "<h3> Temp: " +
                data.current.temp +
                "°F</h3>" +
                "<h3> Wind Speed: " +
                data.current.wind_speed +
                "MPH</h3>" +
                "<h3> Humidity: " +
                data.current.humidity +
                "%</h3>" +
                "<h3 class=uvi> UV Index: " +
                "<p id=uvi-display>" +
                data.current.uvi +
                "</p>" +
                "</h3>"
            );

            if (data.current.uvi <= 2) {
              $("#uvi-display").css({
                "background-color": "green",
                padding: "5px",
                color: "#fff",
                "margin-left": "1rem",
                "border-radius": "10px",
                width: "4rem",
                "text-align": "center",
              });
            } else if (3 <= data.current.uvi && data.current.uvi <= 5) {
              $("#uvi-display").css({
                "background-color": "yellow",
                padding: "5px",
                color: "var(--black)",
                "margin-left": "1rem",
                "border-radius": "10px",
                width: "4rem",
                "text-align": "center",
              });
            } else if (6 <= data.current.uvi && data.current.uvi <= 7) {
              $("#uvi-display").css({
                "background-color": "orange",
                padding: "5px",
                color: "#fff",
                "margin-left": "1rem",
                "border-radius": "10px",
                width: "4rem",
                "text-align": "center",
              });
            } else if (8 <= data.current.uvi && data.current.uvi <= 10) {
              $("#uvi-display").css({
                "background-color": "red",
                padding: "5px",
                color: "#fff",
                "margin-left": "1rem",
                "border-radius": "10px",
                width: "4rem",
                "text-align": "center",
              });
            } else {
              $("#uvi-display").css({
                "background-color": "Violet",
                padding: "5px",
                color: "#fff",
                "margin-left": "0.5rem",
                "border-radius": "10px",
                width: "4rem",
                "text-align": "center",
              });
            }

            //Clears all cards if any to display the new 5 day forecast
            $(".card").remove();

            //Gets day from data

            //Displays the 5 day forecast
            for (var i = 0; i < 5; i++) {
              // Gets the dt and converts it to a readable date
              unix_timestamp = data.daily[i].dt;
              day = new Date(unix_timestamp * 1000);

              $("#cityWeather").append(
                "<div class=card>" +
                  "<h3>" +
                  day.toDateString() +
                  "</h3>" +
                  "<img src=http://openweathermap.org/img/wn/" +
                  data.daily[i].weather[0].icon +
                  "@2x.png />" +
                  "<h4>Temp: " +
                  data.daily[i].temp.day +
                  "°F</h4>" +
                  "<h4>Wind: " +
                  data.daily[i].wind_speed +
                  "MPH</h4>" +
                  "<h4>Humidity: " +
                  data.daily[i].humidity +
                  "</h4>" +
                  "</div>"
              );
            }
          });
      }
    });
}

//Displays history that the user looked up
getHistoryStorage();

$("#his1,#his2,#his3,#his4,#his5,#his6,#his7,#his8,#his9,#his0").click(
  function (e) {
    //Saves text into cityValue
    cityValue = $(e.target).text();
    cityName = cityValue;
    //Any spaces will be filled with + in order to get the API
    cityValue = cityValue.split(" ").join("+");
    //Searches up the city weather
    searchCity();
  }
);

//Listens for a click on search
//Change this #search to button so when previous cities are also search, it'll automatically search for it
$("#search").click(function () {
  //Gets City value
  cityName = $("#city").val();
  //Trims white spaces
  cityValue = cityName.trim();
  //Any spaces will be filled with + in order to get the API
  cityValue = cityValue.split(" ").join("+");

  //Capitalize each word
  cityName = capitalize_Words(cityName);

  //Searches up the city weather
  searchCity();
});
