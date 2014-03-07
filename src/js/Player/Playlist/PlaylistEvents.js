//namespace
window.Player = window.Player || {};

window.Player.PlaylistEvents =
{
     //eventArgs - numberOfNewItems
    PlaylistUpdated: "PlaylistUpdated",
    PlaylistItemUpdated: "PlaylistItemUpdated",
    PlaylistItemRemoved: "PlaylistItemRemoved",

    PlaylistCleared: "PlaylistCleared",     //no args
    PlaylistCreated: "PlaylistCreated",     //new playlist length

    PlaylistItemEditionRequested: "PlaylistItemEditionRequested"
};