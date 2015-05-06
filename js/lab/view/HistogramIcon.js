// Copyright 2002-2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a histogram icon.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );


  /**
   * @param {Object} [options]
   * @constructor
   */
  function HistogramIcon( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults

      binNumber: 5,
      binWidth: 10,
      binHeightMax: 20,
      binStroke: 'blue',
      binLineWidth: 2,
      binFill: null
    }, options );

    // Add the bins
    for ( var i = 0; i < options.binNumber; i++ ) {

      var height = 4 * options.binHeightMax * (i + 1) / options.binNumber * (1 - (i) / options.binNumber);
      var rectangle = new Rectangle( i * options.binWidth, -height, options.binWidth, height,
        {
          fill: options.binFill,
          lineWidth: options.binLineWidth,
          stroke: options.binStroke
        } );
      this.addChild( rectangle );
    }

    // Pass options through to the parent class.
    this.mutate( options );
  }

  return inherit( Node, HistogramIcon );
} )
;