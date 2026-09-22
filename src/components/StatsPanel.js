import React from 'react';
import './StatsPanel.css';
import '../App.css';

//turn "2026-06-01" into "Jun 1, 2026" (built from parts so the date doesn't shift with time zones)
function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

//"1 show" / "3 shows"
function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

//round a percentage for display, or null if the backend didn't send one
function percent(value) {
  return typeof value === 'number' ? `${Math.round(value)}%` : null;
}

//one headline number in the summary strip at the top
function SummaryTile({ value, label, detail }) {
  return (
    <div className="summary-tile">
      <div className="summary-value">{value ?? '–'}</div>
      <div className="summary-label">{label}</div>
      {detail && <div className="summary-detail">{detail}</div>}
    </div>
  );
}

//strip of headline numbers: how many shows, how long they are, how much they change, where they happen
function SummaryStrip({ summary }) {
  if (!summary) return null;
  return (
    <div className="summary-grid">
      <SummaryTile
        value={summary.shows}
        label={summary.shows === 1 ? 'show analyzed' : 'shows analyzed'}
        detail={summary.firstDate && `${formatDate(summary.firstDate)} – ${formatDate(summary.lastDate)}`}
      />
      <SummaryTile
        value={typeof summary.avgSongs === 'number' ? summary.avgSongs.toFixed(1) : null}
        label="songs per show"
        detail={`Longest ${summary.longestSongs} · Shortest ${summary.shortestSongs}`}
      />
      <SummaryTile
        value={typeof summary.daysBetweenShows === 'number' ? `${summary.daysBetweenShows.toFixed(1)} days` : null}
        label="between shows"
        detail="on average"
      />
      <SummaryTile
        value={percent(summary.repeatRate)}
        label="repeated from the last show"
        detail={`${plural(summary.coreSongs, 'song')} at 90%+ of shows`}
      />
      <SummaryTile
        value={summary.uniqueSongs}
        label="different songs"
        detail={`${summary.oneOffs} played only once`}
      />
      <SummaryTile value={percent(summary.encoreRate)} label="of shows had an encore" />
      <SummaryTile value={percent(summary.coverShare)} label="of songs were covers" />
      <SummaryTile
        value={summary.countries}
        label={summary.countries === 1 ? 'country' : 'countries'}
        detail={`${summary.cities} ${summary.cities === 1 ? 'city' : 'cities'}`}
      />
    </div>
  );
}

//one ranked list card: rank, name on the left, count on the right
//formatCount controls the count text, e.g. "12x" or "95% of shows"
function RankedCard({ title, items, emptyText, formatCount = (count) => `${count}x`, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <h3>{title}</h3>
      {Array.isArray(items) && items.length > 0 ? (
        <ol className="ranked-list">
          {items.map((item, index) => (
            <li key={index}>
              <span className="ranked-name">
                <span className="ranked-number">{item.rank ?? index + 1}.</span> {item.title}
              </span>
              <span className="ranked-count">{formatCount(item.count)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="stat-empty">{emptyText}</p>
      )}
    </div>
  );
}

//tours side by side: shows, songs per show, different songs, and dates for each
function ToursCard({ tours }) {
  return (
    <div className="stat-card wide-card">
      <h3>Tours</h3>
      {Array.isArray(tours) && tours.length > 0 ? (
        <ol className="ranked-list tour-list">
          {tours.map((tour, index) => (
            <li key={index}>
              <span className="ranked-name">{tour.name}</span>
              <span className="tour-meta">
                {plural(tour.shows, 'show')} · {tour.avgSongs.toFixed(1)} songs/show · {tour.uniqueSongs} different songs
                {tour.firstDate && <> · {formatDate(tour.firstDate)} – {formatDate(tour.lastDate)}</>}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="stat-empty">No named tours in this range</p>
      )}
    </div>
  );
}

//a titled group of cards
function StatsSection({ title, children }) {
  return (
    <section className="stats-section">
      <h3 className="section-title">{title}</h3>
      <div className="stats-grid">{children}</div>
    </section>
  );
}

function StatsPanel({ stats, artistName, range }) {
  const rangeText = range === "all" ? "entire setlist history" : `last ${range} shows`;
  const summary = stats?.summary;
  const shows = summary?.shows;
  const avgSongs = summary?.avgSongs;

  //counts shown as a share of the shows analyzed
  const percentOfShows = (count) => (shows ? `${Math.round((count / shows) * 100)}% of shows` : `${count}x`);
  const showCount = (count) => plural(count, 'show');

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

      {!summary ? (
        <p className="stats-none">No setlists found for this artist. Check the spelling, or try a different range.</p>
      ) : (
        <div className="stats-body">
          <SummaryStrip summary={summary} />

          <StatsSection title="The Songs">
            <RankedCard title="Most Played" items={stats.mostPlayed} emptyText="No songs found" formatCount={percentOfShows} />
            <RankedCard title="Rarest" items={stats.rarest} emptyText="No songs found" />
            <RankedCard title="Most Played Covers" items={stats.covers} emptyText="No covers in this range" />
            <RankedCard title="In Rotation" items={stats.rotation} emptyText="Not enough shows to spot rotating songs" formatCount={(count) => `${count}% of shows`} />
            <RankedCard title="New in the Set" items={stats.newSongs} emptyText="No new songs in the latest shows" formatCount={(count) => `${count}x since added`} />
            <RankedCard title="Biggest Bust-outs" items={stats.bustouts} emptyText="No long-absent songs returned" formatCount={(count) => `back after ${count} shows`} />
          </StatsSection>

          <StatsSection title="How the Show Runs">
            <RankedCard title="Openers" items={stats.openers} emptyText="No openers found" />
            <RankedCard title="Main Set Closers" items={stats.closers} emptyText="No closers found" />
            <RankedCard title="Encore Songs" items={stats.encores} emptyText="No encores marked in this range" />
            <RankedCard title="Signature Transitions" items={stats.transitions} emptyText="No song pairs repeated" />
            <RankedCard title="Usually Early" items={stats.early} emptyText="Not enough shows to tell" formatCount={(count) => `song #${count}`} />
            <RankedCard
              title="Saved for Late"
              items={stats.late}
              emptyText="Not enough shows to tell"
              formatCount={(count) => (typeof avgSongs === 'number' ? `song #${count} of ~${Math.round(avgSongs)}` : `song #${count}`)}
            />
          </StatsSection>

          <StatsSection title="On the Road">
            <RankedCard title="Top Cities" items={stats.cities} emptyText="No city data" formatCount={showCount} />
            <RankedCard title="Top Countries" items={stats.countries} emptyText="No country data" formatCount={showCount} />
            <RankedCard title="Top Venues" items={stats.venues} emptyText="No venue data" formatCount={showCount} />
            <ToursCard tours={stats.tours} />
            <RankedCard title="Regional Specials" items={stats.regional} emptyText="No songs played in just one country" formatCount={showCount} />
          </StatsSection>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
