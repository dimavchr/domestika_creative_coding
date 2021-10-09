const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color')
const tweakpane = require('tweakpane')

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


