import React, { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import './SearchBar.css';

//import to handle nav to results page
import { useNavigate } from 'react-router-dom';

//update to be simple input component rather than handling the result rendering too
function SearchBar() {
  //holds which dropdown range value is selected
  const [range, setRange] = useState("20");
  //store artist input from user
  const [artistName, setArtistName] = useState('');

  const debouncedArtist = useDebounce(artistName, 300);


  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('lastArtistInput');
    if (saved) setArtistName(saved);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('lastArtistInput', artistName);
  }, [artistName]);

  //trigger on search click
    const handleSearch = () => {
      if (!debouncedArtist.trim())
      return;

      //navigate to ResultsPage and pass artist and range as URL parameters
      navigate(`/results?artist=${encodeURIComponent(artistName)}&range=${range}`);
    };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // restored original centered layout
        alignItems: 'center',
        //subtract caption div height to fix captions not clickable
        maxHeight: 'calc(100vh - 80px)',
        width: '100%',
        position: 'relative',
        zIndex: '10',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '0.5rem',
        //ensures nothing sits over the caption
        paddingBottom: '90px',
      }}
    >
    {/*block for search input ui*/}
      <div
        className="search-bar-container"
        style={{
        marginBottom: '0rem'
        }}
      >
      {/*artist input box*/}
        <input
          type="text"
          placeholder="Enter Artist Name for Setlist Insights"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          className="search-input"
        />
        {/*range selection dropdown*/}
        <label htmlFor="range-select">Select data range:</label>
        <select
          id="range-select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="range-select"
        >
          <option value="20">Last 20 Most Recent Shows</option>
          <option value="100">Last 100 Most Recent Shows</option>
          <option value="all">ALL TIME STATS!!! (May take 60+ seconds to process due to Setlist.FM API rate limit)</option>
        </select>

        {/*search button that triggers the redirect to results*/}
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      </div>
  );
}
//export this component so it can be used in Home.js
export default SearchBar;
