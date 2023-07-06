export default class Spawn {
    constructor({create}) {
        const spawnIntervals = 1000;
        this.maxZombies = 1;
        this.create = create;
        this.spawnArr = [];
        setInterval(() => this.spawns(), spawnIntervals);
    }
    
    spawns() {
        if (this.spawnArr.length >= this.maxZombies) return;
        let s = this.create();
        this.spawnArr.push(s);
    }
}