import { useEffect } from 'react';
import { fetchArtistNetwork } from '../utils/wikidata.jsx';

export default function PaintingLoader({ artistId, onLoad, onError, onLoading }) {
  useEffect(() => {
    const loadData = async () => {
      onLoading(true);
      try {
        const network = await fetchArtistNetwork(artistId);
        const filtered = network.filter(item => item.painting.image && item.painting.date);

        const paintingsWithMeta = [];

        for (const item of filtered) {
          const { painting, artist, mentor } = item;
          const relation =
            painting.creator.id === artist.id
              ? 'By main artist'
              : mentor
              ? `Mentored by ${mentor.name}`
              : 'Related artist';

          paintingsWithMeta.push({
            id: painting.id,
            title: painting.title,
            artist: painting.creator.name,
            src: painting.image,
            alt: `${painting.title} by ${painting.creator.name}`,
            relation,
            date: painting.date,
            funFact: `Created by ${painting.creator.name}`, // Customize as needed
          });

          // Shuffle the array so gameplay order changes dynamically as paintings come in
          const shuffledOrder = [...paintingsWithMeta]
            .map(p => ({ p, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ p }) => p);

          // Call onLoad progressively with current batch of paintings & shuffled order
          onLoad([...paintingsWithMeta], shuffledOrder);
        }
      } catch (error) {
        console.error('Error loading paintings:', error);
        if (onError) onError(error);
      } finally {
        onLoading(false);
      }
    };

    loadData();
  }, [artistId, onLoad, onError, onLoading]);

  return null;
}
