# import numpy as np
# from scipy.io.wavfile import write
# import subprocess

# # Define the time vector
# t = np.linspace(0, 5, 22050 * 5) # 5 seconds

# # Define the sampling frequency
# fs = 22050 # Hz

# # Define the frequency components
# f1 = 100 # Hz
# f2 = 500 # Hz
# f3 = 1000 # Hz

# # Create the signal
# signal = np.sin(2 * np.pi * f1 * t) + np.sin(2 * np.pi * f2 * t) + np.sin(2 * np.pi * f3 * t)

# # Normalize the signal to be between -1 and 1
# signal /= np.max(np.abs(signal))

# # Write the signal to a WAV file
# write('synthetic_signal.wav', fs, signal)
#----------------------------------------------------------
# from pydub import AudioSegment
# from pydub.generators import Sine

# # create a sine wave with a frequency of 440 Hz and a duration of 2 seconds
# sine_wave = Sine(440).to_audio_segment(duration=2000)

# # export the audio as a WAV file
# sine_wave.export("sine_wave.wav", format="wav")
#---------------------------------------------------------
from pydub import AudioSegment
from pydub.generators import Sine
import tkinter as tk
from tkinter import filedialog

# Set the duration of each tone in milliseconds
duration = 500

# Initialize an empty list to store the tones
tones = []

# Prompt the user to enter frequencies
while True:
    frequency_input = input("Enter a frequency (in Hz), or 'no more' to finish: ")
    if frequency_input == "no more":
        break
    try:
        frequency = float(frequency_input)
        tone = Sine(frequency).to_audio_segment(duration=duration)
        tones.append(tone)
    except ValueError:
        print("Invalid input. Please enter a number or 'no more'.")

# Concatenate the tones into a single audio file
audio_file = AudioSegment.empty()
for tone in tones:
    audio_file += tone

# Create a file dialog window for the user to choose where to save the audio file
root = tk.Tk()
root.withdraw()
file_path = filedialog.asksaveasfilename(defaultextension=".wav")

# Export the audio file as a WAV file
audio_file.export(file_path, format="wav")