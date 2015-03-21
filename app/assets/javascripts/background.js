var changeBackgroundBasedOnTimeOfDay = function() {
  var date    = new Date;
  var minutes = date.getMinutes();
  var hour    = date.getHours();
  var rValue, gValue, gValue, timePassed;

  var totalMinutes = (hour * 60) + minutes;

  // between midnight and 3 am
  if (0 < totalMinutes && totalMinutes <= 180){
    rValue = 0 + (totalMinutes / 1.8);
    gValue = 50 + (totalMinutes / 1.8);
    gValue = 107 + (totalMinutes / 1.8);
  // between 3 am and 6 am
  } else if (180 < totalMinutes && totalMinutes <= 360) {
    timePassed = 180 - totalMinutes;
    rValue = 0 + (totalMinutes / 1.8);
    gValue = 150 - (timePassed / 2.432432);
    bValue = 207 - (timePassed * 0.266666);
  //between 6am and 4pm
  } else if (360 < totalMinutes && totalMinutes <= 960) {
    timePassed = 360 - totalMinutes;
    rValue = 200 + (timePassed * .333333);
    gValue = 224 + (timePassed * .166666);
    bValue = 255;
  // between 4 pm and midnight
  } else {
    timePassed = 960 - totalMinutes;
    rValue = 0;
    gValue = 124 + (timePassed * 0.154166);
    bValue = 255 + (timePassed * 0.308333);
  }

  $('body').attr('style', 'background:rgba(' + parseInt(rValue) + ',' + parseInt(gValue) + ',' + parseInt(bValue) + ',0.75);')
}

$(document).ready(function(){
  changeBackgroundBasedOnTimeOfDay();

  setInterval(changeBackgroundBasedOnTimeOfDay, 300000);
})




