const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const color = require('canvas-sketch-util/color')
const tweakpane = require('tweakpane')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 30
};

const params = {
  n: 160,
  cr: 300,
  speed: 2
}


const sketch = ({ context, width, height}) => {
  const agents = []

  const n = params.n
  const cr = params.cr

  for (let i=0; i<n; i++) {
    const x = random.range(0,width)
    const y = random.range(0,height)

    agents.push(new Agent(x,y))
  }

  const cx = width/2
  const cy = height/2

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // add a ball
    context.save()
    context.translate(cx,cy)
    context.fillStyle = 'black';

    context.beginPath()
    context.arc(0, 0, cr,0, Math.PI *2)
    context.fill()
    context.stroke()
    context.restore()


    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]

      for (let j = i+1; j < agents.length; j++) {
        const other = agents[j]

        dist = agent.pos.getDistance(other.pos)
        distCenter = agent.pos.getDistance(new Vector(cx,cy)) 
        const distCenterThresh = cr

        if (dist > 200) continue; // skip building distance if too far away 

        context.lineWidth = math.mapRange(dist, 0, 200, 8, 1)
        context.strokeStyle =  color.style([ 
          math.mapRange(dist, 0, 100, 255, 80)
          , math.mapRange(dist, 0, 50, 255, 80)
          , math.mapRange(dist, 0, 300, 255, 150)
          , math.mapRange(dist, 0, 400, 0.8, 0.2)]);
          // math.mapRange(dist, 0, 200, 12, 1)
        context.beginPath()
        context.moveTo(agent.pos.x, agent.pos.y)
        context.lineTo(other.pos.x, other.pos.y)
        context.stroke()

        // if (dist > 10) continue; // bounce off a close agent
        // agent.vel.x = agent.vel.x * (-1) 
        // agent.vel.y = agent.vel.y * (-1)

        if (distCenter > distCenterThresh) continue
        agent.vel.x = agent.vel.x * (-0.01) 
        agent.vel.y = agent.vel.y * (-0.01)
    }
  }
    


    agents.forEach(agent => {
      agent.update()
      agent.draw(context)
      agent.wrap(width,height)
    });


  };
};


//////// CLASS DEFINITIONS

// creates a point with X Y coord
class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  getDistance(v) {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx**2 + dy**2)
  }
}

// creates a point agent that can move

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x,y)
    this.vel = new Vector(random.range(-params.speed,params.speed),
    random.range(-params.speed,params.speed))
    this.radius = random.range(4,8)
  }

  bounce(width, height) {
    if (this.pos.x <0 || this.pos.x >= width) this.vel.x *= -1
    if (this.pos.y <0 || this.pos.y >= height) this.vel.y *= -1
    
  }

  wrap(width, height) {
    if (this.pos.x > width) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = width
    if (this.pos.y > height) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = height
    
  }

  update() {
    this.pos.x += this.vel.x 
    this.pos.y += this.vel.y 
  }

  draw(context) {

    context.save()
    context.translate(this.pos.x, this.pos.y)

    context.lineWidth = 3
    context.strokeStyle =  color.style([ 110, 20, 200, 0.9]);

    context.beginPath()
    context.arc(0, 0, this.radius,0, Math.PI *2)
    context.fill()
    context.stroke()

    context.restore()
  }
}

const createPane = () => {
  const pane = new tweakpane.Pane()
  let folder

  folder = pane.addFolder({ title: 'Agents' })
  folder.addInput(params, 'n', { min: 5, max: 1500, step: 1 })
  folder.addInput(params, 'speed', { min: 0, max: 10})

  folder = pane.addFolder({ title: 'Environment' })
  folder.addInput(params, 'cr', { min: 0, max: 500, step: 1 })
  // folder.addInput(params, 'Speed', { min: 0, max: 10})
  
}

createPane()
canvasSketch(sketch, settings);
