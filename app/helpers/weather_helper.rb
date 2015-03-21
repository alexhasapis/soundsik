module WeatherHelper


  def sun_position(sunrise, sunset)
    unix_time = Time.now.to_i
    if unix_time > sunset
      @time_of_day = "Night"
    elsif unix_time < sunset && unix_time > sunrise
      @time_of_day = "Day"
    else
      @time_of_day = "Night"
    end
  end

  def weather_info(weather)
    @weather = weather
    @location_weather = weather["weather"].first["main"]
    @location_temp = (1.8 * (weather["main"]["temp"] - 273) + 32).to_i
  end

  def valid_zip(zip_code)
    weather_data = HTTParty.get("http://api.openweathermap.org/data/2.5/weather?q=#{zip_code}&APPID=#{OPEN_WEATHER_KEY}")
    if weather_data["sys"]["country"] != "US"
      flash[:notice] = "We're having connection issues. Please try again."
    else
      weather_info(weather_data)
      sun_position(weather_data["sys"]["sunrise"], weather_data["sys"]["sunset"])
    end
  end

  def weather_coordinates(lat, long)
    puts "***************************"
    puts "ENTERING weather_coordinates METHOD"
    puts "***************************"

    binding.pry
    weather_data = HTTParty.get("http://api.openweathermap.org/data/2.5/weather?lat=#{lat}&lon=#{long}&APPID=#{OPEN_WEATHER_KEY}")
    puts "Weather Data Response: #{weather_data}"

    if weather_data["sys"]["country"] != "US"
      flash[:notice] = "We're having connection issues. Please try again."
    else
      weather_info(weather_data)
      sun_position(weather_data["sys"]["sunrise"], weather_data["sys"]["sunset"])
    end
  end

  def choose_weather_icon(location_weather)
    puts "***************************"
    puts "ENTERING choose_weather_icon METHOD"
    puts "***************************"

    case location_weather
    when "Thunderstorm", "Drizzle", "Rain", "Extreme"
      type_of_weather = "Rain"
    when "Snow", "Atmosphere"
      type_of_weather = "Snow"
    when "Clouds"
      if @weather["weather"].first["description"] == "clear sky"
        type_of_weather = "Clear"
      else
        type_of_weather = "Cloudy"
      end
    end
    @type_of_weather = type_of_weather
  end

end
