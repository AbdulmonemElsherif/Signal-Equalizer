// Define variables for input and output signal viewers
const inputSignalViewer = document.getElementById("input-signal-viewer");
const outputSignalViewer = document.getElementById("output-signal-viewer");

// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("input-spectrogram");
const outputSpectrogram = document.getElementById("output-spectrogram");

// Define variables for equalizer sliders
let sliders;
// // Define function to handle file upload
// function handleFileUpload(event) {
//   // Get uploaded file
//   const file = event.target.files[0];
  
//   // Create file reader object
//   const reader = new FileReader();
  
//   // Define function to handle file reader load event
//   reader.onload = function (event) {
//   // Get audio data from file reader result
//   const audioData = event.target.result;
  
//   // Decode audio data into audio buffer
//   const audioContext = new AudioContext();
//   audioContext.decodeAudioData(audioData, function (buffer) {
//     // Update input signal viewer and spectrogram
//     updateInputSignalViewer(buffer);
//     updateInputSpectrogram(buffer);
  
//     // Apply equalization to audio buffer
//     const equalizedBuffer = applyEqualization(buffer);
  
//     // Update output signal viewer and spectrogram
//     updateOutputSignalViewer(equalizedBuffer);
//     updateOutputSpectrogram(equalizedBuffer);
//   });
//   };
  
//   // Read uploaded file as array buffer
//   reader.readAsArrayBuffer(file);
//   }
  
//   // Add event listener to file input element
//   const fileInput = document.getElementById("file-input");
//   fileInput.addEventListener("change", handleFileUpload);
  
  

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
      sliders = document.getElementById("uniform-range-sliders").cloneNode(true);
      break;
    case "vowels":
      sliders = document.getElementById("vowels-sliders").cloneNode(true);
      break;
    case "musical-instruments":
      sliders = document.getElementById("musical-instruments-sliders").cloneNode(true);
      break;
    case "biological-signal-abnormalities":
      sliders = document.getElementById("biological-signal-abnormalities-sliders").cloneNode(true);
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
// // Define function to update input signal viewer
// function updateInputSignalViewer(signal) {
// // Create new waveform object
// const waveform = WaveSurfer.create({
// container: inputSignalViewer,
// waveColor: "gray",
// progressColor: "black",
// cursorColor: "black",
// height: 100,
// barWidth: 2,
// barGap: null,
// normalize: true,
// responsive: true,
// });

// // Load signal into waveform object
// waveform.loadDecodedBuffer(signal);

// // Set playback options
// waveform.setPlaybackRate(1);
// waveform.setMute(true);
// waveform.setLoop(false);
// waveform.setVolume(0.5);

// // Render waveform
// waveform.drawBuffer();
// }

// // Define function to update output signal viewer
// function updateOutputSignalViewer(signal) {
// // Create new waveform object
// const waveform = WaveSurfer.create({
// container: outputSignalViewer,
// waveColor: "gray",
// progressColor: "black",
// cursorColor: "black",
// height: 100,
// barWidth: 2,
// barGap: null,
// normalize: true,
// responsive: true,
// });

// // Load signal into waveform object
// waveform.loadDecodedBuffer(signal);

// // Set playback options
// waveform.setPlaybackRate(1);
// waveform.setMute(true);
// waveform.setLoop(false);
// waveform.setVolume(0.5);

// // Render waveform
// waveform.drawBuffer();
// }

// // Define function to update input spectrogram
// function updateInputSpectrogram(signal) {
// // Create new spectrogram object
// const spectrogram = WaveSurfer.create({
// container: inputSpectrogram,
// waveColor: "gray",
// progressColor: "black",
// cursorColor: "black",
// height: 200,
// barWidth: 2,
// barGap: null,
// normalize: true,
// responsive: true,
// plugins: [
// WaveSurfer.spectrogram.create({
// wavesurfer: spectrogram,
// container: "#input-spectrogram",
// labels: true,
// fftSamples: 512,
// colorMap: [
// [0, "rgb(0,0,255)"],
// [0.25, "rgb(0,255,255)"],
// [0.5, "rgb(0,255,0)"],
// [0.75, "yellow"],
// [1, "rgb(255,0,0)"],
// ],
// }),
// ],
// });

// // Load signal into spectrogram object
// spectrogram.loadDecodedBuffer(signal);

// // Set playback options
// spectrogram.setPlaybackRate(1);
// spectrogram.setMute(true);
// spectrogram.setLoop(false);
// spectrogram.setVolume(0.5);

// // Render spectrogram
// spectrogram.drawBuffer();
// }

