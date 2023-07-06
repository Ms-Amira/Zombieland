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
    bulletTest({bullets: player.defense.bullets, zombies: zombieSpawn.spawnArr, bulletRadius: 8, zombieRadius: 16});
});

function bulletTest({bullets, zombies, bulletRadius, zombieRadius}) {
  bullets.forEach(bullet => {
    zombies.forEach((zombie, index) => {
      let diff_x = zombie.position.x - bullet.position.x;
      let diff_y = zombie.position.y - bullet.position.y;
      let dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if (dist < bulletRadius + zombieRadius) {
        zombies.splice(index, 1)
        zombie.kill();
      }
    })
  })
}
