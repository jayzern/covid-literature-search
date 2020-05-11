import time
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer
from question_generator import QuestionGenerator
from visualize_keywords import VisualizeKeywords

qa = QuestionAnswer()
qg = QuestionGenerator()
vk = VisualizeKeywords()

def create_app():
    app = Flask(__name__)

    @app.route('/time')
    def get_current_time():
        content = {'time': time.time()}
        # Must jsonify before return data
        return jsonify(content)

    @app.route('/query/<question>')
    def query(question):
        print(question)
        answer = qa.query(question)
        return jsonify(answer)

    @app.route('/rolling_questions/<answer>')
    def rolling_questions(answer):
        question_list = qg.parse(answer)
        return jsonify({'questions': question_list})

    # TODO: Download 3_BERT_squad from google drive and put inside models folder
    @app.route('/visualize/<question>/<context>')
    def visualize(question, context):
        keywords = vk.get_scores(question, context)
        print(keywords)
        return jsonify(keywords)

    return app
