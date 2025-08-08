import { useState, useEffect } from 'react';
import Lightbox from '../components/Lightbox.jsx';
import Navbar from '../components/Navbar.jsx';
import { searchPaintings } from '../utils/aic'; // Adjust path if needed
import '../styles/Game.css';

function Game() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await searchPaintings('impressionism');
        const data = response?.data?.filter(p => p.image_id).slice(0, 5);

        const formatted = data.map(painting => ({
          src: `https://www.artic.edu/iiif/2/${painting.image_id}/full/843,/0/default.jpg`,
          alt: `${painting.title} by ${painting.artist_display || 'Unknown'}`,
        }));

        setImages(formatted);
      } catch (error) {
        console.error('Error fetching paintings:', error);
      }
    };

    fetchPaintings();
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) {
    return (
      <>
        <Navbar />
        <main className="centered-main full-height">
          <p>Loading paintings...</p>
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
            src={images[0].src}
            alt={images[0].alt}
            tabIndex={0}
            className="target-image"
            onDoubleClick={() => openLightbox(0)}
          />
          <div className="painting-info">
            <p><strong>Current:</strong> {images[0].alt}</p>
            <p><strong>Target:</strong> “The Persistence of Memory”, Salvador Dalí</p>
          </div>
          <div className="tracker">
            <h2>Track Your Steps</h2>
            <div className="tracker-scroll" tabIndex={0}>
              <div className="circle">1</div>
              <p>{images[0].alt}</p>
              <div className="circle">?</div>
            </div>
          </div>
        </div>

        <div className="game-bottom">
          {images.slice(1).map((img, index) => (
            <div className="choice" key={index}>
              <img
                src={img.src}
                alt={img.alt}
                tabIndex={0}
                onDoubleClick={() => openLightbox(index + 1)}
              />
              <p className="title">{img.alt.split(' by ')[0]}</p>
              <p className="artist">{img.alt.split(' by ')[1]}</p>
              <p className="link-type"></p>
            </div>
          ))}
        </div>
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
        }
        onNext={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
      />
    </>
  );
}

export default Game;
