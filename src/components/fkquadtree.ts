
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

	public updateWithCircle( _g : Phaser.Geom.Circle, _dataChangeOnContain : T ) {
		// Check, if the circle contains the whole quad
		// 		Delete all sub trees, apply data change
		if ( Phaser.Geom.Circle.ContainsRect( _g, this.dataRect ) ) {
			this.dataSubTree = null;
			this.dataNode = _dataChangeOnContain;
			return;
		}
		// Check if overlap or circle within quad
		//		If not limit, split
		//		If limit, treated as contained
		var isOverlapped = Phaser.Geom.Intersects.CircleToRectangle( _g, this.dataRect )
			|| Phaser.Geom.Rectangle.Contains( this.dataRect, _g.x, _g.y );
		if ( isOverlapped ) {
			if ( this.resDepth > 0 ) {
				if ( this.dataSubTree == null )
					this.createAllSubTrees();
				for( var i = 0; i < this.dataSubTree.length; i++ ) {
					var t = this.dataSubTree[i];
					t.updateWithCircle( _g, _dataChangeOnContain );
				}
				// At this point, all sub trees has been updated.
				// Check whether all subtrees hold the same value
				// If they do, they are redundant and can be represent by using only parent tree. 
				// So fold them back to parent tree
				this.clearRedendantSubTrees();
			}
			else {
				this.dataSubTree = null;
				this.dataNode = _dataChangeOnContain;
			}
		}
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
		this.dataSubTree = null;
		this.dataNode = toCompare;
	}
}