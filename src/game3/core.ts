import 'phaser';
import {SampleGameData} from './service/samplegamedata';

export class Core extends Phaser.Scene {

    constructor() {
        super({
            key: "Core"
        });
    }
    
	public create(): void {
		var g = this;
		SampleGameData.inst().Init( g );
		SampleGameData.inst().Run();
	}
}