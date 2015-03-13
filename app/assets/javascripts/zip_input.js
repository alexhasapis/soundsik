//listens for the enter button to be pressed wth a zip code

$(function(){
  $('input#location').on('keydown', function(e){
    //only works if key pressed is enter
    if (e.keyCode === 13){
      //get value of field
      var zipCode = this.value;
      //ajax to our server for validation
      $.ajax({
        method: 'POST',
        url: '/songs',
        dataType: 'json',
        //send data down in params format
        data: {zip_code: zipCode},
        success: function(data){
          if (data){
            //I'm thinking you can either ajax back down with the city + state 
            //for the weather call, or you can use this to trigger your change
          }
          else{
            //Alert user the zip code was invalid.  We can come up with a
            //better error show but this will do for now
            alert("That is not a valid zip code. Please try again");
          }
        }
      });
    }
  });
});