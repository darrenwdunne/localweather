var latlon;
var address;

$(document).ready(function() {
  console.log('ready!');
  updateMap();
  getLocation();
});

function getLocation() {
  showStatus('Determining your location...');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onLocSuccess, onLocError);
  } else {
    $('#inputLatLon').html('Geolocation not supported.');
  }
}

function onLocSuccess(position) {
  $('#inputLatLon').val(position.coords.latitude + ',' + position.coords.longitude);
  $('#inputCityNameWait').hide();
  latlon = position; // store it for later
  getCity(position);
}

function onLocError(error) {
  showError('Error: Your browser does not support geolocation. Using Raleigh, NC: ' + error.code);
  // use Raleigh 35.7796,-78.6382
  var position = {
    coords: {
      latitude: 35.7796,
      longitude: -78.6382
    }
  };
  $('#inputLatLon').val(position.coords.latitude + ',' + position.coords.longitude);
  $('#inputStreet').val('Raleigh, NC');
  $('#inputCityNameWait').hide();
  latlon = position; // store it for later
  getCity(position);
}

function getCity(position) {
  var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true';
  $.getJSON(url, onCitySuccess, onCityError);
}

function onCitySuccess(json) {
  showStatus('Location found.');
  address = json.results[0].formatted_address;
  $('#inputStreet').val(address);
  showPositionOnMap(latlon);
  getWeather(latlon);
}

function onCityError(error) {
  showError('Error Determining City: ' + error.code);
  // maybe google apis doesn't work on mobile? try to get weather anyway
  showPositionOnMap(latlon);
  getWeather(latlon);
}

function showPositionOnMap(position) {
  updateMap(position.coords.latitude, position.coords.longitude, 14);
}

function updateMap(lat, lon, zoom) {
  var url = getMapURL(lat, lon, zoom);
  $('#mapholder').html('<img src=\'' + url + '\'>');
}

function getMapURL(lat, lon, zoom) {
  if (zoom === undefined) {
    zoom = 1;
  }
  if (lat === undefined) {
    lat = 0;
  }
  if (lon === undefined) {
    lon = 0;
  }
  var url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lon + '&zoom=' + zoom + '&size=400x300&sensor=false';
  return url;
}


function getWeather(position) {
  showStatus('Retrieving Weather');

  $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&APPID=c09de18a26acbeecad5e6553158ac245&callback=', function(json) {
    showWeather(json);
  });
}

function showWeather(json) {
//  $('#myModal').modal('show');
  var contentHtml = buildWeatherHTML(json);
  var city=json.name;
  $('#status').popover({
    placement: 'bottom',
    title: '<div style="text-align:center; color:blue; font-size:12px;">'+city+'</div>',
    html: 'true',
    viewport: { 'selector': '#mapholder', 'padding': 0 },
    content: '<div id="popOverBox">'+contentHtml+'</div>'
  });
  $('#status').popover('show');

  if (json.weather[0].description.indexOf('rain')>0) {
    $('.jumbotron').css('background-image','url(https://pixabay.com/static/uploads/photo/2014/09/21/14/39/rain-455124_960_720.jpg)');
  } else if (json.weather[0].description.indexOf('cloud')>0) {
    $('.jumbotron').css('background-image','url(https://pixabay.com/static/uploads/photo/2013/10/16/10/17/blue-sky-196230_960_720.jpg)');
  } else {
    $('.jumbotron').css('background-image','url(https://pixabay.com/static/uploads/photo/2012/05/19/00/55/sun-49143_960_720.jpg)');
  }
  showStatus('');
}

function buildWeatherHTML(json) {
  var temp = json.main.temp; // kelvin
  var tempF = (temp*9/5 - 459.67).toFixed(1);
  var tempHtml = '<p class="text-center">'+tempF+'&#176; F</p>';
  var icon = 'http://openweathermap.org/img/w/'+json.weather[0].icon+'.png';
  var iconHtml = '<img class="center-block" src="'+icon+'"/>';
  var desc = '<h4 class="text-center">'+json.weather[0].description+'</h4>';
  return desc+iconHtml+tempHtml;
}

function showError(msg) {
  $('#error').html(msg);
  console.log(msg);
}

function showStatus(msg) {
  $('#status').html(msg);
}
