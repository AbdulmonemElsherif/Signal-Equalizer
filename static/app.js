// // Define variables for input and output signal viewers
// const inputSignal = document.getElementById("inputwave");
// const outputSignal = document.getElementById("outputwave");
// // Define variables for input and output spectrograms
// const inputSpectrogram = document.getElementById("inputspectrogram");
// const outputSpectrogram = document.getElementById("outputspectrogram");
// // Define variables for equalizer sliders
// let sliders;
// let sampleRate;
// let maxTime = 0;
// // Define variable for mode selector
// const equalizerContainer = document.getElementById("equalizer-container");
// const modeSelector = document.getElementById("mode-select");
// const slidersContainer = document.getElementById("sliders");
// const inputAudio = document.getElementById("inputaudio");
// const outputAudio = document.getElementById("outputaudio");
// let file;
// let plotted = false;
// let signals = [];
// let modeBool = [0, 0, 0, 0];
// //--------------------------------------EVENT LISTENERS---------------------------------------------

// // document.querySelectorAll(".slider").forEach((slider) => {
// //   slider.addEventListener("change", handleSliderChange);
// // });

// // // Add event listener to mode selector
// // modeSelector.addEventListener("change", () => {
// //   const selectedIndex = modeSelector.selectedIndex;
// //   updateSliders(selectedIndex);
// // });
// function addSliders() {
//   // const slidersContainer = document.getElementById("sliders");
//   // const equalizerContainer = document.getElementById("equalizer-container");
//   // const modeSelect = document.getElementById("mode-select");

//   modeSelect.addEventListener("change", function () {
//     const mode = modeSelect.value;

//     // Hide all slider groups
//     const sliderGroups = document.querySelectorAll(".slider-group");
//     sliderGroups.forEach(function (group) {
//       group.style.display = "none";
//     });

//     // Show the selected slider group
//     const selectedGroup = document.getElementById(`${mode}-sliders`);
//     selectedGroup.style.display = "block";

//     // Set limits and default values for each slider
//     const sliders = selectedGroup.querySelectorAll(".slider");
//     sliders.forEach(function (slider) {
//       switch (mode) {
//         case "uniform":
//           slider.min = "-12";
//           slider.max = "12";
//           slider.value = "0";
//           slider.previousElementSibling.textContent = "";
//           break;
//         case "vowels":
//           slider.min = "-6";
//           slider.max = "6";
//           slider.value = "0";
//           slider.previousElementSibling.textContent = `Slider ${slider.id.slice(-1)}`;
//           break;
//         case "music":
//           slider.min = "-5";
//           slider.max = "5";
//           slider.value = "0";
//           slider.previousElementSibling.textContent = slider.id.slice(7);
//           break;
//         case "arrythmia":
//           slider.min = "-50";
//           slider.max = "50";
//           slider.value = "0";
//           slider.previousElementSibling.textContent = "Arrythmia";
//           break;
//       }
//     });
//   });

//   // Initialize with the first mode selected
//   modeSelect.value = "uniform";
//   modeSelect.dispatchEvent(new Event("change"));

//   // Show the sliders container
//   slidersContainer.style.display = "block";
// }

// window.addEventListener("load", function () {
//   addSliders();
// });

// window.addEventListener("load", function () {
//   createPlot(inputSignal);
//   createPlot(outputSignal);
//   //apply changes from first graph onto the second graph in case of zooming and panning
//   inputSignal.on("plotly_relayout", (eventData) => {
//     linking(inputSignal, outputSignal);
//     checkBoundaries(inputSignal, eventData);
//   });
//   //apply changes from second graph onto the first graph in case of zooming and panning
//   outputSignal.on("plotly_relayout", (eventData) => {
//     linking(outputSignal, inputSignal);
//     checkBoundaries(outputSignal, eventData);
//   });
// });

// document
//   .getElementById("formFile")
//   .addEventListener("change", async (event) => {
//     file = event.target.files[0];
//     const fileType = file.type;