// // Define function to update output spectrogram
// function updateOutputSpectrogram(signal) {
// // Create new spectrogram object
// const spectrogram = WaveSurfer.create({
// container: outputSpectrogram,
// waveColor: "gray",
// progressColor: "black",
// cursorColor: "black",
// height: 200,
// barWidth: 2,
// barGap: null,
// normalize: true,
// responsive: true,
// plugins: [
// WaveSurfer.spectrogram.create({
// wavesurfer: spectrogram,
// container: "#output-spectrogram",
// labels: true,
// fftSamples: 512,
// colorMap: [
// [0, "rgb(0,0,255)"],
// [0.25, "rgb(0,255,255)"],
// [0.5, "rgb(0,255,0)"],
// [0.75, "yellow"],
// [1, "rgb(255,0,0)"],
// ],
// }),
// ],
// });

// // Load signal into spectrogram object
// spectrogram.loadDecodedBuffer(signal);

// // Set playback options
// spectrogram.setPlaybackRate(1);
// spectrogram.setMute(true);
// spectrogram.setLoop(false);
// spectrogram.setVolume(0.5);

// // Render spectrogram
// spectrogram.drawBuffer();
// }
// // Define function to apply equalization to audio buffer
// function applyEqualization(buffer) {
//   // Get equalizer slider values
//   const sliderValues = getSliderValues();
  
//   // Create new audio buffer with same length and sample rate as input buffer
//   const audioContext = new AudioContext();
//   const outputBuffer = audioContext.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  
//   // Apply equalization to each channel of the input buffer
//   for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
//   // Get input and output buffers for current channel
//   const inputChannelData = buffer.getChannelData(channel);
//   const outputChannelData = outputBuffer.getChannelData(channel);
  
//  // Apply equalization to each sample of the input buffer
//   for (let sample = 0; sample < buffer.length; sample++) {
//     // Apply equalization to current sample based on slider values
//     const equalizedSample = applyEqualizationToSample(inputChannelData[sample], sliderValues);
  
//     // Set equalized sample value in output buffer
//     outputChannelData[sample] = equalizedSample;
//   }
//   }
  
//   // Return equalized audio buffer
//   return outputBuffer;
//   }
  
//   // Define function to get equalizer slider values
//   function getSliderValues() {
//   // Get equalizer sliders
//   const sliders = document.querySelectorAll("#equalizer-container input[type='range']");
  
//   // Create object to store slider values
//   const sliderValues = {};
  
//   // Loop through sliders and store their values in the object
//   sliders.forEach(function (slider) {
//   sliderValues[slider.id] = parseFloat(slider.value);
//   });
  
//   // Return slider values object
//   return sliderValues;
//   }
  
//   // Define function to apply equalization to a single sample
//   function applyEqualizationToSample(sample, sliderValues) {
//   // Apply gain to sample based on slider values
//   let gain = 1;
//   gain += (sliderValues["slider-1"] / 100) * Math.sin(sample * 2 * Math.PI * sliderValues["slider-2"]);
//   gain += (sliderValues["slider-3"] / 100) * Math.sin(sample * 4 * Math.PI * sliderValues["slider-4"]);
//   gain += (sliderValues["slider-5"] / 100) * Math.sin(sample * 8 * Math.PI * sliderValues["slider-6"]);
//   gain += (sliderValues["slider-7"] / 100) * Math.sin(sample * 16 * Math.PI * sliderValues["slider-8"]);
//   gain += (sliderValues["slider-9"] / 100) * Math.sin(sample * 32 * Math.PI * sliderValues["slider-10"]);
//   sample *= gain;
  
//   // Return equalized sample
//   return sample;
//   }

  
//   // Define function to reset equalizer sliders to default values
//   function resetSliders() {
//   // Get equalizer sliders
//   const sliders = document.querySelectorAll("#equalizer-container input[type='range']");
  
//   // Loop through sliders and set their values to default
//   sliders.forEach(function (slider) {
//   slider.value = slider.getAttribute("data-default");
//   });
  
//   // Update output signal viewer and spectrogram with default equalization
//   const inputBuffer = getInputBuffer();
//   const outputBuffer = applyEqualization(inputBuffer);
//   updateOutputSignalViewer(outputBuffer);
//   updateOutputSpectrogram(outputBuffer);
//   }
  
//   // Define function to get input buffer from input signal viewer
//   function getInputBuffer() {
//   // Get input signal viewer waveform object
//   const waveform = inputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
  
//   // Get input buffer from waveform object
//   const inputBuffer = waveform.backend.buffer;
  
//   // Return input buffer
//   return inputBuffer;
//   }
  
//   // Add event listener to reset button
//   const resetButton = document.getElementById("reset-button");
//   resetButton.addEventListener("click", resetSliders);
  
  
  
//   // Define function to download equalized audio file
//   function downloadEqualizedFile() {
//   // Get output buffer with equalization applied
//   const inputBuffer = getInputBuffer();
//   const outputBuffer = applyEqualization(inputBuffer);
  
//   // Create new audio buffer source node with output buffer
//   const audioContext = new AudioContext();
//   const source = audioContext.createBufferSource();
//   source.buffer = outputBuffer;
  
//   // Create new media stream destination node
//   const destination = audioContext.createMediaStreamDestination();
  
