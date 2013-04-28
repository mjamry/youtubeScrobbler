var _apiKey = 'f21088bf9097b49ad4e7f487abab981e';
var cache = new LastFMCache();
var lastFmObject = new LastFM({
		apiKey    : _apiKey,
		apiSecret : '7ccaec2093e33cded282ec7bc81c6fca',
		cache     : cache
	});


function artistInfo()
{
	this.lastFmApi = lastFmObject;
}

artistInfo.prototype = 
{
	getArtist: function(artistName, callback)
	{
		this.lastFmApi.artist.getInfo(
				{artist: artistName}, 
				{success:function(data)
					{
						var artistData = 
						{
							name: data.artist.name,
							bio: data.artist.bio.content
						};
						
						callback(artistData);
					}
				}
			);
	},
			
	getTack: function(trackName)
	{

	}
	
};

function lastFmSession()
{
	this.lastFmApi = lastFmObject;
	this.sessionId = null;
}

lastFmSession.prototype = 
{
	getSessionId: function(token, callback)
	{
		this.lastFmApi.auth.getSession({token:token}, callback);
	},
			
			getRecommendedArtists: function(params, session, callback){
				this.lastFmApi.user.getRecommendedArtists(params, session, callback);
			}
	
};

function scrobbler(){
	this.lastFmApi = lastFmObject;
}

scrobbler.prototype = {
	scrobble: function(track, session, callback){
		this.lastFmApi.track.scrobble(track, session, callback);
	},
	updateNowPlaying: function(track, session, callback){
		this.lastFmApi.track.updateNowPlaying(track, session, callback);
	},
	love: function(track, session, callback){
		this.lastFmApi.track.love(
			track,
			session, 
			callback
		);
	},
			getSimilar: function(params, session, callback){
				this.lastFmApi.track.getSimilar(params, callback);
			}
};