// Lightbox.jsx
import { useEffect } from 'react';
import '../styles/Lightbox.css';


export default function Lightbox({ isOpen, images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div id="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close gallery">&times;</button>
        <img
          id="lightbox-image"
          src={images[index].src}
          alt={images[index].alt || `Image ${index + 1}`}
        />
        <div className="lightbox-controls">
          <button id="prev" onClick={onPrev} aria-label="Previous image">&#10094;</button>
          <button id="next" onClick={onNext} aria-label="Next image">&#10095;</button>
        </div>
      </div>
    </div>
  );
}
