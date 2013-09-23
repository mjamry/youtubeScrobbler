window.LastFm = window.LastFm || {};

LastFmConstants =
{
    API_KEY: 'f21088bf9097b49ad4e7f487abab981e',
    API_SECRET: '7ccaec2093e33cded282ec7bc81c6fca'
}

LastFmApiCommon =
{
    CACHE: new LastFMCache(),
    DATA_PROVIDER: new LastFM({
        apiKey: LastFmConstants.API_KEY,
        apiSecret: LastFmConstants.API_SECRET,
        cache: this.CACHE
    })
}