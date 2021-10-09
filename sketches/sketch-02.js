const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const color = require('canvas-sketch-util/color')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 30,
  duration: 5
};


const randColorBlend = (col1, col2) => {
  return color.blend(col1, col2,opacity=Math.random());
}

const sketch = () => {
  return ({ context, width, height, playhead }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round'

    
    const cx = width * 0.5
    const cy = height * 0.5

    const w = width * 0.01
    const h = height * 0.4
    let x, y

    const num = 1500
    const radius = width * 0.23

    for(let i=0;i < num; i++){

      // draw spokes
      const slice = math.degToRad(360/num)
      const angle = slice*i

      x = cx + radius * Math.sin(angle)
      y = cy + radius * Math.cos(angle)


      // retina
      
      context.save()
      context.strokeStyle = color.style([ random.range(150,250)
        , random.range(50,100), 50
        , random.range(0.1,0.9) ]);
      context.translate(cx, cy)
      context.rotate(-angle*playhead)
      
      context.lineWidth = random.range(1,0.08*100*random.range(1,2))
      
      context.beginPath()
      context.arc(0, 0, radius*random.range(0,0.99), 
      slice * random.range(0,-3), 
      slice * random.range(0,200))
      context.stroke()
      context.restore()

      // corona
      context.save()
      context.translate(x,y)
      context.rotate(-angle)
      context.scale(random.range(0,0.5),random.range(0,0.3))
  
      // col = randColorBlend('cyan','white')
      // context.fillStyle = col.hex
      context.fillStyle = color.style([ random.range(150,250)
        , random.range(50,100), 50
        , random.range(0.8,0.99)]);

      context.beginPath()
      context.rect(w, h 
        , w*random.range(0.1,0.5)
        , h*random.range(0.05,1.2))
      context.fill()
      context.restore()
      

    }

    
  };
};

canvasSketch(sketch, settings);