//     if (fileType != "text/csv") {
//       let fileURL = URL.createObjectURL(file);
//       inputAudio.src = fileURL;
//       outputAudio.src = fileURL;
//       // var formData = new FormData();
//       // formData.append("audioFile", file);
//       readAudioFile(file);
//     } else {
//       // Create a new file reader instance
//       const reader = new FileReader();
//       // Read the file as text
//       reader.readAsText(file);
//       let data;
//       // Trigger this function when the file is loaded
//       reader.onload = () => {
//         // Parse the CSV data into an array of objects
//         data = reader.result
//           .trim()
//           .split("\n")
//           .map((row) => {
//             // Split each row by comma and convert the values to numbers
//             const [col1, col2] = row.split(",");
//             return { col1: parseFloat(col1), col2: parseFloat(col2) };
//           });
//         // Convert the CSV data to a trace and update the graph
//         convertCsvToTrace(data);
//         plotGraphs(signals[0].x, signals[0].y);
//       };
//     }
//   });

// document.querySelectorAll(".stopbutton").forEach((button, index) => {
//   button.addEventListener("click", () => {
//     if (index === 0) {
//       inputAudio.pause();
//       inputAudio.currentTime = 0;
//     } else {
//       outputAudio.pause();
//       outputAudio.currentTime = 0;
//     }
//   });
// });

// document
//   .querySelector("#spectrogram-toggle")
//   .addEventListener("change", (event) => {
//     document.querySelectorAll(".spectrogram").forEach((spectrogram) => {
//       if (event.target.checked) {
//         spectrogram.style.display = "block";
//       } else {
//         spectrogram.style.display = "none";
//       }
//     });
//   });

// //---------------------------------------FUNCTIONS----------------------------------------------------------

// function createPlot(graphElement) {
//   let layout = {
//     margin: {
//       l: 50,
//       r: 50,
//       b: 50,
//       t: 50,
//       pad: 5,
//     },
//     xaxis: {
//       title: "Time (sec)",
//       zoom: 1000,
//     },
//     yaxis: {
//       title: "Amplitude",
//       fixedrange: true,
//     },
//     dragmode: false,
//   };
//   let config = {
//     // Enable responsive sizing of the plot
//     responsive: true,
//     // Enable automatic resizing of the plot to fit its container element
//     autosize: true,
//     //remove logo of plotly
//     displaylogo: false,
//     //remove unused buttons
//     modeBarButtonsToRemove: ["toImage", "zoom2d", "lasso2d", "pan2d"],
//   };
//   Plotly.newPlot(graphElement, [], layout, config);
// }

// function readAudioFile(file) {
//   var formData = new FormData();
//   formData.append("audioFile", file);
//   let maxFreq = 0;
//   fetch("/readAudioFile", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       let audioDataArray = result.audioData;
//       let time = [];
//       sampleRate = result.sampleRate;
//       maxFreq = result.maxFreq;
//       setUniformSliderRange(maxFreq);
//       for (let index = 0; index < audioDataArray.length; index++) {
//         //get time from sampling frequency as  fs = 1/T
//         time.push(index / sampleRate);
//       }
//       // find the maximum time value in the audio file
//       maxTime = time[time.length - 1];
//       document.querySelectorAll(".slider").forEach((slider) => {
//         slider.value = 0;
//       });
//       plotGraphs(time, audioDataArray);
//     });
// }

// function plotGraphs(x, y) {
//   var config = {
//     dragmode: "pan",
//   };
//   if (inputSignal.data.length === 0) {
//     Plotly.addTraces(inputSignal, { x: x, y: y });
//     Plotly.addTraces(outputSignal, { x: x, y: y });
//   } else {
//     Plotly.deleteTraces(inputSignal, 0);
//     Plotly.deleteTraces(outputSignal, 0);
//     Plotly.addTraces(inputSignal, { x: x, y: y });
//     Plotly.addTraces(outputSignal, { x: x, y: y });
//   }
//   Plotly.update(inputSignal, {}, config);
//   Plotly.update(outputSignal, {}, config);
//   plotInitialSpectrograms();
// }

// function convertCsvToTrace(csvdata) {
//   //maps the values of column 1 and column 2 of the CSV data to two arrays x and y
//   //slices the arrays to take only the first 1000 elements (to limit the plot size)
//   let x = csvdata.map((arrRow) => arrRow.col1).slice(0, 1000);
//   let y = csvdata.map((arrRow) => arrRow.col2).slice(0, 1000);
//   let uploadedSignal = { x: x, y: y };
//   if (signals.length == 0) {
//     signals.push(uploadedSignal);
//   } else {
//     //If there is already a trace object in the array, the existing trace object is removed using the pop() method 
//     //and the new uploaded signal trace object is pushed into the array using the push() method
//     signals.pop();
//     signals.push(uploadedSignal);
//   }
// }

