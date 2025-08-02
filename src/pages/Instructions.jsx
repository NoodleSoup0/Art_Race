import Navbar from '../components/Navbar';

function Instructions() {
  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <h1>How to Play</h1>
        <hr className="center-line" aria-hidden="true" />
        <p>Race from the starting painting to the target painting in no more than 5 steps.</p>
        <p>Choose paintings connected to the current painting by artist influence, style, era, or movement.</p>
        <p>Double click to enlarge the images in Gallery View!</p>
        <p>Backtrack anytime to explore new paths through the “Track Your Steps” Progress Tracker.</p>
      </main>
    </>
  );
}

export default Instructions;
