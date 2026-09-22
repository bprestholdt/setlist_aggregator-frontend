import React from 'react';
import './StatsPanel.css';
import '../App.css';

//one ranked song list card (encores, openers, rarest, most played share the same layout)
//formatCount controls the text in parentheses after each song, e.g. "12x"
function SongListCard({ title, songs, emptyText, formatCount = (count) => `${count}x` }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      {Array.isArray(songs) && songs.length > 0 ? (
        <ol>
          {songs.map((song, index) => (
            <li key={index}>
              {song.title} ({formatCount(song.count)})
            </li>
          ))}
        </ol>
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}

//card showing how much the artist's shows repeat each other
function ConsistencyCard({ consistency }) {
  const hasRepeatRate = consistency && typeof consistency.repeatRate === 'number';
  return (
    <div className="stat-card">
      <h3>Setlist Consistency</h3>
      {consistency ? (
        <>
          {hasRepeatRate && (
            <>
              <p>{Math.round(consistency.repeatRate)}% repeat</p>
              <small className="stat-caption">of each show's songs were also played at the previous show</small>
            </>
          )}
          <ul className="stat-details">
            <li>{consistency.coreSongs} songs played at 90%+ of shows</li>
            <li>{consistency.uniqueSongs} different songs overall</li>
            <li>{consistency.oneOffs} played at only one show</li>
          </ul>
        </>
      ) : (
        <p>Consistency data unavailable</p>
      )}
    </div>
  );
}

function StatsPanel({ averageLength, encores, rarest, openers, mostPlayed, consistency, transitions, bustouts, artistName, range }) {
  const rangeText = range === "all" ? "entire setlist history" : `last ${range} shows`;

  return (
    <div style={{ width: '100%' }}>
      {artistName && (
        <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
          <h2 style={{
            fontSize: '3rem',
            marginTop: '0',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            textShadow: '0 0 12px rgba(255, 80, 0, 0.55), 0 0 20px rgba(255, 140, 0, 0.2)',
            position: 'relative',
          }}>
            💯
            <span className="flame-text" style={{
              fontFamily: "'Bangers', cursive",
              backgroundImage: 'url("/Flames.gif")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'flicker-soft 2s infinite',
            }}>
              Stats for {artistName}'s {rangeText}
            </span>{' '}
            👀
          </h2>
        </div>
      )}

      <div className="stats-grid">

        <SongListCard title="Top Encore Songs" songs={encores} emptyText="Encore Data unavailable" />
        <SongListCard title="Top Opener Songs" songs={openers} emptyText="Opener Data unavailable" />
        <SongListCard title="Rarest Songs" songs={rarest} emptyText="Rarest Data unavailable" />
        <SongListCard title="Most Played Songs" songs={mostPlayed} emptyText="Most Played Data unavailable" />

        <div className="stat-card">
          <h3>Average Songs Per Show</h3>
          {typeof averageLength === 'number' && !isNaN(averageLength) ? (
            <p>{averageLength.toFixed(2)} songs per show</p>
          ) : (
            <p>Average setlist length not available</p>
          )}
        </div>

        <ConsistencyCard consistency={consistency} />
        <SongListCard title="Signature Transitions" songs={transitions} emptyText="No song pairs repeated in this range" />
        <SongListCard
          title="Biggest Bust-outs"
          songs={bustouts}
          emptyText="No long-absent songs returned in this range"
          formatCount={(count) => `back after ${count} shows`}
        />
      </div>
    </div>
  );
}

export default StatsPanel;
