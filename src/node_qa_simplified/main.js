// Simplified version of node.js huggingface question-answering for experimenting
const tf = require('@tensorflow/tfjs-node');
const {
    BertWordPieceTokenizer,
    Encoding,
    TruncationStrategy,
} = require('tokenizers');

const MODEL_PATH = './.models/distilbert-uncased';
const VOCAB_PATH = './.models/distilbert-uncased/vocab.txt';

const MODEL_PARAMS = {
    signature: 'serving_default',
    input_ids_name: 'input_ids',
    cased: false,
};

async function loadModel() {
    /**
     * Loads in a model given a model path
     * Returns the model object and the model's metagraph data
     */
    // Saved Model Format
    const model = await tf.node.loadSavedModel(
        MODEL_PATH,
        ['serve'],
        MODEL_PARAMS.signature
    );

    // TFJS Format (NOT WORKING)
    // const model = await tf.loadGraphModel(
    //     'file:// + MODEL_PATH'
    // );

    // Metagraph data
    const modelGraph = (
        await tf.node.getMetaGraphsFromSavedModel(MODEL_PATH)
    )[0];

    return { model, modelGraph };
}

function getMaxContextMap(spans, spanIndex, stride, questionLengthWithTokens) {
    /**
     * Helper function for creating feature data from huggingface node code
     */
    const map = new Map();
    const spanLength = spans[spanIndex].length;
    let i = 0;
    while (i < spanLength) {
        const position = spanIndex * stride + i;
        let bestScore = -1;
        let bestIndex = -1;
        for (const [ispan, span] of spans.entries()) {
            const spanEndIndex = span.startIndex + span.length - 1;
            if (position < span.startIndex || position > spanEndIndex) {
                continue;
            }
            const leftContext = position - span.startIndex;
            const rightContext = spanEndIndex - position;
            const score =
                Math.min(leftContext, rightContext) + 0.01 * span.length;
            if (score > bestScore) {
                bestScore = score;
                bestIndex = ispan;
            }
        }
        map.set(questionLengthWithTokens + i, bestIndex === spanIndex);
        i++;
    }
    return map;
}

async function getAnswer(
    tokenizer,
    features,
    startLogits,
    endLogits,
    maxAnswerLength
) {
    /**
     * Huggingface nodejs code to process model output into readable text
     */
    const answers = [];
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const starts = startLogits[i];
        const ends = endLogits[i];
        const contextLastIndex =
            feature.contextStartIndex + feature.contextLength - 1;
        const [filteredStartLogits, filteredEndLogits] = [
            starts,
            ends,
        ].map((logits) =>
            logits
                .slice(feature.contextStartIndex, contextLastIndex)
                .map((val, i) => [i + feature.contextStartIndex, val])
        );
        filteredEndLogits.sort((a, b) => b[1] - a[1]);
        for (const startLogit of filteredStartLogits) {
            filteredEndLogits.some((endLogit) => {
                if (endLogit[0] < startLogit[0]) {
                    return;
                }
                if (endLogit[0] - startLogit[0] + 1 > maxAnswerLength) {
                    return;
                }
                if (!feature.maxContextMap.get(startLogit[0])) {
                    return;
                }
                answers.push({
                    feature,
                    startIndex: startLogit[0],
                    endIndex: endLogit[0],
                    score: startLogit[1] + endLogit[1],
                    startLogits: starts,
                    endLogits: ends,
                });
                return true;
            });
        }
    }
    if (!answers.length) {
        return null;
    }
    const answer = answers.sort((a, b) => b.score - a.score)[0];
    const offsets = answer.feature.encoding.offsets;

    const answerText = text.slice(
        offsets[answer.startIndex][0],
        offsets[answer.endIndex][1]
    );
    const startProbs = softMax(answer.startLogits);
    const endProbs = softMax(answer.endLogits);
    const probScore = startProbs[answer.startIndex] * endProbs[answer.endIndex];
    return {
        answer: answerText,
        score: Math.round((probScore + Number.EPSILON) * 100) / 100,
    };
}

