// Copyright 2015, University of Colorado Boulder

/**
 * Scenery node for the representation of a ball. For performance reason, the ball is added as a Scenery Image instead of a Circle.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * Constructor for the representation of a ball
   * @param {number} radius - in view coordinates
   * @constructor
   */
  function BallRepresentationNode( radius ) {

    Node.call( this );

    //  create the representation for a ball
    var ballRepresentation = new Circle( radius, {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 0.1 * radius,
      fill: new RadialGradient( -radius * 0.4,  // gives ball white glare
        -radius * 0.4,
        0,
        radius * 0.1,
        -radius * 0.3,
        radius * 0.6 )
        .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
        .addColorStop( 1, PlinkoConstants.BALL_COLOR )
    } );


    // create an image of the ball and add to this node.
    //var ballImage = ballRepresentation.toDataURLNodeSynchronous();
    //this.addChild( ballImage );
    this.addChild( ballRepresentation );

  }

  plinkoProbability.register( 'BallRepresentationNode', BallRepresentationNode );

  return inherit( Node, BallRepresentationNode );
} );