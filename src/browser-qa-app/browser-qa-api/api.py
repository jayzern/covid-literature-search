import time
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer

qa = QuestionAnswer()


def create_app():
    app = Flask(__name__)

    @app.route('/time')
    def get_current_time():
        content = {'time': time.time()}
        return content

    @app.route('/query/<question>')
    def query(question):
        return qa.query(question)

    return app
