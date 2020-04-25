Tensorflow.js Doc:
<https://js.tensorflow.org/api_node/1.3.1/#tf.node.TFSavedModel.predict>

Hugging Face Models Doc:
<https://huggingface.co/transformers/model_doc/distilbert.html#distilbertforquestionanswering>



Hugging Face Node.js Question Answering Example
<https://github.com/huggingface/node-question-answering/>

DYNAMIC QUANTIZATION ON BERT
https://pytorch.org/tutorials/intermediate/dynamic_quantization_bert_tutorial.html

Added:
node-question-answering.js works
BERT quantization works

TODO: Try Quantization using Tensorflow.js
https://itnext.io/shrink-your-tensorflow-js-web-model-size-with-weight-quantization-6ddb4fcb6d0d

Directions:
1. setup a cloud server hosting the model, and we can have a static site code that just sends api requests to our server
2. code our own bert tokenizer that works on static javascript (which is what google's question answering demo did) 
3. we can deploy a node server app on heroku that does something we need to decide on (maybe an app that takes a wikipedia link as an input and lets u ask questions)
