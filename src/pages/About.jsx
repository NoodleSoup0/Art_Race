import Navbar from '../components/Navbar';

function About() {
  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <h1>About ArtRace / Credits</h1>
        <hr className="center-line" aria-hidden="true" />
        <p>
          ArtRace is designed to provide an engaging, interactive way to explore art history by
          connecting paintings through artist influence, style, and chronology.
        </p>
        <p>Data and images are primarily sourced from:</p>

        <p>
          <a
            href="https://www.wikidata.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikidata SPARQL Query Service
          </a>{' '}
          — for retrieving artist networks, painting metadata, dates, and images.
        </p>

        <p>
          <a
            href="https://www.wikipedia.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikipedia API
          </a>{' '}
          — for fetching artist and painting summaries and fun facts.
        </p>
      </main>
    </>
  );
}

export default About;
