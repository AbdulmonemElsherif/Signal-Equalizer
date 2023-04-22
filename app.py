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
    # audioFile = request.files['audioFile']
    sliderValues = request.form['sliderValues']
    return audio_processor.process_uniform_audio(sliderValues)

if __name__ == "__main__":
    app.run(debug=True)