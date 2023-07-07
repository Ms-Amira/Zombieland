import * as PIXI from "pixi.js";
import Defense from "./defense";

export default class Player {
    constructor({app}) {
        this.app = app;
        const playerWidth = 32;
        let sheet = PIXI.Loader.shared.resources['assets/hero_male.json'].spritesheet
        this.player = new PIXI.AnimatedSprite(sheet.animations['idle']);
        this.player.animationSpeed = 0.1;
        this.player.play();
// this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
this.player.anchor.set(0.5);
this.player.position.set(app.screen.width / 2, app.screen.height / 2);
// this.player.width = this.player.height = playerWidth;
// this.player.tint = 0xea985d;

app.stage.addChild(this.player);

this.lastClickButton = 0;
this.defense = new Defense({app, player:this});
const margin = 16;
const barHeight = 8;
this.maxHealth = 100;
this.health = this.maxHealth;
this.healthBar = new PIXI.Graphics();
this.healthBar.beginFill(0xff0000);
this.healthBar.initialWidth = app.screen.width - 2 * margin;
this.healthBar.drawRect(margin, app.screen.height - barHeight - margin / 2, this.healthBar.initialWidth, barHeight);
this.healthBar.endFill();
this.healthBar.zIndex = 1;
this.app.stage.sortableChildren = true;
this.app.stage.addChild(this.healthBar);
    }

    attack() {
        this.health -= 1;
        this.healthBar.width = (this.health / this.maxHealth) * this.healthBar.initialWidth;
        if(this.health <= 0) {
            this.dead = true;
        }
    }

    get position() {
       return this.player.position;
    }

    get width() {
        return this.player.width;
    }

    update(delta) {
        if (this.dead) return;
        const click = this.app.renderer.plugins.interaction.mouse;
        const pointCursor = click.global;
        let movement = Math.atan2(pointCursor.y - this.player.position.y, pointCursor.x - this.player.position.x
        ) +
            Math.PI / 2;
        this.player.rotation = movement;

        if (click.buttons !== this.lastClickButton) {
            this.defense.shooting = click.buttons !== 0;
            this.lastClickButton = click.buttons;
        }
        this.defense.update(delta);
    }
}