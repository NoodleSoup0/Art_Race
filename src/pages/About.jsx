import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function About() {
  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <h1>About ArtRace / Credits</h1>
        <hr className="center-line" aria-hidden="true" />
        <p>Created to provide an accessible way to explore art visually and interactively.</p>
        <p>Credit for information and images to:</p>
        <p>
          <a
            href="https://www.moma.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Museum of Modern Art
          </a>
        </p>
        <p>
          <a
            href="https://metmuseum.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The MET Collection API
          </a>
        </p>
        <p>
          <a
            href="https://api.artic.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Art Institute of Chicago API
          </a>
        </p>
        <p>
          <a
            href="https://www.rijksmuseum.nl/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rijksmuseum API
          </a>
        </p>
        <p>
          <a
            href="https://www.wikiart.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            WikiArt API
          </a>
        </p>
      </main>
    </>
  );
}

export default About;
