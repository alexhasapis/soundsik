function weather(data){
  $('div.weather').empty();
  $('<img>').attr('src', '/images/' + data.time_of_day + data.type_of_weather + '.png').appendTo('div.weather');
  $('<h1>').text(data.location_temp).appendTo('div.weather');
};
