import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import About from './pages/About';
import Home from './pages/Home';
import Instructions from './pages/Instructions';
import Game from './pages/Game';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

export default App;
