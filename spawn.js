import GameState from "./game-state";

export default class Spawn {
    constructor({app, create}) {
        this.app = app;
        const spawnIntervals = 1000;
        this.maxZombies = 10;
        this.create = create;
        this.spawnArr = [];
        setInterval(() => this.spawns(), spawnIntervals);
    }
    
    spawns() {
        if (this.app.gameState !== GameState.RUNNING) return;
        if (this.spawnArr.length >= this.maxZombies) return;
        let s = this.create();
        this.spawnArr.push(s);
    }
}