import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { fetchArtistNetwork } from '../utils/wikidata.jsx';
import '../styles/Game.css';
import { getFunFact } from '../components/FunFacts.jsx';

function Game() {
  const [paintings, setPaintings] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [collectedPaintings, setCollectedPaintings] = useState([]);

  const TOTAL_POSSIBLE = 50; // adjust as needed

  useEffect(() => {
    startNewRound();
  }, []);

  const loadRoundData = async () => {
    setLoading(true);
    setProgress(0);

    try {
      const network = await fetchArtistNetwork('Q5582');
      setProgress(30);

      const filtered = network.filter(
        item => item.painting.image && item.painting.date
      );

      const total = filtered.length;
      const paintingsWithMeta = [];

      for (let i = 0; i < total; i++) {
        const { painting, artist, mentor } = filtered[i];

        const fact = await getFunFact(painting.creator.name, painting.title);

        paintingsWithMeta.push({
          id: painting.id,
          title: painting.title,
          artist: painting.creator.name,
          src: painting.image,
          alt: `${painting.title} by ${painting.creator.name}`,
          date: painting.date,
          funFact: fact,
        });

        // Update progress from 30% to 90% as fun facts load
        setProgress(30 + Math.round(((i + 1) / total) * 60));
      }

      setProgress(100);

      // Remove already collected paintings from pool
      const available = paintingsWithMeta.filter(
        p => !collectedPaintings.some(c => c.id === p.id)
      );

      if (available.length < 5) {
        console.warn('Not enough new paintings available, game might repeat.');
      }

      // Sort by date ascending
      const sortedPaintings = [...available].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Pick 5 paintings: earliest fixed first, 4 others shuffled
      const mainPainting = sortedPaintings[0];
      const rest = sortedPaintings.slice(1);

      const shuffledRest = rest
        .map(p => ({ p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, 4)
        .map(({ p }) => p);

      const finalShuffled = [mainPainting, ...shuffledRest];

      setPaintings(paintingsWithMeta);
      setShuffled(finalShuffled);
    } catch (error) {
      console.error('Error loading paintings:', error);
      setPaintings([]);
      setShuffled([]);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const startNewRound = async () => {
    setResult(null);
    setHintsVisible(false);
    setDragIndex(null);
    await loadRoundData();
  };

  const onDragStart = (index) => setDragIndex(index);

  const onDragOver = (index, e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newOrder = [...shuffled];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setDragIndex(index);
    setShuffled(newOrder);
  };

  const checkOrder = () => {
    const choicePaintings = shuffled.slice(1, 5);

    // Correct order sorted by date
    const correctOrder = [...choicePaintings].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    console.log(
      'Correct order of choices by date:',
      correctOrder.map(p => `${p.title} (${p.date})`)
    );

    console.log(
      'Current order of choices:',
      choicePaintings.map(p => `${p.title} (${p.date})`)
    );

    const isCorrect = choicePaintings.every(
      (p, i, arr) => i === 0 || new Date(arr[i - 1].date) <= new Date(p.date)
    );

    if (isCorrect) {
      setResult('Correct! 🎉');
      setCollectedPaintings(prev => {
        const newOnes = shuffled.filter(
          p => !prev.some(existing => existing.id === p.id)
        );
        return [...prev, ...newOnes];
      });
    } else {
      setResult('Not quite, try again.');
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="centered-main full-height">
          <p>Loading paintings... {progress}%</p>
          <div className="progress-bar-container" aria-label="Loading progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </main>
      </>
    );
  }

  if (paintings.length === 0) {
    return (
      <>
        <Navbar />
        <main className="centered-main full-height">
          <p>No paintings with images found.</p>
        </main>
      </>
    );
  }

  const mainPainting = shuffled[0];
  const choices = shuffled.slice(1, 5);

  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <div className="game-top">
          <img
            src={mainPainting.src}
            alt={mainPainting.alt}
            className="target-image"
            loading="lazy"
            onDoubleClick={() => openLightbox(0)}
            tabIndex={0}
          />
          <div className="painting-info">
            <p>
              <strong>Earliest Painting:</strong> {mainPainting.title} by {mainPainting.artist} (
              {new Date(mainPainting.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              )
            </p>

            <div style={{ margin: '10px 0' }}>
              <button className="button" onClick={checkOrder} style={{ marginRight: 10 }}>
                Check Order
              </button>
              <button className="button" onClick={() => setHintsVisible(!hintsVisible)}>
                {hintsVisible ? 'Hide Hints' : 'Show Hints'}
              </button>
            </div>
          </div>

          <div className="tracker">
            <h2>Track Your Collection</h2>
            <p>Collected: {collectedPaintings.length} / {TOTAL_POSSIBLE}</p>
            <div className="tracker-scroll" tabIndex={0}>
              {collectedPaintings.map((painting) => (
                <div key={painting.id} className="tracker-item">
                  <img src={painting.src} alt={painting.alt} loading="lazy" />
                  <p>{painting.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="game-bottom">
          {choices.map((img, index) => (
            <div
              className="choice"
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index + 1)}
              onDragOver={(e) => onDragOver(index + 1, e)}
              tabIndex={0}
              aria-grabbed="false"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onDoubleClick={() => openLightbox(index + 1)}
              />
              <p className="title">{img.title}</p>
              <p className="artist">{img.artist}</p>
              {hintsVisible && img.funFact && (
                <p style={{ fontStyle: 'italic', color: '#555' }}>
                  💡{' '}
                  {img.funFact.url ? (
                    <a
                      href={img.funFact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#555', textDecoration: 'underline' }}
                    >
                      {img.funFact.extract}
                    </a>
                  ) : (
                    img.funFact.extract
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {result && (
          <p
            style={{
              marginTop: 15,
              fontWeight: 'bold',
              color: result.startsWith('Correct') ? 'green' : 'red',
            }}
            aria-live="polite"
          >
            {result}
          </p>
        )}

        {result?.startsWith('Correct') && (
          <button className="button" onClick={startNewRound}>
            Start Next Round
          </button>
        )}
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        images={shuffled}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setLightboxIndex((lightboxIndex - 1 + shuffled.length) % shuffled.length)
        }
        onNext={() => setLightboxIndex((lightboxIndex + 1) % shuffled.length)}
      />
    </>
  );
}

export default Game;
