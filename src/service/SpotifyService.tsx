
class SpotifyService {

    token = "";
    artistID = ""
    searchParams: URLSearchParams;
    tokenExpireTime: any;

    //Client ID and Client Secret can be obtained at https://developer.spotify.com/dashboard
    client_id = "SPOTIFY_CLIENT_ID";
    client_secret = "SPOTIFY_CLIENT_SECRET";

    constructor() {
        this.searchParams = new URLSearchParams();
    }

    async generateToken() {
        this.searchParams.append("grant_type", "client_credentials");
        this.searchParams.append("client_id", this.client_id);
        this.searchParams.append("client_secret", this.client_secret);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: this.searchParams
        };

        await fetch("https://accounts.spotify.com/api/token", requestOptions)
            .then(response => response.json())
            .then(data => {
                this.token = data.access_token;
            })
            .catch(error => {
                console.error(error);
            });
    }


    async getArtistData(artistName: string) {
        const id = await this.getArtistID(artistName)
        if (id !== "") {
            return await fetch(
                "https://api.spotify.com/v1/artists/" + id,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                }
            )
                .then(res => res.json())
                .then(data => data)
                .catch(error => console.error(error));
        }
        return null;
    }

    async getArtistID(artistName: string) {
        const url = new URL('https://api.spotify.com/v1/search');
        url.searchParams.append("q", artistName);
        url.searchParams.append("type", "artist");
        url.searchParams.append("limit", "1");

        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        };

        if (artistName != "") {
            return await fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.artists.items.length != 0) {
                        return this.artistID = data.artists.items[0].id;
                    }
                    return "";
                })
                .catch(error => console.log(error));
        }
        return "";
    }

    async getArtistAlbums(artistName: string) {
        const id = await this.getArtistID(artistName);
        if (id != "") {
            const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });

            const albumsData = await albumsResponse.json();
            return albumsData;
        }
        return null;
    }

    async getArtistTopTracks(artistName: string) {
        const id = await this.getArtistID(artistName);
        if (id != "") {
            const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=RO`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });

            const topTracks = await topTracksResponse.json();
            return topTracks;
        }
        return null;
    }
}


export default new SpotifyService();