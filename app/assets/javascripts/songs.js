// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function loadSoundsik(){
  $('<h1>').attr('id', 'title').text('Soundsik').appendTo('div#title');
  $('<h3>').text('Location').appendTo('div#zip-text');
  $('<input>').attr({
    type: 'text',
    id: 'location',
    placeholder: 'Your Zip Code',
    maxlength: '5'
  }).appendTo('div#zip-input');
};

$(document).ajaxStart(function() {
  var target = document.getElementById('spinner')
  var spinner = new Spinner(opts).spin(target);
  console.log("working")
});

$( document ).ajaxComplete(function() {
  $('#spinner').empty();
});

$(document).ready(loadSoundsik);

