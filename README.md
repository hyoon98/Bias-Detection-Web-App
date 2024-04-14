# Bias Detection Web App
## Introduction
This is a web app that uses a bias detection machine learning model from HuggingFace to detect bias in news articles.
The model: https://huggingface.co/d4data/bias-detection-model
# Setup
## Step 0:
Clone the repository
## Step 0.5:
Setup a new virtual environment for Python, and download Node.js and NPM: https://nodejs.org/en/download/
## Step 1:
Open two terminals and change the directory of one to /backend, and another to /bias-checker. Activate the Python environment for the one in /backend
## Step 2:
For the terminal in /backend, run ```pip install -r requirements.txt```, and then  ```flask --app backend run```
For the terminal in /bias-checker run ```npm i```, and then ```npm run dev```
Both the React page and the Flask server should be running.
## Step 3:
Navigate to http://localhost:5173/ in your preferred browser and use the web application.
