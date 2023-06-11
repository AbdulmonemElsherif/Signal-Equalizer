# Signal-Equalizer
## Table of contents:
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Project Features](#project-features)
- [Getting Started](#getting-started)
- [Team](#team)


### Introduction
A website that equalizes signals in different modes, including uniform range, vowels, musical instruments, and biological signal abnormalities.

### Project Structure
The Web Application is built using:
- Frontend:
  - BootStrap
  - HTML
  - CSS
  - JavaScript
- Backend framework:
  - Flask (Python)

The Frontend main function to set the structure of the page and plot the signals and manage
the user interface, while the Backend is responsible for performing signal filtering operations.

```
master
├─ data
│  ├─ bioabnormality sample single (csv)
│  ├─ audio samples (wav)
│  ├─ synthaticaudio (py) (to generate a synthatic audio of certain frequencies)
│  └─ task statement (pdf)
├─ static (JS & CSS files)
│  ├─  css
│  └─  js
├─ templates (HTML file)
├─ app.py (Back-End Server)
├─ audioProcessing.py (Filtering class)
├─ LICENSE
├─ processed_arythmia(csv)
└─ README.md
```

### Project Features
Website has the following features:
 UI that contains:
> 1. Two signal viewers, one for the input and one for the output signals. The two viewers should allow the 
signals to run in time in a synchronous way (with controls for playing and pausing and speed)
> 2. Two spectrograms, one for the input and one for the output signals.

 The user can switch between the following modes easily (through a combobox)
> 1. Uniform Range Mode: where the total frequency range of the input signal is divided uniformly into 10 equal 
ranges of frequencies, each is controlled by one slider in the UI

> 2. Vowels Mode: where each slider can control the magnitude of specific vowel. You will need to do your own 
research for how the speech vowels are composed of different frequency components/ranges.

> 3. Musical Instruments Mode: where each slider can control the magnitude of a specific musical instrument in 
the input music signal.

> 4. Biological Signal Abnormalities: where each slider can control the magnitude of a specific abnormality (e.g. 
ECG arrhythmia) in the input biological signal.


### Getting Started
To get started with the digital filter designer web app, follow these steps:

1. Clone the repository:
``` 
git clone https://github.com/AbdulmonemElsherif/Signal-Equalizer.git
``` 
2. Install Python3 from:
``` 
www.python.org/downloads/
```
3. Install the following packages:-
   - Flask
   - scipy
   - numpy
 - Open Project Terminal & Run:
```
pip install -r requirements.txt
```
4. Open the application in your web browser by writing this in your terminal:
```
python app.py
```

### Note
The application has been tested on Google Chrome, Microsoft Edge and Mozilla Firefox web browsers.

### Team
Biomedical Signal Processing (SBEN311) class task created by:

| Team Members                                  
|-------------------------------------------------------
| [Nada Mohamed](https://github.com/NadaAlfowey)
| [Abdulmonem Elsherif](https://github.com/AbdulmonemElsherif)   
| [Asmaa Khalid](https://github.com/asmaakhaledd) 
| [Mariam Gamal](https://github.com/mariamgamal70)
      

     

### Submitted to:
- Dr. Tamer Basha & Eng. Christina Adly
