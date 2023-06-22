import { useState, useEffect } from 'react';
import spotifyImg from "./assets/spotify-img.png"
import './App.css';
import SpotifyService from './service/SpotifyService';
import searchIcon from "./assets/search-btn.png"

function App() {
  const [artistData, setArtistData] = useState<any>("");
  const [artistName, setArtistName] = useState<any>("");
  const [artistAlbums, setArtistAlbums] = useState<any>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    SpotifyService.generateToken();
  }, [])



  const handleChange = (e: any) => {
    setArtistName(e.target.value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const artist = await SpotifyService.getArtistData(artistName);
    const albums = await SpotifyService.getArtistAlbums(artistName);
    setArtistData(artist);
    setArtistAlbums(albums);
    setIsSubmitted(true)
  }

  return (
    <>
      <section className={isSubmitted ? "title-app-section-flex" : 'title-app-section'}>
        <p className='title-app'>Explore your favourite <span>artist</span></p>
        <div className="search-artist-container">
          <form onSubmit={handleSubmit} className='search-form'>
            <div className='form-container'>
              <input type="text" className='artist-input' id='name' name="name" onChange={handleChange} value={artistName} placeholder='Artist name' />

              <button className='search-button' type='submit'> <img src={searchIcon} alt="" />
              </button>
            </div>
          </form>
        </div>
      </section>
      {isSubmitted &&
        <section className='artist-info-section'>
          <div className='artist-container'>
            <div className='artist-info-container'>
              <div className='artist-image-container'>
                <img className='artist-image' src={artistData.images[0].url} alt="" />
              </div>
              <h1 className='artist-name'>{artistData.name}</h1>
              <div className='artist-info'>
                <p className='popularity-info'> <span> {artistData.followers.total} followers</span> | <span>{artistData.popularity} popularity</span></p>
                <div>
                  <ul className='genres-list'>
                    {artistData.genres.map((gen: string, index: number) => {
                      return <li key={index}> {gen}</li>
                    })}
                  </ul>
                </div>
                <div className='albums-container'>
                  <ul className='albums-list'>
                    {artistAlbums.items.map((album: any, index: number) => {
                      return <li className='album-item' key={index}>
                        <a href={album.external_urls.spotify}>
                          <img className='album-img' src={album.images[0].url} alt="" />
                          <h3 className='album-title'>{album.name}</h3>
                          <p className='album-songs'>{album.total_tracks} songs</p>
                        </a>
                      </li>
                    })}
                  </ul>
                </div>
                <div className='spotify-link'>
                  <img className='spotify-img' src={spotifyImg} alt="" />
                  <a href={artistData.external_urls.spotify}>Spotify Page</a>
                </div>
              </div>
            </div>
          </div>
        </section>}
    </>
  );
}

export default App
