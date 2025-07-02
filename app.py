# app.py
from flask import Flask, request, jsonify
from prophet import Prophet
from huggingface_hub import hf_hub_download
import pandas as pd
import joblib
import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")

HF_REPO_ID = "MLwithSam/rossmann-forecast-models"
CACHE_DIR = "./hf_models_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

@app.route("/forecast", methods=["POST"])
def forecast():
    try:
        data = request.get_json()
        store_id = data.get("store_id")
        days = int(data.get("days", 30))

        if store_id is None:
            return jsonify({"error": "Missing store_id"}), 400

        # Download the model from Hugging Face (cached after first use)
        model_filename = f"prophet_store_{store_id}.pkl"
        model_path = hf_hub_download(
            repo_id=HF_REPO_ID,
            filename=model_filename,
            cache_dir=CACHE_DIR
        )

        model = joblib.load(model_path)
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        output = forecast[["ds", "yhat"]].tail(days).to_dict(orient="records")

        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
