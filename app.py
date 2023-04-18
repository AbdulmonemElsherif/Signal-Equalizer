from flask import Flask, render_template, redirect, url_for, request, session, flash, Response
import numpy as np
from scipy.fft import fft
import librosa
frequencyBands=[[20,2000],[2000,4000],[4000,6000],[6000,8000],[8000,10000],[10000,12000],[12000,14000],[14000,16000],[16000,18000],[18000,20000]]
audioData=[]
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/readAudioFile',methods=['POST'])
def uploadAudio():
    audioFile = request.files['audioFile']
    audioData, sr = librosa.load(audioFile, sr=None)
    return {'audioData':audioData.tolist(),'sampleRate':sr}



def perform_fft():
    # data = request.json
    time = np.array(data['time'])  # Convert to numpy array
    # #print(time)
    signal = np.array(data['signal'])  # Convert to numpy array
    # #print(signal)
    sample_rate = data['sampleRate']
    # #print(sample_rate)
    signal_fft_freq = np.fft.fft(signal) 
    magnitude = np.abs(signal_fft_freq)
    phase = np.angle(signal_fft_freq)
    return {'magnitude': magnitude, 'phase': phase, 'frequency': signal_freq}

def perform_ifft():
    modified_signal = np.fft.ifft(fft)

def rangeEqualizer():
    idicesArr = np.where((signal_fft_freq >= frequencyBands[index][0]) & (signal_fft_freq <= frequencyBands[index][1]))
    gainValue=sliderValue
    for indexValue in idicesArr:
        magnitude[indexValue] *= gainValue


@app.route('/uniformAudioProcessing',methods=['POST','GET'])
    # # Get the bytes data from the request
    # audioData = request.files['audioData'].read() 
    # print(audioData);
    # # Get the sampling rate from the request
    # sampleRate = int(request.form['sampleRate']) 

    # # Convert audio data to numpy array 
    # audio_np = np.frombuffer(audioData, dtype=np.float32)
    # print(audio_np)
    # # Perform FFT on audio data
    # fft_result = np.fft.fft(audio_np)
    # magnitude = np.abs(fft_result)
    # phase = np.angle(fft_result)
    
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