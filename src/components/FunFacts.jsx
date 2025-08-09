// Loose match: ignore "the", punctuation, case, and extra spaces
function looseTitleMatch(input, wikiTitle) {
  const normalize = str => str
    .toLowerCase()
    .replace(/\bthe\b/g, '')       // remove "the"
    .replace(/[^\w\s]/g, '')       // remove punctuation
    .replace(/\s+/g, ' ')          // normalize spaces
    .trim();
  return normalize(input) === normalize(wikiTitle);
}

// Simple similarity by word overlap ratio
function stringSimilarity(a, b) {
  const normalize = s => s.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const wordsA = new Set(normalize(a).split(/\s+/));
  const wordsB = new Set(normalize(b).split(/\s+/));
  const intersection = [...wordsA].filter(w => wordsB.has(w));
  return intersection.length / Math.max(wordsA.size, wordsB.size);
}

// Helper to check if a Wikipedia page exists (prevents 404 fetches)
async function doesWikipediaPageExist(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(title)}`
    );
    if (!res.ok) return false;
    const data = await res.json();

    const pages = data.query?.pages;
    if (!pages) return false;

    // If any page has "missing" property, page doesn't exist
    for (const pageId in pages) {
      if (pages[pageId].missing !== undefined) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function fetchWikipediaSummary(title, artist = null) {
  // Pre-check page existence to avoid 404 fetch
  const exists = await doesWikipediaPageExist(title);
  if (!exists) return null;

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const data = await res.json();

    // Treat very short or empty summaries as missing
    if (!data.extract || data.extract.length < 50) return null;

    if (
      !artist ||
      looseTitleMatch(title, data.title) || // loose match
      data.extract.toLowerCase().includes(artist.toLowerCase())
    ) {
      return {
        extract: data.extract,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function searchWikipediaPage(title, artist) {
  const queries = [];

  if (artist) {
    queries.push(`${title} (${artist})`);
  }
  queries.push(title);

  if (artist) {
    queries.push(`${title} ${artist}`);
  }

  let allResults = [];

  for (const q of queries) {
    try {
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(q)}`
      );
      const searchData = await searchRes.json();
      if (searchData.query && searchData.query.search) {
        allResults = allResults.concat(searchData.query.search);
      }
    } catch {
      // ignore fetch errors per query
    }
  }

  if (allResults.length === 0) return null;

  // Deduplicate results by title
  const uniqueResultsMap = new Map();
  for (const r of allResults) {
    uniqueResultsMap.set(r.title, r);
  }
  const uniqueResults = [...uniqueResultsMap.values()];

  // Filter out disambiguation etc
  const filtered = uniqueResults.filter(r => {
    const t = r.title.toLowerCase();
    const s = r.snippet.toLowerCase();
    return !t.includes('disambiguation') && !s.includes('may refer to') && !s.includes('refer to');
  });

  if (filtered.length === 0) return null;

  // Pick best by similarity
  let bestMatch = null;
  let bestScore = 0;
  for (const result of filtered) {
    const score = stringSimilarity(title, result.title);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = result.title;
    }
  }

  return bestMatch;
}

export async function getFunFact(artist, painting) {
  // 1. Try direct fetch (with existence check inside)
  let factObj = await fetchWikipediaSummary(painting, artist);
  if (factObj) return factObj;

  // 2. Try search fallback
  const foundTitle = await searchWikipediaPage(painting, artist);
  if (foundTitle) {
    // Also check existence before fetch summary (optional, since fetchWikipediaSummary does it)
    factObj = await fetchWikipediaSummary(foundTitle, artist);
    if (factObj) return factObj;
  }

  // 3. Nothing found at all
  return {
    extract: `No interesting fun fact found for "${painting}"${artist ? ` by ${artist}` : ''}.`,
    url: null,
  };
}
