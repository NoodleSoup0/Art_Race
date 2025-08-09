import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';

function Home() {
  return (
    <div>
      <Navbar />

      <main className="centered-main full-height spaced-text">
        <h1 className="main-header">Welcome to ArtRace!</h1>
        <p className="main-header">
          Travel through time by unraveling the perfect chronological order of masterpieces, collecting iconic paintings as you master the art of history—one round, one artist at a time.
        </p>
        <div className="center-buttons">
          <Link to="/game" className="button">Start Game</Link>
          <Link to="/instructions" className="button">Instructions</Link>
        </div>
      </main>

      <footer>
        <p>
          contact: <a href="mailto:linhly2025@u.northwestern.edu">linhly2025@u.northwestern.edu</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;
