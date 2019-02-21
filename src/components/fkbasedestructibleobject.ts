import "phaser";
import * as _ from 'lodash';
import { FkQuadTree } from "./fkquadtree";

export class FkBaseDstrGridData {
}

export class FkBaseDestructibleObject<T extends FkBaseDstrGridData> {
    private dataGame : Phaser.Scene;
	private dataBody : FkQuadTree<T>;
	private dataPos : Phaser.Geom.Point;

	constructor( _game: Phaser.Scene, _posX : number, _posY : number, 
		_maxWidth : number, _maxHeight : number,
		_draw : ( _rect : Phaser.Geom.Rectangle, _data : T ) => void,
		_initState : T  ) {

        console.log( "Object size: " + _maxWidth + "x" + _maxHeight + ", pixels: " + _maxWidth * _maxHeight );

		var depthW = Math.ceil( Math.log2( _maxWidth ) + 1 );
		var depthH = Math.ceil( Math.log2( _maxHeight ) + 1 );
		this.dataGame = _game;
		this.dataPos = new Phaser.Geom.Point( _posX, _posY );
		this.dataBody = new FkQuadTree<T>( 0, 0,
			_maxWidth, _maxHeight, Math.max( depthH, depthW ), 
			_initState );
	}

	public draw( _triggerDraw : ( rect : Phaser.Geom.Rectangle, data : T ) => void ) {
		this.dataBody.draw( _triggerDraw );
	}

	public modifyByDstrObject( _g : FkBaseDestructibleObject<T>, _stateToChangeFromSource : T, _stateNewOnTarget : T ) {
		this.dataBody.updateWithQuadTree( _g.dataBody, ( _data : T ) => {
			if ( _.isEqual( _data, _stateToChangeFromSource ) )
				return _stateNewOnTarget;
			else
				return null;
		} );
	}

	public modifyByCircle( _g : Phaser.Geom.Circle, _sNew : T ) { 
		this.dataBody.updateWithCircle( _g, _sNew );
	}

	public modifyByRectangle( _g : Phaser.Geom.Rectangle, _sNew : T ) { 
		this.dataBody.updateWithRectangle( _g, _sNew );
	}

	public modifyByTriangle( _g : Phaser.Geom.Triangle, _sNew : T ) { 
		this.dataBody.updateWithTriangle( _g, _sNew );
	}

	public modifyByLine( _x1 : number, _y1 : number, 
		_x2 : number, _y2 : number, _w : number, _sNew : T ) {
		this.dataBody.updateWithLine( _x1, _y1, _x2, _y2, _w, _sNew );
	}

    public collisionWithPoint( _g : Phaser.Geom.Point ) : boolean {
    	return false;
    }

    public collisionWithMovingPoint( _g1 : Phaser.Geom.Point, _g2 : Phaser.Geom.Point ) : Phaser.Geom.Point {
    	return null;
    }

    public collisionWithDstrObject( _g : FkBaseDestructibleObject<T> ) : boolean {
    	return false;
    }

    public collisionWithMovingDstrObject( _g1 : FkBaseDestructibleObject<T>, _g2 : FkBaseDestructibleObject<T> ) : Phaser.Geom.Point[] {
    	return null;
    }

    public saveToString() : string {
    	return "";
    }

    public loadFromString() : string {
    	return "";
    }
}