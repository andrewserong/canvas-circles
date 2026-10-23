import './style.css'
import { Circle } from './circle.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
  <canvas id="canvas">
  <button id="counter" type="button" class="counter"></button>
</section>
`;

let entities: Array<Circle> = [];
let startTime: DOMHighResTimeStamp;

let lastCreation: DOMHighResTimeStamp;
let canvasContext: CanvasRenderingContext2D;
let canvasWidth: number;
let canvasHeight: number;

let mouseX: number;
let mouseY: number;

const CREATION_INTERVAL = 25;

function clearCanvas() {
  canvasContext.fillStyle = '333';

  canvasContext.clearRect(0,0,canvasWidth,canvasHeight);
  // canvasContext.fillRect(0,0,canvasWidth,canvasHeight);
}

function renderCircle(circle: Circle) {
  // position
  const x = canvasWidth * circle.x;
  const y = canvasHeight * circle.y;
  const size = circle.size;  
  
  const isWithinCircle = (mouseX && Math.abs(x - mouseX) < 50) && (mouseY && Math.abs(y - mouseY) < 50);

  const colorString = isWithinCircle ? '255,50,50' : '255,255,255';

  canvasContext.fillStyle = `rgba(${colorString},${circle.opacity})`;

  canvasContext.beginPath();
  canvasContext.arc(x, y, size, 0, 2 * Math.PI);
  canvasContext.fill();
}

function mainLoop(newTime: DOMHighResTimeStamp) {
  if ( ! startTime) {
    startTime = newTime;
  }

  if ( ! lastCreation || newTime - lastCreation > CREATION_INTERVAL ) {
    lastCreation = newTime;
    for (let i=0; i<4; i++) {
      entities.push(new Circle(
        Math.random(),
        Math.random(),
        newTime,
      ) );
    }
  }

  const indexesToRemove = new Set();

  // Clear the canvas, in prep for rendering.
  clearCanvas();

  entities.forEach( (entity, index) => {
    entity.update(newTime);

    if (! entity.isAlive(newTime)) {
      indexesToRemove.add( index );
      return;
    }

    renderCircle(entity);
  } );

  // Tidy up entities;
  entities = entities.filter( (_entity, index ) => ! indexesToRemove.has(index) );

  requestAnimationFrame(mainLoop);
}

function configureCanvas() {
  // Use "as" here because we expect that the canvas really exists in the document.
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  // From: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays

  const dpr = window.devicePixelRatio;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvasContext.scale(dpr, dpr);

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
}

function init() {
  configureCanvas();

  window.addEventListener('resize', configureCanvas);
  window.addEventListener('mousemove', event => {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } );

  requestAnimationFrame(mainLoop);
}

init();