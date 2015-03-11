// moods array to create buttons from
var moods = ['Party', 'Lively', 'Passionate', 'Reflective', 'Trippy', 'Happy', 'Sad', 'Soothing'];

function renderMoods(ary){
 $(ary).each(function(){

   //create an li element with a button class and id of mood
  var label = $('<label for = "'+ this + '_button"> '+ this + '</label>')
  var radioBox  = $('<input type= "radio" id = "'+ this + '_button"  name = "mood" value= "'+ this + '">') 

   $('#moods-list').append(label).append(radioBox);
 });
}

