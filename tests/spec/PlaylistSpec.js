describe("Playlist", function(){
    var playlist;
    var mediaDetails_1 = new window.Player.MediaDetails();
    mediaDetails_1.artist = "artist_1";
    mediaDetails_1.title = "title_1";
    mediaDetails_1.id = 1;
    var mediaDetails_2 = new window.Player.MediaDetails();
    mediaDetails_2.artist = "artist_2";
    mediaDetails_2.title = "title_2";
    mediaDetails_2.id = 2;
    var mediaDetails_3 = new window.Player.MediaDetails();
    mediaDetails_3.artist = "artist_3";
    mediaDetails_3.title = "title_3";
    mediaDetails_3.id = 3;

    beforeEach(function(){
        playlist = new window.Player.Playlist();

        playlist.add(mediaDetails_1);
        playlist.add(mediaDetails_2);
        playlist.add(mediaDetails_3);
    });

    it("should contain three items", function(){
        expect(playlist.length()).toEqual(3);
    });

    it("should return first item", function(){
        expect(playlist.first()).toEqual(mediaDetails_1);
    });

    it("should return last item", function(){
        expect(playlist.last()).toEqual(mediaDetails_3);
    });

    it("should return second element", function(){
        expect(playlist.get(1)).toEqual(mediaDetails_2);
    });

    describe("after removing first item", function(){

        beforeEach(function()
        {
            playlist.remove(0);
        });

        it("should contain only two items", function(){
            expect(playlist.length()).toEqual(2);
        });

        it("should move rest of items by one position", function(){
            expect(playlist.get(0)).toEqual(mediaDetails_2);
            expect(playlist.get(1)).toEqual(mediaDetails_3);
        });
    });

    it("should replace first element", function(){
        playlist.replace(0, mediaDetails_3);

        expect(playlist.get(0)).toEqual(mediaDetails_3);
        expect(playlist.get(1)).toEqual(mediaDetails_2);
        expect(playlist.get(2)).toEqual(mediaDetails_3);
    });


});