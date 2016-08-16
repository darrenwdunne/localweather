# localweather
Local weather report (using geolocation)

## Description
This uses the geolocation features of HTML5 to automatically determine the browser's location.

It then 
- uses the resulting lat/lon to fetch a Google Map image of the location
- uses the Open Weather Map REST interface to fetch the current weather at that location
- displays an appropriate background image
- shows a Bootstrap popover with the current weather description, temp, and icon

## To Build
```
git clone ...
npm install
bower install
gulp && gulp serve
```
