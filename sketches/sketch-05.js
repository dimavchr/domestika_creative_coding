const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const tweakpane = require('tweakpane')


const settings = {
	dimensions: [ 1080, 1080 ]
};


const params = {
  text: 'Dima',
  glyphs: '+,-,.,/',
  cell: 10
}

// let manager;

let text = params.text;
let fontSize = 200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {


  return ({ context, width, height }) => {

    const text = params.text;

    const cell = params.cell;
    const cols = Math.floor(width  / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;
  
    typeCanvas.width  = cols;
    typeCanvas.height = rows;

		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols * 0.4;

		typeContext.fillStyle = 'white';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		typeContext.textBaseline = 'top';

		const metrics = typeContext.measureText(text);
		const mx = metrics.actualBoundingBoxLeft * -1;
		const my = metrics.actualBoundingBoxAscent * -1;
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		const tx = (cols - mw) * 0.5 - mx;
		const ty = (rows - mh) * 0.5 - my;

    const getGlyph = (v) => {
      if(v < 50) return ''
      if(v < 100) return '.'
      if(v< 150) return '-'
      if(v< 200) return '+'
    
      const glyphs = params.glyphs.split(',')
    
      return random.pick(glyphs)
    }


		typeContext.save();
		typeContext.translate(tx, ty);

		typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();

		typeContext.fillText(text, 0, 0);
		typeContext.restore();

		const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    
    context.fillStyle = 'black'
    context.fillRect(0,0,width,height)

    context.textBaseline = 'middle'
    context.textAlign = 'center'

    // context.drawImage(typeCanvas, 0, 0)

    for (let i = 0; i < numCells; i++){
      const col = i % cols;
      const row = Math.floor(i/cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0]
      const g = typeData[i * 4 + 1]
      const b = typeData[i * 4 + 2]
      const a = typeData[i * 4 + 3]

      const glyph = getGlyph(r)

      context.font = `${cell * 2}px ${fontFamily}`
      if (Math.random() < 0.1) context.font = `${cell * 7}px ${fontFamily}`
      context.fillStyle = 'white'

      context.save()
      context.translate(x, y)
      context.translate(cell * 0.5, cell * 0.5)
      
      context.fillText(glyph,0,0);
      
      context.restore()

    }

  };
};

// const getGlyph = (v) => {
//   if(v < 50) return ''
//   if(v < 100) return '.'
//   if(v< 150) return '-'
//   if(v< 200) return '+'

//   const glyphs = params.glyphs.split(',')

//   return random.pick(glyphs)

// }

// const onKeyUp = (e) => {
//   text = e.key.toUpperCase();
//   console.log(text)
//   manager.render();
// }

// document.addEventListener('keyup', onKeyUp)

const start = async () => {
  manager = await canvasSketch(sketch, settings);
}

const createPane = () => {
  const pane = new tweakpane.Pane()
  let folder

  folder = pane.addFolder({ title: 'Settings' })
  folder.addInput(params, 'text')
  folder.addInput(params, 'glyphs')
  folder.addInput(params, 'cell',{step:1, min: 4,max: 40})
}


createPane()
// canvasSketch(sketch, settings);
start()


/*
const url = 'https://picsum.photos/200'

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = url
  });
};

// const start = () => {
//   loadMeSomeImage(url).then(img => {
//     console.log('image width', img.width)
//   })
//   console.log('this line')
// }

const start = async () => {
  const img = await loadMeSomeImage(url)
  console.log('image width', img.width)
  console.log('this line')
}

start()
*/