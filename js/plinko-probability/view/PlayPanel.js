// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 */
define( function( require ) {
  'use strict';

  // imports

  var Circle = require( 'SCENERY/nodes/Circle' );
  var HStrut = require( 'SUN/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  //var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  //var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var VStrut = require( 'SUN/VStrut' );


  //var PANEL_OPTION_FONT = {font: new PhetFont( 14 )};

  var CIRCLE_RADIUS = 10;
  /**
   *
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Property.<String>} ballRadioProperty
   * @param options
   * @constructor
   */
  function PlayPanel( isPlayingProperty, ballRadioProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'black',
        lineWidth: 1,
        minWidth: 0.1,
        titleToControlsVerticalSpace: 5
      },
      options );

    var chargeColor = 'red';

    var oneBall = new Circle( CIRCLE_RADIUS, {
      fill: new RadialGradient( -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, 0, -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, CIRCLE_RADIUS * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, chargeColor ), centerX: 0, centerY: 0
    } );

    var continuous = new HBox( {
      //align: 'left',
      spacing: -5,
      children: [new Circle( CIRCLE_RADIUS, {
        fill: new RadialGradient( -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, 0, -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, CIRCLE_RADIUS * 1.6 )
          .addColorStop( 0, 'white' )
          .addColorStop( 1, chargeColor ), centerX: 0, centerY: 0
      } ),
        new Circle( CIRCLE_RADIUS, {
          fill: new RadialGradient( -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, 0, -CIRCLE_RADIUS * 0.4, -CIRCLE_RADIUS * 0.4, CIRCLE_RADIUS * 1.6 )
            .addColorStop( 0, 'white' )
            .addColorStop( 1, chargeColor ), centerX: 0, centerY: 0
        } )]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      {node: oneBall, property: ballRadioProperty, value: 'oneBall'},
      {node: continuous, property: ballRadioProperty, value: 'continuous'}
    ], {radius: 8} );

    var ballModeMarkerVBox = new VBox( {
      children: [
        new VStrut( options.titleToControlsVerticalSpace ),
        new HStrut( Math.max( 0.1, options.minWidth - 2 * options.xMargin ) ),
        new HBox( {children: [new HStrut( 10 ), ballModeRadioButtons]} )
      ],
      align: 'left'
    } );

    // play button
    var playPauseButtonOptions = {
      //upFill: Constants.blueUpColor,
      //overFill: Constants.blueOverColor,
      //disabledFill: Constants.blueDisabledColor,
      //downFill: Constants.blueDownColor,
      //backgroundGradientColorStop0: Constants.buttonBorder0,
      //backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };

    //// prefer 200 hue
    //blueUpColor: new Color( 'hsl(210,70%,75%)' ),
    //  blueOverColor: new Color( 'hsl(210,90%,80%)' ),
    //  blueDisabledColor: new Color( 'rgb(180,180,180)' ),
    //  blueDownColor: new Color( 'hsl(210,80%,70%)' ),
    //  radioColor: new Color( 'hsl(210,90%,77%)' ),
    //  sliderUp: new Color( 'hsl(210,50%,63%)' ),
    //  sliderOver: new Color( 'hsl(210,70%,73%)' ),
    //  buttonBorder0: new Color( 'transparent' ),
    //  buttonBorder1: new Color( 'transparent' ),

    var playPauseButton = new PlayPauseButton( isPlayingProperty, {
      scale: 1.0,
      touchExpansion: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );


    var startVBox = new HBox( {
      children: [
        playPauseButton,
        ballModeMarkerVBox
      ]
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left', spacing: 10,
      children: [startVBox]
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, PlayPanel );
} );
