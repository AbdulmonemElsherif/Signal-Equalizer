from flask import Flask, render_template, redirect, url_for, request,Response,jsonify,send_file
import numpy as np
from scipy.fft import fft
import librosa
import json
import soundfile as sf
import io
import csv
import wave
import struct

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

#to upload the file 
@app.route('/uploadfile', methods=['GET','POST'])
def uploadfile():
    file = request.files['file']
    if file and file.filename.endswith('.csv'):
        csv_data = []
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            csv_data.append(row)
        return jsonify(csv_data)

# to detect arrythmia
@app.route('/detectArrythmia', methods=['POST'])
def detectArrythmia():
    file = request.files['file']
    if file.filename.endswith('.csv'):
        arrhythmia_values = []
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Replace 'column_name' with the name of the column containing arrhythmia values
            arrhythmia_values.append(float(row['column_name']))
        return jsonify(arrhythmia_values)
    else:
        return jsonify({'error': 'Invalid file type'})

    

# def csv_to_wav(csv_filename, wav_filename):
#     # Open the CSV file and read in the time and audio data
#     with open(csv_filename, 'r') as f:
#         reader = csv.reader(f)
#         time_data = []
#         audio_data = []
#         for row in reader:
#             time_data.append(float(row[0]))
#             audio_data.append(float(row[1]))

#     # Normalize the audio data
#     max_value = max(audio_data)
#     min_value = min(audio_data)
#     audio_data = [(x - min_value) / (max_value - min_value) for x in audio_data]

#     # Create a WAV file and write the audio data to it
#     with wave.open(wav_filename, 'w') as wavfile:
#         wavfile.setnchannels(1)
#         wavfile.setsampwidth(2)
#         wavfile.setframerate(44100)
#         for i in range(len(time_data)):
#             sample = int(audio_data[i] * 32767)
#             data = struct.pack('<h', sample)
#             wavfile.writeframes(data)
            
#          return send_file(wav_filename, mimetype='audio/wav')

















if __name__ == "__main__":
    app.run(debug=True)