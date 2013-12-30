describe("Duration", function(){
    var durationInSeconds = 134;
    var duration;

    beforeEach(function(){

        duration = new window.Player.Duration(durationInSeconds);
    });

    it("should return value in seconds", function(){
        var result = duration.getInSeconds();

        expect(result).toEqual(durationInSeconds);
    });

    it("should return human readable format of time", function(){
        var result = duration.getHumanReadable();

        expect(result).toEqual("2:14");
    });
});