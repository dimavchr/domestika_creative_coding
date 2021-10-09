const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions:[1080,1080]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01

    const w = width * 0.10;
    const h = height * 0.10;
    const gap = width * 0.03;
    const ix = width * 0.17
    const iy = height * 0.17
    const off = width * 0.02

    var gradient = context.createLinearGradient(0, 0, width-w, height-h);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        let x = ix + (w + gap) * i;
        let y = iy + (h + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();
       
        for (let k = 0; k < Math.random() * 10 / 2; k++) {
          radius = Math.random() * 100
          deg = Math.PI * 2
          context.beginPath()
          context.rect(x + 8, y + 8, w, h)
          context.stroke()
          context.lineWidth = (i + j) * 2 * Math.random()
        }

        for (let k = 0; k < Math.random() * 10 / 2; k++) {
          radius = Math.random() * 100
          deg = Math.PI * 2
          context.beginPath()
          context.arc(x + w / k, y + h / k, radius, 0, deg);
          context.rect(x + 8, y + 8, w, h)
          context.stroke()
          context.strokeStyle = gradient
          context.lineWidth = (i + j) * 3 * Math.random()
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
