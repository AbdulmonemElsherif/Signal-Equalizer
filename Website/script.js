// Define variables for input and output signal viewers
const inputWave = document.getElementById("inputwave");
const outputWave = document.getElementById("outputwave");
// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("inputspectrogram");
const outputSpectrogram = document.getElementById("outputspectrogram");
// Define variables for equalizer sliders
let sliders;
// Define variable for mode selector
const modeSelector = document.getElementById("mode-select");

// Define function to update equalizer sliders based on selected mode
function updateSliders() {
  // Remove existing sliders
  if (sliders) {
    sliders.remove();
  }

  // Create new sliders based on selected mode
  const mode = modeSelector.value;
  switch (mode) {
    case "uniform-range":
      sliders = document
        .getElementById("uniform-range-sliders")
        .cloneNode(true);
      break;
    case "vowels":
      sliders = document.getElementById("vowels-sliders").cloneNode(true);
      break;
    case "musical-instruments":
      sliders = document
        .getElementById("musical-instruments-sliders")
        .cloneNode(true);
      break;
    case "biological-signal-abnormalities":
      sliders = document
        .getElementById("biological-signal-abnormalities-sliders")
        .cloneNode(true);
      break;
    default:
      sliders = document.createElement("div");
      break;
  }

  // Add new sliders to equalizer container
  const equalizerContainer = document.getElementById("equalizer-container");
  equalizerContainer.appendChild(sliders);
  // Hide the sliders if no mode is selected
  if (mode === "") {
    equalizerContainer.classList.add("hidden");
  } else {
    equalizerContainer.classList.remove("hidden");
  }
}

// Add event listener to mode selector
modeSelector.addEventListener("change", updateSliders);

// Call updateSliders function to initialize equalizer sliders
updateSliders();

let inputWaveSurfer, outputWaveSurfer;

inputWaveSurfer = WaveSurfer.create({
  container: inputWave,
  waveColor: "#D9DCFF",
  progressColor: "#4353FF",
  cursorColor: "#4353FF",
  barWidth: 3,
  barRadius: 3,
  cursorWidth: 1,
  height: 200,
  barGap: 3,
  plugins: [
    WaveSurfer.spectrogram.create({
      wavesurfer: inputWaveSurfer,
      container: document.querySelector("#inputspectrogram"),
      labels: true,
      height: 256,
    }),
  ],
});

outputWaveSurfer = WaveSurfer.create({
  container: outputWave,
  waveColor: "#D9DCFF",
  progressColor: "#4353FF",
  cursorColor: "#4353FF",
  barWidth: 3,
  barRadius: 3,
  cursorWidth: 1,
  height: 200,
  barGap: 3,
  plugins: [
    WaveSurfer.spectrogram.create({
      wavesurfer: outputWaveSurfer,
      container: document.querySelector("#outputspectrogram"),
      labels: true,
      height: 256,
    }),
  ],
});

document.getElementById("formFile").addEventListener("change", async (event) => {
  var file = event.target.files[0];
  var fileURL = URL.createObjectURL(file);
  inputWaveSurfer.load(fileURL);
  // // Temporary storage space where audio data is stored before it is processed or played back.
  // // The AudioBuffer can be used to store and manipulate audio data, such as playing back audio, applying audio effects, or analyzing audio properties.
  // const audioBuffer = inputWaveSurfer.getBuffer();
  // // Create an audio context
  const audioContext = new AudioContext();
  // const sourceNode = audioContext.createBufferSource();
  // //save the audio data in wavesurferbuffer in the sourcenode buffer
  // sourceNode.buffer = audioBuffer;
  // //Create an AnalyserNode using the AudioContext object to analyze the audio data.
  // const analyserNode = audioContext.createAnalyser();
  // sourceNode.connect(analyser);
  // sourceNode.connect(audioContext.destination);
  // // Set FFT size
  // analyser.fftSize = 1024;
  // const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
  // analyserNode.getByteFrequencyData(frequencyData);

  // // Access the frequency data
  // for (let i = 0; i < frequencyData.length; i++) {
  //   let freq = (i * audioContext.sampleRate) / analyserNode.fftSize;
  //   let amp = frequencyData[i];
  //   // Do something with freq and amp values
  //   console.log("Frequency: " + freq + " Hz, Amplitude: " + amp);
  // }

  //Load an audio file
  fetch(fileURL)
    // obtain the audio data as an ArrayBuffer.
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data)) //decoding audio refers to the process of converting audio data from a binary format (such as MP3, WAV, or AAC) into a format that can be used for audio processing and playback within the web browser.
    .then((buffer) => {
      // Create an analyser node
      //allows us to perform audio analysis operations, including FFT analysis, on an audio buffer.
      const analyser = audioContext.createAnalyser();
      // Set FFT size
      //determines the number of data points
      //Higher values result in higher frequency resolution but lower time resolution, and vice versa.
      //The FFT size determines the number of bins or frequency bands in the frequency domain representation of an audio signal
      // A larger FFT size will result in more frequency bins and finer frequency resolution, but it also requires more processing power and may result in a slower update rate. A smaller FFT size will have fewer frequency bins and lower frequency resolution, but it may provide a faster update rate and require less processing power.
      analyser.fftSize = 1024;
      // Connect the analyser node to the audio buffer
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      // Start playing the audio file
      //source.start();

      //store the frequency data obtained from the AnalyserNode
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      // Get the frequency data from the analyser node
      let frequencyArr = [];
      analyser.getByteFrequencyData(frequencyData);
      console.log(frequencyData);
      // Access the frequency data
      for (let i = 0; i < frequencyData.length; i++) {
        //i represents the index of the frequency bin in the frequencyData array, which contains the amplitude values of each frequency bin obtained from the analyserNode.getByteFrequencyData() method.
        //calculates the frequency value corresponding to the i-th frequency bin.
        let freq = (i * audioContext.sampleRate) / analyser.fftSize;
        // Do something with freq and amp values
        frequencyArr.push(freq);
      }
      // Assuming frequencyData is the Uint8Array obtained from the AnalyserNode

      // Step 1: Determine the total frequency range
      const minFrequency = Math.min(...frequencyArr);
      const maxFrequency = Math.max(...frequencyArr);

      // Step 2: Calculate the frequency step
      const frequencyRange = maxFrequency - minFrequency;
      const frequencyStep = frequencyRange / 10;

      // Step 3: Create an array to store the frequency ranges
      const frequencyRanges = [];

      // Step 4: Loop through the frequency ranges
      for (let i = 0; i < 10; i++) {
        const startFrequency = minFrequency + i * frequencyStep;
        const endFrequency = startFrequency + frequencyStep;
        frequencyRanges.push({ startFrequency, endFrequency });
      }

      console.log(frequencyArr);
      console.log(frequencyRanges);
    })
    .catch((error) => console.error(error));

});

document.querySelectorAll(".playbutton").forEach((button) => {
  button.addEventListener("click", () => {
    inputWaveSurfer.play();
  });
});

document.querySelectorAll(".pausebutton").forEach((button) => {
    button.addEventListener("click", () => {
    inputWaveSurfer.pause();
  });
});

document.querySelectorAll(".playbackRateSlider").forEach((slider) => {
  slider.addEventListener("input", (event) => {
    const playbackRate = parseFloat(event.target.value); // Get the current value of the slider as a float
    inputWaveSurfer.setPlaybackRate(playbackRate); // Set the playback rate of WaveSurfer instance
  })
});


