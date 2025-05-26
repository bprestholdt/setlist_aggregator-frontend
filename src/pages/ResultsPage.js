//new page to extract the statspanel logic into its own page
//reads artist, range from URL, fetches all stats and renders the stat panel
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import StatsPanel from '../components/StatsPanel';
import SetlistFMCredit from '../components/SetlistFMCredit';

function ResultsPage() {

    //get paramaters and location from react router
    const [params] = useSearchParams();
    const location = useLocation();

    //extract artist,range once for rendering
    const artist = params.get('artist');
    const range = params.get('range');

    //background image for page
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('/images/default_backgroundRickRoss.jpg');


  //show loading while data being fetched
  const [loading, setLoading] = useState(false);

  //store results from backend in arrays
  const [encores, setEncores] = useState([]);
  const [rarest, setRarest] = useState([]);
  const [averageLength, setAverageLength] = useState(null);
  const [openers, setOpeners] = useState([]);
  const [mostPlayed, setMostPlayed] = useState([]);

  //confirm what frontend actually received to debug
  console.log("Encore songs:", encores);
  console.log("Rarest songs:", rarest);
  console.log("Avg length:", averageLength);
  console.log("Opener songs:", openers);
  console.log("Most played songs:", mostPlayed);

  //hook that runs the fetch when URL changes
  useEffect(() => {
    //fetch twice for safety
    const artist = params.get('artist');
    const range = params.get('range');

    //prevent fetch if URL is invalid
    if (!artist || !range) {
            return;
          }

    async function fetchStats() {
      //set loading when function called and clear stats from last fetch
      setLoading(true);
      setEncores([]);
      setRarest([]);
      setOpeners([]);
      setMostPlayed([]);
      setAverageLength(null);

      try {
        //send GET req to consolidated backend API endpoint using env variable that handles local vs deployment
        const result = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/setlists/stats?artist=${artist}&setlistRange=${range}`);

        //check and parse JSON response
        if (!result.ok) {
          const text = await result.text(); // catch HTML or plain text errors
          console.error("Backend error response:", text);
          throw new Error(`Stats API returned status ${result.status}`);
        }

        const data = await result.json();

        console.log("Stats API response:", data);

        //store response data in the state using values returned from backend
        setEncores(Array.isArray(data.encores) ? data.encores : []);
        setRarest(Array.isArray(data.rarest) ? data.rarest : []);
        setOpeners(Array.isArray(data.openers) ? data.openers : []);
        setMostPlayed(Array.isArray(data.mostPlayed) ? data.mostPlayed : []);
        const avg = parseFloat(data.averageLength);
        setAverageLength(!isNaN(avg) ? avg : null);
      }
      catch (err) {
        console.error("error fetching deez stats. ughhhh.", err);
      }
      finally {
        //hide loading regardless of response
        setLoading(false);
      }
    }

  //fetch artist image from last.fm API
  async function fetchArtistImage() {
  try {
  console.log("Fetching artist image from Last.fm for:", artist);

  const response = await fetch (
  `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`
  );

  const data = await response.json();

  console.log("Last.fm response:", data);

  //attempt to find the largest available image
  const image = data?.artist?.image?.find(img => img.size === 'extralarge')?.['#text'];

  console.log("Extracted image URL:", image);

  if (image && image.startsWith('http') && !image.includes('lastfm') && !image.includes('star')) {
          setBackgroundImageUrl(image);
          console.log("Fetched artist image:", image);
        } else {
          setBackgroundImageUrl('/images/default_backgroundRickRoss.jpg');
        }
      } catch (err) {
        console.warn("Could not load image for artist:", err);
        setBackgroundImageUrl('/images/default_backgroundRickRoss.jpg');
      }
    }

    //call it immediately when page loads
    fetchStats();
    fetchArtistImage();
  }, [location]); //run API fetch again if URL changes any parameter

  //return full page styled container holding results
  //full screen background image-
  //TO DO- display artist image from search, if we dont have their image display placeholder
  return (
    <div
      style={{
        paddingTop: '6rem',
        paddingBottom: '5rem',
        minHeight: '100vh',
        color: 'white',
        backgroundImage: loading ? 'none' : `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* loading message glowing red*/}
      {loading && (
      <div
      style={{
        textAlign: 'center',
        fontSize: '3rem',
        fontWeight: '900',
        color: '#fff',
        backgroundColor: '#ff0000',
        textTransform: 'uppercase',
        padding: '2rem',
        margin: '4rem auto',
        maxWidth: '800px',
        background: 'linear-gradient(to right, #ff4d4d, #ff0000)',
        boxShadow: '0 0 30px #ff4d4d, 0 0 60px #ff0000',
        borderRadius: '1rem',
        fontFamily: 'Impact, "Arial Black", sans-serif',
        letterSpacing: '2px',
        textShadow: '2px 2px 4px #000000, 0 0 20px #ff0000',
        animation: 'pulseGlow 1.5s infinite ease-in-out',
       }}
        className="loading-message"
        >
        Loading Some Stats That Will Blow Your F*****G M*****F*****G G******N MIND!!!!
        </div>
      )}

      {/* after loading complete, pass stats as props to StatsPanel component */}
      {!loading && artist && (
        <>
        {/*back button*/}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '1rem',
              backgroundColor: '#4444ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
              transition: 'background-color 0.2s ease',
            }}
          >
            ⬅ Back to Search
          </button>
        </div>
          <StatsPanel
            averageLength={averageLength}
            encores={encores}
            openers={openers}
            rarest={rarest}
            artistName={artist}
            range={range}
          />
          <div style = {{ textAlign: 'center', marginTop: '2rem' }}>
          <SetlistFMCredit />
          </div>
        </>
      )}
    </div>
  );
}

//export component to use in app.js
export default ResultsPage;
