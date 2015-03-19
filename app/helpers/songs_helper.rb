module SongsHelper

  # to create the link to get a list of artists from echonest based on a mood
  def create_echonest_artist_url(genre, mood)
    query_params = "?" + URI.encode_www_form({
      api_key: ECHONEST_API_KEY,
      mood:    mood.downcase,
      genre:   genre.downcase
    })
    "http://developer.echonest.com/api/v4/artist/search" + query_params + "&min_hotttnesss=.5&results=100"
  end



  #hit the API and store the seed artists
  def find_artists_by_mood(genre, mood)
    link = create_echonest_artist_url(genre, mood)
    artist_sample = []
    response = HTTParty.get(link)
    5.times do
      response["response"]["artists"].shuffle
      artist_sample.push(response["response"]["artists"].pop)
    end
    return artist_sample
  end

  def seed_playlist(artists, mood)
    query_params = "?" + URI.encode_www_form({
      api_key: ECHONEST_API_KEY
    })
    link = "http://developer.echonest.com/api/v4/playlist/static" + query_params + "&type=artist-radio&artist_id=#{artists[0]["id"]}&artist_id=#{artists[1]["id"]}&artist_id=#{artists[2]["id"]}&artist_id=#{artists[3]["id"]}&artist_id=#{artists[4]["id"]}&results=30"
    binding.pry
  end

  def get_spotify_songs(genre, mood)
    artist_response = find_artists_by_mood(genre, mood)
    spotify_ids = seed_playlist(artist_response, mood).map do |song|
      if (!song["tracks"].empty?) && (song["artist_name"] != nil) && (song["title"] != nil)
        # { artist:     song["artist_name"],
          # title:      song["title"],
          song["tracks"][0]["foreign_id"].split(":")[2]
        # }
      end
    end
    play_list_string = "spotify:trackset:PREFEREDTITLE:"
    spotify_ids.compact.each do |song|
      play_list_string = play_list_string + song + ","
    end
    play_list_string
  end

end








