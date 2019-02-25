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

	protected draw( _triggerDraw : ( rect : Phaser.Geom.Rectangle, data : T ) => void ) {
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

	public modifyByCircle( _g : Phaser.Geom.Circle, _sNew : T, _isRelative : boolean = false ) {
		if ( _isRelative )
			this.dataBody.updateWithCircle( _g, _sNew );
		else
			this.dataBody.updateWithCircle( 
				new Phaser.Geom.Circle( _g.x - this.dataPos.x, _g.y - this.dataPos.y, 
					_g.radius ), _sNew );
	}

	public modifyByRectangle( _g : Phaser.Geom.Rectangle, _sNew : T, _isRelative : boolean = false ) { 
		if ( _isRelative )
			this.dataBody.updateWithRectangle( _g, _sNew );
		else
			this.dataBody.updateWithRectangle( 
				new Phaser.Geom.Rectangle( _g.x - this.dataPos.x, _g.y - this.dataPos.y, 
					_g.width, _g.height ), _sNew );
	}

	public modifyByTriangle( _g : Phaser.Geom.Triangle, _sNew : T, _isRelative : boolean = false ) { 
		if ( _isRelative )
			this.dataBody.updateWithTriangle( _g, _sNew );
		else
			this.dataBody.updateWithTriangle( 
				new Phaser.Geom.Triangle( _g.x1 - this.dataPos.x, _g.y1 - this.dataPos.y,
				 	_g.x2 - this.dataPos.x, _g.y2 - this.dataPos.y,
				 	_g.x3 - this.dataPos.x, _g.y3 - this.dataPos.y ), _sNew );
	}

	public modifyByLine( _x1 : number, _y1 : number, 
		_x2 : number, _y2 : number, _w : number, _sNew : T, _isRelative : boolean = false ) {
		if ( _isRelative )
			this.dataBody.updateWithLine( _x1, _y1, _x2, _y2, _w, _sNew );
		else
			this.dataBody.updateWithLine( _x1 - this.dataPos.x, _y1 - this.dataPos.y, 
				_x2 - this.dataPos.x, _y2 - this.dataPos.y, _w, _sNew );
	}

    public collisionWithPoint( _g : Phaser.Geom.Point, _sData : T ) : boolean {
    	return this.dataBody.collisionWithPoint( 
    		new Phaser.Geom.Point( _g.x - this.dataPos.x, _g.y - this.dataPos.y ), _sData );
    }

    public collisionWithMovingPoint( _g1 : Phaser.Geom.Point, _g2 : Phaser.Geom.Point, _sData : T ) : Phaser.Geom.Point {
    	var p = this.dataBody.collisionWithMovingPoint( 
    		new Phaser.Geom.Point( _g1.x - this.dataPos.x, _g1.y - this.dataPos.y ), 
    		new Phaser.Geom.Point( _g2.x - this.dataPos.x, _g2.y - this.dataPos.y ), 
    		_sData );
    	if ( p != null )
    		return new Phaser.Geom.Point( this.dataPos.x + p.x, this.dataPos.y + p.y );
    	else
    		return null;
    }

    public collisionWithDstrObject( _g : FkBaseDestructibleObject<T>, _sData : T ) : boolean {
    	return this.dataBody.collisionWithQuadTree( 
    		new Phaser.Geom.Point( _g.dataPos.x - this.dataPos.x, _g.dataPos.y - this.dataPos.y ),
    		_g.dataBody, _sData );
    }

    public collisionWithMovingDstrObject( _g1 : FkBaseDestructibleObject<T>, _p2 : Phaser.Geom.Point, _sData : T ) : Phaser.Geom.Point[] {
    	return this.dataBody.collisionWithMovingQuadTree( 
    		new Phaser.Geom.Point( _g1.dataPos.x - this.dataPos.x, _g1.dataPos.y - this.dataPos.y ),
    		new Phaser.Geom.Point( _p2.x - this.dataPos.x, _p2.y - this.dataPos.y ),
    		_g1.dataBody, _sData );
    }

    public saveToString() : string {
    	return "";
    }

    public loadFromString() : string {
    	return "";
    }
}