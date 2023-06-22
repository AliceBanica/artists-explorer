
class SpotifyService {

    token: string;
    artistID: string;
    searchParams: URLSearchParams;

    constructor() {
        this.searchParams = new URLSearchParams();
        this.token = "";
        this.artistID = "";
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
            .then(data => this.artistID = data.artists.items[0].id)
            .catch(error => console.error(error));
    }

    async getArtistAlbums(artistName: string) {
        const id = await this.getArtistID(artistName);
        const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        });

        const albumsData = await albumsResponse.json();
        // const albums = albumsData.items;
        return albumsData;
        // Print the album names and IDs
        // albums.forEach((album: any) => {
        //     console.log(album.name, album.id);
        // });
    }

}


export default new SpotifyService();