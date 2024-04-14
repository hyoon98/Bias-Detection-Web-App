from flask import Flask, jsonify, request
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from transformers import pipeline
from flask_cors import CORS, cross_origin
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

tokenizer = AutoTokenizer.from_pretrained("d4data/bias-detection-model")
model = TFAutoModelForSequenceClassification.from_pretrained("d4data/bias-detection-model")

classifier = pipeline('text-classification', model=model, tokenizer=tokenizer) # cuda = 0,1 based on gpu availability

def process_csv(file_path):
    processed_data = []

    with open(file_path, 'r', encoding='utf-8-sig') as csv_file:
        df = pd.read_csv(csv_file, header=None)
        df['Biased_Status'] = df.iloc[:, 0].apply(classifier)
        df['Biased_Status'] = df['Biased_Status'].apply(lambda x: x[0]['label'] if len(x) > 0 and 'label' in x[0] else None)
        df_filtered = df[df['Biased_Status'] == "Non-biased"]
        df_filtered.drop(columns=['Biased_Status'], inplace=True)
        processed_data=df_filtered.to_csv(index=False, header=False)
    return jsonify({'data': processed_data})

@app.route('/bias-detection', methods=['POST'])
@cross_origin()
def bias_detection():
    data = request.get_json()
    text = data['text']
    result = classifier(text)
    return jsonify(result), 200

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Save the file to a temporary location
        file.save('temp.csv')
        
        # Process the CSV file
        processed_csv_data = process_csv('temp.csv')
        # Return the processed CSV data
        return processed_csv_data
