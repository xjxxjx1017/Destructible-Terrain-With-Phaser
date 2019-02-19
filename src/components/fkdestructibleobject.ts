import "phaser";
import * as _ from 'lodash';
import { FkQuadTree } from "./fkquadtree";

class FkDstGridData {
    public dataIsVisible : boolean;

    constructor( _isVisible : boolean ) {
        this.dataIsVisible = _isVisible;
    }
}

export class FkDestructibleObject {
    private IS_DEBUG : boolean = true;
    private FRAME_COLOR : number = 0x00ff00;
    private FRAME_COLOR_HIDDEN : number = 0xff0000;
    private FRAME_WIDTH : number = 1;    
    private dataGame : Phaser.Scene;
	private dataBody : FkQuadTree<FkDstGridData>;
	private dataPos : Phaser.Geom.Point;
    private layerGridEdge : Phaser.GameObjects.Graphics;
    private debugDrawCounter : number = 0;

	constructor( _game: Phaser.Scene, _posX : number, _posY : number, 
		_maxWidth : number, _maxHeight : number ) {
        var self = this;

        console.log( "Object size: " + _maxWidth + "x" + _maxHeight + ", pixels: " + _maxWidth * _maxHeight );

		var depthW = Math.ceil( Math.log2( _maxWidth ) + 1 );
		var depthH = Math.ceil( Math.log2( _maxHeight ) + 1 );
		this.dataGame = _game;
        this.layerGridEdge = _game.add.graphics();
        this.layerGridEdge.setX( _posX );
        this.layerGridEdge.setY( _posY );
		this.dataPos = new Phaser.Geom.Point( _posX, _posY );
		this.dataBody = new FkQuadTree<FkDstGridData>( 0, 0,
			_maxWidth, _maxHeight, Math.max( depthH, depthW ), 
			( _rect, _data ) => { self.drawGrid( _rect, _data ); }, new FkDstGridData(true) );
	}

	public damageByDstObject( _g : FkDestructibleObject ) {
		this.dataBody.updateWithQuadTree( _g.dataBody, ( _data : FkDstGridData ) => {
			if ( _.isEqual( _data, new FkDstGridData( true ) ) )
				return new FkDstGridData(false);
			else
				return null;
		} );
	}

	public damageByCircle( _g : Phaser.Geom.Circle ) { 
		this.dataBody.updateWithCircle( _g, new FkDstGridData(false) );
	}

	public damageByRectangle( _g : Phaser.Geom.Rectangle ) { 
		this.dataBody.updateWithRectangle( _g, new FkDstGridData(false) );
	}

	public damageByTriangle( _g : Phaser.Geom.Triangle ) { 
		this.dataBody.updateWithTriangle( _g, new FkDstGridData(false) );
	}

	public damageByLine( _x1 : number, _y1 : number, 
		_x2 : number, _y2 : number, _w : number ) {
		this.dataBody.updateWithLine( _x1, _y1, _x2, _y2, _w, new FkDstGridData(false) );
	}

	public generateByDstObject( _g : FkDestructibleObject ) {
		this.dataBody.updateWithQuadTree( _g.dataBody, ( _data : FkDstGridData ) => {
			if ( _.isEqual( _data, new FkDstGridData( true ) ) )
				return new FkDstGridData(true);
			else
				return null;
		} );
	}

	public generateByCircle( _g : Phaser.Geom.Circle ) { 
		this.dataBody.updateWithCircle( _g, new FkDstGridData(true) );
	}

	public generateByRectangle( _g : Phaser.Geom.Rectangle ) { 
		this.dataBody.updateWithRectangle( _g, new FkDstGridData(true) );
	}

	public generateByTriangle( _g : Phaser.Geom.Triangle ) { 
		this.dataBody.updateWithTriangle( _g, new FkDstGridData(true) );
	}

	public generateByLine( _x1 : number, _y1 : number, 
		_x2 : number, _y2 : number, _w : number ) {
		this.dataBody.updateWithLine( _x1, _y1, _x2, _y2, _w, new FkDstGridData(true) );
	}

    public drawDstObject() {
        this.layerGridEdge.clear();
        this.debugDrawCounter = 0;
        this.dataBody.draw();
        console.log( "Draw: " + this.debugDrawCounter + " rects" );
    }

    private drawGrid( _rect : Phaser.Geom.Rectangle, _data : FkDstGridData ) : void {
        if ( _data.dataIsVisible == false ) {
            if ( this.IS_DEBUG ) {
                this.debugDrawCounter++;
                this.layerGridEdge.lineStyle(this.FRAME_WIDTH, this.FRAME_COLOR_HIDDEN, 1);
                this.layerGridEdge.strokeRect( _rect.x, _rect.y, _rect.width, _rect.height );
            }
        }
        else {
            this.debugDrawCounter++;
            this.layerGridEdge.lineStyle(this.FRAME_WIDTH, this.FRAME_COLOR, 1);
            this.layerGridEdge.strokeRect( _rect.x, _rect.y, _rect.width, _rect.height );
        }
    }
}