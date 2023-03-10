import { Container, Renderer, Loader} from 'pixi.js';
import { CONFIG } from "./gameConfig";

window.addEventListener("DOMContentLoaded", initPixiApp);

let PIXI_Renderer;
let PIXI_Loader;
let stage;
let timestampOnFrameRequest, dt;

const WIDTH = CONFIG.RENDERER_WIDTH;
const HEIGHT = CONFIG.RENDERER_HEIGHT;
let aspectRatio = WIDTH / HEIGHT;

const ASSETS_LIST = CONFIG.ASSETS;

function initPixiApp() {
  PIXI_Renderer = new Renderer({ width:WIDTH, height:HEIGHT});
  PIXI_Renderer.autoResize = true;

  document.body.appendChild(PIXI_Renderer.view);

  window.onresize = resize;

  stage = new Container();

  PIXI_Loader = Loader.shared;

  for (var asset in ASSETS_LIST) {
    if (ASSETS_LIST.hasOwnProperty(asset)) {
      console.log(`adding asset ${asset}" -> "${ASSETS_LIST[asset]}`);
      PIXI_Loader.add(ASSETS_LIST[asset]);
    }
  }
  
  console.log(PIXI_Loader.resources);
  PIXI_Loader.load(initGame);
  resize();
}

function initGame() {

  //start game loop
  timestampOnFrameRequest = performance.now();
  updateGame(timestampOnFrameRequest);
}

function updateGame(_callbacExecutedTime) {
  //timestep for time calculation
  //get time difference between frame request time and frame callback time
  dt = _callbacExecutedTime - timestampOnFrameRequest;
  //assign callback time as new frame request time as we'll request a frame again
  timestampOnFrameRequest = _callbacExecutedTime;
  //do the next frame request
  requestAnimationFrame(updateGame);

  PIXI_Renderer.render(stage);
}

function resize() {
  //get browser window dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
  
    let gamewidth = 0;
    let gameheight = 0;
  
    let windowratio = windowWidth / windowHeight;
  
    //scale with window height if the window scales in landscape ratio 
    if (windowratio >= aspectRatio) {
      gamewidth = windowHeight * aspectRatio;
      gameheight = windowHeight;
    }
    //scale with window width if the window scales in portrait ratio
    else {
      gamewidth = windowWidth;
      gameheight = windowWidth / aspectRatio;
    }
  
    //scale renderer
    PIXI_Renderer.view.style.width = gamewidth + 'px';
    PIXI_Renderer.view.style.height = gameheight + 'px';
  
    //reposition renderer
    let x = (windowWidth - gamewidth) * 0.5;
    let y = (windowHeight - gameheight) * 0.5;
    PIXI_Renderer.view.style.margin = y + "px " + x + "px";

}
