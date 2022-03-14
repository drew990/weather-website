# Open Weather Project

Website link - https://drew990.github.io/weather-website/

![ScreenShot](WeatherScreenshot.png)

# Description

In this project, you'll be able to type in any major cities you want and it'll pull up the current weather as well a 5 day forecast. This is done by getting the API from open weather as well displaying them by jQuery

## Frontend

What the user will see is a navigation bar that is an input that'll allow users to type in a city name to get the weather of it. It'll search once the button is clicked. If the city can't be found, a message will be displayed telling the user the city can't be found due to an error on their end or the system's end.

Below the user will see a history of cities they have looked up before and if they click on them as well, it'll re-search the city again and will display the current weather with temperature, wind speed, humidity, and UV index. Another feature is that it'll display the next 5-day forecast as displaying the same info as the current weather.

## Backend

Looking behind the scenes, it's powered by jQuery to make the code easier to read. We have two functions that are listening for a click when either searching for a city or wanting to revisit a previous city. When click, it'll get the city values to name as well if a new city, it'll save the city into the local storage. Once it has the value, it'll save it into the API and fetch the current weather. From the given information, it'll append the temperature, wind, UV index, and humidity. From there, it'll fetch the API again but for the 5-day forecast. It'll display the same info as the current weather.
