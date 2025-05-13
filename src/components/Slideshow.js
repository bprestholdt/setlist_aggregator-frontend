import React, { useState, useEffect } from 'react';
import './Slideshow.css';


// hardcoded image data for slideshow
const images = [
  {
    src: '/images/GYBE.jpg',
    artist: 'Godspeed! You Black Emperor',
    date: '2018-04-21',
    location: 'Tilburg, NL',
    attribution: 'Photo by [Rene Passet](https://commons.wikimedia.org/wiki/File:Godspeed_You!_Black_Emperor_@_Roadburn_Festival_2018-04-21_003.jpg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)'
  },
  {
    src: '/images/WuTang.jpg',
    artist: 'Wu-Tang Clan',
    date: '2019-06-29',
    location: 'Glastonbury Festival',
    attribution: 'Photo by [Simoncromptonreid](https://commons.wikimedia.org/wiki/File:Wu-Tang_Clan_-_Glastonbury_2019.jpg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)'
  },
  {
    src: '/images/Fugazi.jpg',
    artist: 'Fugazi',
    date: '1996-03-29',
    location: 'Atlanta, GA',
    attribution: 'Photo by [M S](https://commons.wikimedia.org/wiki/File:FUGAZI_1_(19549805629).jpg) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
    src: '/images/Swans.jpg',
    artist: 'Swans',
    date: '2010-12-10',
    location: 'Warsaw, PL',
    attribution: 'Photo by [Marcin Kutera](https://commons.wikimedia.org/wiki/File:Swans_warsaw_10_12_2010_poland_m_kutera.jpg) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
    src: '/images/RTJ.jpg',
    artist: 'Run the Jewels with Zack De La Rocha',
    date: '2015-04-11',
    location: null,
    attribution: 'Photo by [Fred von Lohmann](https://commons.wikimedia.org/wiki/File:Run_the_Jewels.jpg) / [CC BY-SA 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.en)'
  },
  {
    src: '/images/Beatles.jpg',
    artist: 'The Beatles',
    date: '1964-02',
    location: 'The Ed Sullivan Show',
    attribution: 'Photo by [Bernard Gotfryd](https://commons.wikimedia.org/wiki/File:The_Beatles_performing_at_The_Ed_Sullivan_Show.jpg) / [Library of Congress]'
  },
  {
    src: '/images/NIN.jpg',
    artist: 'Nine Inch Nails',
    date: '2006-02-12',
    location: 'Moline, IL',
    attribution: 'Photo by [Brandon Dusseau](https://commons.wikimedia.org/wiki/File:Nine_Inch_Nails_Moline_10.jpg) / [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/)'
  },
  {
    src: '/images/PJHarvey.jpg',
    artist: 'PJ Harvey',
    date: '2004-09-02',
    location: null,
    attribution: 'Photo by [Dave Mitchell (Plastic Jesus)](https://www.flickr.com/photos/davemitchell/108478954/) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
    src: '/images/Nirvana.jpg',
    artist: 'Nirvana',
    date: '1994-11-01',
    location: 'Unplugged',
    attribution: 'Photo by [julio zeppelin](https://www.flickr.com/photos/83706716@N02/7679510730) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
    src: '/images/Shellac.jpg',
    artist: 'Shellac',
    date: '2008-01-04',
    location: 'Sao Paolo, BR',
    attribution: 'Photo by [cássio abreu](https://www.flickr.com/photos/psicodrops/2381545747/) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
    src: '/images/QOTSA.jpg',
    artist: 'Queens of the Stone Age',
    date: '2017-11-17',
    location: 'Wembley Stadium',
    attribution: 'Photo by [Raph_PH](https://www.flickr.com/photos/raph_ph/38546172716/) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
  {
      src: '/images/Bowie1.jpg',
      artist: 'David Bowie',
      date:null,
      location: null,
      attribution: 'Photo by [Vértes György](https://commons.wikimedia.org/wiki/File:David_Bowie_RGB_13X18.jpg#/media/File:David_Bowie_RGB_13X18.jpg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)'
  },
  {
      src: '/images/Bowie2.jpeg',
      artist: 'David Bowie',
      date: '2003-11-23',
      location: null,
      attribution: 'Photo by [Roger Woolman](https://commons.wikimedia.org/wiki/File:David_Bowie_(135687113).jpeg) / [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)'
  },
  {
        src: '/images/JesusLizard.jpg',
        artist: 'The Jesus Lizard',
        date: '2009-09-14',
        location: 'Paradiso, Amsterdam',
        attribution: 'Photo by [Nick Helderman](https://www.flickr.com/photos/nickhelderman/3934176174/) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
    },
  {
    src: '/images/TalkingHeads.jpg',
    artist: 'Talking Heads',
    date: '1982',
    location: null,
    attribution: 'Photo by [Craig Howell](https://www.flickr.com/photos/seat850/3451464308) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
  },
{
  src: '/images/Godflesh.jpg',
  artist: 'Godflesh',
  date: '2018-04-20',
  location: 'Roadburn Festival',
  attribution: 'Photo by [Grywnn](https://commons.wikimedia.org/wiki/File:Godflesh_@_Roadburn_Festival_2018-04-20_004.jpg#/media/File:Godflesh_@_Roadburn_Festival_2018-04-20_004.jpg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)'
},
{
  src: '/images/TheClash.jpg',
  artist: 'The Clash',
  date: '1980-05-21',
  location: 'Chateau Neuf, Oslo',
  attribution: 'Photo by [Helge Øverås](https://commons.wikimedia.org/wiki/File:Clash_21051980_12_800.jpg#/media/File:Clash_21051980_12_800.jpg) / [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)'
},
{
  src: '/images/Ween.jpg',
  artist: 'Ween',
  date: '2009-08-30',
  location: 'Outside Lands Festival',
  attribution: 'Photo by [David Oliver](https://commons.wikimedia.org/wiki/File:Dean_Ween_Outside_Lands.jpg#/media/File:Dean_Ween_Outside_Lands.jpg) / [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)'
},
{
  src: '/images/TheCure.jpg',
  artist: 'The Cure',
  date: '2013-04-16',
  location: null,
  attribution: 'Photo by [Facundo Gaisler](https://www.flickr.com/photos/fotosgraficas/8654838339) / [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)'
},
{
  src: '/images/Swans1.jpg',
  artist: 'Swans',
  date: '2012-08-06',
  location: 'OFF Festival',
  attribution: 'Photo by [Nick Helderman](https://commons.wikimedia.org/wiki/File:OFF_Festival_2012_Swans.jpg#/media/File:OFF_Festival_2012_Swans.jpg) / [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/)'
}

];

// Helper function to convert Markdown-style links in attribution to HTML
function formatAttribution(markdown) {
  if (!markdown) return '';
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// helper to shuffle photo array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Slideshow() {
// shuffle images once on initial load
  const [shuffledImages] = useState(() => shuffleArray(images));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % shuffledImages.length);
    }, 4300); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [shuffledImages]);

  const current = shuffledImages[index];

  return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
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

        {/*caption overlay in bottom right*/}
        <div className = "slideshow-caption">
          <div>
            {current.artist} – {current.date}
            {current.location ? ` @ ${current.location}` : ''}
          </div>
          {current.attribution && (
            <small
              dangerouslySetInnerHTML={{ __html: formatAttribution(current.attribution) }}
            />
          )}
        </div>
      </div>
    );
}

export default Slideshow;
