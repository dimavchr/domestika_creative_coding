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
  n: 200,
  dist: 200,
  cr: 300,
  speed: 1,
  max_radius: 8,
  line_width: 13,
  showcircle: true,
  tint:{r: 250, g: 10, b: 10},
  bgr: {r: 0, g: 0, b: 0},
  animate: true

}


const sketch = ({ context, width, height}) => {
    
    const agents = []

    const n = params.n
    
  
    for (let i=0; i<n; i++) {
      const x = random.range(0,width)
      const y = random.range(0,height)
  
      agents.push(new Agent(x,y,params.max_radius))
    }

  return ({ context, width, height }) => {

    const cr = params.cr
    const cx = width/2
    const cy = height/2    
    const bgcol = color.style([params.bgr.r, params.bgr.g, params.bgr.b])

    context.save()
    context.fillStyle = bgcol
    context.fillRect(0, 0, width, height);
    context.restore()

    // add a ball
    context.save()
    context.translate(cx,cy)
    context.strokeStyle = params.showcircle ? 'white' : bgcol
    context.fillStyle = params.showcircle ? 'black' : bgcol

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

        if (dist < params.dist) { // skip building distance if too far away 

    //     if (dist < 20) { // bounce off a close agent
    //     agent.vel.x = agent.vel.x * (-1)
    //     agent.vel.y = agent.vel.y * (-1)
    // }

    if (distCenter < distCenterThresh){ 
        agent.vel.x = agent.vel.x * (0.001) 
        agent.vel.y = agent.vel.y * (0.001)}

        context.save()
        context.lineWidth = math.mapRange(dist, 0, 200, params.line_width, 1)
        context.lineCap = 'round'
        context.strokeStyle =  color.style([ 
            math.mapRange(dist, 1, params.dist, params.tint.r, 1)
            , math.mapRange(dist, 1, params.dist, params.tint.g, 1)
            , math.mapRange(dist, 1, params.dist, params.tint.b, 1)
            , math.mapRange(dist, 1, params.dist, 0.8, 0.05)]);
        context.beginPath()
        context.moveTo(agent.pos.x, agent.pos.y)
        context.lineTo(other.pos.x, other.pos.y)
        context.stroke()
        context.restore()

    }

        
    }
  }
    
    
    agents.forEach(agent => {
        if (params.animate) {
            agent.update(radius = params.max_radius, speed = params.speed)
            agent.bounce(width,height)
        }
      agent.draw(context
        , color.style([ params.tint.r, params.tint.g, params.tint.b, 0.9])
        )
      
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
  constructor(x, y, max_radius) {
    this.pos = new Vector(x,y)
    this.vel = new Vector(random.range(-1,1),
    random.range(-1,1))
    this.radius = random.range(1,max_radius)
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

  update(radius, speed) {
    this.pos.x += this.vel.x * speed
    this.pos.y += this.vel.y * speed
    this.radius = radius
  }

  draw(context, strokeStyle) {

    context.save()
    context.translate(this.pos.x, this.pos.y)

    context.lineWidth = 3
    context.strokeStyle =  strokeStyle

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
  folder.addInput(params, 'dist', { min: 5, max: 500, step: 1 })
  folder.addInput(params, 'tint');
  folder.addInput(params, 'max_radius', { min: 0, max: 40, step: 1 })
  folder.addInput(params, 'line_width', { min: 1, max: 40, step: 1 })
  folder.addInput(params, 'speed', { min: 0, max: 10})
  folder.addInput(params, 'animate')


  folder = pane.addFolder({ title: 'Environment' })
  folder.addInput(params, 'cr', { min: 0, max: 500, step: 1 })
  folder.addInput(params, 'showcircle');
  folder.addInput(params, 'bgr');
  
}

createPane()
canvasSketch(sketch, settings);
