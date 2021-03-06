// Copyright 2015-2020, University of Colorado Boulder

/**
 * Play button for starting an action
 *
 * @author Sam Reid
 * @author Martin Veillette (Berea College)
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function PlayButton( options ) {

  options = merge( {
    radius: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS,
    baseColor: 'rgb( 0, 224, 121 )', // light green
    iconColor: 'black',
    buttonAppearanceStrategy: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_APPEARANCE_STRATEGY
  }, options );

  // triangle is sized relative to the radius
  const triangleHeight = options.radius;
  const triangleWidth = options.radius * 0.8;

  const triangleShape = new Shape()
    .moveTo( 0, triangleHeight / 2 )
    .lineTo( triangleWidth, 0 )
    .lineTo( 0, -triangleHeight / 2 )
    .close();

  const triangleNode = new Path( triangleShape, {
    fill: options.iconColor
  } );

  // move to right slightly, since we don't want it exactly centered
  options.xContentOffset = 0.1 * triangleNode.width;

  assert && assert( !options.content );
  options.content = triangleNode;

  RoundPushButton.call( this, options );
}

plinkoProbability.register( 'PlayButton', PlayButton );

inherit( RoundPushButton, PlayButton );
export default PlayButton;