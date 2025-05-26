import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import Slideshow from '../components/Slideshow';
import '../components/Slideshow.css';

//import slideshow images
import images from '../components/slideshowImages';

//moved slideshow logic and caption to home in order to make all links clickable

// helper to shuffle photo array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to convert Markdown-style links in attribution to HTML
function formatAttribution(markdown) {
  if (!markdown) return '';
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function Home() {
  //shuffle images once on initial load
  const [shuffledImages] = useState(() => shuffleArray(images));
  const [index, setIndex] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
        setIndex((i) => (i + 1) % shuffledImages.length);
      }, 4300); //change every 4 seconds
      return () => clearInterval(interval);
    }, [shuffledImages]);

    const current = shuffledImages[index];

  return (
    <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/*full-screen rotating slideshow in background*/}
      <Slideshow current = {current} />

      {/*overlay on top of slideshow*/}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          //make sure its imposed over slideshow
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          //make tight vertical spacing between title and search
          gap: '0.25rem',
          padding: '0.75rem 1rem',
          //silver text
          color: '#C0C0C0',
          //dark transparent background for white text
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            marginTop: '0rem',
            marginBottom: '0.5rem',
            paddingBottom: '0.25rem',
            textShadow: '2px 2px 8px black',
            fontWeight: 'bold',
            letterSpacing: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '0.25rem 0.5rem',
            borderRadius: '8px',
          }}
        >
          Setlist Aggregator
        </h1>
        <SearchBar />
      </div>

      {/*caption at bottom right is now clickable*/}
            <div
              className="slideshow-caption"
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                maxWidth: '80%',
                lineHeight: '1.3rem',
                zIndex: 10,
                pointerEvents: 'auto',
                textShadow: '0px 0px 5px #000',
              }}
            >
              <div>
                {current.artist} – {current.date}
                {current.location ? ` @ ${current.location}` : ''}
              </div>
              {current.attribution && (
                <small
                  dangerouslySetInnerHTML={{
                    __html: formatAttribution(current.attribution),
                  }}
                />
              )}
            </div>
    </div>
  );
}

export default Home;
