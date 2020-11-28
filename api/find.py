from flask import Flask, Response, jsonify
app = Flask(__name__)
from time import sleep
import pandas as pd
import random
from pathlib import Path

@app.route('/', defaults={'path': ''}, methods=["POST"])
@app.route('/<path:path>', methods=["POST"])
def catch_all(path):
    sleep(5)
    csv = pd.read_csv(Path(__file__).parent.parent / "scraper/outputs/iosco.csv")
    if random.randint(1, 100) > 90:
        return {"statusCode": 500}
    else:
        return jsonify({ "results": csv.transpose().to_dict() })