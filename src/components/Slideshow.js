import React, { useState, useEffect } from 'react';
import './Slideshow.css';

function Slideshow({ current }) {

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
        <img
          src={current.src}
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
