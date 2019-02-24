import "phaser";
import * as _ from 'lodash';
import { FkBaseDestructibleObject, FkBaseDstrGridData } from "../../components/fkbasedestructibleobject";

export class FkDstrGridData extends FkBaseDstrGridData {
    public dataIsVisible : boolean;

    protected constructor( _isVisible : boolean ) {
    	super();
        this.dataIsVisible = _isVisible;
    }

    public static getStateVisible() : FkDstrGridData {
    	return new FkDstrGridData( true );
    }

    public static getStateHide() : FkDstrGridData {
    	return new FkDstrGridData( false );
    }
}

export class FkDestructibleObject extends FkBaseDestructibleObject<FkDstrGridData> {
    private IS_DEBUG : boolean = true;
    public static RENDER_FRAME : string = "RENDER_FRAME";
    public static RENDER_TEXTURE : string = "RENDER_TEXTURE";
    private FRAME_COLOR : number = 0x00ff00;
    private FRAME_FILL_COLOR : number = 0x004400;
    private FRAME_COLOR_HIDDEN : number = 0xff0000;
    private FRAME_WIDTH : number = 1;   
    private dataRenderType : string = FkDestructibleObject.RENDER_FRAME; 
    private layerGridEdge : Phaser.GameObjects.Graphics;
    private layerTexture : Phaser.GameObjects.Image;
    private debugDrawCounter : number = 0;

	constructor( _game: Phaser.Scene, _posX : number, _posY : number, 
		_maxWidth : number, _maxHeight : number, _renderType : string ) {
    	super( _game, _posX, _posY, _maxWidth, _maxHeight,
	    	( _rect, _data ) => { this.render( _rect, _data ); }, 
	    	FkDstrGridData.getStateVisible()  );
        this.dataRenderType = _renderType;
        if ( this.dataRenderType == FkDestructibleObject.RENDER_TEXTURE ) {
            this.layerGridEdge = _game.make.graphics( {} );
            this.layerGridEdge.setX( _posX );
            this.layerGridEdge.setY( _posY );
            this.layerTexture = _game.add.image( _posX, _posY, "ship-body-light" );
            this.layerTexture.setMask( this.layerGridEdge.createGeometryMask() );
        }
        else {
            this.layerGridEdge = _game.add.graphics();
            this.layerGridEdge.setX( _posX );
            this.layerGridEdge.setY( _posY );
        }
	}

    public drawDstrObject() {
        this.layerGridEdge.clear();
        this.debugDrawCounter = 0;
        this.draw( ( _rect, _data ) => { this.render( _rect, _data ); } );
        console.log( "Draw: " + this.debugDrawCounter + " rects" );
    }

    private render(  _rect : Phaser.Geom.Rectangle, _data : FkDstrGridData ) {
        if ( this.dataRenderType == FkDestructibleObject.RENDER_TEXTURE ) {
            this.renderTexture( _rect, _data );
            return;
        }
        this.renderFrame( _rect, _data );
        return;
    }

    private renderFrame( _rect : Phaser.Geom.Rectangle, _data : FkDstrGridData ) : void {
        if ( _data.dataIsVisible ) {
            this.debugDrawCounter++;
            this.layerGridEdge.fillStyle( this.FRAME_FILL_COLOR );
            this.layerGridEdge.fillRectShape( _rect );
            this.layerGridEdge.lineStyle(this.FRAME_WIDTH, this.FRAME_COLOR, 1);
            this.layerGridEdge.strokeRect( _rect.x, _rect.y, _rect.width, _rect.height );
        }
        else {
            if ( this.IS_DEBUG ) {
                this.debugDrawCounter++;
                this.layerGridEdge.lineStyle(this.FRAME_WIDTH, this.FRAME_COLOR_HIDDEN, 1);
                this.layerGridEdge.strokeRect( _rect.x, _rect.y, _rect.width, _rect.height );
            }
        }
    }

    private renderTexture( _rect : Phaser.Geom.Rectangle, _data : FkDstrGridData ) : void {
        if ( _data.dataIsVisible ) {
            this.debugDrawCounter++;
            this.layerGridEdge.lineStyle(this.FRAME_WIDTH, this.FRAME_COLOR, 1);
            this.layerGridEdge.fillStyle(this.FRAME_FILL_COLOR, 1 );
            this.layerGridEdge.fillRect( _rect.x, _rect.y, _rect.width, _rect.height );
        }
    }

    public static firstCollidePointForMovingPointToDstrObjectList( _objList : FkDestructibleObject[], _p1 : Phaser.Geom.Point, _p2 : Phaser.Geom.Point, _sData : FkDstrGridData ) : Phaser.Geom.Point {
        var min_len = Number.MAX_VALUE;
        var collidePoint = null;
        _objList.forEach( function(obj : FkDestructibleObject) {
            var pp = obj.collisionWithMovingPoint( _p1, _p2, _sData );
            if ( pp != null ) {
                var len = (pp.x - _p1.x)*(pp.x - _p1.x) + (pp.y - _p1.y)*(pp.y - _p1.y);
                if ( min_len > len ) {
                    collidePoint = pp;
                    min_len = len;
                }
            }
        });
        return collidePoint;
    }
}