const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color')
const tweakpane = require('tweakpane')

const settings = {
  dimensions: [1080, 1080]
};

const params = {
  file: 'Airplane-PNG-Transparent-HD-Photo.png',
  glyphs: '#',
  cell: 1,
  tint: { r: 40, g: 231, b: 178, a: .6 }
}

let manager, image;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.getElementById('canvas');
const typeContext = typeCanvas.getContext('2d');

const magic = ({ video, context, width, height }) => {
  const cell = 1;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  typeContext.fillStyle = 'black';
  typeContext.fillRect(0, 0, cols, rows);

  typeContext.save();

  typeContext.drawImage(video, 0, 0, cols, rows); // draw image
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

    context.font = `${cell * 3}px ${fontFamily}`;
    context.fillStyle = color.style([
      params.tint.r, params.tint.g, params.tint.b, params.tint.a])
    context.fontStyle
    if (Math.random() < 0.1) {
      context.font = `${cell * 8}px ${fontFamily}`;
      context.fillStyle = color.style([
        params.tint.r+50, params.tint.g+50, params.tint.b+50, params.tint.a+0.5])

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

const getGlyph = (v) => {
  if (v < 150) return '';
  if (v < 200) return '-';
  if (v < 220) return '—';
  if (v < 250) return '+';

  const glyphs = params.glyphs.split(',');

  return random.pick(glyphs);
};

const createPane = () => {
  const pane = new tweakpane.Pane()
  let folder

  folder = pane.addFolder({ title: 'Settings' })
  folder.addInput(params, 'glyphs')
  folder.addInput(params, 'cell', { step: 1, min: 1, max: 40 })
  folder.addInput(params, 'tint')
}

// Event listener on enter keys
const onEnter = (e) => {
  if (e.key == 'Enter') manager.render();
};

document.addEventListener('keyup', onEnter);

createPane()

const video = document.getElementById('video')

navigator.getUserMedia(
    {
      video: true,
      audio: false,
    },
    (stream) => {
      video.srcObject = stream
      video.play()
    },
    (error) => {
      console.log(error)
    }
)

const draw = (video, context, width, height) => {
  magic({ video, context, width, height })

  setTimeout(draw, 20, video, context, width, height)
}

video.addEventListener('play', function() {
  draw(this, typeContext, 400, 300)
}, false)
