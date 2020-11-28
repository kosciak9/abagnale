from flask import Flask, Response, jsonify
app = Flask(__name__)
import pandas as pd
from pathlib import Path

@app.route('/', defaults={'path': ''}, methods=["POST"])
@app.route('/<path:path>', methods=["POST"])
def catch_all(path):
    csv = pd.read_csv(Path(__file__).parent.parent / "scraper/outputs/iosco.csv")
    return jsonify(csv.transpose().to_dict())