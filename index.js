import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawn from "./spawn.js";
//import Matter from "matter-js";

const canvasSize = 256;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f
});

let player = new Player({app});
let zombieSpawn = new Spawn({create: () => new Zombie({app, player})});

app.ticker.add((delta) => {
    player.update();
    zombieSpawn.spawnArr.forEach((zombie) => zombie.update()); 
});