//   // Connect source node to destination node
//   source.connect(destination);
  
//   // Create new media recorder object with destination stream
//   const recorder = new MediaRecorder(destination.stream);
  
//   // Define function to handle media recorder data available event
//   recorder.ondataavailable = function (event) {
//   // Create new blob object with recorded data
//   const blob = new Blob([event.data], { type: "audio/wav" });
  
// // Create new download link element
//   const downloadLink = document.createElement("a");
//   downloadLink.href = URL.createObjectURL(blob);
//   downloadLink.download = "equalized-audio.wav";
  
//   // Add download link to document and click it to start download
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
  
//   // Remove download link from document
//   document.body.removeChild(downloadLink);
//   };
  
//   // Start recording
//   recorder.start();
  
//   // Start playing audio buffer
//   source.start();
  
//   // Stop recording after audio buffer has finished playing
//   source.onended = function () {
//   recorder.stop();
//   };
//   }
  
//   // Add event listener to download button
//   const downloadButton = document.getElementById("download-button");
//   downloadButton.addEventListener("click", downloadEqualizedFile);
  
  
  
//   // Define function to toggle play/pause of input and output signal viewers
//   function togglePlayback() {
//   // Get input and output waveform objects
//   const inputWaveform = inputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
//   const outputWaveform = outputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
  
//   // Toggle play/pause of input waveform
//   if (inputWaveform.isPlaying()) {
//   inputWaveform.pause();
//   } else {
//   inputWaveform.play();
//   }
  
//   // Toggle play/pause of output waveform
//   if (outputWaveform.isPlaying()) {
//   outputWaveform.pause();
//   } else {
//   outputWaveform.play();
//   }
//   }
  
//   // Add event listener to play/pause button
//   const playPauseButton = document.getElementById("play-pause-button");
//   playPauseButton.addEventListener("click", togglePlayback);
  
  
  
  
//   // Define function to toggle mute/unmute of input and output signal viewers
//   function toggleMute() {
//   // Get input and output waveform objects
//   const inputWaveform = inputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
//   const outputWaveform = outputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
  
//   // Toggle mute/unmute of input waveform
//   if (inputWaveform.getMute()) {
//   inputWaveform.setMute(false);
//   } else {
//   inputWaveform.setMute(true);
//   }
  
//   // Toggle mute/unmute of output waveform
//   if (outputWaveform.getMute()) {
//   outputWaveform.setMute(false);
//   } else {
//   outputWaveform.setMute(true);
//   }
//   }
  
//   // Add event listener to mute/unmute button
//   const muteButton = document.getElementById("mute-button");
//   muteButton.addEventListener("click", toggleMute);
  

  
//   // Define function to toggle loop of input and output signal viewers
//   function toggleLoop() {
//   // Get input and output waveform objects
//   const inputWaveform = inputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
//   const outputWaveform = outputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
  
//   // Toggle loop of input waveform
//   if (inputWaveform.getLoop()) {
//   inputWaveform.setLoop(false);
//   } else {
//   inputWaveform.setLoop(true);
//   }
  
//   // Toggle loop of output waveform
//   if (outputWaveform.getLoop()) {
//   outputWaveform.setLoop(false);
//   } else {
//   outputWaveform.setLoop(true);
//   }
//   }
  
//   // Add event listener to loop button
//   const loopButton = document.getElementById("loop-button");
//   loopButton.addEventListener("click", toggleLoop);
  

  
//   // Define function to change playback rate of input and output signal viewers
//   function changePlaybackRate(rate) {
//   // Get input and output waveform objects
//   const inputWaveform = inputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
//   const outputWaveform = outputSignalViewer.querySelector(".wavesurfer-container").__wavesurfer;
  
//   // Change playback rate of input waveform
//   inputWaveform.setPlaybackRate(rate);
  
//   // Change playback rate of output waveform
//   outputWaveform.setPlaybackRate(rate);
//   }
  
//   // Add event listener to playback rate buttons
//   const playbackRateButtons = document.querySelectorAll(".playback-rate-button");
//   playbackRateButtons.forEach(function (button) {
//   button.addEventListener("click", function () {
//   const rate = parseFloat(button.getAttribute("data-rate"));
//   changePlaybackRate(rate);
//   });
//   });
//   // Define function to update equalization and output signal viewer/spectrogram
// function updateEqualization() {
//   // Get input buffer
//   const inputBuffer = getInputBuffer();
  
//   // Apply equalization to input buffer
//   const outputBuffer = applyEqualization(inputBuffer);
  
//   // Update output signal viewer and spectrogram with equalized signal
//   updateOutputSignalViewer(outputBuffer);
//   updateOutputSpectrogram(outputBuffer);
//   }
  
//   // Add event listeners to equalizer sliders
//   const equalizerSliders = document.querySelectorAll("#equalizer-container input[type='range']");
//   equalizerSliders.forEach(function (slider) {
//   slider.addEventListener("input", updateEqualization);
//   });