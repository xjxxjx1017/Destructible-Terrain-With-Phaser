import 'phaser';
import {FkQuadTree} from '../../components/fkquadtree';
import {FkDstrGridData, FkDestructibleObject} from './sampledestructibleobject';

export class SampleGameData {
	private dataGame : Phaser.Scene;

	private static _inst:SampleGameData = null;
	public static inst():SampleGameData {
		if ( this._inst == null )
			this._inst = new SampleGameData();
		return this._inst;
	}

	private constructor() {}

	public Init( _game : Phaser.Scene ) : Phaser.Scene {
		return this.dataGame = _game;
	}

	public Run() {
        var self = this;
        var s = 5;
        var stateHide = FkDstrGridData.getStateHide();
        var stateVisible = FkDstrGridData.getStateVisible();

        var ship1 = new FkDestructibleObject( this.dataGame, 5 * s, 5 * s, 50 * s, 30 * s, FkDestructibleObject.RENDER_FRAME );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 15 * s, 15 * s, 4 * s ), stateHide );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 15 * s, 22 * s, 6 * s ), stateHide  );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 35 * s, 22 * s, 14 * s ), stateVisible );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 25 * s, 18 * s, 8 * s ), stateHide  );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 22 * s, 30 * s, 4 * s ), stateHide  );
        ship1.modifyByCircle( new Phaser.Geom.Circle( 25 * s, 30 * s, 4 * s ), stateHide  );
        ship1.drawDstrObject();

        var ship2 = new FkDestructibleObject( this.dataGame, 65 * s, 5 * s, 40 * s, 30 * s, FkDestructibleObject.RENDER_FRAME );
        ship2.modifyByCircle( new Phaser.Geom.Circle( 25 * s, 18 * s, 8 * s ), stateHide );
        ship2.modifyByTriangle( new Phaser.Geom.Triangle( 10 * s, 10 * s, 40 * s, 21 * s, 45 * s, 23 * s ), stateHide );
        ship2.modifyByTriangle( new Phaser.Geom.Triangle( 12 * s, 12 * s, 41 * s, 22 * s, 46 * s, 24 * s ), stateVisible );
        ship2.modifyByRectangle( new Phaser.Geom.Rectangle( 35 * s, 22 * s, 4 * s, 4 * s ), stateHide );
        ship2.modifyByLine( 40 * s, 25 * s, 10 * s, 35 * s, 1 * s, stateVisible );
        ship2.modifyByLine( 10 * s, 20 * s, 40 * s, 20 * s, 1 * s, stateHide );
        ship2.drawDstrObject();

        var ship3 = new FkDestructibleObject( this.dataGame, 5 * s, 45 * s, 50 * s, 30 * s, FkDestructibleObject.RENDER_FRAME );
        ship3.modifyByCircle( new Phaser.Geom.Circle( 15 * s, 15 * s, 4 * s ), stateHide );
        ship3.modifyByCircle( new Phaser.Geom.Circle( 15 * s, 22 * s, 6 * s ), stateHide );
        ship3.modifyByLine( 40 * s, 25 * s, 10 * s, 35 * s, 1 * s, stateHide );
        ship3.modifyByLine( 10 * s, 20 * s, 40 * s, 20 * s, 1 * s, stateHide );
        ship3.drawDstrObject();

        var ship4 = new FkDestructibleObject( this.dataGame, 65 * s, 45 * s, 40 * s, 30 * s, FkDestructibleObject.RENDER_TEXTURE );
        ship4.modifyByDstrObject( ship2, stateVisible, stateHide );
        ship4.modifyByDstrObject( ship3, stateVisible, stateHide );
        ship4.modifyByDstrObject( ship1, stateVisible, stateVisible );
        ship4.drawDstrObject();

        var g = this.dataGame.add.graphics();
        var shipList : FkDestructibleObject[] = [];
        shipList.push( ship1 );
        shipList.push( ship2 );
        shipList.push( ship3 );
        shipList.push( ship4 );
        this.dataGame.input.on( "pointermove", function( pointer ) {
            var b = false;
            shipList.forEach( function(ship) {
                b = b || ship.collisionWithPoint( new Phaser.Geom.Point( pointer.x, pointer.y ), stateVisible )
            });
            var lineStartPointList = [];
            lineStartPointList.push( new Phaser.Geom.Point( 100, 100 ) );
            lineStartPointList.push( new Phaser.Geom.Point( 450, 100 ) );
            lineStartPointList.push( new Phaser.Geom.Point( 100, 350 ) );
            lineStartPointList.push( new Phaser.Geom.Point( 450, 330 ) );
            lineStartPointList.push( new Phaser.Geom.Point( 100, 220 ) );
            g.clear();
            for ( var i = 0; i < lineStartPointList.length; i++ ) {
                var min_len = Number.MAX_VALUE;
                var p = lineStartPointList[i];
                self.drawDebugCircleSmall( g, p.x, p.y, true );
                var collidePoint = FkDestructibleObject.firstCollidePointForMovingPointToDstrObjectList( shipList, p, new Phaser.Geom.Point( pointer.x, pointer.y ), stateVisible );
                if ( collidePoint != null ) {
                    self.drawDebugLine( g, new Phaser.Geom.Line( p.x, p.y, pointer.x, pointer.y ), false );
                    self.drawDebugCircle( g, collidePoint.x, collidePoint.y, true );
                    self.drawDebugLine( g, new Phaser.Geom.Line( p.x, p.y, collidePoint.x, collidePoint.y ), true );
                }
                else
                    self.drawDebugLine( g, new Phaser.Geom.Line( p.x, p.y, pointer.x, pointer.y ), true );
            }
            // draw mouse position
            self.drawDebugCircleSmall( g, pointer.x, pointer.y, true );
        });
	}

    private drawDebugCircle( _graphics : Phaser.GameObjects.Graphics, _x : number, _y : number, isTrue : boolean ) {
        _graphics.lineStyle( 1, isTrue ? 0xffff00 : 0xff0000, 1 );
        _graphics.fillStyle( isTrue ? 0xffff00 : 0xff0000 );
        _graphics.fillCircle( _x, _y, 5 );
        _graphics.strokeCircle( _x, _y, 7 );
    }

    private drawDebugCircleSmall( _graphics : Phaser.GameObjects.Graphics, _x : number, _y : number, isTrue : boolean ) {
        _graphics.fillStyle( isTrue ? 0xffff00 : 0xff0000 );
        _graphics.fillCircle( _x, _y, 3 );
    }

    private drawDebugLine( _graphics : Phaser.GameObjects.Graphics, _l : Phaser.Geom.Line, isTrue : boolean ) {
        _graphics.lineStyle( 1, isTrue ? 0x00ff00 : 0xff0000, 3 );
        _graphics.strokeLineShape( _l );
    }
}