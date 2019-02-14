import 'phaser';

export class FkGameData {
	private dataGame : Phaser.Scene;

	private static _inst:FkGameData = null;
	public static inst():FkGameData {
		if ( this._inst == null )
			this._inst = new FkGameData();
		return this._inst;
	}

	private constructor() {}

	public Init( _game : Phaser.Scene ) : Phaser.Scene {
		return this.dataGame = _game;
	}

	public Run() {
        var self = this;
	}
}