import React, { useState } from 'react';
import './styles.css';
import Dashboard from './Dashboard';

// ✅ import backend function
import { sendFileForPrediction } from './predictionService';

export default function App() {
  const [view, setView] = useState('upload');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [futureCycles, setFutureCycles] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;

    setFile(picked);
    setFileName(picked.name);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    if (futureCycles < 1 || futureCycles > 500) {
      alert('Please enter a number between 1 and 500 for future cycles');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendFileForPrediction(file, futureCycles);
      setPredictionData(result);
      setView('dashboard');
    } catch (err) {
      console.error(err);
      alert('Prediction failed, check server console');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunNewPrediction = () => {
    setFile(null);
    setFileName('');
    setPredictionData(null);
    setFutureCycles(50);
    setView('upload');
  };

  return (
    <div className="App-container">
      <div className="header">
        <h1>Battery Predictor</h1>
      </div>

      {view === 'upload' && (
        <div className="upload-container">
          <h2>Upload Your Data</h2>
          <p className="upload-instructions">
            Please upload the .csv or .xlsx file with your battery's cycle data.
          </p>

          <label htmlFor="file-upload" className="file-input-label btn-primary">
            Choose File
          </label>

          <input
            id="file-upload"
            className="file-input-hidden"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />

          {fileName && <p className="file-name">📄 {fileName}</p>}

          <div className="future-cycles-input">
            <label htmlFor="future-cycles" className="future-cycles-label">
              Number of Future Cycles to Predict:
            </label>
            <input
              id="future-cycles"
              type="number"
              min="1"
              max="500"
              value={futureCycles}
              onChange={(e) => setFutureCycles(parseInt(e.target.value) || 50)}
              className="future-cycles-field"
              disabled={isLoading}
            />
          </div>

          {file && (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ marginTop: '20px' }}
            >
              {isLoading ? 'Processing...' : 'Run Prediction'}
            </button>
          )}
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard
          fileName={fileName}
          predictionData={predictionData} // ✅ pass API output
          onRunNewPrediction={handleRunNewPrediction}
        />
      )}
    </div>
  );
}
