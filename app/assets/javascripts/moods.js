// moods array to create buttons from
var moods = ['Party', 'Lively', 'Passionate', 'Reflective', 'Trippy', 'Happy', 'Sad', 'Soothing'];

function renderMoods(ary){
 $(ary).each(function(){

  //create a label element with a button id based on mood
  var label = $('<label for = "'+ this + '_button"> '+ this + '</label>')
  //create a radiobutton  with a button with a value of genre

  var radioBox  = $('<input type= "radio" class="mood" id = "'+ this + '_button"  name = "mood" value= "'+ this + '">')
  //add button to list
  $('#moods-list').append(label).append(radioBox);

  // add an event listener to radio buttons
  radioBox.on('change', getPlaylist)

 });
}

function getPlaylist(){
  var mood = this.id.split('_')[0].toLowerCase()

  $.ajax({
    url:      '/',
    type:     'get',
    dataType: 'json',
    data:     {mood: mood}
  }).done(function(data){
    // console.log(data);
    // for (var i=0, len = data.songs.length; i<len; i++){
    //   debugger
    //   data.songs[i]
    //   var spotifyPlayer = $('<iframe>')
    //    src="https://embed.spotify.com/?uri=spotify%3Atrack%3A3HL3Rh5ZnAxd3Uzhm9c9ti" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    // }

     $('<iframe>').appendTo($(window))
  })
}

