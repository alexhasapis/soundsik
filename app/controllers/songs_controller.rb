class SongsController < ApplicationController
  def index
  end

  def create
    #Use Zip class method to validate location in US
    location = Zip.validate_zip(params[:zip_code])
    if location
      #either send the data back up or use it to go weather api call
      end
    else
      respond_to do |format|
        format.json {render json: nil}
      end
    end
  end

end
