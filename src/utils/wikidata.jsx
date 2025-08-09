export const buildSparqlQuery = (artistId) => `
SELECT DISTINCT ?artist ?artistLabel ?mentor ?mentorLabel ?painting ?paintingLabel ?paintingCreator ?paintingCreatorLabel ?image ?date WHERE {
  VALUES ?artist { wd:${artistId} }

  OPTIONAL { ?artist wdt:P184 ?mentor . }

  ?painting wdt:P31 wd:Q3305213;
            wdt:P170 ?paintingCreator .

  FILTER(?paintingCreator = ?artist || ?paintingCreator = ?mentor)

  OPTIONAL { ?painting wdt:P18 ?image . }
  OPTIONAL { ?painting wdt:P571 ?date . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 50
`;

export async function fetchArtistNetwork(artistId) {
  const query = buildSparqlQuery(artistId);
  const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query);
  const headers = { 
    Accept: 'application/sparql-results+json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    return data.results.bindings
      .map(item => {
        // Parse date string safely, fallback to null
        const date = item.date ? item.date.value : null;

        // Some dates may be full date/time or just year, so parse as Date or fallback
        // We'll keep date as string for sorting, and parse in game.jsx
        return {
          artist: {
            id: item.artist.value.split('/').pop(),
            name: item.artistLabel.value,
          },
          mentor: item.mentor ? {
            id: item.mentor.value.split('/').pop(),
            name: item.mentorLabel.value,
          } : null,
          painting: {
            id: item.painting.value.split('/').pop(),
            title: item.paintingLabel.value,
            creator: {
              id: item.paintingCreator.value.split('/').pop(),
              name: item.paintingCreatorLabel.value,
            },
            image: item.image ? item.image.value : null,
            date, // string or null
          },
        };
      })
      // Filter out paintings without date or image if you want only valid ones
      .filter(p => p.painting.date && p.painting.image);
  } catch (error) {
    console.error('Error fetching Wikidata network:', error);
    return [];
  }
}


