// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var PropertySet = require( 'AXON/PropertySet' );
    var Sound = require( 'VIBE/Sound' );
    var Timer = require( 'PHET_CORE/Timer' );


    // audio
    var ballHittingFloorAudio = require( 'audio!PLINKO_PROBABILITY/ballHittingFloor' );

    // constants
    var MAX_BALL_NUMBER = 100;

    function PlinkoProbabilityIntroModel() {

      var thisModel = this;

      PropertySet.call( this, {
        probability: 0.5,
        histogramMode: 'count', // acceptable values are 'count' and 'fraction'
        ballMode: 'oneBall', // acceptable values are 'oneBall', 'tenBalls', 'allRemainingBalls' and 'continuous'
        histogramVisible: false,
        isBallCapReached: false, // is the maximum of balls reached?
        numberOfRows: 12,
        isSoundEnabled: false
      } );


      this.ballHittingFloorSound = new Sound( ballHittingFloorAudio );

      this.timerID = [];

      this.launchedBallsNumber = 0; // number of current trial (current ball drop)

      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty );
      this.balls = new ObservableArray();
      this.histogram = new Histogram( this.numberOfRowsProperty );
      this.landedBallsNumber = this.histogram.landedBallsNumber; //number of balls in the histogram

      this.on( 'PressPlayButton', function() {
        thisModel.play();
      } );
    }


    plinkoProbability.register( 'PlinkoProbabilityIntroModel', PlinkoProbabilityIntroModel );

    return inherit( PropertySet, PlinkoProbabilityIntroModel, {

      /**
       * time step function that is responsible for updating the position and status of tehe balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        var thisModel = this;
        var PHASE_INITIAL = 0;
        var PHASE_FALLING = 1;
        var PHASE_EXIT = 2;
        var PHASE_COLLECTED = 3;
        this.balls.forEach( function( ball ) {
          var df = dt * 5;
          if ( ball.phase === PHASE_INITIAL ) {
            if ( df + ball.fallenRatio < 1 ) {
              ball.fallenRatio += df;
              ball.initialPegPositionInformation();
            }
            else {
              ball.phase = PHASE_FALLING;
              ball.fallenRatio = 0;
              ball.updatePegPositionInformation();
              if ( thisModel.isSoundEnabled ) {
                thisModel.ballHittingFloorSound.play();
              }
            }
          }
          if ( ball.phase === PHASE_FALLING ) {
            if ( df + ball.fallenRatio < 1 ) {
              ball.fallenRatio += df;
            }
            else {
              ball.fallenRatio = 0;

              if ( ball.pegHistory.length > 1 ) {
                ball.updatePegPositionInformation();
                if ( thisModel.isSoundEnabled ) {
                  thisModel.ballHittingFloorSound.play();
                }

              }
              else {
                ball.phase = PHASE_EXIT;
                ball.updatePegPositionInformation();
                if ( thisModel.isSoundEnabled ) {
                  thisModel.ballHittingFloorSound.play();
                }
                ball.trigger( 'exited' );
                ball.numberOfBalls = thisModel.histogram.bins[ ball.binIndex ];

              }
            }
          }
          if ( ball.phase === PHASE_EXIT ) {
            if ( df + ball.fallenRatio < 7 - 0.5 * ball.numberOfBalls ) {
              ball.fallenRatio += df;
            }
            else {
              ball.phase = PHASE_COLLECTED;
              //this.binIndex = this.column;
              ball.trigger( 'landed' );
            }
          }
          ball.step( dt * 5 );
        } );

      },

      /**
       * Reset of the model attributes.
       * @public
       */
      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.balls.clear();
        this.histogram.reset();
        this.launchedBallsNumber = 0;
        this.resetTimer();

      },
      /**
       * Reset of the Timer to empty listeners.
       * @public
       */
      resetTimer: function() {
        //TODO: Manage memory leak for timerID array. Values do not delete after function call.
        if ( this.timerID ) {

          this.timerID.forEach( function( timerIdElement ) {
            Timer.clearTimeout( timerIdElement );
          } );
          this.timerID = [];
        }
      },


      /**
       * Play function adds balls to the model, the number of balls added depends on the status of ballMode.
       * The function updates the total number of launched balls
       * @private
       */
      play: function() {
        var i = 0;
        var thisModel = this;
        var timerIDnumber;
        switch( this.ballMode ) {
          case 'oneBall':
            if ( this.launchedBallsNumber < MAX_BALL_NUMBER ) {
              this.launchedBallsNumber++;
              this.addNewBall();
            }
            break;

          case 'tenBalls':

            for ( i; (i < 10) && (this.launchedBallsNumber < MAX_BALL_NUMBER); i++ ) {
              this.launchedBallsNumber++;
              timerIDnumber = Timer.setTimeout( function() {
                thisModel.addNewBall();
              }, (i * 500) ); /// measure in milliseconds

              this.timerID.push( timerIDnumber );
            }


            break;

          case 'allBalls':
            for ( i; this.launchedBallsNumber < MAX_BALL_NUMBER; i++ ) {
              this.launchedBallsNumber++;
              timerIDnumber = Timer.setTimeout( function() {
                thisModel.addNewBall();
              }, (i * 300) );
              this.timerID.push( timerIDnumber );
            }
            break;

          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + thisModel.galtonBoardRadioButton );

        }
      },

      /**
       * Add a new Ball to the model
       * @private
       */
      addNewBall: function() {
        var thisModel = this;
        var addedBall = new Ball( this.probability, this.numberOfRows );
        this.balls.push( addedBall );
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
          addedBall.numberOfBalls = thisModel.histogram.bins[ addedBall.binIndex ];
          if ( thisModel.isSoundEnabled ) {
            thisModel.ballHittingFloorSound.play();
          }
        } );

      },


      /**
       * Function that returns the theoretical average of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalAverage: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return numberOfRows * probability;
      },

      /**
       * Function that calculates the theoretical standard deviation of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return Math.sqrt( numberOfRows * probability * (1 - probability) );
      },

      /**
       * Function that calculates the theoretical standard deviation of the mean for the current value of number of balls
       * It returns a string if there is not a single particle on the board
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number||string}
       */
      getTheoreticalStandardDeviationOfMean: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );

        if ( this.landedBallsNumber > 0 ) {
          return Math.sqrt( numberOfRows * probability * (1 - probability ) / this.landedBallsNumber );
        }
        else {
          return 'Not A Number';
        }
      },

      /**
       * Function that returns the binomial coefficient, equivalent to (in Latex) ${n\choose k}$
       * usually expressed as "n choose k". It is the coefficient of the x^k term in the polynomial
       * expansion of the binomial power (1 + x)^n. It is related to the Pascal triangle.
       *
       * see http://en.wikipedia.org/wiki/Binomial_coefficient
       *
       * @param {number} n - the number of rows
       * @param {number} k - the bin number
       * @returns {number}  "n choose k"= n!/( k! (n-k)!)
       */
      getBinomialCoefficient: function( n, k ) {
        // we want (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
        var coefficient = 1;
        var i;
        for ( i = n - k + 1; i <= n; i++ ) {
          coefficient *= i;
        }
        for ( i = 1; i <= k; i++ ) {
          coefficient /= i;
        }
        return coefficient;
      },

      /**
       * Function that returns the theoretical probability that a ball in in a galton box with 'n' rows (or layers)
       * ends up in the bin number 'k' given the success  probability of every event is 'p'.
       *
       * see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @param {number} n - the number of rows, must be an integer > 0
       * @param {number} k - the bin number - an integer between 0 and n
       * @param {number} p - the success (a.k.a binary) probability, a number between 0 and 1
       * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
       */
      getBinomialProbability: function( n, k, p ) {
        assert && assert( k <= n, 'the bin number, k, ranges from 0 to n' );
        var binomialCoefficient = this.getBinomialCoefficient( n, k );
        var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
        return binomialCoefficient * statisticalWeight;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *
       *  see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @returns {Array.<number>}
       */
      getBinomialDistribution: function() {
        var binomialCoefficientsArray = [];
        var k;
        // let's not try to be clever and let's go forward with the brute force approach
        for ( k = 0; k < this.numberOfRowsProperty.value + 1; k++ ) {
          binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRowsProperty.value, k, this.probability ) );
        }
        return binomialCoefficientsArray;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
       *
       * @returns {Array.<number>}
       */
      getNormalizedBinomialDistribution: function() {
        var binomialCoefficientsArray = this.getBinomialDistribution();
        var maxCoefficient = _.max( binomialCoefficientsArray );
        var normalizedArray = binomialCoefficientsArray.map( function( num ) {
          return num / maxCoefficient;
        } ); // fraction is smaller than one
        return normalizedArray;
      }

    } );
  }
)
;



