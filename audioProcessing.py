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

    def plot_spectrogram(self,audio_data,sample_rate):
        # Generate the spectrogram
        hop_length = 512
        n_fft = 2048
        spectrogram = librosa.feature.melspectrogram(y=audio_data, sr=sample_rate, n_fft=n_fft, hop_length=hop_length)
        # Convert the spectrogram to decibels
        spectrogram = librosa.power_to_db(spectrogram, ref=np.max)
        # Plot the spectrogram
        plt.figure(figsize=(10, 4))
        librosa.display.specshow(spectrogram, y_axis='mel', fmax=8000, x_axis='time')
        plt.colorbar(format='%+2.0f dB')
        plt.tight_layout()
        # Save the plot as an image
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        data = base64.b64encode(buf.read()).decode('ascii')
        # Return the image data as JSON
        return jsonify({'image': data})

    def input_spectrogram(self):
        return self.plot_spectrogram(self.audio_data,self.sample_rate)

    def output_spectrogram(self,audio_file):
        audio_data, sr = librosa.load(audio_file, sr=None)
        return self.plot_spectrogram(audio_data,sr)
    # def process_vowel_audio(self, sliderValues):
    # # Define the frequency bands for each vowel
    # vowelBands = {
    #     'a': [730, 1090],
    #     'e': [530, 1700],
    #     'i': [330, 2400],
    #     'o': [300, 640],
    #     'u': [325, 700]
    # }
    # # Perform FFT on the audio data
    # fft_data = self.perform_fft(self.audio_data, self.sample_rate)
    # signal_fft_freq = fft_data['frequency']
    # magnitude = fft_data['magnitude']
    # phase = fft_data['phase']
    # # Parse the slider values
    # sliderValues = json.loads(sliderValues)
    # # Modify the magnitude of the FFT based on the vowel sliders
    # for vowel, gain in sliderValues.items():
    #     if vowel in vowelBands:
    #         band = vowelBands[vowel]
    #         indices = np.where((signal_fft_freq >= band[0]) & (signal_fft_freq <= band[1]))
    #         for index in indices[0]:
    #             magnitude[index] *= gain
    # # Perform IFFT on the modified FFT
    # modified_signal = self.perform_ifft(magnitude * np.exp(1j * phase))
    # time_domain_signal = np.real(modified_signal)
    # # Return the modified audio data as a WAV file
    # wav_file = io.BytesIO()
    # sf.write(wav_file, time_domain_signal, self.sample_rate, format='WAV')
    # wav_file.seek(0)
    # return send_file(wav_file, mimetype='audio/wav')
def process_vowel_audio(self, sliderValues):
    # Perform formant analysis on the audio data
    formants = librosa.formant.track(self.audio_data, sr=self.sample_rate, order=2)
    # Define the frequency bands for each vowel based on the formant frequencies
    vowelBands = {}
    for i, vowel in enumerate(['a', 'e', 'i', 'o', 'u']):
        if i < len(formants):
            f1, f2 = formants[i]
            vowelBands[vowel] = [int(f1 - 50), int(f2 + 50)]
    # Perform FFT on the audio data
    fft_data = self.perform_fft(self.audio_data, self.sample_rate)
    signal_fft_freq = fft_data['frequency']
    magnitude = fft_data['magnitude']
    phase = fft_data['phase']
    # Parse the slider values
    sliderValues = json.loads(sliderValues)
    # Modify the magnitude of the FFT based on the vowel sliders
    for vowel, gain in sliderValues.items():
        if vowel in vowelBands:
            band = vowelBands[vowel]
            indices = np.where((signal_fft_freq >= band[0]) & (signal_fft_freq <= band[1]))
            for index in indices[0]:
                magnitude[index] *= gain
    # Perform IFFT on the modified FFT
    modified_signal = self.perform_ifft(magnitude * np.exp(1j * phase))
    time_domain_signal = np.real(modified_signal)
    # Return the modified audio data as a WAV file
    wav_file = io.BytesIO()
    sf.write(wav_file, time_domain_signal, self.sample_rate, format='WAV')
    wav_file.seek(0)
    return send_file(wav_file, mimetype='audio/wav')