// function processAudio(file) {
//   var formData = new FormData();
//   formData.append("audioFile", file);
//   fetch("/readAudioFile", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       let audioDataArray = result.audioData;
//       let time = [];
//       sampleRate = result.sampleRate;
//       for (let index = 0; index < audioDataArray.length; index++) {
//         //get time from sampling frequency as  fs = 1/T
//         time.push(index / sampleRate);
//       }
//       //updates a Plotly chart with the time and audio data arrays
//       Plotly.update(outputSignal, { x: [time], y: [audioDataArray] }, {}, 0);

//     });
// }

// // // Define function to update equalizer sliders based on selected mode
// // function updateSliders(selectedIndex) {
// //   const sliderGroups = document.querySelectorAll(".slider-group");
// //   equalizerContainer.style.display = "block";
// //   sliderGroups.forEach((sliderGroup, index) => {
// //     if (index === selectedIndex - 1) {
// //       sliderGroup.style.display = "block";
// //     } else {
// //       sliderGroup.style.display = "none";
// //     }
// //   });
// // }

// // function getSliderValues() {
// //   let sliderValues = [];
// //   selectedModeIndex = document.getElementById("mode-select").selectedIndex;
// //   // uses the forEach() method to iterate over all the elements with the class name "uniformmode" and pushes their values into an array called sliderValues. 
// //   if (selectedModeIndex === 1) {
// //     document.querySelectorAll(".uniformmode").forEach((slider) => {
// //       sliderValues.push(slider.value);
// //       modeBool = [1, 0, 0, 0];
// //     });
// //   } else if (selectedModeIndex === 2) {
// //     document.querySelectorAll(".vowels").forEach((slider) => {
// //       sliderValues.push(slider.value);
// //       modeBool = [0, 1, 0, 0];
// //     });
// //   } else if (selectedModeIndex === 3) {
// //     document.querySelectorAll(".music").forEach((slider) => {
// //       sliderValues.push(slider.value);
// //       modeBool = [0, 0, 1, 0];
// //     });
// //   } else if (selectedModeIndex === 4) {
// //     document.querySelectorAll(".arrythmia").forEach((slider) => {
// //       sliderValues.push(slider.value);
// //       modeBool = [0, 0, 0, 1];
// //     });
// //   }
// //   return sliderValues;
// // }

// // function setUniformSliderRange(maxfreq){
// //   //sets the labels of uniform sliders
// //   let range=0;
// //   document.querySelectorAll(".uniformrangelabel").forEach((label) => {
// //     label.innerHTML=`${range/1000}`
// //     range = range + Math.round(maxfreq / 10);
// //     label.innerHTML += `-${range/1000}kHz`;
// //   });
// // }

// // function handleSliderChange() {
// //   sliderValues = getSliderValues();
// //   //used to create key-value pairs from form data or other types of data and then send it to a server using the fetch() method or the XMLHttpRequest object
// //   var formData = new FormData();
// //   formData.append("file", file);
// //   formData.append("sliderValues", JSON.stringify(sliderValues));
// //   formData.append("mode", JSON.stringify(modeBool));
// //   // selectedModeIndex = document.getElementById("mode-select").selectedIndex;
// //   if (file.name.endsWith(".csv")) {
// //     // formData.append("y", inputSignal.data[0].y);
// //     fetch("/detectArrhythmia", {
// //       method: "POST",
// //       body: formData,
// //     })
// //       .then((response) => response.blob())
// //       .then((result) => {
// //         spectrogramSliderChange(result);
// //         const reader = new FileReader();
// //         reader.onload = () => {
// //           const csvdata = reader.result;
// //           const arrdata = csvdata.split("\n").map(row => parseFloat(row.split(",")[1]));
// //           Plotly.update(outputSignal, { y: [arrdata] }, {}, 0);
// //         };
// //         reader.readAsText(result);
// //       });
// //   } else {
// //     fetch("/audioProcessing", {
// //       method: "POST",
// //       body: formData,
// //     })
// //       .then((response) => response.blob())
// //       .then((result) => {
// //         spectrogramSliderChange(result);
// //         outputAudio.src = URL.createObjectURL(result);
// //         processAudio(result);
// //       });
// //   }
// // }
// function addLabelsToSliders(mode) {
//   const slidersContainer = document.getElementById("sliders");
//   slidersContainer.innerHTML = "";

