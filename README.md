# Rossmann Sales Forecasting App

This project predicts daily sales for Rossmann retail stores using Facebook Prophet and historic data. It was built as a full-stack machine learning application using:

- Facebook Prophet (for time-series forecasting)
- Flask (for API backend)
- React (for frontend interface)
- Hugging Face Hub (to store 850+ pretrained `.pkl` models)

---

## What This App Does

- Accepts a **store ID** and **forecast period** (e.g. 30 days)
- Loads the store-specific Prophet model from Hugging Face
- Returns predicted daily sales as a table
- Renders a clean, responsive frontend for business use

---

## How To Use

1. Enter a store ID (between `1` and `1115`)
2. Choose how many future days you'd like to forecast (e.g. `30`)
3. Click `Get Forecast`
4. View the prediction table for the selected store

---

## Backend Setup

- Flask API (`app.py`) with endpoint: `POST /forecast`
- Loads `prophet_store_<ID>.pkl` model from Hugging Face
- Example request:

```json
POST /forecast
{ "store_id": 3, "days": 30 }
```

---

## Frontend

Built with React (`create-react-app`). Talks to the Flask API on Render via fetch. Hosted live using **Vercel**.

---

## Hosting

- Backend: [Flask on Render](https://render.com)
- Models: [Hugging Face Model Repo](https://huggingface.co/MLwithSam/rossmann-forecast-models)
- Frontend: [React on Vercel](https://vercel.com)

---

## File Structure

```
     rossmann-forecast/
├── app.py
├── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
├── saved_models/ (optional for local runs)
```

---

## Status

MVP complete  
Ready for extension with charts, CSV upload, or dashboards

---

## Author

Built by [@Mightysam01](https://huggingface.co/MLwithSam)
