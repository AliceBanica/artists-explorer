import moment from "moment";


class SpotifyService {

    token = "";
    artistID = ""
    searchParams: URLSearchParams;
    tokenExpireTime: any;

    constructor() {
        this.searchParams = new URLSearchParams();
    }

    verifyKey(): void {
        const currentTime = moment();

        if (this.token === "" || this.tokenExpireTime.isBefore(currentTime)) {
            this.tokenExpireTime = currentTime.add(60, "minutes");
            this.generateToken();
            console.log("key generated")
        }
        console.log(this.tokenExpireTime);
        console.log(this.tokenExpireTime.isBefore(currentTime))
    }

    async generateToken() {
        this.searchParams.append("grant_type", "client_credentials");
        this.searchParams.append("client_id", "64708c81e2514718a448a519ac3738d6");
        this.searchParams.append("client_secret", "833b132ddec941e9945054a8656171df");

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
                    method: "GET", // or 'PUT'
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                }
            )
                .then(res => res.json())
                .then(data => data)
                .catch(error => console.error(error));
        }
        return null
    }

    async getArtistID(artistName: string) {
        const url = new URL('https://api.spotify.com/v1/search')
        url.searchParams.append("q", artistName);
        url.searchParams.append("type", "artist");
        url.searchParams.append("limit", "1");

        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        };

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