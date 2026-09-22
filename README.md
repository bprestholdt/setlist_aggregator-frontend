# Setlist Aggregator

Search any artist and see statistics from their concert setlists: most played songs, top openers, top encores, rarest songs, and the average number of songs per show. You can look at their last 20 shows, last 100 shows, or their entire history.

**Live site:** https://setlist-aggregator-frontend.vercel.app

This repo is the React frontend. The Spring Boot + PostgreSQL backend is at [setlist_aggregator-backend](https://github.com/bprestholdt/setlist_aggregator-backend).

## How it works

1. You enter an artist and a range on the home page.
2. The backend looks the artist up on MusicBrainz to get their unique ID, so names like "Future" resolve to the right artist.
3. It pulls that artist's setlists from the Setlist.fm API page by page and saves them to PostgreSQL, so later searches come from the database instead of the API.
4. It calculates the stats and returns them in one response, which the results page displays over a background built from the artist's Last.fm image (or a color gradient generated from their name).

## Tech

- React 19, React Router
- Deployed on Vercel
- Backend: Java 17, Spring Boot, Spring Data JPA, PostgreSQL

## Running locally

Requires Node.js and a running copy of the backend.

Create a `.env` file in the project root:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_LASTFM_API_KEY=your-lastfm-api-key
```

Then:

```
npm install
npm start
```

The app runs at http://localhost:3000.

## Credits

- Setlist data from [Setlist.fm](https://www.setlist.fm)
- Artist lookup from [MusicBrainz](https://musicbrainz.org)
- Artist images from [Last.fm](https://www.last.fm)
- Home page concert photos are from Wikimedia Commons and Flickr under Creative Commons licenses; each photo's credit and license is shown in its caption
