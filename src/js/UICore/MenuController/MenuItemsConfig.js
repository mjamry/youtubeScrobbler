window.UI = window.UI || {};

window.UI.MenuItemsConfig =
{
    Player:
    {
        Name: "Player",
        Icon: "fa fa-play-circle-o fa-2x",
        Page: "#player"
    },

    PlaylistManage:
    {
        Name: "Playlist Manager",
        Icon: "fa fa-list-ul fa-2x",
        Page: "#playlist-manager"
    },

    AccountManager:
    {
        Name: "Accounts",
        Icon: "fa fa-user fa-2x",
        Page: "#accounts"
    },

    Settings:
    {
        Name: "Settings",
        Icon: "fa fa-gear fa-2x",
        Page: "#settings"
    },

    Logs:
    {
        Name: 'App Logs',
        Icon: "fa fa-bug fa-2x",
        Page: "#testing-environment",
        Position: window.UI.MenuItemPosition.Bottom
    },

    Contact:
    {
        Name: "Contact",
        Icon: "fa fa-envelope fa-2x",
        Page: "#contact",
        Position: window.UI.MenuItemPosition.Bottom
    }
};