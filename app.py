from flask import Flask, render_template, redirect, url_for, request,Response,jsonify,send_file
import numpy as np
from scipy.fft import fft
import librosa
import json
import soundfile as sf
import io

app = Flask(__name__)
