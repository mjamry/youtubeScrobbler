window.UI = window.UI || {};

window.UI.UserNotifierConfiguration =
{
    NotificationTimeout: 20,
    MaxNumberOfNotifications: 2,
    ErrorClass: "user-notification-error",
    InfoClass: "user-notification-info",

    IconContainer: "user-notification-icon",
    MessageContainer: "user-notification-message",

    UndoButton: "user-notification-undo-button",
    CloseButton: "user-notification-close-button",

    ErrorIconClass: "fa fa-exclamation-circle",
    InfoIconClass: "fa fa-info-circle"
};

window.UI.UserNotificationTypes =
{
    Info: "info",
    Error: "error"
};