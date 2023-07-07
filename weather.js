export default class Weather {
    constructor({app}) {
        this.lightningGap = {min: 9000, max: 29000}
        this.app = app;
        this.createAudio();
    }
}