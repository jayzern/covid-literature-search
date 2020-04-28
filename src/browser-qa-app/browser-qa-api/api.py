import time
from flask import Flask
from flask import jsonify


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    content = {'time': time.time()}
    return jsonify(content)