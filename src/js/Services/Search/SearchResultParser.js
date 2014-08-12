window.Services = window.Services || {};

window.Services.SearchResultParser = function(nameValidator)
{
    this.nameValidator = nameValidator;
};

window.Services.SearchResultParser.prototype =
{
    parse: function(result, clickHandler, context)
    {
        var that = this;
        var output = [];
        result.forEach(function(item)
        {
            if(item.name && item.url && that.nameValidator.isNameCorrect(item))
            {
                Logger.getInstance().debug("[Search] title: " + item.name + " id: " + item.url);
                var builder = new window.UI.SearchResultItemBuilder(window.UI.MediaLoadConfig);
                builder.initialise();
                builder.setTitle(item.name);
                builder.setVideoUrl(item.url);
                builder.setAddButtonHandler(clickHandler, context);

                var icons = [context.config.YoutubeIcon];
                if (item.isPlaylist)
                {
                    icons.push(context.config.PlaylistIcon);
                }

                builder.setToolTipText("Add to the playlist: " + item.name);
                builder.setIcons(icons);
                builder.setCover(item.cover);

                var searchItem = builder.build();
                output.push(searchItem);
            }
        });

        return output;
    }
};