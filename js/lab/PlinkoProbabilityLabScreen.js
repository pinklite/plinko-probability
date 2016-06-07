// Copyright 2015, University of Colorado Boulder

/**
 * The main Plinko Probability Lab screen
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var PlinkoProbabilityLabModel = require( 'PLINKO_PROBABILITY/lab/model/PlinkoProbabilityLabModel' );
  var PlinkoProbabilityLabView = require( 'PLINKO_PROBABILITY/lab/view/PlinkoProbabilityLabView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityLabTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityLabTitleScreen' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Lab Icon
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    return new Node( { children: [ background ] } );

  };

  function PlinkoProbabilityLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    Screen.call( this,
      plinkoProbabilityLabTitleScreenString,
      createScreenIcon(), // no icon, single-screen sim
      function() { return new PlinkoProbabilityLabModel(); },
      function( model ) { return new PlinkoProbabilityLabView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR
      }
    );
  }

  plinkoProbability.register( 'PlinkoProbabilityLabScreen', PlinkoProbabilityLabScreen );

  return inherit( Screen, PlinkoProbabilityLabScreen );
} );
