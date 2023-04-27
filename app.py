from flask import Flask, render_template, redirect, url_for, request,Response,jsonify,send_file
from audioProcessing import AudioProcessor 
import librosa
import json
import soundfile as sf
import io
import csv
import wave
import struct

app = Flask(__name__)
audio_processor = AudioProcessor()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/readAudioFile',methods=['POST'])
def readAudio():
    audioFile = request.files['audioFile']
    audioData = audio_processor.upload_audio(audioFile)
    return jsonify(audioData)

@app.route('/audioProcessing',methods=['POST'])
def rangeEqualizer():
    sliderValues = request.form['sliderValues']
    return audio_processor.process_uniform_audio(sliderValues)

@app.route('/detectArrhythmia',methods=['POST'])
def detectArrhythmia():
    arrSliderValue = request.form['arrSliderValue']
    file = request.files['file']
    if file.filename.endswith('.csv'):
        processed_file =audio_processor.process_arrythmia(arrSliderValue, file)
        return processed_file

@app.route('/inputSpectrogram',methods=['GET'])
def inputspectrogram():
    return audio_processor.input_spectrogram()

@app.route('/outputSpectrogram',methods=['POST'])
def outputspectrogram():
    outputFile = request.files['outputFile']
    return audio_processor.output_spectrogram(outputFile)



if __name__ == "__main__":
    

    app.run(debug=True)
    

# to detect arrythmia
# @app.route('/detectArrythmia', methods=['POST'])
# def detectArrythmia():
#     file = request.files['file']
#     if file.filename.endswith('.csv'):
#         arrhythmia_values = []
#         csv_reader = csv.DictReader(file)
#         for row in csv_reader:
#             # Replace 'column_name' with the name of the column containing arrhythmia values
#             arrhythmia_values.append(float(row['column_name']))
#         return jsonify(arrhythmia_values)
#     else:
#         return jsonify({'error': 'Invalid file type'})
    
    # #to upload the file 
# @app.route('/uploadfile', methods=['GET','POST'])
# def uploadfile():
#     file = request.files['file']
#     if file and file.filename.endswith('.csv'):
#         csv_data = []
#         csv_reader = csv.DictReader(file)
#         for row in csv_reader:
#             csv_data.append(row)
#         return jsonify(csv_data)