function softMax(values) {
    /**
     * Softmax function from huggingface node js code
     */
    const max = Math.max(...values);
    const exps = values.map((x) => Math.exp(x - max));
    const expsSum = exps.reduce((a, b) => a + b);
    return exps.map((e) => e / expsSum);
}

async function predict(question, context) {
    /**
     * Main function for model prediction. Prints out answer and probability score
     */
    const { model, modelGraph } = await loadModel();

    // Get model settings
    const signatureDef = modelGraph.signatureDefs[MODEL_PARAMS.signature];
    const rawShapeData =
        signatureDef['inputs'][MODEL_PARAMS.input_ids_name]['shape'];
    const shape = rawShapeData.map((s) => s.array[0]); // model's input shape

    // Set up tokenizer
    const tokenizer = await BertWordPieceTokenizer.fromOptions({
        vocabFile: VOCAB_PATH,
        lowercase: !MODEL_PARAMS.cased,
    });

    const stride = 128;
    tokenizer.setPadding({ maxLength: shape[1] });
    tokenizer.setTruncation(shape[1], {
        strategy: TruncationStrategy.OnlySecond,
        stride: stride,
    });

    // Encode Inputs
    const encoding = await tokenizer.encode(question, text);
    const encodings = [encoding, ...encoding.overflowing];

    // Create a features vector containing start/end index information
    // From huggingface node js code
    const questionLength =
        encoding.tokens.indexOf(tokenizer.configuration.sepToken) - 1; // Take [CLS] into account
    const questionLengthWithTokens = questionLength + 2;
    const spans = encodings.map((e, i) => {
        const nbAddedTokens = e.specialTokensMask.reduce(
            (acc, val) => acc + val,
            0
        );
        const actualLength = e.length - nbAddedTokens;
        return {
            startIndex: i * stride,
            contextStartIndex: questionLengthWithTokens,
            contextLength: actualLength - questionLength,
            length: actualLength,
        };
    });

    const features = spans.map((s, i) => {
        const maxContextMap = getMaxContextMap(
            spans,
            i,
            stride,
            questionLengthWithTokens
        );
        return {
            contextLength: s.contextLength,
            contextStartIndex: s.contextStartIndex,
            encoding: encodings[i],
            maxContextMap: maxContextMap,
        };
    });

    // Run Inference on model
    const result = tf.tidy(() => {
        const inputTensor = tf.tensor(encoding.ids, undefined, 'int32');
        const maskTensor = tf.tensor(
            encoding.attentionMask,
            undefined,
            'int32'
        );
        return model.predict({
            input_ids: inputTensor,
            attention_mask: maskTensor,
        });
    });

    // Process result into text
    let [startLogits, endLogits] = await Promise.all([
        result['output_0'].squeeze().array(),
        result['output_1'].squeeze().array(),
    ]);
    startLogits = [startLogits];
    endLogits = [endLogits];

    const answer = await getAnswer(
        tokenizer,
        features,
        startLogits,
        endLogits,
        15
    );

    // Print answer
    console.log(answer);
}

// const text = `Super Bowl 50 was an American football game to determine the champion of the National Football League (NFL) for the 2015 season.
// The American Football Conference (AFC) champion Denver Broncos defeated the National Football Conference (NFC) champion Carolina Panthers 24–10 to earn their third Super Bowl title. The game was played on February 7, 2016, at Levi's Stadium in the San Francisco Bay Area at Santa Clara, California.
// As this was the 50th Super Bowl, the league emphasized the "golden anniversary" with various gold-themed initiatives, as well as temporarily suspending the tradition of naming each Super Bowl game with Roman numerals (under which the game would have been known as "Super Bowl L"), so that the logo could prominently feature the Arabic numerals 50.`;
// const question = 'Who won the Super Bowl?';
const question = 'How many parameters does BERT-large have?';
const text =
    'BERT-large is really big... it has 24-layers and an embedding size of 1,024, for a total of 340M parameters! Altogether it is 1.34GB, so expect it to take a couple minutes to download to your Colab instance.';

predict(question, text);
