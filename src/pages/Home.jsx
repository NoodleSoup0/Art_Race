import { Link } from 'react-router-dom';
import '../styles/style.css'
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
    
      <main>
        <h1>Welcome to ArtRace!</h1>
        <p>Navigate between paintings connected by artists, styles, movements and eras.</p>
        <Link to="/game">Start Game</Link> |{" "}
        <Link to="/instructions">Instructions</Link>
      </main>

      <footer>
        <p>contact: <a href="mailto:linhly2025@u.northwestern.edu">linhly2025@u.northwestern.edu</a></p>
      </footer>
    </div>
  );
}

export default Home;
