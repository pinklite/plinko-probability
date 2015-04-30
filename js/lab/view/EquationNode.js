// Copyright 2002-2015, University of Colorado Boulder

/**
 * Equation Node that renders a text node of an equation of the form  'text' = 'number'
 *
 * Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings

//  var plusString = '\u002B'; // we want a large + sign
//  var minusString = '\u2212';

  //constants
  /**
   *
   * @param {string} leftHandSideOfEquation
   * @param {number} rightHandSideOfEquation
   * @constructor
   */
  function EquationNode( leftHandSideOfEquation, rightHandSideOfEquation, options ) {

    options = _.extend( {
      leftHandSideFont: new PhetFont( 16 ),
      rightHandSideFont: new PhetFont( 16 ),
      leftHandSideFill: 'blue',
      rightHandSideFill: 'blue',
      maxSigFigs: 3
    }, options );

    Node.call( this );

    this.leftHandSideOfEquationText = new SubSupText( leftHandSideOfEquation,
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill
      } );
    this.equalSignText = new Text( ' = ',
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill
      } );
    this.rightHandSideOfEquationText = new Text( this.roundNumber( rightHandSideOfEquation, options ),
      {
        font: options.rightHandSideFont,
        fill: options.rightHandSideFill
      } );

    var mutableEquationText = new Node( {
      children: [
        this.leftHandSideOfEquationText,
        this.equalSignText,
        this.rightHandSideOfEquationText
      ]
    } );

    this.equalSignText.left = 30;
    this.rightHandSideOfEquationText.left = 50;
    this.addChild( mutableEquationText );
  }

  return inherit( Node, EquationNode, {
    setRightHandSideOfEquation: function( number ) {
      this.rightHandSideOfEquationText.text = this.roundNumber( number, { maxSigFigs: 3 } );
    },

    roundNumber: function( number, options ) {
      var roundedNumber;
      if ( Math.abs( number ) < 1 ) {
        roundedNumber = Util.toFixed( number, options.maxSigFigs );
      }
      else if ( Math.abs( number ) < 10 ) {
        roundedNumber = Util.toFixed( number, options.maxSigFigs - 1 );
      }
      else if ( Math.abs( number ) < 100 ) {
        roundedNumber = Util.toFixed( number, options.maxSigFigs - 2 );
      }
      else {
        roundedNumber = Util.toFixed( number, options.maxSigFigs - 3 );
      }
      return roundedNumber;
    }
  } );
} )
;
