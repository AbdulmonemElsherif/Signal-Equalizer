// Define variables for input and output signal viewers
const inputSignalViewer = document.getElementById("input-signal-viewer");
const outputSignalViewer = document.getElementById("output-signal-viewer");

// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("input-spectrogram");
const outputSpectrogram = document.getElementById("output-spectrogram");

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
var wavesurfer;

window.addEventListener("load", () => {
  wavesurfer = WaveSurfer.create({
    container: document.querySelector("#waveform"),
    waveColor: "#D9DCFF",
    progressColor: "#4353FF",
    cursorColor: "#4353FF",
    barWidth: 3,
    barRadius: 3,
    cursorWidth: 1,
    height: 200,
    barGap: 3,
  });

  // Add Spectrogram plugin to Wavesurfer instance
  wavesurfer.addPlugin(
    WaveSurfer.spectrogram.create({
      container: document.querySelector("#inputspectrogram"),
      fftSamples: 256, // Number of samples for the Fast Fourier Transform (FFT)
      labels: true, // Show frequency labels on the spectrogram
      responsive: true, // Make the spectrogram responsive to container size changes
    })
  );

  document.getElementById("formFile").addEventListener("change", (event) => {
    var file = event.target.files[0];
    var fileURL = URL.createObjectURL(file);
    wavesurfer.load(fileURL);
  });
});

  document.getElementById("playButton").addEventListener("click", () => {
    wavesurfer.play();
  });
  document.getElementById("pauseButton").addEventListener("click", () => {
    wavesurfer.pause();
  });