//this file is used to initialise global environment variables such as singletones implementations
(function(){
    var logger = new LoggerImpl();
    Logger.setInstance(logger);

    var timeParser = new window.Common.TimeParserImpl();
    TimeParser.setInstance(timeParser);

    var eventBroker = new window.Common.EventBrokerImpl();
    EventBroker.setInstance(eventBroker);
})();