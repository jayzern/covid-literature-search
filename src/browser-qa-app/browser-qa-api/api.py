import time
from flask import Flask
from flask import jsonify
from question_answer import QuestionAnswer
from question_generator import QuestionGenerator
# from text_similarity import TextSimilarity
# from visualize_keywords import VisualizeKeywords


qa = QuestionAnswer()
qg = QuestionGenerator()
# sim = TextSimilarity()
# vk = VisualizeKeywords()

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

    # @app.route('/visualize')
    # def visualize():
    #     question = "Bayesian Inference"
    #     answer_text = """we consider extensions to previous models for patient level nosocomial infection in several ways provide a specification of the likelihoods for these new models specify new update steps required for stochastic integration and provide programs that implement these methods to obtain parameter estimates and model choice statistics previous susceptibleinfected models are extended to allow for a latent period between initial exposure to the pathogen and the patient becoming themselves infectious and the possibility of decolonization we allow for multiple facilities such as acute care hospitals or longterm care facilities and nursing homes and for multiple units or wards within a facility patient transfers between units and facilities are tracked and accounted for in the models so that direct importation of a colonized individual from one facility or unit to another might be inferred we allow for constant transmission rates rates that depend on the number of colonized individuals in a unit or facility or rates that depend on the proportion of colonized individuals statistical analysis is done in a bayesian framework using markov chain monte carlo methods to obtain a sample of parameter values from their joint posterior distribution cross validation deviance information criterion and widely applicable information criterion approaches to model choice fit very naturally into this framework and we have implemented all three we illustrate our methods by considering model selection issues and parameter estimation for data on methicilinresistant staphylococcus aureus surveillance tests over 1 year at a veterans administration hospital comprising seven wards || https://academic.oup.com/imammb/article-pdf/35/Supplement_1/i29/25802099/dqx010.pdf"""
    #     keywords = vk.get_scores(question, answer_text)
    #     print(keywords)

    #     return keywords

    return app
