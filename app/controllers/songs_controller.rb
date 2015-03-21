class SongsController < ApplicationController
  include SongsHelper
  include WeatherHelper

  def index
    mood  = params[:mood] ? params[:mood] : ""
    genre = params[:genre] ? params[:genre] : ""
    if mood != ""
      songs = get_spotify_songs(genre, mood)
    end
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

    choose_weather_icon(@location_weather)

    data = {
      type_of_weather: @type_of_weather,
      time_of_day: @time_of_day,
      location_temp: @location_temp,
      city: @city
    }

    render json: data
  end



  def weather_via_coordinates
    lat = params[:latitude]
    long = params[:longitude]
    print "Latitude: #{lat},"
    puts "Longitude: #{long}"

    puts "***************************"
    puts "Hitting the weather API..."
    weather_coordinates(lat, long)

    puts "***************************"
    puts "Choosing Weather Icon"
    choose_weather_icon(@location_weather)


    data = {
      type_of_weather: @type_of_weather,
      time_of_day: @time_of_day,
      location_temp: @location_temp,
      city: @city
    }
    puts "***************************"
    puts "The Returned Data: #{data}"

    render json: data
  end

end
