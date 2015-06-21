window.UI = window.UI || {};

window.UI.PlaylistManageConfiguration =
{
    PlaylistDetailsContainer: ".playlist-details-view",
    PlaylistName: ".playlist-details-header",
    PlaylistId: ".playlist-details-id",
    PlaylistDescr: ".playlist-details-description",
    PlaylistItemsCount: ".playlist-details-items-count",
    PlaylistStorage: ".playlist-details-storage",
    PlaylistTags: ".playlist-details-tags",

    PlaylistSearch: "playlist-list-search",
    PlaylistSort: "playlist-list-sort",
    PlaylistSortClass: ".playlist-list-sort",

    PlaylistTagTemplate: '<div class="label playlist-save-tag"><div class="name"></div></div>',

    values:
    {
        name: "name",
        id: "id",
        description: "description",
        count: "count",
        storage: "storage",
        tags: "tags"
    }
};
