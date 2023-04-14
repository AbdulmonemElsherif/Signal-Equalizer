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

 document.getElementById("formFile").addEventListener("change", (event) => {
   var file = event.target.files[0];
   var fileURL = URL.createObjectURL(file);
   inputWaveSurfer.load(fileURL);
 });

 document.getElementById("playButton").addEventListener("click", () => {
   inputWaveSurfer.play();
 });

 document.getElementById("pauseButton").addEventListener("click", () => {
   inputwavesurfer.pause();
 });

