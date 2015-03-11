var genres = ["Rock", "Pop", "R&B", "Hiphop", "Indie/Alternative", "EDM", "Country", "Jazz", "Classical"]




// iterate over the genre array 
$(genres).each(function (i, genre) {
  // create a button from the array.
  var $newButton = $('<button>').text(genre);
  // append the button to the body
   $("body").append($newButton)
});



// // $(buttonText).each(function(i, buttonText) {
// //   var $newButton = $('<button>').text(buttonText)
// //   $(".wrapper").append($buttonText)
// //     // $newButton.on('click', someFunctionYouWrite);

// // });
