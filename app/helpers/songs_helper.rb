module SongsHelper

 # to create the link to get a list of artists from echonest based on a mood
 def create_echonest_artist_url(genre, mood)
   query_params = "?" + URI.encode_www_form({
     api_key: ECHONEST_API_KEY,
     mood:    mood.downcase,
     genre:   genre.downcase
   })
   "http://developer.echonest.com/api/v4/artist/search" + query_params + "&min_hotttnesss=.5&min_familiarity=.68&results=60"
 end


 #hit the API and store the seed artists
 def find_artists_by_mood(genre, mood)
   link = create_echonest_artist_url(genre, mood)
   artist_sample = []
   response = HTTParty.get(link)
   5.times do
     response["response"]["artists"].shuffle!
     artist_sample.push(response["response"]["artists"].pop)
   end
   return artist_sample
 end

 #attempt to get a more responsive playlist despite echonest search limitations
 def seed_playlist(artists, mood)
   case mood
   when "Happy"
     song_selection = "valence-top"
     sort = "danceability-asc"
   when "Party"
     song_selection = "danceability-top"
     sort = "energy-asc"
   when "Sad"
     song_selection = "valence-bottom"
     sort = "valence-asc"
   when "Passionate"
     song_selection = "energy-top"
     sort = "valence-asc"
   when "Reflective"
     song_selection = "acousticness-top"
     sort = "valence-asc"
   when "Trippy"
     song_selection = "acousticness-bottom"
     sort = "danceability-asc"
   when "Lively"
     song_selection = "tempo-top"
     sort = "energy-asc"
   when "Soothing"
     song_selection = "energy-bottom"
     sort = "tempo-desc"
   end

   query_params = "?" + URI.encode_www_form({
     api_key: ECHONEST_API_KEY,
     song_selection: song_selection
   })
   link = "http://developer.echonest.com/api/v4/playlist/static" + query_params + "&type=artist-radio&artist_id=#{artists[0]["id"]}&artist_id=#{artists[1]["id"]}&artist_id=#{artists[2]["id"]}&artist_id=#{artists[3]["id"]}&artist_id=#{artists[4]["id"]}&results=30&sort=#{sort}&limited_interactivity=true&bucket=id:spotify&bucket=tracks&limit=true"
   return HTTParty.get(link)
 end

 # remove tracks where the same artist appears twice in
 # a row
 def filter_sequential_artists(playlist)
   i = 1
   repeated = 0
   while i < playlist.length
     if playlist[i]["artist_name"] == playlist[i-1]["artist_name"]
     puts playlist[i]["artist_name"]
     puts playlist[i-1]["artist_name"]
     playlist.delete_at(i)
     end
    i += 1
   end
   return playlist
 end

 #parse spotify id data from echonest call to send
 # back up to create player
 def get_spotify_songs(genre, mood)
   artist_response = find_artists_by_mood(genre, mood)
   playlist = seed_playlist(artist_response, mood)
   filtered_playlist = filter_sequential_artists(playlist["response"]["songs"])
   spotify_ids = filtered_playlist.map do |song|
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
