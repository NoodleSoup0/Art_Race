import Navbar from '../components/Navbar';

function Instructions() {
  return (
    <>
      <Navbar />
      <main className="centered-main full-height spaced-text">
        <h1>How to Play</h1>
        <hr className="center-line" aria-hidden="true" />
        <p>Start each round by examining the earliest painting displayed at the top.</p>
        <p>Drag and drop the other four paintings to arrange them in the correct chronological order by their creation dates.</p>
        <p>Click <strong>“Check Order”</strong> to see if your arrangement is correct.</p>
        <p>If you’re right, all five paintings will be added to your personal collection in the “Track Your Collection” gallery.</p>
        <p>Use the <strong>“Start Next Round”</strong> button to challenge yourself with a new set of paintings.</p>
        <p>Double-click any painting to enlarge it in the Gallery View for a closer look.</p>
        <p>Keep collecting paintings to build your ultimate art history collection!</p>
      </main>
    </>
  );
}

export default Instructions;
 