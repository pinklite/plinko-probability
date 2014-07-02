// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // imports
  // var Color = require( 'SCENERY/util/Color' );
  // var Font = require( 'SCENERY/util/Font' );
  var HStrut = require( 'SUN/HStrut' );
  var HSlider = require( 'SUN/HSlider' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  // var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  // var Vector2 = require( 'DOT/Vector2');
  // var RadioButton = require( 'SUN/RadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var Property = require( 'AXON/Property' );
  // var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var VStrut = require( 'SUN/VStrut' );


  var PANEL_OPTION_FONT = { font: new PhetFont( 14 ) };
  var PANEL_TITLE_FONT = new PhetFont( 16 );


  // strings

  /**
  * @param {Property<Number>} valueProperty
  * @param { {min:Number, max:Number} } range
  * @param {string} title
  * @param {bool} isInteger
  *
  */

  function createSliderVBox(property, range, title, isInteger) {

    var rowsSlider = new HSlider(property, range);
    rowsSlider.rotate(-Math.PI / 2);

    var rowsSliderLabel = new Text('');

    property.link( function( num ) {
      rowsSliderLabel.setText(isInteger ? Math.floor(num) : num.toFixed(2));
    } );

    return new VBox( { 
      children: [
        rowsSlider,
        rowsSliderLabel
      ]
    } );

  }

  /**
   * @param {PlinkoProbabilityModel} model
   * @param {*} options
   * @constructor
   */
  function ControlPanel( model, view, histogramIndicatorStateProperty, showIndicatorStateProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'orange',
        lineWidth: 3,
        minWidth: 0.1,
        titleToControlsVerticalSpace: 5 },
      options );

    var histogramDisplayRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: new Text( 'Fraction', PANEL_OPTION_FONT ), property: histogramIndicatorStateProperty, value: 'fraction', label: 'Fraction' },
      { node: new Text( 'Number', PANEL_OPTION_FONT ), property: histogramIndicatorStateProperty, value: 'number', label: 'Number' },
      { node: new Text( 'auto-scale', PANEL_OPTION_FONT ), property: histogramIndicatorStateProperty, value: 'autoScale', label: 'auto-scale' }
    ], { radius: 8 } );

    var histogramDisplayMarkerVBox = new VBox( {
      children: [
        new Text( 'Histogram display: ', PANEL_TITLE_FONT ),
        new VStrut( options.titleToControlsVerticalSpace ),
        new HStrut( Math.max( 0.1, options.minWidth - 2 * options.xMargin ) ),
        new HBox( { children: [ new HStrut( 10 ), histogramDisplayRadioButtons ] } )
      ],
      align: 'left'
    } );

    var showRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: new Text( 'Ball', PANEL_OPTION_FONT ), property: showIndicatorStateProperty, value: 'ball', label: 'ball' },
      { node: new Text( 'Path', PANEL_OPTION_FONT ), property: showIndicatorStateProperty, value: 'path', label: 'path' },
      { node: new Text( 'None', PANEL_OPTION_FONT ), property: showIndicatorStateProperty, value: 'none', label: 'none' }
    ], { radius: 8 } );

    var showMarkerVBox = new VBox( {
      children: [
        new Text( 'Show: ', PANEL_TITLE_FONT ),
        new VStrut( options.titleToControlsVerticalSpace ),
        new HStrut( Math.max( 0.1, options.minWidth - 2 * options.xMargin ) ),
        new HBox( { children: [ new HStrut( 10 ), showRadioButtons ] } )
      ],
      align: 'left'
    } );

    var sliderHBox = new HBox( {
      children: [
        createSliderVBox(model.numberOfRows, {min: 3, max: 40}, 'rows', true),
        createSliderVBox(model.probability, {min: 0, max: 1}, 'p', false)
      ],
      align: 'top',
      spacing: 50
    } );

    // The contents of the control panel
    var content = new VBox( {align: 'left', spacing: 10, 
    children: [histogramDisplayMarkerVBox, showMarkerVBox, sliderHBox] } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, ControlPanel );
} );