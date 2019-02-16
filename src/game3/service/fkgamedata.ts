import 'phaser';
import {FkQuadTree} from '../../components/fkquadtree';
import {FkDestructibleObject} from '../../components/fkdestructibleobject';

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
        var s = 5;

        var ship1 = new FkDestructibleObject( this.dataGame, 5 * s, 5 * s, 50 * s, 30 * s );
        ship1.damageByCircle( new Phaser.Geom.Circle( 15 * s, 15 * s, 4 * s ) );
        ship1.damageByCircle( new Phaser.Geom.Circle( 15 * s, 22 * s, 6 * s ) );
        ship1.generateByCircle( new Phaser.Geom.Circle( 35 * s, 22 * s, 14 * s ) );
        ship1.damageByCircle( new Phaser.Geom.Circle( 25 * s, 18 * s, 8 * s ) );
        ship1.damageByCircle( new Phaser.Geom.Circle( 22 * s, 30 * s, 4 * s ) );
        ship1.damageByCircle( new Phaser.Geom.Circle( 25 * s, 30 * s, 4 * s ) );
        ship1.drawDstObject();

        var ship2 = new FkDestructibleObject( this.dataGame, 65 * s, 5 * s, 40 * s, 30 * s );
        ship2.damageByCircle( new Phaser.Geom.Circle( 25 * s, 18 * s, 8 * s ) );
        ship2.damageByTriangle( new Phaser.Geom.Triangle( 10 * s, 10 * s, 40 * s, 21 * s, 45 * s, 23 * s ) );
        ship2.generateByTriangle( new Phaser.Geom.Triangle( 12 * s, 12 * s, 41 * s, 22 * s, 46 * s, 24 * s ) );
        ship2.damageByRectangle( new Phaser.Geom.Rectangle( 35 * s, 22 * s, 4 * s, 4 * s ) );
        ship2.generateByLine( 40 * s, 25 * s, 10 * s, 35 * s, 1 * s );
        ship2.damageByLine( 10 * s, 20 * s, 40 * s, 20 * s, 1 * s );
        ship2.drawDstObject();

        var ship3 = new FkDestructibleObject( this.dataGame, 5 * s, 45 * s, 50 * s, 30 * s );
        ship3.damageByCircle( new Phaser.Geom.Circle( 15 * s, 15 * s, 4 * s ) );
        ship3.damageByCircle( new Phaser.Geom.Circle( 15 * s, 22 * s, 6 * s ) );
        ship3.drawDstObject();

        var ship4 = new FkDestructibleObject( this.dataGame, 65 * s, 45 * s, 40 * s, 40 * s );
        ship4.damageByCircle( new Phaser.Geom.Circle( 15 * s, 15 * s, 4 * s ) );
        ship4.damageByCircle( new Phaser.Geom.Circle( 15 * s, 22 * s, 6 * s ) );
        ship4.damageByLine( 40 * s, 25 * s, 10 * s, 35 * s, 1 * s );
        ship4.damageByLine( 10 * s, 20 * s, 40 * s, 20 * s, 1 * s );
        ship4.drawDstObject();
	}
}