import React, { useState, useEffect } from 'react';
import spotifyImg from "./assets/spotify-img.png"
import './App.css';
import SpotifyService from './service/SpotifyService';
import searchIcon from "./assets/search-btn.png";
import playImg from "./assets/start.png";
import pauseImg from "./assets/pause.png";
import alertImg from "./assets/alert.png";
import wave from "./assets/wavy.png";


function App() {
  const [artistData, setArtistData] = useState<any>("");
  const [artistName, setArtistName] = useState<any>("");
  const [artistAlbums, setArtistAlbums] = useState<any>("");
  const [topTracks, setTopTracks] = useState<any>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const audio: any = new Audio();
  let isAudioRunning = false;
  let trackName: string;
  let playButtonIndex = -1;

  useEffect(() => {
    SpotifyService.generateToken();
  }, []);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert])

  const handleChange = (e: any) => {
    setArtistName(e.target.value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const artist = await SpotifyService.getArtistData(artistName);
    const albums = await SpotifyService.getArtistAlbums(artistName);
    const topTracks = await SpotifyService.getArtistTopTracks(artistName);

    setIsSubmitted(true);
    if (artist) {
      setArtistData(artist);
      setArtistAlbums(albums);
      setTopTracks(topTracks);
    }
    else {
      setArtistData(null);
      setShowAlert(true);
    }
  }

  function togglePlay(track: any, index: number): void {
    const playPauseButton: HTMLButtonElement = document.getElementById("playPauseButton" + index) as HTMLButtonElement;
    const buttonImage: HTMLImageElement = playPauseButton?.querySelector("img") as HTMLImageElement;

    if (isAudioRunning && trackName === track) {
      audio.pause();
      isAudioRunning = false;
      buttonImage.src = playImg;
      buttonImage.alt = "Play";
    } else {
      if (playButtonIndex != -1) {
        const oldPlayPauseButton: HTMLButtonElement = document.getElementById("playPauseButton" + playButtonIndex) as HTMLButtonElement;
        const oldButtonImage: HTMLImageElement = oldPlayPauseButton?.querySelector("img") as HTMLImageElement;
        oldButtonImage.src = playImg;
        oldButtonImage.alt = "Play";
      }
      audio.pause();
      audio.src = track;
      audio.play();
      isAudioRunning = true;

      buttonImage.src = pauseImg;
      buttonImage.alt = "Pause";
      trackName = track;
      playButtonIndex = index;
    }
  }

  return (
    <>
      <section className={isSubmitted ?
        ((artistData !== "" && artistData != null) ? 'title-app-section-flex' : "title-app-section") : "title-app-section"}>

        <p className='title-app'>Explore your favourite <span>artist</span></p>
        <div className={isSubmitted ? "no-search-artist" : "search-artist-container"}>

          <form onSubmit={handleSubmit} className='search-form'>
            <div className='form-container'>
              <input type="text" className='artist-input' id='name' name="name" onChange={handleChange} value={artistName} placeholder='Artist name' />
              <button className='search-button' type='submit'>
                <img src={searchIcon} alt="" />
              </button>
            </div>
          </form>
          {isSubmitted ?
            ((artistData !== "" && artistData != null) ? '' : <span className='short-info'>Results are based on the Spotify API developed by Spotify.
            </span>) : <span className='short-info'>Results are based on the Spotify API developed by Spotify.
            </span>}
        </div>
      </section>

      {isSubmitted ? (
        (artistData !== "" && artistData != null) ? <section className='artist-info-section'>
          <div className='artist-container'>
            <div className='artist-info-container'>
              <div className='artist-image-container'>
                <img className='artist-image' src={artistData.images[0].url} alt="" />
              </div>
              <a href={artistData.external_urls.spotify} className='artist-name-container'>
                <img src={spotifyImg} alt="" />
                <h1 className='artist-name'>{artistData.name}</h1>
              </a>
              <div className='artist-info'>
                <p className='popularity-info'> <span> {artistData.followers.total} followers</span> | <span>{artistData.popularity} popularity</span></p>
                <div>
                  <ul className='genres-list'>
                    {artistData.genres.map((gen: string, index: number) => {
                      return <li key={index}> {gen}</li>
                    })}
                  </ul>
                </div>

                <div className='top-tracks-container'>
                  <h4 className='top-tracks-subtitle'>Top Tracks</h4>
                  <ul className='top-tracks-list'>
                    {topTracks.tracks.map((track: any, index: number) => {
                      if (track.preview_url != null) {
                        return <li key={index} className='track-item'>
                          <div className='track-name-container'>
                            <button onClick={() => togglePlay(track.preview_url, index)} className='button-audio' id={"playPauseButton" + index} >
                              <img src={playImg} alt="" className='img-audio' />
                            </button>
                            <h3 className='track-name'>{track.name}</h3>
                          </div>
                        </li>
                      }
                    })}
                  </ul>
                </div>

                <div className='albums-container'>
                  <h4 className='albums-subtitle'>Albums</h4>
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
              </div>
            </div>
          </div>
        </section > : (showAlert &&
          <div className='alert'>
            <img className='alert-image' src={alertImg} alt="" />
            <span>Didn't find anything! Please enter a valid name. </span>
          </div>
        )) : ""}


      {isSubmitted ?
        ((artistData !== "" && artistData != null) ? <footer>
          <div>Results are based on the Spotify API developed by Spotify.</div>
        </footer> : "") : ""}


      <div className='background-elements'>
        <img className='wave-img' src={wave} alt="" />
        <div className='bg-circle-1'></div>
        <div className='bg-circle-2'></div>
        <div className='line line-1'></div>
        <div className='line line-2'></div>
        <div className='line line-3'></div>
      </div>
    </>
  );
}

export default App
