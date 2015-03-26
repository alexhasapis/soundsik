// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function loadSoundsik(){
  $('<h3>').text('Location').appendTo('div#zip-text');
  $('<input>').attr({
    type: 'text',
    id: 'location',
    placeholder: 'Your Zip Code',
    maxlength: '5'
  }).appendTo('div#zip-input');
};

function warblrPanel(){
  $('#genres').empty();
  $('#moods').empty();
  $('.mood-genre-buttons').css({
    "border-color": "white",
    "border-style": "solid",
    "width": "300px",
    "height": "375px",
    "margin-top": "50px"
  });
  $('h3').css("margin-top", "75px")
  $('#zip-text').appendTo('.mood-genre-buttons');
  $('#zip-input').insertAfter('#zip-text');
};

// function warblrButton(name, height, width){
//   $('<button>').attr("id", name).text(name).css({
//     "border-color": "gray",
//     "border-style": "solid",
//     "height": height,
//     "width": width
//   });
// };


$(document).ajaxStart(function() {
  var target = document.getElementById('spinner')
  var spinner = new Spinner(opts).spin(target);
  console.log("working")
});

$( document ).ajaxComplete(function() {
  $('#spinner').empty();
});

$(document).ready(loadSoundsik);

