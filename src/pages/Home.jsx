import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />

      <main className="centered-main full-height spaced-text">
        <h1 className="main-header">Welcome to ArtRace!</h1>
        <p className="main-header">
          Navigate between paintings connected by artists, styles, movements and eras.
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
