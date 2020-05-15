import time
import random
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer
from pos_tagging import POS_Tagging
from visualize_keywords import VisualizeKeywords
from tf_idf import TF_IDF

qa = QuestionAnswer()
pos_tagging = POS_Tagging()
vk = VisualizeKeywords()
tfidf = TF_IDF()

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

        # Generate context using answer.
        context = []
        for doc in answer['abstract']:
            context.append(doc)
        
        # Generate "what are" questions based on context using POS tagging
        POS_tagging_set = set()
        for doc in context:
            try:
                question_list = pos_tagging.parse(doc)
            except:
                pass

            # Append non-empty questions
            for question in question_list:
                if len(question) > 1:
                    # Adding to a set() ensures questions are unique
                    POS_tagging_set.add(question)
        POS_tagging_list = list(POS_tagging_set)
        
        # Generate top words based on context using TDIDF
        tfidf_list = tfidf.get_top_words(context)

        # Concat and shuffle
        suggestions = tfidf_list + POS_tagging_list
        random.shuffle(suggestions)

        output = {
            'answer': answer,
            'suggestions': suggestions
        }

        return jsonify(output)

    # TODO: Download 3_BERT_squad from google drive and put inside models folder
    @app.route('/visualize/<question>/<context>')
    def visualize(question, context):
        keywords = vk.get_scores(question, context)
        return jsonify(keywords)

    return app
