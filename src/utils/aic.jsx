// src/api/aic.js
import axios from 'axios';

const BASE_URL = 'https://api.artic.edu/api/v1';

export const searchPaintings = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/artworks/search`, {
      params: {
        q: query,
        fields: 'id,title,artist_display,date_display,image_id',
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching paintings:', error);
    return null;
  }
};
