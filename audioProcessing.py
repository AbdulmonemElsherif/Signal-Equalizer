from flask import Flask, render_template, redirect, url_for, request, Response, jsonify, send_file
import numpy as np
from scipy.fft import fft
import librosa
import librosa.display
import json
import base64
import io
import soundfile as sf
import matplotlib.pyplot as plt
from scipy import signal
import pandas as pd
import os
import matplotlib
matplotlib.use('Agg')


class AudioProcessor:
    def __init__(self):
        # self.uniformFrequencyBands = [[20, 2000], [2000, 4000], [4000, 6000], [6000, 8000], [8000, 10000], [10000, 12000], [12000, 14000], [14000, 16000], [16000, 18000], [18000, 20000]]
        self.uniformFrequencyBands = []
        self.vowelFrequencyBands =  [[4000,10000],[1200,5000],[490, 2800]]
        self.musicFrequencyBands=[[0,500],[500,1200],[1200,7000]]
        self.arrythmiaFrequencyBand=[[0,25]]#[100,130],
        self.fmax=0

    def get_uniform_frequency_bands(self,max_freq):
        frequencies = np.linspace(0, max_freq, num=11)
        for i in range(len(frequencies)-1):
            band = [round(frequencies[i]), round(frequencies[i+1])]
            self.uniformFrequencyBands.append(band)

    def read_arrythmia_data(self, csv_file):
        csv_data = pd.read_csv(csv_file)
        arrythmia_time = csv_data.iloc[:, 0].values
        arrythmia_data = csv_data.iloc[:, 1].values
        return {"arrythmia_data":arrythmia_data, "arrythmia_time":arrythmia_time}

    def upload_audio(self, audio_file):
        audio_data, sr = librosa.load(audio_file, sr=None)
        output=self.perform_fft(audio_data,sr)
        maxfreq=round(np.max(output['frequency']))
        self.get_uniform_frequency_bands(maxfreq)
        return {'audioData':audio_data.tolist(),'sampleRate':sr,'maxFreq':maxfreq}

    def perform_fft(self, audioData, sr):
        audioData_np = np.array(audioData)
        signal_fft_freq = np.fft.fft(audioData_np)
        magnitude = np.abs(signal_fft_freq)
        phase = np.angle(signal_fft_freq)
        frequency = np.fft.fftfreq(len(audioData_np), d=1/sr)
        return {'magnitude': magnitude, 'phase': phase, 'frequency': frequency }

    def perform_ifft(self, fft):
        modified_signal = np.fft.ifft(fft)
        return modified_signal

    def process_audio(self,file,sliderValues,mode):
        output = self.upload_audio(file)
        audio_data = output['audioData']
        sample_rate = output['sampleRate']
        fft_data = self.perform_fft(audio_data, sample_rate)
        signal_fft_freq = fft_data['frequency']
        magnitude = fft_data['magnitude']
        phase = fft_data['phase']
        gainValues = np.array(json.loads(sliderValues))
        gainValues = [int(val) for val in gainValues]
        mode = np.array(json.loads(mode))
        mode = [int(val) for val in mode]
        gainValuesIterator=0
        if mode[0]==1:
            frequencyBands=self.uniformFrequencyBands
        elif mode[1]==1:
            frequencyBands=self.vowelFrequencyBands
        elif mode[2]==1:
            frequencyBands=self.musicFrequencyBands
        for gainValue in gainValues:
            indices = np.where((signal_fft_freq >= frequencyBands[gainValuesIterator][0]) & (signal_fft_freq <= frequencyBands[gainValuesIterator][1]))
            for index in indices[0]:
                if gainValue >= 0:
                    magnitude[index] *= gainValue
                else:
                    magnitude[index] =- magnitude[index] #noise cancellation, multiplies the magnitude value at the index with -1, effectively flipping the sign of the magnitude.
            gainValuesIterator += 1
        modified_signal = self.perform_ifft(magnitude * np.exp(1j * phase))
        time_domain_signal = np.real(modified_signal)
        wav_file = io.BytesIO()
        sf.write(wav_file, time_domain_signal, sample_rate, format='WAV')
        wav_file.seek(0)
        return send_file(wav_file, mimetype='audio/wav')

    def process_arrythmia(self, arrSliderValue, file):
        readoutput=self.read_arrythmia_data(file)
        arrythmia_data=readoutput["arrythmia_data"]
        arrythmia_time=readoutput["arrythmia_time"]
        arrythmia_sample_rate=360;
        fft_arrData=self.perform_fft(arrythmia_data,arrythmia_sample_rate)
        signal_fft_freq = fft_arrData['frequency']
        magnitude = fft_arrData['magnitude']
        phase = fft_arrData['phase']
        gainValues = np.array(json.loads(arrSliderValue))
        gainValues = [int(val) for val in gainValues]
        gainValuesIterator = 0
        for gainValue in gainValues:
            indices = np.where((signal_fft_freq >= self.arrythmiaFrequencyBand[gainValuesIterator][0]) & (signal_fft_freq <= self.arrythmiaFrequencyBand[gainValuesIterator][1]))
            for index in indices[0]:
                if gainValue >= 0:
                    magnitude[index] =- magnitude[index]
                else:
                    magnitude[index] *= -gainValue #it applies a gain reduction
            gainValuesIterator += 1
        modified_signal = self.perform_ifft(magnitude * np.exp(1j * phase))
        time_domain_signal = np.real(modified_signal)
        df = pd.DataFrame({"time":arrythmia_time,"amplitude":time_domain_signal})
        df.to_csv('processed_arrythmia.csv',header=False ,index=False)
        return send_file('processed_arrythmia.csv',mimetype='text/csv' ,as_attachment=True)

    def plot_spectrogram(self,audio_data,sample_rate):
        # Generate the spectrogram
        hop_length = 1000#This is the number of samples between the start of each frame #512
        #if the signal has a sample rate of 44100 samples per second, and the hop length is set to 22050, then each frame will have a duration of 0.5 seconds, with the start of each new frame shifted by 0.5 seconds relative to the start of the previous frame. 
        n_fft = 2048#number of points in the Fast Fourier Transform (FFT) used to compute the spectrogram
        #equivalent to number of samples to be processed at once to obtain the frequency content of that segment of the signal.
        spectrogram = librosa.feature.melspectrogram(y=audio_data, sr=sample_rate, n_fft=n_fft, hop_length=hop_length)#Internally, the function computes the short-time Fourier transform (STFT) 
        # Convert the spectrogram to decibels
        #use STFT to compute the spectrogram because it allows us to analyze the frequency content of a signal over time
        spectrogram = librosa.power_to_db(spectrogram, ref=np.max)
        # Plot the spectrogram
        plt.figure(figsize=(10, 4))
        librosa.display.specshow(spectrogram, y_axis='mel', fmax=20000, x_axis='time')
        plt.colorbar(format='%+2.0f dB')#2 specifies the total number of digits displayed, and the 0 specifies the number of decimal places, f float
        plt.tight_layout()# adjusts the padding between subplots to make sure there is no overlapping text, labels or other elements in the plot
        # Save the plot as an image
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        data = base64.b64encode(buf.read()).decode('ascii')
        # Return the image data as JSON
        return jsonify ({'image': data})

    def input_spectrogram(self,file):
        if file.filename.endswith('.csv'):
            return self.csv_spectrogram(file)
        else:
            audioData, sampleRate = librosa.load(file, sr=None)
            return self.plot_spectrogram(audioData,sampleRate)
    
    def output_spectrogram(self,file):
        filetype = file.mimetype
        if filetype == 'text/csv':
            return self.csv_spectrogram(file)
        else:
            audioData, sampleRate = librosa.load(file, sr=None)
            return self.plot_spectrogram(audioData,sampleRate)
        
    def csv_spectrogram(self, file):
        # Read in the CSV file
        output=self.read_arrythmia_data(file)
        arrythmiaData=output["arrythmia_data"]
        # Set up the STFT parameters
        fs = 360
        window = 'hann' #window function used to isolate the signal at each time segment. Here it is set to 'hann', which is a common choice for audio signal processing.
        nperseg = 256 #length of each segment in the STFT calculation, typically set to a power of 2 to improve the efficiency of the FFT algorithm.
        noverlap = nperseg // 2 #the number of samples that overlap between adjacent segments in the STFT calculation. Here it is set to half the length of each segment.

        # Apply the STFT to the signal
        f, t, Zxx = signal.stft(arrythmiaData, fs=fs, window=window, nperseg=nperseg, noverlap=noverlap)
        # Convert the spectrogram to decibels zxx->magnitude
        Zxx_db = 20 * np.log10(np.abs(Zxx))

         # Clear the current plot
        plt.clf()

        # Plot the spectrogram
        plt.pcolormesh(t, f[f <= 1000], Zxx_db[f <= 1000])#limit freq of spectrogram
        plt.ylabel('Frequency [Hz]')
        plt.xlabel('Time [sec]')
        plt.colorbar(format='%+2.0f dB')
        plt.tight_layout()

        # Save the plot as an image
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        data = base64.b64encode(buf.read()).decode('ascii')
        # Return the image data as JSON
        return jsonify({'image': data})        
    