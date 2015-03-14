module SongsHelper

  # to create the link to get a list of songs from echonest based on a mood
  def create_echonest_url(mood)
    query_params = "?" + URI.encode_www_form({
      api_key: ENV["ECHONEST_API_KEY"],
      mood:    mood
    })
    "http://developer.echonest.com/api/v4/song/search" + query_params + "&bucket=id:spotify&bucket=tracks"
  end

  # to actually hit the API and store the songs
  def find_songs_by_mood(mood)
    link = create_echonest_url(mood)
    response = HTTParty.get(link)
  end

  def get_songs(mood)
    response = find_songs_by_mood(mood)
    spotify_ids = response["response"]["songs"].map do |song|
      if (!song["tracks"].empty?) && (song["artist_name"] != nil) && (song["title"] != nil)
        { artist:     song["artist_name"],
          title:      song["title"],
          spotify_id: song["tracks"][0]["foreign_id"]
        }
      end
    end
    spotify_ids.compact
  end

end








