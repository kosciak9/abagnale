from flask import Flask, Response
app = Flask(__name__)
import pandas as pd
from pathlib import Path

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    csv = pd.read_csv(Path(__file__).parent().parent() / "scraper/outputs/iosco.csv")
    return csv.to_json()