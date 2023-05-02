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
  inputSignal.on("plotly_relayout", (eventData) => {
    linking(inputSignal, outputSignal);
    checkBoundaries(inputSignal,eventData);
  });
  //apply changes from second graph onto the first graph in case of zooming and panning
  outputSignal.on("plotly_relayout", (eventData) => {
    linking(outputSignal, inputSignal);
    checkBoundaries(outputSignal,eventData);
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
      // var formData = new FormData();
      // formData.append("audioFile", file);
      readAudioFile(file);
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
    document.getElementById("spectrogram")
      if (event.target.checked) {
        spectrogram.style.display = "flex";
        document.getElementById("audio").style.display = "none";
      } else {
        spectrogram.style.display = "none";
        document.getElementById("audio").style.display = "flex";
      }
  });

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

function readAudioFile(file) {
  var formData = new FormData();
  formData.append("audioFile", file);
  let maxFreq=0;
  fetch("/readAudioFile", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      let audioDataArray = result.audioData;
      let time = [];
      sampleRate = result.sampleRate;
      maxFreq = result.maxFreq;
      setUniformSliderRange(maxFreq);
      for (let index = 0; index < audioDataArray.length; index++) {
        //get time from sampling frequency as  fs = 1/T
        time.push(index / sampleRate);
      }
      // find the maximum time value in the audio file
      maxTime = time[time.length - 1];
      document.querySelectorAll(".slider").forEach((slider) => {
        slider.value = 0;
      });
      plotGraphs(time, audioDataArray);
    });
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
  //maps the values of column 1 and column 2 of the CSV data to two arrays x and y
  //slices the arrays to take only the first 1000 elements (to limit the plot size)
  let x = csvdata.map((arrRow) => arrRow.col1).slice(0, 1000);
  let y = csvdata.map((arrRow) => arrRow.col2).slice(0, 1000);
  let uploadedSignal = { x: x, y: y };
  if (signals.length == 0) {
    signals.push(uploadedSignal);
  }else{
  //If there is already a trace object in the array, the existing trace object is removed using the pop() method 
  //and the new uploaded signal trace object is pushed into the array using the push() method
  signals.pop();
  signals.push(uploadedSignal);
}
}

function processAudio(file) {
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
      //updates a Plotly chart with the time and audio data arrays
      Plotly.update(outputSignal, { x: [time], y: [audioDataArray] }, {}, 0);
      
    });
}

// Define function to update equalizer sliders based on selected mode
function updateSliders(selectedIndex) {
  const sliderGroups = document.querySelectorAll(".slider-group");
  equalizerContainer.style.display = "block";
  sliderGroups.forEach((sliderGroup, index) => {
    if (index === selectedIndex - 1) {
      sliderGroup.style.display = "flex";
    } else {
      sliderGroup.style.display = "none";
    }
  });
}

function getSliderValues() {
  let sliderValues = [];
  selectedModeIndex = document.getElementById("mode-select").selectedIndex;
  // uses the forEach() method to iterate over all the elements with the class name "uniformmode" and pushes their values into an array called sliderValues. 
  if (selectedModeIndex === 1) {
    document.querySelectorAll(".uniformmode").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool = [1, 0, 0, 0];
    });
  } else if (selectedModeIndex === 2) {
    document.querySelectorAll(".vowels").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool = [0, 1, 0, 0];
    });
  } else if (selectedModeIndex === 3) {
    document.querySelectorAll(".music").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool = [0, 0, 1, 0];
    });
  } else if (selectedModeIndex === 4) {
    document.querySelectorAll(".arrythmia").forEach((slider) => {
      sliderValues.push(slider.value);
      modeBool = [0, 0, 0, 1];
    });
  }
  return sliderValues;
}

function setUniformSliderRange(maxfreq){
  //sets the labels of uniform sliders
  let range=0;
  document.querySelectorAll(".uniformrangelabel").forEach((label) => {
    label.innerHTML=`${range/1000}`
    range = range + Math.round(maxfreq / 10);
    label.innerHTML += `-${range/1000}kHz`;
  });
}

function handleSliderChange() {
  sliderValues = getSliderValues();
  //used to create key-value pairs from form data or other types of data and then send it to a server using the fetch() method or the XMLHttpRequest object
  var formData = new FormData();
  formData.append("file", file);
  formData.append("sliderValues", JSON.stringify(sliderValues));
  formData.append("mode", JSON.stringify(modeBool));
  // selectedModeIndex = document.getElementById("mode-select").selectedIndex;
  if (file.name.endsWith(".csv")) {
    // formData.append("y", inputSignal.data[0].y);
    fetch("/detectArrhythmia", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((result) => {
        spectrogramSliderChange(result);
        const reader = new FileReader();
        reader.onload = () => {
          const csvdata = reader.result;
          const arrdata = csvdata.split("\n").map(row => parseFloat(row.split(",")[1]));
          Plotly.update(outputSignal, { y: [arrdata] }, {}, 0);
        };
        reader.readAsText(result);
      });
  } else {
    fetch("/audioProcessing", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((result) => {
        spectrogramSliderChange(result);
        outputAudio.src = URL.createObjectURL(result);
        processAudio(result);
      });
  }
}

function spectrogramSliderChange(outputfile) {
  var formData = new FormData();
  formData.append("outputFile", outputfile);
  fetch("/outputSpectrogram", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    //update the image source of an HTML element
    .then((result) => {
      const outputSpectrogram = document.getElementById("outputspectrogram");
      outputSpectrogram.src = "data:image/png;base64," + result.image;
    });
}

function plotInitialSpectrograms() {
  var formData = new FormData();
  formData.append("file", file);
  fetch("/inputSpectrogram", {
    method: "POST",
    body: formData,
  })
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
      fixedrange:true,
      range: [yaxis.range[0], yaxis.range[1]],
    },
  };
  Plotly.update(secondGraph, {}, update);
}

function checkBoundaries(graphElement,eventData) {
  if (maxTime) {
    var xMin = eventData["xaxis.range[0]"];
    var xMax = eventData["xaxis.range[1]"];
    if (xMax > maxTime || xMin < 0) {
      Plotly.relayout(graphElement, {
        xaxis: {
          range: [0, maxTime],
        },
        yaxis: { fixedrange: true },
      });
    }
  }
}
