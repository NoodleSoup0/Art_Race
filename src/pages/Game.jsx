import { useState } from 'react';
import Lightbox from '../components/Lightbox.jsx';
import Navbar from '../components/Navbar.jsx';
import '../styles/Game.css'

function Game() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = [
    {
      src: '/images/night-watch.jpg',
      alt: 'The Night Watch by Rembrandt van Rijn',
    },
    {
      src: '/images/sample1.jpg',
      alt: 'Las Meninas by Diego Velázquez',
    },
    {
      src: '/images/sample2.jpg',
      alt: 'Girl with a Pearl Earring by Johannes Vermeer',
    },
    {
      src: '/images/sample3.jpg',
      alt: 'The Hay Wain by John Constable',
    },
    {
      src: '/images/sample4.jpg',
      alt: 'The Goldfinch by Carel Fabritius',
    },
  ];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
            <p><strong>Current:</strong> “The Night Watch” by Rembrandt van Rijn</p>
            <p><strong>Target:</strong> “The Persistence of Memory”, Salvador Dalí</p>
          </div>
          <div className="tracker">
            <h2>Track Your Steps</h2>
            <div className="tracker-scroll" tabIndex={0}>
              <div className="circle">1</div>
              <p>"The Night Watch" by Rembrandt van Rijn</p>
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
                onDoubleClick={() => {
                  console.log("Opening lightbox:", index + 1);
                  openLightbox(index + 1);
                }}
              />
              <p className="title">{img.alt.split(' by ')[0]}</p>
              <p className="artist">{img.alt.split(' by ')[1]}</p>
              <p className="link-type"> {/* Replace with actual link types if available */}</p>
            </div>
          ))}
        </div>
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
        onNext={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
      />
      
    </>
  );
}

export default Game;
