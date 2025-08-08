// src/pages/Gallery.js
import React, { useEffect, useState } from 'react';
import { searchPaintings } from '../utils/aic';

function Gallery() {
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching paintings...');
      try {
        const data = await searchPaintings('impressionism');
        console.log('Raw API response:', data);

        if (data && data.data) {
          console.log('Paintings found:', data.data.length);
          setPaintings(data.data);
        } else {
          console.warn('No paintings found or unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching paintings:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="gallery">
      {paintings.map((painting) => (
        <div key={painting.id}>
          <h3>{painting.title}</h3>
          <p>{painting.artist_display}</p>
          <p>{painting.date_display}</p>
          <img
            src={`https://www.artic.edu/iiif/2/${painting.image_id}/full/843,/0/default.jpg`}
            alt={painting.title}
            width={300}
          />
        </div>
      ))}
    </div>
  );
}

export default Gallery;
