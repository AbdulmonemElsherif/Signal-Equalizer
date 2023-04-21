from flask import Flask, render_template, redirect, url_for, request,Response,jsonify,send_file
import numpy as np
from scipy.fft import fft
import librosa
import json
import soundfile as sf
import io
frequencyBands=[[20,2000],[2000,4000],[4000,6000],[6000,8000],[8000,10000],[10000,12000],[12000,14000],[14000,16000],[16000,18000],[18000,20000]]
audioData=[]
sr=0
app = Flask(__name__)

def perform_fft(audioData, sr):
    audioData_np = np.array(audioData)
    signal_fft_freq = np.fft.fft(audioData_np) 
    magnitude = np.abs(signal_fft_freq)
    phase = np.angle(signal_fft_freq)
    # An array of frequencies corresponding to the Fourier Transform output
    # d=1/sampleRate: This specifies the spacing between the frequency values in the output array. In this case, it is set to 1/sampleRate
    frequency = np.fft.fftfreq(len(audioData_np), d=1/sr) 
    return {'magnitude': magnitude, 'phase': phase, 'frequency': frequency }

def perform_ifft(fft):
    modified_signal = np.fft.ifft(fft)
    return modified_signal

def upload_audio(audio_file):
    audio_data, sr = librosa.load(audio_file, sr=None)
    return {'audioData':audio_data.tolist(),'sampleRate':sr}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/readAudioFile',methods=['POST'])
def readAudio():
    audioFile = request.files['audioFile']
    audioData = upload_audio(audioFile)
    return jsonify(audioData)


@app.route('/audioProcessing',methods=['POST'])
def rangeEqualizer():
    audioFile = request.files['audioFile']
    audio_data = upload_audio(audioFile)
    fft_data = perform_fft(audio_data['audioData'], audio_data['sampleRate'])
    signal_fft_freq = fft_data['frequency']
    magnitude = fft_data['magnitude']
    phase = fft_data['phase']
    gainValues = np.array(json.loads(request.form['sliderValues']))
    gainValues = [int(val) for val in gainValues]
    gainValuesIterator=0
    for band in frequencyBands:
        indices = np.where((signal_fft_freq >= band[0]) & (signal_fft_freq <= band[1]))
        for index in indices[0]:
            # Apply the gain to the corresponding frequency component
            magnitude[index] *= gainValues[gainValuesIterator]
        if gainValuesIterator<len(gainValues):
            gainValuesIterator+=1
    modified_signal = perform_ifft(magnitude * np.exp(1j * phase))
    # modified_signal = modified_signal / len(modified_signal)

    # Convert complex values to real values
    time_domain_signal = np.real(modified_signal)
    wav_file = io.BytesIO()
    sf.write(wav_file, time_domain_signal, audio_data['sampleRate'], format='WAV')
    modified_signal = modified_signal.tolist()
    wav_file.seek(0)
    return send_file(wav_file, mimetype='audio/wav')
    # modified_signal_real = [num.real for num in modified_signal]
  
    # return {'reconstructedAudio': modified_signal_real, 'magnitude': magnitude.tolist(), 'phase':phase.tolist()}


if __name__ == "__main__":
    app.run(debug=True)