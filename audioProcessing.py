from flask import Flask, render_template, redirect, url_for, request, Response, jsonify, send_file
import numpy as np
from scipy.fft import fft
import librosa
import json
import soundfile as sf
import io

class AudioProcessor:
    def __init__(self):
        self.frequencyBands = [[20, 2000], [2000, 4000], [4000, 6000], [6000, 8000], [8000, 10000], [10000, 12000], [12000, 14000], [14000, 16000], [16000, 18000], [18000, 20000]]

    def set_audio_data(self, audioData, sr):
        self.audio_data=audioData
        self.sample_rate=sr

    def upload_audio(self, audio_file):
        audio_data, sr = librosa.load(audio_file, sr=None)
        self.set_audio_data(audio_data,sr)
        return {'audioData':audio_data.tolist(),'sampleRate':sr}

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

    def process_uniform_audio(self,sliderValues):
        fft_data = self.perform_fft(self.audio_data, self.sample_rate)
        signal_fft_freq = fft_data['frequency']
        magnitude = fft_data['magnitude']
        phase = fft_data['phase']
        gainValues = np.array(json.loads(sliderValues))
        gainValues = [int(val) for val in gainValues]
        gainValuesIterator=0
        for band in self.frequencyBands:
            indices = np.where((signal_fft_freq >= band[0]) & (signal_fft_freq <= band[1]))
            for index in indices[0]:
                magnitude[index] *= gainValues[gainValuesIterator]
            if gainValuesIterator<len(gainValues):
                gainValuesIterator+=1
        modified_signal = self.perform_ifft(magnitude * np.exp(1j * phase))
        time_domain_signal = np.real(modified_signal)
        wav_file = io.BytesIO()
        sf.write(wav_file, time_domain_signal, self.sample_rate, format='WAV')
        wav_file.seek(0)
        return send_file(wav_file, mimetype='audio/wav')

