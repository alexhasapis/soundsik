// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


function loadSoundik(){
  $('<h1>').attr('id', 'zip-code').text('Enter your zip code').appendTo('div#zip-text');
  $('<input>').attr({
    type: 'text',
    id: 'location',
    placeholder: 'Enter Zip Code'
  }).appendTo('div#zip-input');
}


$(document).ready(loadSoundik);

renderGenres(genres);
renderMoods(moods);


