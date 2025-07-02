// React frontend (App.jsx)
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [storeId, setStoreId] = useState('');
  const [days, setDays] = useState(30);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://time-series-forecasting-rossmann.onrender.com/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId, days: days })
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
        This app predicts future daily sales for Rossmann retail stores using historical trends and holiday patterns.
        Simply enter a store ID (1–1115) and choose how many future days you'd like to forecast.
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
          <h3>Forecast for next {days} days</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted Sales</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((item, i) => (
                <tr key={i}>
                  <td>{item.ds}</td>
                  <td>{Math.round(item.yhat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
