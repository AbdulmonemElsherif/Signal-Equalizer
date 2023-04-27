from flask import Flask, render_template, redirect, url_for, request,Response,jsonify,send_file
from audioProcessing import AudioProcessor

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
    file=request.files['file']
    mode= request.form['mode']
    sliderValues = request.form['sliderValues']
    return audio_processor.process_uniform_audio(file,sliderValues,mode)

@app.route('/inputSpectrogram',methods=['GET'])
def inputspectrogram():
    return audio_processor.input_spectrogram()

@app.route('/outputSpectrogram',methods=['POST'])
def outputspectrogram():
    outputFile = request.files['outputFile']
    return audio_processor.output_spectrogram(outputFile)

if __name__ == "__main__":
    app.run(debug=True)