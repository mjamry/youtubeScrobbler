//namespace
window.Player = window.Player || {};

window.Player.PlaylistEvents =
{
    //playlist events

    //eventArgs - numberOfNewItems
    PlaylistUpdated: "PlaylistUpdated",
    PlaylistItemUpdated: "PlaylistItemUpdated",

    //carry item index and obtained details.
    PlaylistElementDetailsObtained: "PlaylistElementDetailsObtained",
    PlaylistElementDetailsObtainingFailed : "PlaylistElementDetailsObtainingFailed"
};