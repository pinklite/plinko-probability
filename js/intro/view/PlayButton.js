// Copyright 2002-2013, University of Colorado Boulder

/**
 * Play button for starting an action
 *
 * @author Sam Reid
 * @Author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var ResetAllShape = require( 'SCENERY_PHET/ResetAllShape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );


  var DEFAULT_RADIUS = 28;

  /*
   * PlayButton constructor
   *
   * @param {Object} [options] node options
   * @constructor
   */
  function PlayButton( options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS
    }, options );

    // play symbol is sized relative to the radius
    var triangleHeight = options.radius;
    var triangleWidth = options.radius * 0.8;

    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), { fill: 'black' } );

    var playCircle = new Circle( options.radius );
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;
    playCircle.addChild( playPath );

    RoundPushButton.call( this, _.extend( { content: playCircle }, options ) );
  }

  return inherit( RoundPushButton, PlayButton );
} );