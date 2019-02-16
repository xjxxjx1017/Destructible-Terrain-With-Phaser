
import 'phaser';
import * as _ from 'lodash';

export class FkQuadTree<T>{

	public resDepth : number;
	public dataNode : T;
	public dataRect : Phaser.Geom.Rectangle;
	public dataSubTree : FkQuadTree<T>[];
	public triggerDraw : ( rect : Phaser.Geom.Rectangle, data : T ) => void;

	constructor( _x : number, _y : number, _w : number, _h : number, _depth : number,
		_draw : ( rect : Phaser.Geom.Rectangle, data : T ) => void, _data : T ) {
		this.resDepth = _depth;
		this.dataNode = _data;
		this.dataRect = new Phaser.Geom.Rectangle( _x, _y, _w, _h );
		this.dataSubTree = null;
		this.triggerDraw = _draw;
	}

	public updateWithLine( _x1 : number, _y1 : number, 
		_x2 : number, _y2 : number, _w : number, _dataChangeOnContain : T ) {
		var theta = Math.atan( ( _y2 - _y1 ) / ( _x2 - _x1 ) );
		var p1 = new Phaser.Geom.Rectangle( 
			_x1 - Math.sin(theta) * _w / 2, 
			_y1 + Math.cos(theta) * _w / 2 );
		var p2 = new Phaser.Geom.Rectangle( 
			_x1 + Math.sin(theta) * _w / 2, 
			_y1 - Math.cos(theta) * _w / 2 );
		var p3 = new Phaser.Geom.Rectangle( 
			_x2 + Math.sin(theta) * _w / 2, 
			_y2 - Math.cos(theta) * _w / 2 );
		var p4 = new Phaser.Geom.Rectangle( 
			_x2 - Math.sin(theta) * _w / 2, 
			_y2 + Math.cos(theta) * _w / 2 );
		var tr1 = new Phaser.Geom.Triangle( p1.x, p1.y, p2.x, p2.y, p3.x, p3.y );
		var tr2 = new Phaser.Geom.Triangle( p1.x, p1.y, p3.x, p3.y, p4.x, p4.y );
		this.updateWithTriangle( tr1, _dataChangeOnContain );
		this.updateWithTriangle( tr2, _dataChangeOnContain );
	}

	public updateWithRectangle( _g : Phaser.Geom.Rectangle, _dataChangeOnContain : T ) {
		if ( Phaser.Geom.Rectangle.ContainsRect( _g, this.dataRect ) ) {
			this.foldSubTreesToParent( _dataChangeOnContain );
			return;
		}
		if ( Phaser.Geom.Intersects.RectangleToRectangle( this.dataRect, _g )
			|| ( Phaser.Geom.Rectangle.ContainsRect( this.dataRect, _g ) ) ) {
			this.updateSubtrees( _dataChangeOnContain, function( _tree : FkQuadTree<T>, _data : T ) {
				_tree.updateWithRectangle( _g, _data );
			})
		}
	}

	public updateWithTriangle( _g : Phaser.Geom.Triangle, _dataChangeOnContain : T ) {
		if ( Phaser.Geom.Triangle.Contains( _g, this.dataRect.x, this.dataRect.y )
			&&  Phaser.Geom.Triangle.Contains( _g, this.dataRect.x + this.dataRect.width, this.dataRect.y )
			&&  Phaser.Geom.Triangle.Contains( _g, this.dataRect.x, this.dataRect.y + this.dataRect.height )
			&&  Phaser.Geom.Triangle.Contains( _g, this.dataRect.x + this.dataRect.width, this.dataRect.y + this.dataRect.height ) ) {
			this.foldSubTreesToParent( _dataChangeOnContain );
			return;
		}
		if ( Phaser.Geom.Intersects.RectangleToTriangle( this.dataRect, _g )
			|| ( Phaser.Geom.Rectangle.Contains( this.dataRect, _g.x1, _g.y1 )
			&& Phaser.Geom.Rectangle.Contains( this.dataRect, _g.x2, _g.y2 )
			&& Phaser.Geom.Rectangle.Contains( this.dataRect, _g.x3, _g.y3 ) ) ) {
			this.updateSubtrees( _dataChangeOnContain, function( _tree : FkQuadTree<T>, _data : T ) {
				_tree.updateWithTriangle( _g, _data );
			})
		}
	}

	public updateWithCircle( _g : Phaser.Geom.Circle, _dataChangeOnContain : T ) {
		if ( Phaser.Geom.Circle.ContainsRect( _g, this.dataRect ) ) {
			this.foldSubTreesToParent( _dataChangeOnContain );
			return;
		}
		if ( Phaser.Geom.Intersects.CircleToRectangle( _g, this.dataRect )
			|| Phaser.Geom.Rectangle.Contains( this.dataRect, _g.x, _g.y ) ) {
			this.updateSubtrees( _dataChangeOnContain, function( _tree : FkQuadTree<T>, _data : T ) {
				_tree.updateWithCircle( _g, _data );
			})
		}
	}

	private updateSubtrees( _dataToUpdate : T, 
		_callback : ( _tree : FkQuadTree<T>, _data : T ) => void ) {
		if ( this.resDepth > 0 ) {
			if ( this.dataSubTree == null )
				this.createAllSubTrees();
			for( var i = 0; i < this.dataSubTree.length; i++ ) {
				var t = this.dataSubTree[i];
				_callback( t, _dataToUpdate );
			}
			// At this point, all sub trees has been updated.
			// Check whether all subtrees hold the same value
			// If they do, they are redundant and can be represent by using only parent tree. 
			// So fold them back to parent tree
			this.clearRedendantSubTrees();
		}
		else this.foldSubTreesToParent( _dataToUpdate );
	}

	public draw() {
		var self = this;
		if ( this.dataSubTree != null ) {
			this.dataSubTree.forEach( function(q) {
				q.draw();
			})
		}
		else self.triggerDraw( self.dataRect, self.dataNode );
	}

	private foldSubTreesToParent( _data : T ) {
		this.dataSubTree = null;
		this.dataNode = _data;
	}

	private createAllSubTrees() {
		var wh = [ 
			{ w: 0, h: 0 },
			{ w: 1, h: 0 },
			{ w: 0, h: 1 },
			{ w: 1, h: 1 },
		]
		this.dataSubTree = [];
		for( var i = 0; i < wh.length; i++ ) {
			var o = wh[i];
			this.dataSubTree.push( new FkQuadTree( 
				this.dataRect.x + ( this.dataRect.width/2 * o.w ), 
				this.dataRect.y + ( this.dataRect.height/2 * o.h ), 
				this.dataRect.width/2, this.dataRect.height/2, 
				this.resDepth - 1, this.triggerDraw, this.dataNode ) );
		}
	}

	private clearRedendantSubTrees() {
		var toCompare : T = null;
		for( var i = 0; i < this.dataSubTree.length; i++ ) {
			var t = this.dataSubTree[i];
			if ( t.dataSubTree != null )
				return;
			if ( toCompare == null )
				toCompare = t.dataNode;
			else if ( !_.isEqual( toCompare, t.dataNode ) )
				return;
		}
		// All sub trees don't contain any sub-sub trees and have the same node data.
		this.foldSubTreesToParent( toCompare );
	}
}