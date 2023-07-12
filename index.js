import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawn from "./spawn.js";
import { textStyle, subTextStyle, zombies } from "./globals.js";
import Weather from "./weather.js";
import GameState from "./game-state.js";

const canvasSize = 400;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const music = new Audio('./assets/HordeZee.mp3');
music.addEventListener('timeupdate', function() {
  if (this.currentTime > this.duration - 0.2) {
     this.currentTime = 0; 
  }
});

const zombieHorde = new Audio('./assets/horde.mp3');
zombieHorde.volume = 0.7;
zombieHorde.addEventListener('timeupdate', function() {
  if (this.currentTime > this.duration - 0.2) {
     this.currentTime = 0; 
  }
});

initGame();

async function initGame() {
  app.gameState = GameState.PREINTRO;
  console.log('Loading...')
  try {
    await loadAssets();
    console.log('Loaded')
    app.weather = new Weather({app})
    let player = new Player({app});
let zombieSpawn = new Spawn({app, create: () => new Zombie({app, player})});

let preIntroScene = createScene('Zombieland', 'Click to Continue');
let pressPlay = createScene('Zombieland', 'Click to Start');
let endPlay = createScene('Zombieland', 'Game Over!');

app.ticker.add((delta) => {
  if(player.dead) app.gameState = GameState.GAMEOVER;
  preIntroScene.visible = app.gameState === GameState.PREINTRO;
  pressPlay.visible = app.gameState === GameState.START;
  endPlay.visible = app.gameState === GameState.GAMEOVER;

  switch(app.gameState) {
    case GameState.PREINTRO:
      player.scale = 4;
      break;
    case GameState.INTRO:
      player.scale -= 0.01;
      if (player.scale <= 1) app.gameState = GameState.START;
      break;
    case GameState.RUNNING:
      player.update(delta);
      zombieSpawn.spawnArr.forEach((zombie) => zombie.update(delta)); 
      bulletTest({bullets: player.defense.bullets, zombies: zombieSpawn.spawnArr, bulletRadius: 8, zombieRadius: 16});
      break;
    default:
      break;
  }
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

function createScene(sceneText, sceneSubText) {
  const scene = new PIXI.Container();
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);

  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2;
  subText.y = 50;
  subText.anchor.set(0.5, 0);

  scene.zIndex = 1;
  scene.addChild(text);
  scene.addChild(subText);
  app.stage.addChild(scene);
  return scene;
}


// function startGame() {
//   app.gameStarted = true;
//   app.weather.enableSound();
// }

async function loadAssets() {
  return new Promise ((resolve, reject) => {
    zombies.forEach(z => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add('assets/hero_male.json');
    PIXI.Loader.shared.add('bullet', 'assets/bullet.png');
    PIXI.Loader.shared.add('rain', 'assets/rain.png');
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO;
      music.play();
      app.weather.enableSound();
      break;
      case GameState.START:
        app.gameState = GameState.RUNNING;
        zombieHorde.play();
        break;
    default:
      break;
  }
}

document.addEventListener('click', clickHandler);