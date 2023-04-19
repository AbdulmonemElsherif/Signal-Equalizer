from flask import Flask, render_template, redirect, url_for, request, session, flash, Response
import numpy as np
from scipy.fft import fft
import librosa
import json
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

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/readAudioFile',methods=['POST'])
def uploadAudio():
    audioFile = request.files['audioFile']
    audioData, sr = librosa.load(audioFile, sr=None)
    return {'audioData':audioData.tolist(),'sampleRate':sr}

@app.route('/audioProcessing',methods=['POST','GET'])
def rangeEqualizer():
    audio_data = uploadAudio()
    fft_data = perform_fft(audio_data['audioData'], audio_data['sampleRate'])
    signal_fft_freq = fft_data['frequency']
    magnitude = fft_data['magnitude']
    phase = fft_data['phase']
    gainValues = request.form['sliderValues']
    gainValuesNp = np.array(json.loads(gainValues))
    for band in frequencyBands:
        indices = np.where((signal_fft_freq >= band[0]) & (signal_fft_freq <= band[1]))
        for i in indices:
            # Apply the gain to the corresponding frequency components
            magnitude[indices] *= gainValuesNp[i]
            #phase[indices] *= gain_product
    modified_signal = perform_ifft(magnitude * np.exp(1j * phase))
    return {'reconstructedAudio':modified_signal.tolist()}

    
    # # An array of frequencies corresponding to the Fourier Transform output
    # # The length of the output array will be equal to the length of the input signal
    # # len(audio_np): This is the length of the input signal audio_np, which is the number of samples in the signal.
    # # d=1/sampleRate: This specifies the spacing between the frequency values in the output array. In this case, it is set to 1/sampleRate
    # frequencies = np.fft.fftfreq(len(audio_np), d=1/sampleRate)
    # print(len(audio_np))
    # Convert FFT results to JSON and send as response
    # return {'magnitude': magnitude, 'phase': phase, 'frequency': signal_freq}



if __name__ == "__main__":
    app.run(debug=True)