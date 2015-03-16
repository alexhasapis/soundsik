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

end
