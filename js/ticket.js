/********************************************************************************
 This file contains all of the enumerations and basics required to build a Ticket,
 which will then be used to find a state in a character"s behaviour file.
 
 Tickets contain relatively fluid, short term information, one is held by each 
 Player.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/************************************************************
 * An enumeration for every base dialogue event in the game.
 **/
// TODO: Consider expanding to include all SELF and OTHER possibilities.
var eSituation = {
    // general situations
    START         : "start",         // at the start of the game (not the select screen)
    IDLE_CHATTER  : "idle",          // happens between rounds
    REVIEW_HAND   : "hand",          // after deal and after swap
    SWAP_CARDS    : "swap",          // during AI phase
    PRE_REVEAL    : "pre-reveal",    // just before the reveal phase
    
    // situations about this player
    SELF_LOST           : "self-lost",          // during reveal phase
    SELF_PRE_STRIP      : "self-pre-strip",     // during strip phase
    SELF_STRIP          : "self-strip",         // during strip phase
    SELF_POST_STRIP     : "self-post-strip",    // after a strip
    SELF_PRE_FORFEIT    : "self-pre-forfeit",   // during reveal phase
    SELF_START_FORFEIT  : "self-start-forfeit", // when a forfeit starts
    SELF_POST_START_FORFEIT   : "self-post-start-forfeit",   // after the start of the forfeit
    SELF_FORFEIT        : "self-forfeit",       // during forfeit process
    SELF_FORFEIT_END    : "self-forfeit-end",   // at the end of the forfeit process
    SELF_POST_FORFEIT   : "self-post-forfeit",  // just after forfeit ends
    
    // situations about other players
    OTHER_LOST          : "other-lost",          // during reveal phase
    OTHER_PRE_STRIP     : "other-pre-strip",     // during strip phase
    OTHER_STRIP         : "other-strip",         // during strip phase
    OTHER_POST_STRIP    : "other-post-strip",    // after a strip
    OTHER_PRE_FORFEIT   : "other-pre-forfeit",   // during reveal phase
    OTHER_START_FORFEIT : "other-start-forfeit", // when a forfeit starts
    OTHER_POST_START_FORFEIT  : "other-post-start-forfeit",  // after the start of the forfeit
    OTHER_FORFEIT       : "other-forfeit",       // during forfeit process
    OTHER_POST_FORFEIT  : "other-post-forfeit",  // just after forfeit ends
    
    // end game situations
    VICTORY       : "victory",       // when the game is won
    DEFEAT        : "defeat"         // when the game is lost
}

/************************************************************
 * An enumeration for simplified hand strength.
 **/
// TODO: Consider replacing with HandStrength and a +/- option
var eHandQuality = {
    GOOD : "good",
    OKAY : "okay",
    BAD  : "bad"
}

/************************************************************
 * An enumeration for relative player state.
 **/
var eRelativeState = {
    WINNING : "winning",
    NORMAL  : "normal",
    LOSING  : "losing",
    LOST    : "lost"
}

/************************************************************
 * An enumeration for player exposure levels.
 **/
// TODO: Consider replacing with or also allowing exact stages
var eExposure = {
    NONE     : "none",
    CHEST    : "chest",
    CROTCH   : "crotch",
    FULL     : "full",
    FORFEIT  : "forfeit",
    SPENT    : "spent"
};


/********************************************************************************
 * Ticket Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) Used to query the XML of an opponent.
 **/
function Ticket() 
{
    // xml shortcuts
    this.behaviour = null;
    this.stage = null;
    
    // always required
    var situation = eSituation.IDLE_CHATTER;
    
    // event conditionals
    var preSwap = true;                             // only during REVIEW_HAND
    var handQuality = eHandQuality.OKAY;            // only during REVIEW_HAND and SWAP_CARDS
    var swappedCards = 0;                           // only during SWAP_CARDS
    
    // TODO: Add the number of cards being swapped as an option
    //var clothingPos = eClothingPosition.OTHER;      // only during OTHER_(strip)
    //var clothingType = eClothingType.ACCESSORY;     // only during OTHER_(strip)
    var newExposure = eExposure.NONE;               // only during OTHER_(strip)
    
    // other character additionals, in order of priority
    // TODO: Add a priority setting to the behaviour file for each case
    // TODO: All of this stuff (except target) is probably going to the Log
    var target = 0;                 // matches with IDs, the ID of the character affected
    var IDs = [];                   // a list of other character IDs in the game
    // TODO: Consider adding otherStages, with a +/- option
    var genders = [];               // matches with IDs
    var exposures = [];             // matches with IDs
    var size = [];                  // matches with IDs
    var otherRealtiveState = [];    // matches with IDs
    
    // other additionals
    var selfRealtiveState = eRelativeState.NORMAL;
}

// TODO: Implement this
Ticket.prototype.reset = function () 
{
    
}