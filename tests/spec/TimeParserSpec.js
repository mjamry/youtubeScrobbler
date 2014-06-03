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
            expect(timeParser.getHumanReadableFormat(0)).toEqual("0:00");
        });

        it("should return \"1:00\" for 60s", function(){
            expect(timeParser.getHumanReadableFormat(60)).toEqual("1:00");
        });

        it("should return \"1:01\" for 61s", function(){
            expect(timeParser.getHumanReadableFormat(61)).toEqual("1:01");
        });

        it("should return \"1:11\" for 71s", function(){
            expect(timeParser.getHumanReadableFormat(71)).toEqual("1:11");
        });

        it("should return \"9:00\" for 540s", function(){
            expect(timeParser.getHumanReadableFormat(540)).toEqual("9:00");
        });

        it("should return \"59:59\" for 3599s", function(){
            expect(timeParser.getHumanReadableFormat(3599)).toEqual("59:59");
        });

        it("should return \"1:00:00\" for 3600s", function(){
            expect(timeParser.getHumanReadableFormat(3600)).toEqual("1:00:00");
        });

        it("should return \"1:00:01\" for 3601s", function(){
            expect(timeParser.getHumanReadableFormat(3601)).toEqual("1:00:01");
        });

        it("should return \"1:01:01\" for 3661s", function(){
            expect(timeParser.getHumanReadableFormat(3661)).toEqual("1:01:01");
        });
    });
});