// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the 'Lab' screen
 *
 * @author Martin Veillette (Berea College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import BallPhase from '../../common/model/BallPhase.js';
import PlinkoProbabilityCommonModel from '../../common/model/PlinkoProbabilityCommonModel.js';
import PlinkoProbabilityQueryParameters from '../../common/PlinkoProbabilityQueryParameters.js';
import plinkoProbability from '../../plinkoProbability.js';
import LabBall from './LabBall.js';

// constants
const MAX_BALLS = PlinkoProbabilityQueryParameters.maxBallsLab; // max number of balls *per bin*

/**
 * @constructor
 */
function LabModel() {

  const self = this;

  PlinkoProbabilityCommonModel.call( this );

  // @public
  this.isPlayingProperty = new BooleanProperty( false );

  this.hopperModeProperty.link( function( hopperMode ) {

    // When balls get created, they add themselves to the histogram binCount.
    // So when we clear the balls, we need to remove them from the histogram.
    self.balls.forEach( function( ball ) {
      // Don't remove balls if they have exited the board or landed in a bin
      if ( !( ball.phase === BallPhase.EXITED || ball.phase === BallPhase.COLLECTED ) ) {
        //remove the ball from the binCount
        self.histogram.bins[ ball.binIndex ].binCount--;
      }
    } );

    // remove all the balls
    self.balls.clear(); // clear the balls
  } );

  // @private time we want to pass before we created a new ball
  this.ballCreationTimeInterval = 0;
}

plinkoProbability.register( 'LabModel', LabModel );

inherit( PlinkoProbabilityCommonModel, LabModel, {

  // @public
  reset: function() {
    PlinkoProbabilityCommonModel.prototype.reset.call( this );
    this.isPlayingProperty.reset();
  },

  /**
   * @param {number} dt - time interval
   * @public
   */
  step: function( dt ) {

    // we don't want balls to drop too quickly so we keep track of the interval
    this.ballCreationTimeElapsed += dt;

    // if the play button is pressed and the interval is greater than some interval...
    if ( this.isPlayingProperty.get() && this.ballCreationTimeElapsed > this.ballCreationTimeInterval ) {
      this.addNewBall(); // add a new ball
      this.ballCreationTimeElapsed = 0; // reset the elapsed time
    }

    switch( this.hopperModeProperty.get() ) {

      case 'ball':

        // Move balls
        var ballsMoved = false;
        var dtCapped = Math.min( 0.090, dt * 10 ); // Cap the dt so that the balls don't make a big jump
        this.balls.forEach( function( ball ) {
          const ballMoved = ball.step( dtCapped );
          ballsMoved = ( ballMoved || ballsMoved );
        } );

        // Notify if balls moved
        if ( ballsMoved ) {
          this.ballsMovedEmitter.emit();
        }

        this.ballCreationTimeInterval = 0.100; // 100 milliseconds if we are seeing balls
        break;

      case 'path':
        this.balls.forEach( function( ball ) {
          ball.updateStatisticsAndLand();
        } );
        this.ballCreationTimeInterval = 0.050; // 50 milliseconds if we are seeing paths
        break;

      case 'none':
        this.balls.forEach( function( ball ) {
          ball.updateStatisticsAndLand();
        } );
        this.ballCreationTimeInterval = 0.015; // 15 milliseconds if nothing is being shown
        break;

      default:
        throw new Error( 'invalid hopperMode: ' + this.hopperModeProperty.get() );
    }
  },

  /**
   * Add a new Ball to the model
   *
   * @private
   */
  addNewBall: function() {

    const self = this;

    const addedBall = new LabBall( this.probabilityProperty.get(), this.numberOfRowsProperty.get(), this.histogram.bins );
    this.histogram.bins[ addedBall.binIndex ].binCount++; //update the bin count of the bins
    this.balls.push( addedBall ); // add the ball to the observable array

    if ( self.histogram.getMaximumActualBinCount() >= MAX_BALLS ) {
      self.isBallCapReachedProperty.set( true );
    }

    // ballOutOfPegsEmitter is emitted when the addedBall leaves the last peg on the Galton board.
    addedBall.ballOutOfPegsEmitter.addListener( function ballOutOfPegsListener() {
      self.histogram.addBallToHistogram( addedBall );
      addedBall.ballOutOfPegsEmitter.removeListener( ballOutOfPegsListener );
    } );

    // when the ball lands remove the one that came before it
    addedBall.ballCollectedEmitter.addListener( function removeBallListener() {
      const previousBallIndex = self.balls.indexOf( addedBall ) - 1; // gets the index of the ball before
      if ( previousBallIndex > -1 ) {
        const previousBall = self.balls.get( previousBallIndex ); // gets the last ball object
        self.balls.remove( previousBall ); //removes the previous ball
      }
      addedBall.ballCollectedEmitter.removeListener( removeBallListener );
    } );
  },

  /**
   * Function that returns the theoretical average of the binomial distribution
   *
   * @param {number} numberOfRows - an integer
   * @param {number} probability - ranges from 0 to 1
   * @returns {number}
   * @public
   */
  getTheoreticalAverage: function( numberOfRows, probability ) {
    assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
    return numberOfRows * probability;
  },

  /**
   * Function that calculates the theoretical standard deviation of the binomial distribution
   *
   * @param {number} numberOfRows - an integer
   * @param {number} probability - ranges from 0 to 1
   * @returns {number}
   * @public
   */
  getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
    assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
    return Math.sqrt( numberOfRows * probability * ( 1 - probability ) );
  },

  /**
   * Function that returns the binomial coefficient, equivalent to (in Latex) ${n\choose k}$
   * usually expressed as "n choose k". It is the coefficient of the x^k term in the polynomial
   * expansion of the binomial power (1 + x)^n. It is related to the Pascal triangle.
   * See http://en.wikipedia.org/wiki/Binomial_coefficient
   *
   * @param {number} n - the number of rows
   * @param {number} k - the bin number
   * @returns {number}  "n choose k"= n!/( k! (n-k)!)
   * @private
   */
  getBinomialCoefficient: function( n, k ) {

    // (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
    let coefficient = 1;
    let i;
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
   * See http://en.wikipedia.org/wiki/Binomial_distribution
   *
   * @param {number} n - the number of rows, must be an integer > 0
   * @param {number} k - the bin number - an integer between 0 and n
   * @param {number} p - the success (a.k.a binary) probability, a number between 0 and 1
   * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
   * @private
   */
  getBinomialProbability: function( n, k, p ) {
    assert && assert( k <= n, 'the bin number, k, ranges from 0 to n' );
    const binomialCoefficient = this.getBinomialCoefficient( n, k );
    const statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
    return binomialCoefficient * statisticalWeight;
  },

  /**
   *  Function that returns the theoretical probabilities of the binomial distribution
   *  i.e. P(n,k,p) of a binomial distribution in array form
   *  See http://en.wikipedia.org/wiki/Binomial_distribution
   *
   * @returns {Array.<number>}
   * @private
   */
  getBinomialDistribution: function() {
    const binomialCoefficientsArray = [];
    let k;
    const numberOfRows = this.numberOfRowsProperty.get();
    // let's not try to be clever and let's go forward with the brute force approach
    for ( k = 0; k < numberOfRows + 1; k++ ) {
      binomialCoefficientsArray.push(
        this.getBinomialProbability( numberOfRows, k, this.probabilityProperty.get() ) );
    }
    return binomialCoefficientsArray;
  },

  /**
   *  Function that returns the theoretical probabilities of the binomial distribution
   *  i.e. P(n,k,p) of a binomial distribution in array form
   *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
   *
   * @returns {Array.<number>}
   * @public
   */
  getNormalizedBinomialDistribution: function() {
    const binomialCoefficientsArray = this.getBinomialDistribution();
    const maxCoefficient = _.max( binomialCoefficientsArray );
    const normalizedArray = binomialCoefficientsArray.map( function( num ) {
      return num / maxCoefficient;
    } ); // fraction is smaller than one
    return normalizedArray;
  }
} );

export default LabModel;