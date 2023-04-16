// Define variables for input and output signal viewers
const inputSignal = document.getElementById("inputwave");
const outputSignal = document.getElementById("outputwave");
// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("inputspectrogram");
const outputSpectrogram = document.getElementById("outputspectrogram");
// Define variables for equalizer sliders
let sliders;
// Define variable for mode selector
const equalizerContainer = document.getElementById("equalizer-container");
const modeSelector = document.getElementById("mode-select");
const inputAudio = document.getElementById("inputaudio");


// Define function to update equalizer sliders based on selected mode
function updateSliders() {
  // Remove existing sliders
  if (sliders) {
    sliders.remove();
  }
  // Create new sliders based on selected mode
  const mode = modeSelector.value;  
  // Hide the sliders if no mode is selected
  if (mode == "select-mode") {
    equalizerContainer.style.display = "none";
  } else {
    equalizerContainer.style.display = "block";
  }
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
  equalizerContainer.appendChild(sliders);
}

// Add event listener to mode selector
modeSelector.addEventListener("change", updateSliders);

window.addEventListener("load", function () {
  createPlot(inputSignal);
  createPlot(outputSignal);
  // Call updateSliders function to initialize equalizer sliders
  updateSliders();
});
function createPlot(graphElement) {
  let layout = {
    xaxis: {
      title: "Time (sec)",
      zoom: 1000,
    },
    yaxis: {
      title: "Amplitude",
    },
  };
  Plotly.newPlot(graphElement, [], layout, {
    displaylogo: false,
    // Enable responsive sizing of the plot
    responsive: true,
    // Enable automatic resizing of the plot to fit its container element
    autosize: true,
  });
}

document.getElementById("formFile").addEventListener("change", async (event) => {
  let file = event.target.files[0];
  let fileURL = URL.createObjectURL(file);
  inputAudio.src = fileURL;
  const audioContext = new AudioContext();
  // Read the audio file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // Decode the audio file data directly using await
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  // Extract the audio data from the audio buffer (amplitude)
  const audioData = audioBuffer.getChannelData(0);
  console.log(audioData);
  let time=[]
  for (let index = 0; index < audioData.length; index++) {
    //get time from sampling frequency as  fs = 1/T
    time.push(index / audioBuffer.sampleRate);
  }
  Plotly.addTraces(inputSignal, { x: time, y: audioData }, 0);
  Plotly.addTraces(outputSignal, { x: time, y: audioData }, 0);
  track.connect(audioContext.destination);
});

document.querySelectorAll(".stopbutton").forEach((button,index) => {
  button.addEventListener("click", () => {
    if(index===0){
      inputAudio.pause();
      inputAudio.currentTime = 0;
    }else{
      outputAudio.pause();
      outputAudio.currentTime = 0;
    }
  });
});

document.querySelector("#spectrogram-toggle").addEventListener('change',(event)=>{
  document.querySelectorAll(".spectrogram").forEach((spectrogram)=>{
      if (event.target.checked) {
          spectrogram.style.display='block';
        }
        else{
          spectrogram.style.display = "none";
        }
      })
});