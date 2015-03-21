describe('changeBackgroundBasedOnTimeOfDay', function(){

  // this is a spec
  it('returns true for Saturday', function(){
    expect( sleepIn('Saturday') ).toBe(true);
  });

  it('returns true for Sunday', function(){
    expect( sleepIn('Sunday') ).toBe(true);
  });

  it('returns false for Monday', function(){
    // pending("This spec won't run until we comment it out this line.");
    expect( sleepIn('Monday') ).toBe(false);
  });

  it('returns false for any work day', function(){
    var workday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var randomNumber = Math.floor(Math.random() * workday.length)
    var randomWorkday = workday[randomNumber];
    expect( sleepIn(randomWorkday) ).toBe(false);
  });

});
