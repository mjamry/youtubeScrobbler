//this file is used to initialise global environment variables such as singletones implementations
beforeEach(function()
{
    new Logger();
    var logger = new window.Tests.MockLoggerImpl();
    Logger.setInstance(logger);

    new TimeParser();
    var timeParser = new window.Common.TimeParserImpl();
    TimeParser.setInstance(timeParser);

    new EventBroker();
    var eventBroker = new window.Common.EventBrokerImpl();
    EventBroker.setInstance(eventBroker);

    new LocalStorage();
    var localStorage = new window.Common.LocalStorageImpl();
    LocalStorage.setInstance(localStorage);

    new UserNotifier();
    var userNotifier = new window.Tests.MockUserNotifier();
    UserNotifier.setInstance(userNotifier);
});
