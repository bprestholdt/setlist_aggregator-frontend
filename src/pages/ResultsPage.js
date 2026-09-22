//new page to extract the statspanel logic into its own page
//reads artist, range from URL, fetches all stats and renders the stat panel
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import StatsPanel from '../components/StatsPanel';
import SetlistFMCredit from '../components/SetlistFMCredit';

//generate a consistent gradient based on artist name
function generateArtistGradient(artistName) {
  if (!artistName) return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
  let hash = 0;
  for (let i = 0; i < artistName.length; i++) {
    hash = artistName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 30%, 15%) 0%, hsl(${hue2}, 40%, 20%) 50%, hsl(${hue1}, 35%, 12%) 100%)`;
}

function ResultsPage() {

    //get paramaters and location from react router
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    //extract artist,range once for rendering
    const artist = params.get('artist');
    const range = params.get('range');

    //background image for page
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);


  //show loading while data being fetched
  const [loading, setLoading] = useState(false);
  //true if the request is taking long enough that the server is probably waking up
  const [slowLoad, setSlowLoad] = useState(false);
  //true if the stats request failed, so we show a message instead of empty stat cards
  const [error, setError] = useState(false);

  //every stat from the backend in one object (summary numbers plus ranked lists), null until loaded
  const [stats, setStats] = useState(null);

  //hook that runs the fetch when URL changes
  useEffect(() => {
    //fetch twice for safety
    const artist = params.get('artist');
    const range = params.get('range');

    //prevent fetch if URL is invalid
    if (!artist || !range) {
            return;
          }

    //after 8 seconds of loading, explain the wait (free hosting sleeps when idle and takes up to a minute to wake)
    const slowTimer = setTimeout(() => setSlowLoad(true), 8000);

    async function fetchStats() {
      //set loading when function called and clear stats from last fetch
      setLoading(true);
      setSlowLoad(false);
      setError(false);
      setStats(null);

      try {
        //send GET req to consolidated backend API endpoint using env variable that handles local vs deployment
        //encode the artist so names with &, #, + etc. reach the backend intact
        const result = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/setlists/stats?artist=${encodeURIComponent(artist)}&setlistRange=${encodeURIComponent(range)}`);

        //check and parse JSON response
        if (!result.ok) {
          const text = await result.text(); // catch HTML or plain text errors
          console.error("Backend error response:", text);
          throw new Error(`Stats API returned status ${result.status}`);
        }

        const data = await result.json();

        //store the response; StatsPanel checks each piece before showing it
        setStats(data && typeof data === 'object' ? data : {});
      }
      catch (err) {
        console.error("error fetching deez stats. ughhhh.", err);
        setError(true);
      }
      finally {
        //hide loading regardless of response
        clearTimeout(slowTimer);
        setLoading(false);
        setSlowLoad(false);
      }
    }

  //fetch artist image from last.fm API
  async function fetchArtistImage() {
  try {
  const response = await fetch (
  `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`
  );

  const data = await response.json();

  //attempt to find the largest available image
  const image = data?.artist?.image?.find(img => img.size === 'extralarge')?.['#text'];

  if (image && image.startsWith('http') && !image.includes('lastfm') && !image.includes('star')) {
          setBackgroundImageUrl(image);
        } else {
          setBackgroundImageUrl(null);
        }
      } catch (err) {
        console.warn("Could not load image for artist:", err);
        setBackgroundImageUrl(null);
      }
    }

    //call it immediately when page loads
    fetchStats();
    fetchArtistImage();

    //stop the slow-load timer if the user leaves before the request finishes
    return () => clearTimeout(slowTimer);
  }, [location, params]); //run API fetch again if URL changes any parameter

  //return full page styled container holding results
  //full screen background image-
  //TO DO- display artist image from search, if we dont have their image display placeholder
  return (
    <div
      style={{
        paddingTop: '1rem',
        paddingBottom: '4rem',
        minHeight: '100vh',
        color: 'white',
        backgroundImage: loading ? 'none' : (backgroundImageUrl ? `url(${backgroundImageUrl})` : generateArtistGradient(artist)),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        boxSizing: 'border-box',
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
        Loading Some Stats That Will Blow Your MIND!!!!
        </div>
      )}

      {/* shown if loading takes a while, which usually means the free server is waking up */}
      {loading && slowLoad && (
        <p style={{ textAlign: 'center', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
          Still working. If nobody has searched in a while, the server takes up to a minute to wake up.
          All-time stats for a new artist can take longer.
        </p>
      )}

      {/* after loading complete, pass stats as props to StatsPanel component */}
      {!loading && artist && (
        <>
        {/*back button always visible when not loading*/}
        <div style={{
          padding: '1rem 1rem 0 1rem',
          width: '100%',
          boxSizing: 'border-box'
         }}>
          <button
            onClick={() => navigate('/')}
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

          {error ? (
            //request failed: say so instead of showing every stat as unavailable
            <div style={{ textAlign: 'center', margin: '4rem auto', maxWidth: '600px', padding: '0 1rem' }}>
              <h2>Couldn't load stats right now</h2>
              <p>The stats server didn't respond. Please try again in a minute.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '1rem',
                  backgroundColor: '#4444ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <StatsPanel stats={stats} artistName={artist} range={range} />
          )}
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
