import React from 'react';
import './Slideshow.css';

function Slideshow({ current, onLoad }) {

  return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/*fullscreen image with scaling*/}
        {/*decoding sync: the next photo is already downloaded and decoded before it's shown, so it paints in the same frame as its caption*/}
        <img
          src={current.src}
          onLoad={onLoad}
          decoding="sync"
          alt={`${current.artist} concert`}
          style={{
            width: '100%',
            height: '100%',
            //fill screen but may crop
            objectFit: 'cover',
            //keep crop centered on object
            objectPosition: 'center',
            opacity: 1,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      </div>
    );
}

export default Slideshow;
