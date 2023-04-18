// Define variables for input and output signal viewers
const inputSignal = document.getElementById("inputwave");
const outputSignal = document.getElementById("outputwave");
// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("inputspectrogram");
const outputSpectrogram = document.getElementById("outputspectrogram");
// Define variables for equalizer sliders
let sliders;
let sampleRate;
// Define variable for mode selector
const equalizerContainer = document.getElementById("equalizer-container");
const modeSelector = document.getElementById("mode-select");
const inputAudio = document.getElementById("inputaudio");
let file;
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
  console.log(inputSignal);
  file = event.target.files[0];
  let fileURL = URL.createObjectURL(file);
  inputAudio.src = fileURL;
  outputAudio.src = fileURL;
  var formData = new FormData();
  formData.append("audioFile", file);
  fetch('/readAudioFile',{
    method:'POST',
    body:formData
  })
  .then((response)=>response.json())
  .then((result)=>{
    let audioDataArray = result.audioData;
    let time = [];
    sampleRate = result.sampleRate;
    for (let index = 0; index < audioDataArray.length; index++) {
      //get time from sampling frequency as  fs = 1/T
      time.push(index /sampleRate);
    }
    Plotly.addTraces(inputSignal, { x: time, y: audioDataArray });
    Plotly.addTraces(outputSignal, { x: time, y: audioDataArray });
  })
  // // Add a vertical line trace for the cursor
  // // const max = Math.max(audioData);
  // Plotly.addTraces(inputSignal, { x: [0, 0], y: [-0.5, 0.5] });
  // Plotly.addTraces(outputSignal, { x: [0, 0], y: [-0.5, 0.5] });
});

document.querySelectorAll(".uniformmode").forEach((slider,index)=>{
  slider.addEventListener('change',()=>{
    // let minRange=0;
    // let maxRange=0;
    // switch (index) {
    //   case 0:
    //     (minRange = 20), (maxRange = 2000);
    //     break;
    //   case 1:
    //     (minRange = 2000), (maxRange = 4000);
    //     break;
    //   case 2:
    //     (minRange = 4000), (maxRange = 6000);
    //     break;
    //   case 3:
    //     (minRange = 6000), (maxRange = 8000);
    //     break;
    //   case 4:
    //     (minRange = 8000), (maxRange = 10000);
    //     break;
    //   case 5:
    //     (minRange = 10000), (maxRange = 12000);
    //     break;
    //   case 6:
    //     (minRange = 12000), (maxRange = 14000);
    //     break;
    //   case 7:
    //     (minRange = 14000), (maxRange = 16000);
    //     break;
    //   case 8:
    //     (minRange = 16000), (maxRange = 18000);
    //     break;
    //   case 9:
    //     (minRange = 18000), (maxRange = 20000);
    //     break;
    //   default:
    //     break;
    // }
    let data={time:outputSignal.data[0].x, amplitude: outputSignal.data[0].y, sampleRate: sampleRate,sliderNum: index,sliderValue:slider.value}
    fetch("uniformAudioProcessing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((result)=>{
      console.log(result);
    })
  })
});

document.querySelectorAll(".audiofile").forEach((audio, index) => {
  audio.addEventListener("timeupdate", (event) => {
    const currentTime = event.target.currentTime;
    updateCursor(currentTime, index);
  });
});
// Add an event listener to the audio element to update the cursor position during playback
function updateCursor(currentTime, index) {
  if (index === 0)
    Plotly.update(
      inputSignal,
      { x: [[currentTime, currentTime]], y: [[-0.5, 0.5]] },
      {},
      [1]
    );
  else
    Plotly.update(
      inputSignal,
      { x: [[currentTime, currentTime]], y: [[-0.5, 0.5]] },
      {},
      [1]
    );
}

document.querySelectorAll(".stopbutton").forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === 0) {
      inputAudio.pause();
      inputAudio.currentTime = 0;
    } else {
      outputAudio.pause();
      outputAudio.currentTime = 0;
    }
  });
});

document.querySelector("#spectrogram-toggle").addEventListener("change", (event) => {
    document.querySelectorAll(".spectrogram").forEach((spectrogram) => {
      if (event.target.checked) {
        spectrogram.style.display = "block";
      } else {
        spectrogram.style.display = "none";
      }
    });
});

//   //apply changes from first graph onto the second graph in case of zooming and panning
//   inputSignal.on("plotly_relayout", () => {
//     linking(inputSignal, outputSignal);
//   });
//   //apply changes from second graph onto the first graph in case of zooming and panning
//   outputSignal.on("plotly_relayout", () => {
//     linking(outputSignal, inputSignal);
//   });
//   //linking function
// function linking(firstGraph, secondGraph) {
//     var xaxis = firstGraph.layout.xaxis;
//     //link time frame 
//     var update = {
//       xaxis: {
//         range: [xaxis.range[0], xaxis.range[1]],
//       },
//     };
//     Plotly.update(secondGraph, {}, update);
// }
