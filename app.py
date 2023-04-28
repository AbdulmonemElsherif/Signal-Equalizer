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
    return audio_processor.process_audio(file,sliderValues,mode)

@app.route('/detectArrhythmia',methods=['POST'])
def detectArrhythmia():
    arrSliderValue = request.form['sliderValues']
    file = request.files['file']
    if file.filename.endswith('.csv'):
        processed_file =audio_processor.process_arrythmia(arrSliderValue, file)
        return processed_file

@app.route('/inputSpectrogram',methods=['POST'])
def inputspectrogram():
    inputFile = request.files['file']
    return audio_processor.input_spectrogram(inputFile)

@app.route('/outputSpectrogram',methods=['POST'])
def outputspectrogram():
    outputFile = request.files['outputFile']
    return audio_processor.output_spectrogram(outputFile)

if __name__ == "__main__":
    app.run(debug=True)