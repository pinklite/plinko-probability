// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the Galton Board (also known as a bean machine). It consists of a triangular lattice of pegs.
 *
 * @author Martin Veillette (Berea College)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

/**
 * @param {Property.<number>} numberOfRowsProperty - number of rows of pegs
 * @constructor
 */
function GaltonBoard( numberOfRowsProperty ) {

  // @public
  this.bounds = PlinkoProbabilityConstants.GALTON_BOARD_BOUNDS;

  let rowNumber; // {number} a non negative integer
  let columnNumber; // {number} a non negative  integer
  this.pegs = []; // @public (read-only)

  // creates all the pegs (up to the maximum number of possible rows)
  for ( rowNumber = 0; rowNumber <= PlinkoProbabilityConstants.ROWS_RANGE.max; rowNumber++ ) {
    for ( columnNumber = 0; columnNumber <= rowNumber; columnNumber++ ) {
      const peg = {
        rowNumber: rowNumber, // an integer starting at zero
        columnNumber: columnNumber // an integer starting at zero
      };
      this.pegs.push( peg );
    }
  }

  // link the numberOrRows to adjust the spacing between pegs (and size)
  // link is present for the lifetime of the sum
  const self = this;
  numberOfRowsProperty.link( function( numberOfRows ) {

    self.pegs.forEach( function( peg ) {
      // for performance reasons, we don't throw out the pegs, we simply update their visibility
      peg.isVisible = isPegVisible( peg.rowNumber, numberOfRows );
      if ( peg.isVisible ) {
        // update the position of the pegs on the Galton Board.
        peg.position = getPegPosition( peg.rowNumber, peg.columnNumber, numberOfRows );
      }
    } );
  } );
}

plinkoProbability.register( 'GaltonBoard', GaltonBoard );

/**
 * Gets the x and y coordinates of a peg, in reference to the galton board.
 *
 * @param {number} rowNumber - integer starting at zero
 * @param {number} columnNumber - index of the column, integer starting at zero
 * @param {number} numberOfRows - the number of rows on the screen
 * @returns {Vector2}
 * @public
 */
var getPegPosition = function( rowNumber, columnNumber, numberOfRows ) {
  return new Vector2(
    -rowNumber / 2 + columnNumber,
    -rowNumber - 2 * PlinkoProbabilityConstants.PEG_HEIGHT_FRACTION_OFFSET )
    .divideScalar( numberOfRows + 1 );
};

/**
 * Is the specified peg visible?
 *
 * @param {number} rowNumber - index of row, integer starting at zero
 * @param {number} numberOfRows - number of rows
 * @returns {boolean}
 * @public
 */
var isPegVisible = function( rowNumber, numberOfRows ) {
  return ( rowNumber < numberOfRows );
};

inherit( Object, GaltonBoard, {}, {

  /**
   * Gets the horizontal spacing between two pegs on the same row on the Galton board.
   *
   * @param {number} numberOfRows
   * @returns {number}
   * @public
   * @static
   */
  getPegSpacing: function( numberOfRows ) {
    return PlinkoProbabilityConstants.GALTON_BOARD_BOUNDS.width / ( numberOfRows + 1 );
  }
} );

export default GaltonBoard;