//   if (mode === "equalizer") {
//     const equalizerSliders = document.createElement("div");
//     equalizerSliders.id = "equalizer-container";
//     equalizerSliders.style.display = "none";

//     const uniformRangeSliders = document.createElement("div");
//     uniformRangeSliders.className = "slider-group";
//     uniformRangeSliders.id = "uniform-range-sliders";

//     for (let i = 1; i <= 10; i++) {
//       const formGroup = document.createElement("div");
//       formGroup.className = "form-group";

//       const label = document.createElement("label");
//       label.htmlFor = "slider" + i;
//       label.className = "uniformrangelabel";
//       label.innerText = "Slider " + i;

//       const input = document.createElement("input");
//       input.type = "range";
//       input.className = "form-control-range uniformmode slider";
//       input.id = "slider" + i;
//       input.min = "-12";
//       input.max = "12";
//       input.value = "0";

//       formGroup.appendChild(label);
//       formGroup.appendChild(input);
//       uniformRangeSliders.appendChild(formGroup);
//     }

//     const vowelsSliders = document.createElement("div");
//     vowelsSliders.className = "slider-group";
//     vowelsSliders.id = "vowels-sliders";

//     const sliderS = document.createElement("div");
//     sliderS.className = "form-group";

//     const labelS = document.createElement("label");
//     labelS.htmlFor = "slider-S";
//     labelS.innerText = "Slider S";

//     const inputS = document.createElement("input");
//     inputS.type = "range";
//     inputS.className = "form-control-range vowels slider";
//     inputS.id = "slider-S";
//     inputS.min = "-6";
//     inputS.max = "6";
//     inputS.value = "0";

//     sliderS.appendChild(labelS);
//     sliderS.appendChild(inputS);

//     const sliderB = document.createElement("div");
//     sliderB.className = "form-group";

//     const labelB = document.createElement("label");
//     labelB.htmlFor = "slider-B";
//     labelB.innerText = "Slider B";

//     const inputB = document.createElement("input");
//     inputB.type = "range";
//     inputB.className = "form-control-range vowels slider";
//     inputB.id = "slider-B";
//     inputB.min = "-6";
//     inputB.max = "6";
//     inputB.value = "0";

//     sliderB.appendChild(labelB);
//     sliderB.appendChild(inputB);

//     const sliderY = document.createElement("div");
//     sliderY.className = "form-group";

//     const labelY = document.createElement("label");
//     labelY.htmlFor = "slider-Y";
//     labelY.innerText = "Slider Y";

//     const inputY = document.createElement("input");
//     inputY.type = "range";
//     inputY.className = "form-control-range vowels slider";
//     inputY.id = "slider-Y";
//     inputY.min = "-6";
//     inputY.max = "6";
//     inputY.value = "0";

//     sliderY.appendChild(labelY);
//     sliderY.appendChild(inputY);

//     vowelsSliders.appendChild(sliderS);
//     vowelsSliders.appendChild(sliderB);
//     vowelsSliders.appendChild(sliderY);

//     const musicalInstrumentsSliders = document.createElement("div");
//     musicalInstrumentsSliders.className = "slider-group";
//     musicalInstrumentsSliders.id = "musical-instruments-sliders";

//     const sliderTrumpet = document.createElement("div");
//     sliderTrumpet.className = "form-group";

//     const labelTrumpet = document.createElement("label");
//     labelTrumpet.htmlFor = "slider-Trumpet";
//     labelTrumpet.innerText = "Trumpet";

//     const inputTrumpet = document.createElement("input");
//     inputTrumpet.type = "range";
//     inputTrumpet.className = "form-control-range music slider";
//     inputTrumpet.id = "slider-Trumpet";
//     inputTrumpet.min = "-5";
//     inputTrumpet.max = "5";
//     inputTrumpet.value = "0";

//     sliderTrumpet.appendChild(labelTrumpet);
//     sliderTrumpet.appendChild(inputTrumpet);

//     const sliderXylophone = document.createElement("div");
//     sliderXylophone.className = "form-group";

//     const labelXylophone = document.createElement("label");
//     labelXylophone.htmlFor = "slider-Xylophone";
//     labelXylophone.innerText = "Xylophone";

