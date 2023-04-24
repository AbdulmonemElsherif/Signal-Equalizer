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
const outputAudio = document.getElementById("outputaudio");

let file;


document.querySelectorAll(".slider").forEach((slider)=>{
  slider.addEventListener("change", handleSliderChange)
});

// Add event listener to mode selector
modeSelector.addEventListener("change", ()=>{
  const selectedIndex = modeSelector.selectedIndex;
  updateSliders(selectedIndex);
});

window.addEventListener("load", function () {
  createPlot(inputSignal);
  createPlot(outputSignal);
});

document
  .getElementById("formFile")
  .addEventListener("change", async (event) => {
    file = event.target.files[0];
    let fileURL = URL.createObjectURL(file);
    inputAudio.src = fileURL;
    outputAudio.src = fileURL;
    var formData = new FormData();
    formData.append("audioFile", file);
    fetch("/readAudioFile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        let audioDataArray = result.audioData;
        let time = [];
        sampleRate = result.sampleRate;
        for (let index = 0; index < audioDataArray.length; index++) {
          //get time from sampling frequency as  fs = 1/T
          time.push(index / sampleRate);
        }
        document.querySelectorAll(".slider").forEach((slider) => {
          slider.value = 0;
        });
        if (inputSignal.data.length === 0) {
          Plotly.addTraces(inputSignal, { x: time, y: audioDataArray });
          Plotly.addTraces(outputSignal, { x: time, y: audioDataArray });
        } else {
          Plotly.deleteTraces(inputSignal, [0]);
          Plotly.deleteTraces(outputSignal, [0]);
          Plotly.addTraces(inputSignal, { x: time, y: audioDataArray });
          Plotly.addTraces(outputSignal, { x: time, y: audioDataArray });
        }
      });
    // // Add a vertical line trace for the cursor
    // // const max = Math.max(audioData);
    // Plotly.addTraces(inputSignal, { x: [0, 0], y: [-0.5, 0.5] });
    // Plotly.addTraces(outputSignal, { x: [0, 0], y: [-0.5, 0.5] });
  });

  document.getElementById("formfile").addEventListener("change", async (event)=> {
    const file =  event.target.files[0];
    const fileType = file.type;
    if(fileType == 'text/csv')
    {
      const formData = new FormData();
      formData.append('file', file);
      fetch('/upload_csv', {
          method: 'POST',
          body: formData
      })
      .then((response) => response.json())
      .then((data) => {
        if (inputSignal.data.length === 0) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
          data = reader.result
          .trim()
          .split("\n")
          .map((row) => {
          const [col1, col2] = row.split(",");
          return { col1: parseFloat(col1), col2: parseFloat(col2) };
          });
        }
      }
      convertCsvToTrace(data);

    });
  }
 });

 function convertCsvToTrace(csvdata) {
  let x = csvdata.map((arrRow) => arrRow.col1).slice(0, 1000);
  let y = csvdata.map((arrRow) => arrRow.col2).slice(0, 1000);
  let uploadedSignal = { name: "input Signal", x: x, y: y };
  if (signals.length == 0) {
    signals.push(uploadedSignal);
    Plotly.addTraces(inputSignal, uploadedSignal);
  }
}

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

function getSliderValues(){
  let sliderValues = [];
  selectedModeIndex = document.getElementById("mode-select").selectedIndex;
  if (selectedModeIndex === 1) {
    document.querySelectorAll(".uniformmode").forEach((slider) => {
      sliderValues.push(slider.value);
    });
  } else if (selectedModeIndex === 2) {
    document.querySelectorAll(".vowels").forEach((slider) => {
      sliderValues.push(slider.value);
    });
  }
  return sliderValues;
}

function handleSliderChange() {
  sliderValues = getSliderValues();
  var formData = new FormData();
  formData.append("audioFile", file);
  formData.append("sliderValues", JSON.stringify(sliderValues));
  fetch("audioProcessing", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.blob())
    .then((result) => {
      console.log(result);
      outputAudio.src = URL.createObjectURL(result);
      processUniformAudio(result);
    });
  }


document.getElementById("ECG").addEventListener("change", function(){
  const file = document.getElementById('ECG').files[0];

  const formData = new FormData();
  formData.append('r', file);

  axios.post('', formData)
    .then(response => {
      
      const graphData = JSON.parse(response.data);
    });
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