import time
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer
from question_generator import QuestionGenerator

qa = QuestionAnswer()
qg = QuestionGenerator()


def create_app():
    app = Flask(__name__)

    @app.route('/time')
    def get_current_time():
        content = {'time': time.time()}
        # Must jsonify before return data
        return jsonify(content)

    @app.route('/query/<question>')
    def query(question):
        answer = qa.query(question)
        return jsonify(answer)

    # Need to pass string literals
    # i.e. Coronavirus""disease""(COVID-19)""is""an""infectious""disease""caused""by""a""newly""discovered""coronavirus.
    @app.route('/rolling_questions/<answer>')
    def rolling_questions(answer):
        question_list = qg.parse(answer)
        return jsonify({'questions': question_list})

    return app
