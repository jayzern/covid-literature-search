# References: https://stevenloria.com/tf-idf/

import math
from textblob import TextBlob as tb

class TF_IDF:
    def __init__(self):
        self.NUM_WORDS = 3

    def get_top_words(self, doc_list):
        top_words = []
        # Turn into textblob
        bloblist = [tb(doc) for doc in doc_list]
        
        for i, blob in enumerate(bloblist):
            # Compute tfidf scores and sort them in descending order
            scores = {word: self.tfidf(word, blob, bloblist) for word in blob.words}
            sorted_words = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            # Get top 3
            word_list = list(map(lambda x: x[0], sorted_words[:self.NUM_WORDS]))
            # Turn into single string
            word_string = ', '.join(word_list)
            top_words.append(word_string)
        
        return top_words


    def tf(self, word, blob):
        return blob.words.count(word) / len(blob.words)

    def n_containing(self, word, bloblist):
        return sum(1 for blob in bloblist if word in blob.words)

    def idf(self, word, bloblist):
        return math.log(len(bloblist) / (1 + self.n_containing(word, bloblist)))

    def tfidf(self, word, blob, bloblist):
        return self.tf(word, blob) * self.idf(word, bloblist)