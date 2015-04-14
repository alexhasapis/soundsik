// moods array to create buttons from
var moods = ['Party', 'Lively', 'Passionate', 'Reflective', 'Trippy', 'Happy', 'Sad', 'Soothing'];

$(document).on("click", "button#Mood", function(){
  $('#moods').empty();
  $('#genres').empty();
  $('#moods').css({
    "position": "fixed",
    "top": "300px",
    "height": "160px",
    "left": "225px",
    "width": "550px"
  });

  $('.mood-genre-buttons').css("width", "800px");
  $('#zip-text').css("margin-left", "67.5px");
  $('#zip-text > h3').css({
    "text-align": "left",
    "margin-top": "35px"
    });
  $('#zip-input').css({
    "position": "fixed",
    "margin-left": "25px"
  });
  $('button#Mood').css({
    "background-color": "gray",
    "position": "fixed",
    "top": "300px",
    "margin-left": "50px"
  });
  $('button#Genre').css({
    "background-color": "white",
    "position": "fixed",
    "top": "400px",
    "margin-left": "50px"
  });
  $('#Playlist').text("Make A Playlist").css({
    "position": "fixed",
    "height": "30px",
    "width": "150px",
    "top": "512.5px",
    "left": "35px"
  }).insertAfter('button#Genre').on("click", function(){
   //test if a genre and mood button are clicked
  // $('body').on('click', function(e){
  // //grab all radio buttons that are checked
  // var checkedBoxes = $(':checked')
  // //if there is only 1 checked do nothing, otherwise...
  // if (checkedBoxes.length === 2){
  //   //grab the values of the genre and mood radios that are checked
  //   var genre = $('#genres-list input:checked').val();
  //   var mood = $('#moods-list input:checked').val();

  console.log(genre, mood);
  if (typeof genre !== 'undefined' && mood !== 'undefined') {
    // the variable is defined
    warblrPanel();
    $.ajax({
      url:      '/',
      type:     'get',
      dataType: 'json',
      data:     {mood: mood, genre: genre}
    }).done(function(data){
      $('.music-player').children().remove();
      var src = "https://embed.spotify.com/?uri=" + data.songs

      var spotifyPlayer = $('<iframe>');
      spotifyPlayer.attr('src', src).attr('frameborder', 0).attr('allowtransparency', true);
      $('.music-player').append(spotifyPlayer);
    });
  }
});
  renderMoods(moods);
});

function renderMoods(ary){
  $(ary).each(function(){
    $('<button>').attr({"class": "Mood", "id": this}).text(this).css({
      "background-color": "white",
      "border-color": "black",
      "border-style": "solid",
      "height": "60px",
      "width": "100px",
      "display": "inline-block",
      "margin": "10px"
      }).appendTo("#moods");
      // //create a label element with a button id based on mood
      // var label = $('<label for = "'+ this + '_button"> '+ this + '</label>')
      // //create a radiobutton  with a button with a value of genre
      // var radioBox  = $('<input type= "radio" class="mood" id = "'+ this + '_button"  name = "mood" value= "'+ this + '">')
      // //add button to list
      // $('#moods-list').append(label).append(radioBox);
  });
  $('button.Mood').on("click", function (){
    $('button.Mood').css("background-color", "white");
    $('button#Mood').text(this.innerHTML);
    mood = this.innerHTML
    this.style.backgroundColor = "gray";
  });
};