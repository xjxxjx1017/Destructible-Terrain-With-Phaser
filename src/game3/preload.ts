import 'phaser';

export class Preload extends Phaser.Scene {

    constructor() {
        super({
            key: "Preload"
        });
    }
    
    public preload() : void {
    }

    public create(): void {
        this.nextStage();
    }

    public nextStage(): void {
    	this.scene.start('Core');
    }
}