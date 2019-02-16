import 'phaser';
import {FkQuadTree} from '../../components/fkquadtree';

class GridData {
    public dataIsVisible : boolean = true;

    constructor( _isVisible : boolean ) {
        this.dataIsVisible = _isVisible;
    }
}

export class FkGameData {
    private IS_DEBUG : boolean = false;
    private FRAME_COLOR : number = 0x00ff00;
    private FRAME_COLOR_HIDDEN : number = 0xff0000;
    private FRAME_WIDTH : number = 1;    
	private dataGame : Phaser.Scene;
    private layerGridEdge : Phaser.GameObjects.Graphics;
    private debugDrawCounter : number = 0;

	private static _inst:FkGameData = null;
	public static inst():FkGameData {
		if ( this._inst == null )
			this._inst = new FkGameData();
		return this._inst;
	}

	private constructor() {}

	public Init( _game : Phaser.Scene ) : Phaser.Scene {
        this.layerGridEdge = _game.add.graphics();
		return this.dataGame = _game;
	}

	public Run() {
        var self = this;

        var w = 500, h = 300;
        console.log( "Canvas size: " + w + "x" + h + ", pixels: " + w * h );

        var qt = new FkQuadTree( 50, 50, w, h, 10, 
            ( _rect, _data ) => { self.drawGrid( _rect, _data ); }, 
            new GridData( false ) );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 150, 150, 40 );
        var newData = new GridData( true );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 150, 220, 60 );
        var newData = new GridData( true );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 350, 220, 140 );
        var newData = new GridData( true );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 250, 180, 80 );
        var newData = new GridData( false );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 220, 300, 40 );
        var newData = new GridData( false );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );

        var c = new Phaser.Geom.Circle( 250, 300, 40 );
        var newData = new GridData( false );
        qt.updateWithCircle( c, newData );
        this.drawQuadTree( qt );
	}

    private drawQuadTree( qt : FkQuadTree<GridData> ) {
        this.layerGridEdge.clear();
        this.debugDrawCounter = 0;
        qt.draw();
        console.log( "Draw: " + this.debugDrawCounter );
    }

    private drawGrid( _rect : Phaser.Geom.Rectangle, _data : GridData ) : void {
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