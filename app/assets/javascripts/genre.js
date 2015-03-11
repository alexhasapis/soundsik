var genres = ["Rock", "Pop", "R&B", "Hiphop", "Indie/Alternative", "EDM", "Country", "Jazz", "Classical"]



function renderGenres(ary){
 $(ary).each(function(){
  
   //create an li element with a button class and id of mood
  var label = $('<label for = "'+ this + '_button"> '+ this + '</label>')
  var radioBox  = $('<input type= "radio" id = "'+ this + '_button"  name = "genre" value= "'+ this + '">') 


   // var element = $('<button class="button" "mood" id='+this+'>').text(this);
   
   // element.attr('value', this).attr('name', this);
   
   //Add button to list
   $('#genres-list').append(label).append(radioBox);
 });
}

