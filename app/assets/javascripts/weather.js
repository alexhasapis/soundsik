var latitude, longitude

// gets geolocation of user
window.navigator.geolocation.getCurrentPosition(function(data){
  latitude  = data.coords.latitude;
  longitude = data.coords.longitude;
  $.ajax({
    type: 'POST',
    url: '/weather_via_coordinates',
    dataType: 'json',
    //send data down in params format
    data: {latitude: latitude, longitude: longitude}
    }).success(function(data){
      console.log(data)
      debugger
      $('#moods-list').children().remove();
      $('#genres-list').children().remove();
      var weatherData = data;
      weather(weatherData);
      renderMoods(moods);
      renderGenres(genres);
  })
  },
  function(error){console.log(error)
});


function weather(data){
  $('div.weather').empty();
  $('<img>').attr('src', '/images/' + data.time_of_day + data.type_of_weather + '.png').appendTo('div.weather');
  $('<h1>').text(data.location_temp).appendTo('div.weather');
};