//     const inputXylophone = document.createElement("input");
//     inputXylophone.type = "range";
//     inputXylophone.className = "form-control-range music slider";
//     inputXylophone.id = "slider-Xylophone";
//     inputXylophone.min = "-5";
//     inputXylophone.max = "5";
//     inputXylophone.value = "0";

//     sliderXylophone.appendChild(labelXylophone);
//     sliderXylophone.appendChild(inputXylophone);
//     const sliderBrass = document.createElement("div");
//     sliderBrass.className = "form-group";

//     const labelBrass = document.createElement("label");
//     labelBrass.htmlFor = "slider-Brass";
//     labelBrass.innerText = "Brass";

//     const inputBrass = document.createElement("input");
//     inputBrass.type = "range";
//     inputBrass.className = "form-control-range music slider";
//     inputBrass.id = "slider-Brass";
//     inputBrass.min = "-5";
//     inputBrass.max = "5";
//     inputBrass.value = "0";

//     sliderBrass.appendChild(labelBrass);
//     sliderBrass.appendChild(inputBrass);

//     musicalInstrumentsSliders.appendChild(sliderTrumpet);
//     musicalInstrumentsSliders.appendChild(sliderXylophone);
//     musicalInstrumentsSliders.appendChild(sliderBrass);

//     const biologicalSignalAbnormalitiesSliders = document.createElement("div");
//     biologicalSignalAbnormalitiesSliders.className = "slider-group";
//     biologicalSignalAbnormalitiesSliders.id = "biological-signal-abnormalities-sliders";

//     const sliderHeartbeat = document.createElement("div");
//     sliderHeartbeat.className = "form-group";

//     const labelHeartbeat = document.createElement("label");
//     labelHeartbeat.htmlFor = "slider-heartbeat";
//     labelHeartbeat.innerText = "Arrythmia";

//     const inputHeartbeat = document.createElement("input");
//     inputHeartbeat.type = "range";
//     inputHeartbeat.className = "form-control-range arrythmia slider";
//     inputHeartbeat.id = "slider-heartbeat";
//     inputHeartbeat.min = "-50";
//     inputHeartbeat.max = "50";
//     inputHeartbeat.value = "0";

//     sliderHeartbeat.appendChild(labelHeartbeat);
//     sliderHeartbeat.appendChild(inputHeartbeat);

//     biologicalSignalAbnormalitiesSliders.appendChild(sliderHeartbeat);

//     equalizerSliders.appendChild(uniformRangeSliders);
//     equalizerSliders.appendChild(vowelsSliders);
//     equalizerSliders.appendChild(musicalInstrumentsSliders);
//     equalizerSliders.appendChild(biologicalSignalAbnormalitiesSliders);

//     slidersContainer.appendChild(equalizerSliders);
//   } else {
//     const sliders = document.createElement("div");
//     sliders.id = "sliders-container";

//     for (let i = 1; i <= 5; i++) {
//       const formGroup = document.createElement("div");
//       formGroup.className = "form-group";

//       const label = document.createElement("label");
//       label.htmlFor = "slider" + i;
//       label.innerText = "Slider " + i;

//       const input = document.createElement("input");
//       input.type = "range";
//       input.className = "form-control-range";
//       input.id = "slider" + i;
//       input.min = "0";
//       input.max = "100";
//       input.value = "50";

//       formGroup.appendChild(label);
//       formGroup.appendChild(input);
//       sliders.appendChild(formGroup);
//     }
 

//     slidersContainer.appendChild(sliders);
//   }}

// addLabelsToSliders("equalizer");







//     function spectrogramSliderChange(outputfile) {
//       var formData = new FormData();
//       formData.append("outputFile", outputfile);
//       fetch("/outputSpectrogram", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         //update the image source of an HTML element
//         .then((result) => {
//           const outputSpectrogram = document.getElementById("outputspectrogram");
//           outputSpectrogram.src = "data:image/png;base64," + result.image;
//         });
//     }

//     function plotInitialSpectrograms() {
//       var formData = new FormData();
//       formData.append("file", file);
//       fetch("/inputSpectrogram", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((result) => {
//           // Set the image data as the source of the image element
//           document.querySelectorAll(".spectrogram").forEach((spectrogram) => {
//             spectrogram.src = "data:image/png;base64," + result.image;
//           });
//         });
//     }

