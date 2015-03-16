class SongsController < ApplicationController
  include SongsHelper

  def index
    mood  = params[:mood] ? params[:mood] : ""
    genre = params[:genre] ? params[:genre] : ""
    if mood != ""
      songs = get_songs(mood, "")
    elsif genre != ""
      songs = get_songs("", genre)
    end
      binding.pry
    respond_to do |format|
      format.html
      format.json { render json: {songs: songs} }
    end
  end

  def create
    #Use Zip class method to validate location in US
    location = Zip.validate_zip(params[:zip_code])
    if location
      # #either send the data back up or use it to go weather api call
      # end
    else
      respond_to do |format|
        format.json {render json: nil}
      end
    end
  end

  def zip_weather
    valid_zip(params[:zip_code])
    case @location_weather
    when @location_weather = "Thunderstorm" || location_weather = "Drizzle" || location_weather = "Rain" || location_weather = "Extreme"
      type_of_weather = "Rain"
    when @location_weather = "Snow" || location_weather = "Atmosphere"
      type_of_weather = "Snow"
    when @location_weather = "Clouds" && @weather["weather"].first["description"] != "clear sky"
      type_of_weather = "Cloudy"
    when @weather["weather"].first["description"] == "clear sky"
      type_of_weather = "Clear"
    end
    @type_of_weather = type_of_weather

    redirect_to root_path
  end

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
    @location_temp = 1.8 * (weather["main"]["temp"] - 273) + 32
  end

  def get_weather(location)
    # binding.pry
    if HTTParty.get("http://api.openweathermap.org/data/2.5/weather?q=
      #{location[1]["long_name"]}, #{location[3]["long_name"]}
      &APPID=5931f50a22af92b8b5294d2a09d5b876")== nil
    else
      weather = HTTParty.get("http://api.openweathermap.org/data/2.5/weather?q=
      #{location[1]["long_name"]}, #{location[3]["long_name"]}
      &APPID=5931f50a22af92b8b5294d2a09d5b876")
    end
    weather_info(weather)
    sun_position(weather["sys"]["sunrise"], weather["sys"]["sunset"])
  end

  def valid_zip(zip_code)
    # binding.pry
    if Geocoder.search(zip_code).first.data["address_components"][4]["short_name"] == nil
      flash[:notice] = "We're having connection issues. Please try again."
    elsif Geocoder.search(zip_code).first.data["address_components"][4]["short_name"] != "US"
      flash[:notice] = "Please enter a valid US zip code"
    else
      weather_data = Geocoder.search(zip_code)
      get_weather(weather_data.first.data["address_components"])
    end
  end

end
