// Copyright 2002-2015, University of Colorado Boulder

/**
 * Button with a fraction icon.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var fractionImage = require( 'image!PLINKO/fraction.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function FractionButton( options ) {

    options = _.extend( {
      baseColor: 'white',
      iconWidth: 20 // width of fraction icon, used for scaling, the aspect ratio will determine height
    }, options );

    // eraser icon
    options.content = new Image( fractionImage );
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );
  }

  return inherit( RectangularPushButton, FractionButton );
} );