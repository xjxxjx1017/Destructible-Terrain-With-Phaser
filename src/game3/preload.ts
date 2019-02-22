import 'phaser';

export class Preload extends Phaser.Scene {

    constructor() {
        super({
            key: "Preload"
        });
    }
    
    public preload() : void {
        this.load.image('ship-body-light', 'assets/ship-body-light.png');
    }

    public create(): void {
        this.nextStage();
    }

    public nextStage(): void {
    	this.scene.start('Core');
    }
}