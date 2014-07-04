describe("TimeParser", function(){
    var timeParser = new window.Common.TimeParserImpl();

    describe("_timeCorrection method", function(){
        it("should return the same value if greater than 10", function(){
            expect(timeParser._timeCorrection(20)).toEqual(20);
        });

        it("should add \"0\" at the beginning if lower that 10", function(){
            expect(timeParser._timeCorrection(5)).toEqual("05");
        });
    });

    describe("getSeconds method", function(){

        it("should return 0s for 0ms", function(){
            expect(timeParser.getSeconds(0)).toEqual(0);
        });

        it("should return 10s for 10,000ms", function(){
            expect(timeParser.getSeconds(10000)).toEqual(10);
        });

        it("should return 0s if lower than 500ms", function(){
            expect(timeParser.getSeconds(100)).toEqual(0);
            expect(timeParser.getSeconds(499)).toEqual(0);
        });

        it("should return 1s if greater or equal to 500ms", function(){
            expect(timeParser.getSeconds(500)).toEqual(1);
            expect(timeParser.getSeconds(501)).toEqual(1);
            expect(timeParser.getSeconds(999)).toEqual(1);
        });
    });

    describe("getMinutes method", function(){

        it("should return 0m for 0ms", function(){
            expect(timeParser.getMinutes(0)).toEqual(0);
        });

        it("should return 10m for 600,000s", function(){
            expect(timeParser.getMinutes(600000)).toEqual(10);
        });

        it("should return 0m if lower than 30,000ms", function(){
            expect(timeParser.getMinutes(10000)).toEqual(0);
            expect(timeParser.getMinutes(29999)).toEqual(0);
        });

        it("should return 1m if greater or equal to 30,000ms", function(){
            expect(timeParser.getMinutes(30000)).toEqual(1);
            expect(timeParser.getMinutes(49999)).toEqual(1);
            expect(timeParser.getMinutes(59999)).toEqual(1);
        });

    });

    describe("getHumanReadableTimeFormat method", function(){
        it("should return \"0:00\" for 0s", function(){
            expect(timeParser.getHumanReadableTimeFormat(0)).toEqual("0:00");
        });

        it("should return \"1:00\" for 60s", function(){
            expect(timeParser.getHumanReadableTimeFormat(60)).toEqual("1:00");
        });

        it("should return \"1:01\" for 61s", function(){
            expect(timeParser.getHumanReadableTimeFormat(61)).toEqual("1:01");
        });

        it("should return \"1:11\" for 71s", function(){
            expect(timeParser.getHumanReadableTimeFormat(71)).toEqual("1:11");
        });

        it("should return \"9:00\" for 540s", function(){
            expect(timeParser.getHumanReadableTimeFormat(540)).toEqual("9:00");
        });

        it("should return \"59:59\" for 3599s", function(){
            expect(timeParser.getHumanReadableTimeFormat(3599)).toEqual("59:59");
        });

        it("should return \"1:00:00\" for 3600s", function(){
            expect(timeParser.getHumanReadableTimeFormat(3600)).toEqual("1:00:00");
        });

        it("should return \"1:00:01\" for 3601s", function(){
            expect(timeParser.getHumanReadableTimeFormat(3601)).toEqual("1:00:01");
        });

        it("should return \"1:01:01\" for 3661s", function(){
            expect(timeParser.getHumanReadableTimeFormat(3661)).toEqual("1:01:01");
        });
    });

    describe("getHumanReadableDurationFormat method", function() {
        it("should return \"0:00\" for PT", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT")).toEqual("0:00");
        });

        it("should return \"0:11\" for PT11S", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT11S")).toEqual("0:11");
        });

        it("should return \"0:01\" for PT1S", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1S")).toEqual("0:01");
        });

        it("should return \"1:00\" for PT1M", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1M")).toEqual("1:00");
        });

        it("should return \"11:00\" for PT11M", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT11M")).toEqual("11:00");
        });

        it("should return \"1:01\" for PT1M1S", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1M1S")).toEqual("1:01");
        });

        it("should return \"1:00:00\" for PT1H", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1H")).toEqual("1:00:00");
        });

        it("should return \"11:00:00\" for PT11H", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT11H")).toEqual("11:00:00");
        });

        it("should return \"1:01:01\" for PT1H1M1S", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1H1M1S")).toEqual("1:01:01");
        });

        it("should return \"1:00:01\" for PT1H1S", function () {
            expect(timeParser.getHumanReadableDurationFormat("PT1H1S")).toEqual("1:00:01");
        });
    });

    describe("getSecondsFromDuration method", function()
    {
        it("should return \"0\" for PT", function ()
        {
            expect(timeParser.getSecondsFromDuration("PT")).toEqual(0);
        });

        it("should return \"20\" for PT20S", function ()
        {
            expect(timeParser.getSecondsFromDuration("PT20S")).toEqual(20);
        });

        it("should return \"80\" for PT1M20S", function ()
        {
            expect(timeParser.getSecondsFromDuration("PT1M20S")).toEqual(80);
        });

        it("should return \"3600\" for PT1H", function ()
        {
            expect(timeParser.getSecondsFromDuration("PT1H")).toEqual(3600);
        });

        it("should return \"3661\" for PT1H1M1S", function ()
        {
            expect(timeParser.getSecondsFromDuration("PT1H1M1S")).toEqual(3661);
        });
    });

    describe("_parseDuration method", function()
    {
        it("should return \"['PT', 0, 0, 0, 0, 0, 0]\" for PT", function ()
        {
            expect(timeParser._parseDuration("PT")).toEqual(['PT', 0, 0, 0, 0, 0, 0]);
        });

        it("should return \"['PT', 0, 0, 0, 0, 0, 0]\" for P12Y5M10W15DT", function ()
        {
            expect(timeParser._parseDuration("P12Y5M10W15DT")).toEqual(['P12Y5M10W15DT', 0, 0, 0, 0, 0, 0]);
        });

        it("should return \"['PT1H2M3S', '1H', '1', '2M', '2', '3S', '3']\" for PT1H2M3S", function ()
        {
            expect(timeParser._parseDuration("PT1H2M3S")).toEqual(['PT1H2M3S', '1H', '1', '2M', '2', '3S', '3']);
        });

        it("should return \"['PT2M3S', 0, 0, '2M', '2', '3S', '3']\" for PT2M3S", function ()
        {
            expect(timeParser._parseDuration("PT2M3S")).toEqual(['PT2M3S', 0, 0, '2M', '2', '3S', '3']);
        });

        it("should return \"['PT2H3S', '2H', '2', 0, 0, '3S', '3']\" for PT2H3S", function ()
        {
            expect(timeParser._parseDuration("PT2H3S")).toEqual(['PT2H3S', '2H', '2', 0, 0, '3S', '3']);
        });
    });
});