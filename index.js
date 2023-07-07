import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawn from "./spawn.js";
import { zombies } from "./globals.js";

const canvasSize = 300;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

initGame();

async function initGame() {
  console.log('Loading...')
  try {
    await loadAssets();
    console.log('Loaded')
    let player = new Player({app});
let zombieSpawn = new Spawn({app, create: () => new Zombie({app, player})});

let pressPlay = createScene('Click to Start');
let endPlay = createScene('Game Over!');
app.gameStarted = false;

app.ticker.add((delta) => {
  pressPlay.visible = !app.gameStarted;
  endPlay.visible = player.dead;
  if (app.gameStarted === false) return;
    player.update(delta);
    zombieSpawn.spawnArr.forEach((zombie) => zombie.update(delta)); 
    bulletTest({bullets: player.defense.bullets, zombies: zombieSpawn.spawnArr, bulletRadius: 8, zombieRadius: 16});
});
  } catch(error) {
console.log(error.message)
console.log('Load failed')
  }
}

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

function createScene(sceneText) {
  const scene = new PIXI.Container();
  const text = new PIXI.Text(sceneText);
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);
  scene.zIndex = 1;
  scene.addChild(text);
  app.stage.addChild(scene);
  return scene;
}


function startGame() {
  app.gameStarted = true;
}

async function loadAssets() {
  return new Promise ((resolve, reject) => {
    zombies.forEach(z => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add('assets/hero_male.json');
    PIXI.Loader.shared.add('bullet', 'assets/bullet.png');
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

document.addEventListener('click', startGame);