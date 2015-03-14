var latitude, longitude

// gets geolocation of user
window.navigator.geolocation.getCurrentPosition(function(data){
  latitude  = data.coords.latitude;
  longitude = data.coords.longitude;
  },
  function(error){console.log(error)
});
