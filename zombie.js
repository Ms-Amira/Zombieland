import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Zombie {
constructor({app, player}) {
    this.app = app;
    this.player = player;

    const zombieRadius = 16;
    this.speed = 2;
    this.zombie = new PIXI.Graphics();
    let rando = this.spawnPoint();
    this.zombie.position.set(rando.x, rando.y);
    this.zombie.beginFill(0xff0000, 1);
    this.zombie.drawCircle(0, 0, zombieRadius);
    this.zombie.endFill();
    app.stage.addChild(this.zombie)   
}

update() {
    let z = new Victor(this.zombie.position.x, this.zombie.position.y);
    let p = new Victor(this.player.position.x, this.player.position.y);
    if (z.distance(p) < this.player.width / 2) {
      let rando = this.spawnPoint();
      this.zombie.position.set(rando.x, rando.y);
      return;
    }
    let location = p.subtract(z);
    let direction = location.normalize().multiplyScalar(this.speed);
    this.zombie.position.set(this.zombie.position.x + direction.x, this.zombie.position.y + direction.y);
}

kill(){
this.app.stage.removeChild(this.zombie);
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