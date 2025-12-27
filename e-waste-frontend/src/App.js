import React, { useState } from 'react';
import UploadImage from './components/UploadImage';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="App">
      <header>
        <h1>♻️ E-Waste Classification System</h1>
        <p>AI-powered e-waste identification and recycling guidance</p>
      </header>

      <main>
        {!result ? (
          <UploadImage onUploadSuccess={setResult} />
        ) : (
          <ResultsDisplay result={result} />
        )}
      </main>

      <footer>
        <p>For educational purposes | AI Internship Project</p>
        <p>♻️ Protect the environment - Dispose e-waste responsibly</p>
      </footer>
    </div>
  );
}

export default App;