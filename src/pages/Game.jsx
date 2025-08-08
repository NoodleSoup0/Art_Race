import { useState, useEffect } from 'react';
import Lightbox from '../components/Lightbox.jsx';
import Navbar from '../components/Navbar.jsx';
import { fetchArtistNetwork } from '../utils/wikidata.jsx';
import '../styles/Game.css';

function Game() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const network = await fetchArtistNetwork('Q5582'); // example: Van Gogh

        // Deduplicate paintings by ID
        const uniquePaintingsMap = new Map();

        network.forEach((item) => {
          const p = item.painting;
          if (!uniquePaintingsMap.has(p.id)) {
            uniquePaintingsMap.set(p.id, {
              id: p.id,
              title: p.title,
              artist: p.creator.name,
              src: p.image || 'https://via.placeholder.com/300x400?text=No+Image',
              relation:
                p.creator.id === item.artist.id
                  ? 'By main artist'
                  : item.mentor
                  ? `Mentored by ${item.mentor.name}`
                  : 'Related artist',
            });
          }
        });

        const uniquePaintings = Array.from(uniquePaintingsMap.values());

        // Put main artist painting first if found
        const mainArtistPaintingIndex = uniquePaintings.findIndex(
          (p) => p.relation === 'By main artist'
        );
        if (mainArtistPaintingIndex > 0) {
          const [mainPainting] = uniquePaintings.splice(mainArtistPaintingIndex, 1);
          uniquePaintings.unshift(mainPainting);
        }

        setPaintings(uniquePaintings);
      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="centered-main full-height">
          <p>Loading art network...</p>
        </main>
      </>
    );
  }

  if (paintings.length === 0) {
    return (
      <>
        <Navbar />
        <main className="centered-main full-height">
          <p>No paintings found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <div className="game-top">
          <img
            src={paintings[0].src}
            alt={`${paintings[0].title} by ${paintings[0].artist}`}
            tabIndex={0}
            className="target-image"
            onDoubleClick={() => openLightbox(0)}
          />
          <div className="painting-info">
            <p>
              <strong>Current:</strong> {paintings[0].title} by {paintings[0].artist}
            </p>
            <p>
              <strong>Target:</strong> “The Persistence of Memory”, Salvador Dalí
            </p>
          </div>
          <div className="tracker">
            <h2>Track Your Steps</h2>
            <div className="tracker-scroll" tabIndex={0}>
              <div className="circle">1</div>
              <p>{paintings[0].title}</p>
              <div className="circle">?</div>
            </div>
          </div>
        </div>

        <div className="game-bottom">
          {paintings.slice(1, 5).map((img, index) => (
            <div className="choice" key={img.id || index}>
              <img
                src={img.src}
                alt={`${img.title} by ${img.artist}`}
                tabIndex={0}
                onDoubleClick={() => openLightbox(index + 1)}
              />
              <p className="title">{img.title}</p>
              <p className="artist">{img.artist}</p>
              <p className="link-type">{img.relation}</p>
            </div>
          ))}
        </div>
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        images={paintings}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((lightboxIndex - 1 + paintings.length) % paintings.length)}
        onNext={() => setLightboxIndex((lightboxIndex + 1) % paintings.length)}
      />
    </>
  );
}

export default Game;
