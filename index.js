import * as PIXI from "pixi.js";
import Victor from "victor";
//import Matter from "matter-js";

let canvasSize = 256;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f
});

let squareWidth = 32;
const square = new PIXI.Sprite(PIXI.Texture.WHITE);
square.anchor.set(0.5);
square.position.set(app.screen.width / 2, app.screen.height / 2);
square.width = square.height = squareWidth;
square.tint = 0xea985d;

app.stage.addChild(square);

let zombieRadius = 16;
const zombie = new PIXI.Graphics();
let r = spawnPoint();
zombie.position.set(r.x, r.y);
zombie.beginFill(0xff0000, 1);
zombie.drawCircle(0, 0, zombieRadius);
zombie.endFill();
app.stage.addChild(zombie)

app.ticker.add((delta) => {
    const pointCursor = app.renderer.plugins.interaction.mouse.global;
    let movement = Math.atan2(pointCursor.y - square.position.y, pointCursor.x - square.position.x
        ) +
        Math.PI / 2;
        square.rotation = movement;
});

function spawnPoint() {
  let fourCorners = Math.floor(Math.random() * 4);
  let spawn = new Victor(0, 0);
switch(fourCorners) {
  case 0: // this is the top of the screen
    spawn.x = canvasSize * Math.random();
    break;
  case 1: // this is the right side of the screen
    spawn.x = canvasSize;
    spawn.y = canvasSize * Math.random();
      break;
  case 2: // this is the bottom of the screen
    spawn.x = canvasSize * Math.random();
    spawn.y = canvasSize;
    break;
  default:
    // this is the left side of the screen
    spawn.x = 0;
    spawn.y = canvasSize * Math.random();
    break;
}
return spawn;
}