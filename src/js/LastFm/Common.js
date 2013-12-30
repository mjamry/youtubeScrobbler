window.LastFm = window.LastFm || {};

//TODO move to server side.
window.LastFm.LastFmConstants =
{
    API_KEY: 'ed21aeb031f9999c1fd0f92510b84364',
    API_SECRET: 'c234b6bf6b9f738748ce92391f0b0846'
}

LastFmApiCommon =
{
    CACHE: new LastFMCache(),
    DATA_PROVIDER: new LastFM({
        apiKey: window.LastFm.LastFmConstants.API_KEY,
        apiSecret: window.LastFm.LastFmConstants.API_SECRET,
        cache: this.CACHE
    })
}