class SongsController < ApplicationController
  def index
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
    case location_weather
    when location_weather = "Thunderstorm" || location_weather = "Drizzle" || location_weather = "Rain" || location_weather = "Extreme"
      type_of_weather = "Rain"
    when location_weather = "Snow" || location_weather = "Atmosphere"
      type_of_weather = "Snow"
    when location_weather = "Clouds" && weather["weather"].first["description"] != "clear sky"
      type_of_weather = "Cloudy"
    when weather["weather"].first["description"] == "clear sky"
      type_of_weather = "Clear"
    end
    @time_of_day = time_of_day
    @type_of_weather = type_of_weather
    @location_temp = location_temp
  end

  private

  def sun_position(sunrise, sunset)
    unix_time = Time.now.to_i
    if unix_time > sunset
      time_of_day = "Night"
    elsif unix_time < sunset && unix_time > sunrise
      time_of_day = "Day"
    else
      time_of_day = "Night"
    end
  end

  def weather_info(weather)
    location_weather = weather["weather"].first["main"]
    location_temp = 1.8 * (weather["main"]["temp"] - 273) + 32
  end

  def get_weather(location)
    if OpenWeather::Current.city(
      "#{Geocoder.search(location).first.data["address_components"][1]["long_name"]},
      #{Geocoder.search(location).first.data["address_components"][3]["long_name"]}") == nil
    else
      weather = OpenWeather::Current.city(
        "#{Geocoder.search(location).first.data["address_components"][1]["long_name"]},
        #{Geocoder.search(location).first.data["address_components"][3]["long_name"]}")
    end
    weather_info(weather)
    sun_position(weather["sys"]["sunrise"], weather["sys"]["sunset"])
  end

  def valid_zip(zip_code)
    if Geocoder.search(zip_code).first.data["address_components"][4]["short_name"] == nil
      flash[:notice] = "We're having connection issues. Please try again."
    elsif Geocoder.search(zip_code).first.data["address_components"][4]["short_name"] != "US"
      flash[:notice] = "Please enter a valid US zip code"
    else
      get_weather(Geocoder.search(zip_code).first.data["address_components"])
    end
  end
end
