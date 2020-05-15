import h5py
import re
import pickle as pkl
import numpy as np
import scipy.spatial
from sentence_transformers import SentenceTransformer


EMBEDDING_FILE = "./data/embeddings-gsarti-covidbert-nli.hdf5"
LOOKUP_TABLE_FILE = "./data/text_lookup_processed.pkl"
MODEL_DIR = './model'
NUM_CLOSEST = 5
NUM_BATCH_EMBEDDINGS = 4


class SentenceEmbeddings:
    def __init__(self):
        self.embedder = SentenceTransformer(MODEL_DIR)
        self.batch_embeddings = None
        self.lookup = None
        self.load_data()

    def load_data(self):
        f = h5py.File(EMBEDDING_FILE, 'r')
        self.batch_embeddings = np.array_split(f["embeddings"][:], 4)
        with open(LOOKUP_TABLE_FILE, "rb") as f:
            self.lookup = pkl.load(f)

    def query(self, question):
        question = [re.sub(r'[^a-zA-z0-9\s]', '', question).lower()]
        query_embedding = np.array(self.embedder.encode(
            [question], show_progress_bar=False))

        results = []
        index = 0
        for i, batch in enumerate(self.batch_embeddings):
            distances = scipy.spatial.distance.cdist(
                query_embedding, batch, "cosine")[0]
            results += zip(range(index, index + batch.shape[0]), distances)
            index += batch.shape[0]
            # only keep top results every batch
            results = sorted(results, key=lambda x: x[1])[:NUM_CLOSEST]

        return self.format_results(results)

    def format_results(self, results):
        output = {"score": [], "paragraph": [],
                  "title": [], "abstract": [], "url": []}
        for i, distance in results:
            data = self.lookup[i]
            output["score"].append(1 - distance)
            output["paragraph"].append(data[0])
            output["title"].append(data[1])
            output["abstract"].append(data[2])
            output["url"].append(data[3])
        return output
