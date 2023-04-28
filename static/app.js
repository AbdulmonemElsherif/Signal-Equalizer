// Define variables for input and output signal viewers
const inputSignal = document.getElementById("inputwave");
const outputSignal = document.getElementById("outputwave");
// Define variables for input and output spectrograms
const inputSpectrogram = document.getElementById("inputspectrogram");
const outputSpectrogram = document.getElementById("outputspectrogram");
// Define variables for equalizer sliders
let sliders;
let sampleRate;
let maxTime = 0;
// Define variable for mode selector
const equalizerContainer = document.getElementById("equalizer-container");
const modeSelector = document.getElementById("mode-select");
const inputAudio = document.getElementById("inputaudio");
const outputAudio = document.getElementById("outputaudio");
let file;
let plotted = false;
let signals = [];
let modeBool = [0, 0, 0, 0];
//--------------------------------------EVENT LISTENERS---------------------------------------------

document.querySelectorAll(".slider").forEach((slider) => {
  slider.addEventListener("change", handleSliderChange);
});

// Add event listener to mode selector
modeSelector.addEventListener("change", () => {
  const selectedIndex = modeSelector.selectedIndex;
  updateSliders(selectedIndex);
});

window.addEventListener("load", function () {
  createPlot(inputSignal);
  createPlot(outputSignal);
  //apply changes from first graph onto the second graph in case of zooming and panning
  inputSignal.on("plotly_relayout", () => {
    linking(inputSignal, outputSignal);
  });
  //apply changes from second graph onto the first graph in case of zooming and panning
  outputSignal.on("plotly_relayout", () => {
    linking(outputSignal, inputSignal);
  });
});

document
  .getElementById("formFile")
  .addEventListener("change", async (event) => {
    file = event.target.files[0];
    const fileType = file.type;

    if (fileType != "text/csv") {
      let fileURL = URL.createObjectURL(file);
      inputAudio.src = fileURL;
      outputAudio.src = fileURL;
      var formData = new FormData();
      formData.append("audioFile", file);
      readAudioFile(formData);
    } else {
      // Create a new file reader instance
      const reader = new FileReader();
      // Read the file as text
      reader.readAsText(file);
      let data;
      // Trigger this function when the file is loaded
      reader.onload = () => {
        // Parse the CSV data into an array of objects
        data = reader.result
          .trim()
          .split("\n")
          .map((row) => {
            // Split each row by comma and convert the values to numbers
            const [col1, col2] = row.split(",");
            return { col1: parseFloat(col1), col2: parseFloat(col2) };
          });
        // Convert the CSV data to a trace and update the graph
        convertCsvToTrace(data);
        plotGraphs(signals[0].x, signals[0].y);
      };
    }
  });

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

document
  .querySelector("#spectrogram-toggle")
  .addEventListener("change", (event) => {
    document.querySelectorAll(".spectrogram").forEach((spectrogram) => {
      if (event.target.checked) {
        spectrogram.style.display = "block";
      } else {
        spectrogram.style.display = "none";
      }
    });
  });

graphElement.on("plotly_afterplot", function () {
  checkBoundaries(graphElement);
});

// document.querySelectorAll(".audiofile").forEach((audio, index) => {
//   audio.addEventListener("timeupdate", (event) => {
//     const currentTime = event.target.currentTime;
//     updateCursor(currentTime, index);
//   });
// });

//---------------------------------------FUNCTIONS----------------------------------------------------------

function createPlot(graphElement) {
  let layout = {
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 5,
    },
    xaxis: {
      title: "Time (sec)",
      zoom: 1000,
    },
    yaxis: {
      title: "Amplitude",
      fixedrange: true,
    },
    dragmode: false,
  };
  let config = {
    // Enable responsive sizing of the plot
    responsive: true,
    // Enable automatic resizing of the plot to fit its container element
    autosize: true,
    //remove logo of plotly
    displaylogo: false,
    //remove unused buttons
    modeBarButtonsToRemove: ["toImage", "zoom2d", "lasso2d", "pan2d"],
  };
  Plotly.newPlot(graphElement, [], layout, config);
}

function readAudioFile(formData) {
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
      // find the maximum time value in the audio file
      maxTime = audioDataArray.length / sampleRate;
      document.querySelectorAll(".slider").forEach((slider) => {
        slider.value = 0;
      });
      plotGraphs(time, audioDataArray);
    });
  // // Add a vertical line trace for the cursor
  // // const max = Math.max(audioData);
  // Plotly.addTraces(inputSignal, { x: [0, 0], y: [-0.5, 0.5] });
  // Plotly.addTraces(outputSignal, { x: [0, 0], y: [-0.5, 0.5] });
}

