// React frontend (App.jsx)
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [storeId, setStoreId] = useState('');
  const [days, setDays] = useState(30);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store IDs that are missing
  const unavailableStores = new Set([
    2, 4, 5, 6, 17, 18, 26, 28, 34, 37, 44, 54, 55, 57, 59, 60, 65, 72, 78, 85,
    87, 88, 95, 96, 97, 1006, 1017, 1018, 1021, 1023, 1029, 1030, 1032, 1033,
    1034, 1035, 1043, 1046, 1055, 1069, 1074, 1075, 1081, 1082, 1085, 1090,
    1093, 1095, 1098, 1108, 1110
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForecast([]);

    const numericStoreId = parseInt(storeId);

    if (unavailableStores.has(numericStoreId)) {
      setError(`Sorry, store ID ${numericStoreId} is not available for forecasting.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: numericStoreId, days: days })
      });
      const data = await res.json();
      if (res.ok) {
        setForecast(data);
      } else {
        throw new Error(data.error || 'Forecast failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Rossmann Sales Forecast App</h1>
      <p className="intro">
        This application was built to demonstrate how machine learning can be applied to time-series forecasting in the retail sector. 
        Using historical sales data and holiday trends, the app predicts future daily sales for Rossmann retail stores in Germany.
        <br /><br />
        The purpose of this app is to assist store managers, analysts, or anyone managing retail operations in planning ahead — 
        whether it's for inventory, staffing, or revenue estimation. This model can be adapted to any supermarket or retail chain 
        in other countries by training on their specific historical data.
        <br /><br />
        Note: Some store IDs (based on missing training data) are not available for forecasting. If you enter one of these, you'll be notified.
        <br /><br />
        To use: Simply enter a store ID between 1–1115 and the number of days you'd like to forecast.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          placeholder="Enter store ID (e.g. 1)"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Days (e.g. 30)"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
        />
        <button type="submit">Get Forecast</button>
      </form>

      {loading && <p className="loading">Generating forecast...</p>}
      {error && <p className="error">{error}</p>}

      {forecast.length > 0 && (
        <div className="results">
          <h3>Forecast for store ID {storeId} — next {days} days</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted Sales (EUR)</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((item, i) => (
                <tr key={i}>
                  <td>{item.ds}</td>
                  <td>&euro;{Math.round(item.yhat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="footer">
        <p>
          Project by <a href="https://github.com/Mightysam01/time-series-forecasting-rossmann" target="_blank" rel="noopener noreferrer">Mightysam01</a> | 
          Models hosted on <a href="https://huggingface.co/MLwithSam/rossmann-forecast-models" target="_blank" rel="noopener noreferrer">Hugging Face</a>
        </p>
      </footer>
    </div>
  );
}
