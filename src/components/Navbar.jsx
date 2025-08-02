// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import FontSizeControls from './FontsSizeControls'
import '../styles/style.css'

const Navbar = () => {
  return (
    <nav aria-label="Main navigation">
      <Link to="/">Home</Link>
      <Link to="/game">Game</Link>
      <Link to="/instructions">How to Play</Link>
      <Link to="/about">About</Link>

      <FontSizeControls />
    </nav>
  );
};

export default Navbar;
