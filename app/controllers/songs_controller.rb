class SongsController < ApplicationController
  include SongsHelper

  def index
    mood = params[:mood] ? params[:mood] : ""
    if mood != ""
      songs = get_songs(mood)
    end
    respond_to do |format|
      format.html
      format.json { render json: {songs: songs} }
    end
  end

end
