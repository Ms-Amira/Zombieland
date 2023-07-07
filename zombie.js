import * as PIXI from "pixi.js";
import Victor from "victor";
import { zombies } from "./globals";

export default class Zombie {
constructor({app, player}) {
    this.app = app;
    this.player = player;

    this.speed = 2;
    let rando = this.spawnPoint();

    let zombieName = zombies[Math.floor(Math.random() * zombies.length)];
    this.speed = zombies === 'quickzee' ? 1 : 0.25;
    let sheet = PIXI.Loader.shared.resources[`assets/${zombieName}.json`].spritesheet;

    this.die = new PIXI.AnimatedSprite(sheet.animations['die']);
    this.attack = new PIXI.AnimatedSprite(sheet.animations['attack']);
    this.zombie = new PIXI.AnimatedSprite(sheet.animations['walk']);
    this.zombie.animationSpeed = zombieName === 'quickzee' ? 0.2 : 0.1;
    this.zombie.play();
    this.zombie.anchor.set(0.5);
    this.zombie.position.set(rando.x, rando.y);
    app.stage.addChild(this.zombie)   
}

attackPlayer(){
if (this.attacking) return;
this.attacking = true;
this.interval = setInterval(() => this.player.attack(), 500);
this.zombie.textures = this.attack.textures;
this.zombie.animationSpeed = 0.1;
this.zombie.play();
}

update(delta) {
    let z = new Victor(this.zombie.position.x, this.zombie.position.y);
    let p = new Victor(this.player.position.x, this.player.position.y);
    if (z.distance(p) < this.player.width / 2) {
      this.attackPlayer();
      return;
    }
    let location = p.subtract(z);
    let direction = location.normalize().multiplyScalar(this.speed * delta);
    this.zombie.scale.x = direction.x < 0 ? 1 : - 1;
    this.zombie.position.set(this.zombie.position.x + direction.x, this.zombie.position.y + direction.y);
}

kill(){
  this.zombie.textures = this.die.textures;
  this.zombie.loop = false;
  this.zombie.onComplete = () => setTimeout(() => this.app.stage.removeChild(this.zombie), 3000);
  this.zombie.play();
// this.app.stage.removeChild(this.zombie);
clearInterval(this.interval);
}

get position() {
  return this.zombie.position;
}

spawnPoint() {
    let fourCorners = Math.floor(Math.random() * 4);
    let spawn = new Victor(0, 0);
    let canvasSize = this.app.screen.width;
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
}