//     //linking function
//     function linking(firstGraph, secondGraph) {
//       var xaxis = firstGraph.layout.xaxis;
//       var yaxis = firstGraph.layout.yaxis;
//       var update = {
//         xaxis: {
//           range: [xaxis.range[0], xaxis.range[1]],
//         },
//         yaxis: {
//           fixedrange: true,
//           range: [yaxis.range[0], yaxis.range[1]],
//         },
//       };
//       Plotly.update(secondGraph, {}, update);
//     }

//     function checkBoundaries(graphElement, eventData) {
//       if (maxTime) {
//         var xMin = eventData["xaxis.range[0]"];
//         var xMax = eventData["xaxis.range[1]"];
//         if (xMax > maxTime || xMin < 0) {
//           Plotly.relayout(graphElement, {
//             xaxis: {
//               range: [0, maxTime],
//             },
//             yaxis: { fixedrange: true },
//           });
//         }
//       }
//     }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function to update equalizer sliders based on selected mode
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
  function addLabelsToSliders(mode) {
  const slidersContainer = document.getElementById("sliders");
  slidersContainer.innerHTML = "";
  
  if (mode === "equalizer") {
  const equalizerSliders = document.createElement("div");
  equalizerSliders.id = "equalizer-container";
  equalizerSliders.style.display = "none";
  
  const uniformRangeSliders = document.createElement("div");
  uniformRangeSliders.className = "slider-group";
  uniformRangeSliders.id = "uniform-range-sliders";
  
  for (let i = 1; i <= 10; i++) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";
  
    const label = document.createElement("label");
    label.htmlFor = "slider" + i;
    label.className = "uniformrangelabel";
    label.innerText = "Slider " + i;
  
    const input = document.createElement("input");
    input.type = "range";
    input.className = "form-control-range uniformmode slider";
    input.id = "slider" + i;
    input.min = "-12";
    input.max = "12";
    input.value = "0";
  
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    uniformRangeSliders.appendChild(formGroup);
  }
  
  const vowelsSliders = document.createElement("div");
  vowelsSliders.className = "slider-group";
  vowelsSliders.id = "vowels-sliders";
  const sliderS = document.createElement("div");
  sliderS.className = "form-group";
  
  const labelS = document.createElement("label");
  labelS.htmlFor = "slider-S";
  labelS.innerText = "Slider S";
  
  const inputS = document.createElement("input");
  inputS.type = "range";
  inputS.className = "form-control-range vowels slider";
  inputS.id = "slider-S";
  inputS.min = "-6";
  inputS.max = "6";
  inputS.value = "0";
  
  sliderS.appendChild(labelS);
  sliderS.appendChild(inputS);
  
  const sliderB = document.createElement("div");
  sliderB.className = "form-group";
  
  const labelB = document.createElement("label");
  labelB.htmlFor = "slider-B";
  labelB.innerText = "Slider B";
  
  const inputB = document.createElement("input");
  inputB.type = "range";
  inputB.className = "form-control-range vowels slider";
  inputB.id = "slider-B";
  inputB.min = "-6";
  inputB.max = "6";
  inputB.value = "0";
  
  sliderB.appendChild(labelB);
  sliderB.appendChild(inputB);
  
  const sliderY = document.createElement("div");
  sliderY.className = "form-group";
  
  const labelY = document.createElement("label");
  labelY.htmlFor = "slider-Y";
  labelY.innerText = "Slider Y";
  
  const inputY = document.createElement("input");
  inputY.type = "range";
  inputY.className = "form-control-range vowels slider";
  inputY.id = "slider-Y";
  inputY.min = "-6";
  inputY.max = "6";
  inputY.value = "0";
  
  sliderY.appendChild(labelY);
  sliderY.appendChild(inputY);
  
  vowelsSliders.appendChild(sliderS);
  vowelsSliders.appendChild(sliderB);
  vowelsSliders.appendChild(sliderY);
  
  const musicalInstrumentsSliders = document.createElement("div");
  musicalInstrumentsSliders.className = "slider-group";
  musicalInstrumentsSliders.id = "musical-instruments-sliders";
  
  const sliderTrumpet = document.createElement("div");
  sliderTrumpet.className = "form-group";
  
  const labelTrumpet = document.createElement("label");
  labelTrumpet.htmlFor = "slider-Trumpet";
  labelTrumpet.innerText = "Trumpet";
  
  const inputTrumpet = document.createElement("input");
  inputTrumpet.type = "range";
  inputTrumpet.className = "form-control-range music slider";
  inputTrumpet.id = "slider-Trumpet";
  inputTrumpet.min = "-5";
  inputTrumpet.max = "5";
  inputTrumpet.value = "0";
  
  sliderTrumpet.appendChild(labelTrumpet);
  sliderTrumpet.appendChild(inputTrumpet);
  
  const sliderXylophone = document.createElement("div");
  sliderXylophone.className = "form-group";
  
  const labelXylophone = document.createElement("label");
  labelXylophone.htmlFor = "slider-Xylophone";
  labelXylophone.innerText = "Xylophone";
  
  const inputXylophone = document.createElement("input");
  inputXylophone.type = "range";
  inputXylophone.className = "form-control-range music slider";
  inputXylophone.id = "slider-Xylophone";
  inputXylophone.min = "-5";
  inputXylophone.max = "5";
  inputXylophone.value = "0";
  
  sliderXylophone.appendChild(labelXylophone);
  sliderXylophone.appendChild(inputXylophone);
  const sliderBrass = document.createElement("div");
  sliderBrass.className = "form-group";
  
  const labelBrass = document.createElement("label");
  labelBrass.htmlFor = "slider-Brass";
  labelBrass.innerText = "Brass";
  
  const inputBrass = document.createElement("input");
  inputBrass.type = "range";
  inputBrass.className = "form-control-range music slider";
  inputBrass.id = "slider-Brass";
  inputBrass.min = "-5";
  inputBrass.max = "5";
  inputBrass.value = "0";
  
  sliderBrass.appendChild(labelBrass);
  sliderBrass.appendChild(inputBrass);
  
  musicalInstrumentsSliders.appendChild(sliderTrumpet);
  musicalInstrumentsSliders.appendChild(sliderXylophone);
  musicalInstrumentsSliders.appendChild(sliderBrass);
  
  const biologicalSignalAbnormalitiesSliders = document.createElement("div");
  biologicalSignalAbnormalitiesSliders.className = "slider-group";
  biologicalSignalAbnormalitiesSliders.id = "biological-signal-abnormalities-sliders";
  
  const sliderHeartbeat = document.createElement("div");
  sliderHeartbeat.className = "form-group";
  
  const labelHeartbeat = document.createElement("label");
  labelHeartbeat.htmlFor = "slider-heartbeat";
  labelHeartbeat.innerText = "Arrythmia";
  
  const inputHeartbeat = document.createElement("input");
  inputHeartbeat.type = "range";
  inputHeartbeat.className = "form-control-range arrythmia slider";
  inputHeartbeat.id = "slider-heartbeat";
  inputHeartbeat.min = "-50";
  inputHeartbeat.max = "50";
  inputHeartbeat.value = "0";
  
  sliderHeartbeat.appendChild(labelHeartbeat);
  sliderHeartbeat.appendChild(inputHeartbeat);
  
  biologicalSignalAbnormalitiesSliders.appendChild(sliderHeartbeat);
  
  equalizerSliders.appendChild(uniformRangeSliders);
  equalizerSliders.appendChild(vowelsSliders);
  equalizerSliders.appendChild(musicalInstrumentsSliders);
  equalizerSliders.appendChild(biologicalSignalAbnormalitiesSliders);
  
  slidersContainer.appendChild(equalizerSliders);
  } else {
  const sliders = document.createElement("div");
  sliders.id = "sliders-container";
  
  for (let i = 1; i <= 5; i++) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";
  
    const label = document.createElement("label");
    label.htmlFor = "slider" + i;
    label.innerText = "Slider " + i;
  
    const input = document.createElement("input");
    input.type = "range";
    input.className = "form-control-range";
    input.id = "slider" + i;
    input.min = "0";
    input.max = "100";
    input.value = "50";
  
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    sliders.appendChild(formGroup);
  }
  
  slidersContainer.appendChild(sliders);
  }
  }
  
  addLabelsToSliders("equalizer");
  
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
  fixedrange: true,
  range: [yaxis.range[0], yaxis.range[1]],
  },
  };
  Plotly.update(secondGraph, {}, update);
  }
  
  function checkBoundaries(graphElement, eventData) {
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