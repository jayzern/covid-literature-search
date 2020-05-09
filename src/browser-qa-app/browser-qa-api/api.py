import time
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer
from question_generator import QuestionGenerator
# from text_similarity import TextSimilarity


qa = QuestionAnswer()
qg = QuestionGenerator()
# sim = TextSimilarity()

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

    # Need to pass string literals
    # i.e. Coronavirus""disease""(COVID-19)""is""an""infectious""disease""caused""by""a""newly""discovered""coronavirus.
    @app.route('/rolling_questions/<answer>')
    def rolling_questions(answer):
        question_list = qg.parse(answer)
        return jsonify({'questions': question_list})

    # @app.route('/compute_similarity_example')
    # def compute_similarity_example():
    #     sentence1 = "Kim Jong Un Reminds World of Nuclear Threat at Fertilizer Plant"
    #     sentence2 = "China has taken a more assertive approach since replacing top officials responsible for Hong Kong earlier this year."
    #     score = sim.get_text_similarity(sentence1, sentence2)
    #     return jsonify({'score': score})

    return app
