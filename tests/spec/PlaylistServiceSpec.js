describe("PlaylistService", function(){
    var playlistService;
    var playlist;
    var mediaDetails_1 = new window.Player.MediaDetails();
    mediaDetails_1.artist.name = "artist_1";
    mediaDetails_1.title = "title_1";
    mediaDetails_1.id = 1;
    var mediaDetails_2 = new window.Player.MediaDetails();
    mediaDetails_2.artist.name = "artist_2";
    mediaDetails_2.title = "title_2";
    mediaDetails_2.id = 2;
    var mediaDetails_3 = new window.Player.MediaDetails();
    mediaDetails_3.artist.name = "artist_3";
    mediaDetails_3.title = "title_3";
    mediaDetails_3.id = 3;

    playlist = new window.Player.Playlist();

    playlist.addItem(mediaDetails_1);
    playlist.addItem(mediaDetails_2);
    playlist.addItem(mediaDetails_3);

    beforeEach(function()
    {
        playlistService = new window.Player.PlaylistService(new window.Tests.MockPlaylistRepo());
    });

    it("should return the same playlist as created one", function(){

        playlistService.clearPlaylist();
        playlistService.addToPlaylist(playlist);
        expect(playlistService.getPlaylist()).toEqual(playlist);
    });

    it("should clear existing playlist", function(){
        playlistService.clearPlaylist();

        expect(playlistService.getPlaylist()).not.toEqual(playlist);
        expect(playlistService.getPlaylist()).toEqual(new window.Player.Playlist());
    });
});