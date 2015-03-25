var latitude, longitude

// gets geolocation of user
window.navigator.geolocation.getCurrentPosition(function(data){
  latitude  = data.coords.latitude;
  longitude = data.coords.longitude;
  $.ajax({
    method: 'POST',
    url: '/weather_via_coordinates',
    dataType: 'json',
    //send data down in params format
    data: {latitude: latitude, longitude: longitude}
    }).success(function(data){
      console.log(data)
      $('#moods-list').children().remove();
      $('#genres-list').children().remove();
      $('.mood-genre-buttons').empty();
      var weatherData = data;
      weather(weatherData);
      warblrPanel();
      $('<button>').attr("id", "Change Your Playlist").text("Change Your Playlist").css({
        "background-color": "white",
        "border-color": "black",
        "border-style": "solid",
        "height": "50px",
        "width": "70px",
        "float": "right"
      }).insertBefore("#zip-text");

      $('<button>').attr("id", "Genre").text("Genre").css({
        "background-color": "white",
        "border-color": "black",
        "border-style": "solid",
        "height": "60px",
        "width": "100px",
        "margin-top": "30px",
        "margin-left": "100px"
      }).appendTo('.mood-genre-buttons');

      $('<button>').attr("id", "Mood").text("Mood").css({
        "background-color": "white",
        "border-color": "black",
        "border-style": "solid",
        "height": "60px",
        "width": "100px",
        "margin-top": "30px",
        "margin-left": "100px"
      }).appendTo('.mood-genre-buttons');

      // warblrButton("Change Your Playlist", "30px", "60px").insertBefore('#zip-text');
      // warblrButton("Mood", "60px", "100px").insertAfter('#zip-location');
      // warblrButton("Genre", "60px", "100px").insertAfter('#Mood');
      // renderMoods(moods);
      // renderGenres(genres);
    })
  },
  function(error){console.log(error)
});


function weather(data){
  $('div.weather').empty();
  $('<div class="clearfix">').appendTo('div.weather')
  $('<img>').attr('src', '/images/' + data.time_of_day + data.type_of_weather + '.png').appendTo('div.clearfix');
  $('<h1>').text(data.location_temp + '\xB0').appendTo('div.clearfix');
  $('<h1>').text(data.city).appendTo('div.weather');
};
