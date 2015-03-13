// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


function loadSoundik(){
  $('<h1>').attr('id', 'title').text('Soundisk').appendTo('div#title');
  $('<h3>').text('Location').appendTo('div#zip-text');
  $('<input>').attr({
    type: 'text',
    id: 'location',
    placeholder: 'Your Zip Code',
    maxlength: '5'
  }).appendTo('div#zip-input');
}


$(document).ready(loadSoundik);

renderGenres(genres);
renderMoods(moods);


