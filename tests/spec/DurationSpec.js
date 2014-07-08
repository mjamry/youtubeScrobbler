describe("Duration", function(){
    //info about ISO 8601 - http://en.wikipedia.org/wiki/ISO_8601
    var durationInISO8601 = "PT2M14S";
    var duration;

    beforeEach(function(){

        duration = new window.Player.Duration(durationInISO8601);
    });

    it("should return value in seconds", function(){
        var result = duration.getInSeconds();

        expect(result).toEqual(134);
    });

    it("should return human readable format of time", function(){
        var result = duration.getHumanReadable();

        expect(result).toEqual("2:14");
    });
});