function plotGraphs(x, y) {
  var config = {
    dragmode: "pan",
  };
  if (inputSignal.data.length === 0) {
    Plotly.addTraces(inputSignal, { x: x, y: y });
    Plotly.addTraces(outputSignal, { x: x, y: y });
  } else {
    Plotly.deleteTraces(inputSignal, 0);
    Plotly.deleteTraces(outputSignal, 0);
    Plotly.addTraces(inputSignal, { x: x, y: y });
    Plotly.addTraces(outputSignal, { x: x, y: y });
  }
  Plotly.update(inputSignal, {}, config);
  Plotly.update(outputSignal, {}, config);
  plotInitialSpectrograms();
}

function convertCsvToTrace(csvdata) {
  let x = csvdata.map((arrRow) => arrRow.col1).slice(0, 1000);
  let y = csvdata.map((arrRow) => arrRow.col2).slice(0, 1000);
  let uploadedSignal = { x: x, y: y };
  if (signals.length == 0) {
    signals.push(uploadedSignal);
    // Plotly.addTraces(inputSignal, uploadedSignal);
  }
}

function processUniformAudio(file) {
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
      Plotly.update(outputSignal, { x: [time], y: [audioDataArray] }, {}, 0);
    });
}

// Define function to update equalizer sliders based on selected mode
function updateSliders(selectedIndex) {
  const sliderGroups = document.querySelectorAll(".slider-group");
  equalizerContainer.style.display = "block";
  sliderGroups.forEach((sliderGroup, index) => {
    if (index === selectedIndex - 1) {
      sliderGroup.style.display = "block";
    } else {
      sliderGroup.style.display = "none";
    }
  });
}

function getSliderValues() {
  let sliderValues = [];
  selectedModeIndex = document.getElementById("mode-select").selectedIndex;
  if (selectedModeIndex === 1) {
    document.querySelectorAll(".uniformmode").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool[0] = 1;
    });
  } else if (selectedModeIndex === 2) {
    document.querySelectorAll(".vowels").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool[1] = 1;
    });
  } else if (selectedModeIndex === 3) {
    document.querySelectorAll(".music").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool[2] = 1;
    });
  } else if (selectedModeIndex === 4) {
    document.querySelectorAll(".abnormalities").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool[3] = 1;
    });
  }
  return sliderValues;
}

function handleSliderChange() {
  sliderValues = getSliderValues();
  var formData = new FormData();
  formData.append("file", file);
  formData.append("sliderValues", JSON.stringify(sliderValues));
  formData.append("mode", JSON.stringify(modeBool));
  fetch("/audioProcessing", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.blob())
    .then((result) => {
      spectrogramSliderChange(result);
      outputAudio.src = URL.createObjectURL(result);
      processUniformAudio(result);
    });
}

function spectrogramSliderChange(outputfile) {
  var formData = new FormData();
  formData.append("outputFile", outputfile);
  fetch("/outputSpectrogram", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      const outputSpectrogram = document.getElementById("outputspectrogram");
      outputSpectrogram.src = "data:image/png;base64," + result.image;
    });
}

function plotInitialSpectrograms() {
  fetch("/inputSpectrogram", {})
    .then((response) => response.json())
    .then((result) => {
      // Set the image data as the source of the image element
      document.querySelectorAll(".spectrogram").forEach((spectrogram) => {
        spectrogram.src = "data:image/png;base64," + result.image;
      });
    });
}

//linking function
function linking(firstGraph, secondGraph) {
  var xaxis = firstGraph.layout.xaxis;
  var yaxis = firstGraph.layout.yaxis;
  var update = {
    xaxis: {
      range: [xaxis.range[0], xaxis.range[1]],
    },
    yaxis: {
      range: [yaxis.range[0], yaxis.range[1]],
    },
  };
  Plotly.update(secondGraph, {}, update);
}

function checkBoundaries(graphElement) {
  let xaxis = graphElement.layout.xaxis;
  const validXRange = [0, maxTime];
  if (xaxis.range[0] < validXRange[0] || xaxis.range[1] > validXRange[1]) {
    // Reset the x-axis range to the valid range
    Plotly.relayout(graphElement, {
      xaxis: {
        range: [validXRange[0], validXRange[1]],
      },
    });
  }
}
// // Add an event listener to the audio element to update the cursor position during playback
// function updateCursor(currentTime, index) {
//   if (index === 0)
//     Plotly.update(
//       inputSignal,
//       { x: [[currentTime, currentTime]], y: [[-0.5, 0.5]] },
//       {},
//       [1]
//     );
//   else
//     Plotly.update(
//       inputSignal,
//       { x: [[currentTime, currentTime]], y: [[-0.5, 0.5]] },
//       {},
//       [1]
//     );
// }
