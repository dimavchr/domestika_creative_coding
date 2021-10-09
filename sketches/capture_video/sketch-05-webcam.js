const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color')
const tweakpane = require('tweakpane')


const capture = function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
}



const settings = {
  dimensions: [1080, 1080]
};

const params = {
  file: 'Airplane-PNG-Transparent-HD-Photo.png',
  glyphs: '+,-,.,/',
  cell: 10,
  tint: { r: 40, g: 131, b: 178, a: .7 }
}

let manager, image;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {


  return ({ context, width, height }) => {

    const cell = params.cell;
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;

    typeCanvas.width = cols;
    typeCanvas.height = rows;

    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows); // draw image
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';


    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell + random.range(-cell, cell) * 0.5;
      const y = row * cell + random.range(-cell, cell) * 0.5;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`;
      context.fillStyle = color.style([
        params.tint.r, params.tint.g, params.tint.b, params.tint.a])
      context.fontStyle
      if (Math.random() < 0.1) {
        context.font = `${cell * 8}px ${fontFamily}`;
        context.fillStyle = color.style([
          params.tint.r+50, params.tint.g+50, params.tint.b+50, params.tint.a+0.1])

      }

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      // context.fillRect(0, 0, cell, cell);
      
      context.fillText(glyph, 0, 0);

      context.restore();
    }

    context.drawImage(typeCanvas, 0, 0);
  };
};

const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '-';
  if (v < 150) return '—';
  if (v < 200) return '=';

  const glyphs = params.glyphs.split(',');

  return random.pick(glyphs);
};

// Image loader

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  capture()
  const url = `./${params.file}`
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
  
};


const createPane = () => {
  const pane = new tweakpane.Pane()
  let folder

  folder = pane.addFolder({ title: 'Settings' })
  folder.addInput(params, 'glyphs')
  folder.addInput(params, 'cell', { step: 1, min: 4, max: 40 })
  folder.addInput(params, 'tint')
}

// Event listener on enter keys
const onEnter = (e) => {
  if (e.key == 'Enter') manager.render();
};

document.addEventListener('keyup', onEnter);

createPane()

start();


