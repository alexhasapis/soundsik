//listens for the enter button to be pressed wth a zip code

$(function(){
  $('input#location').on('keydown', function(e){
    //only works if key pressed is enter
    if (e.keyCode === 13){
      //get value of field
      var zipCode = this.value;
      //ajax to our server for validation
      $.ajax({
        method: 'POST',
        url: '/zip_weather',
        dataType: 'json',
        //send data down in params format
        data: {zip_code: zipCode},
        success: function(data){
          console.log(data)
          $('#moods').empty();
          $('#genres').empty();
          var weatherData = data;
          weather(weatherData);
          warblrPanel();
          $('<button>').attr("id", "Playlist").text("Change Your Playlist").css({
            "background-color": "white",
            "border-color": "black",
            "border-style": "solid",
            "height": "50px",
            "width": "70px",
            "float": "right"
          }).insertBefore("#zip-text");

          $('<button>').attr("id", "Mood").text("Mood").css({
            "background-color": "white",
            "border-color": "black",
            "border-style": "solid",
            "height": "60px",
            "width": "100px",
            "margin-top": "30px",
            "margin-left": "100px"
          }).appendTo('.mood-genre-buttons');

          $('<button>').attr("id", "Genre").text("Genre").css({
            "background-color": "white",
            "border-color": "black",
            "border-style": "solid",
            "height": "60px",
            "width": "100px",
            "margin-top": "30px",
            "margin-left": "100px"
          }).appendTo('.mood-genre-buttons');

          // warblrButton("Mood", "60px", "100px").insertAfter('#zip-location');
          // warblrButton("Genre", "60px", "100px").insertAfter('#Mood');
          // renderMoods(moods);
          // renderGenres(genres);
        }
      });
    }
  });
});
