// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



$(document).ready(function (){
  $('<h1>').attr('id', 'zip-code').text('Zip Code').appendTo('div#zip');
  $('<input>').attr({
    type: 'text',
    id: 'location'
  }).appendTo('div#locale');
});

renderGenres(genres);
renderMoods(moods);


