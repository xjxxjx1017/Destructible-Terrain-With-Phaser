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
    private FRAME_COLOR : number = 0x00ff00;
    private FRAME_COLOR_HIDDEN : number = 0xff0000;
    private FRAME_WIDTH : number = 1;    
    private layerGridEdge : Phaser.GameObjects.Graphics;
    private debugDrawCounter : number = 0;

	constructor( _game: Phaser.Scene, _posX : number, _posY : number, 
		_maxWidth : number, _maxHeight : number ) {
    	super( _game, _posX, _posY, _maxWidth, _maxHeight,
	    	( _rect, _data ) => { this.drawGrid( _rect, _data ); }, 
	    	FkDstrGridData.getStateVisible()  );

        this.layerGridEdge = _game.add.graphics();
        this.layerGridEdge.setX( _posX );
        this.layerGridEdge.setY( _posY );
	}

    public drawDstrObject() {
        this.layerGridEdge.clear();
        this.debugDrawCounter = 0;
        this.draw( ( _rect, _data ) => { this.drawGrid( _rect, _data ); } );
        console.log( "Draw: " + this.debugDrawCounter + " rects" );
    }

    private drawGrid( _rect : Phaser.Geom.Rectangle, _data : FkDstrGridData ) : void {
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

    private drawSprite( _s : Phaser.GameObjects.Sprite ) : void {

    }
}