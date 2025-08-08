export const buildSparqlQuery = (artistId) => `
SELECT DISTINCT ?artist ?artistLabel ?mentor ?mentorLabel ?painting ?paintingLabel ?paintingCreator ?paintingCreatorLabel ?image WHERE {
  VALUES ?artist { wd:${artistId} }

  OPTIONAL { ?artist wdt:P184 ?mentor . }

  ?painting wdt:P31 wd:Q3305213;
            wdt:P170 ?paintingCreator .

  OPTIONAL { ?painting wdt:P18 ?image . }

  FILTER(?paintingCreator = ?artist || ?paintingCreator = ?mentor)

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

    return data.results.bindings.map(item => ({
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
      },
    }));
  } catch (error) {
    console.error('Error fetching Wikidata network:', error);
    return [];
  }
}
