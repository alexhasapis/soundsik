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

  private

  def weather_info(weather)

  end

  def get_weather(location)
    if OpenWeather::Current.city(
      "#{Geocoder.search("07079").first.data["address_components"][1]["long_name"]},
      #{Geocoder.search("07079").first.data["address_components"][3]["long_name"]}") == nil
    else
      weather = OpenWeather::Current.city(
        "#{Geocoder.search("07079").first.data["address_components"][1]["long_name"]},
        #{Geocoder.search("07079").first.data["address_components"][3]["long_name"]}")
    end
    weather_info(weather)
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
