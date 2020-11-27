from flask import Flask, Response
app = Flask(__name__)
import pandas as pd

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return pd.__version__