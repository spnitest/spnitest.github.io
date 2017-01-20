/********************************************************************************
 This file contains code that manages player forfeits. It shouldn't directy
 update behaviour or images, but is allowed to modify small aspects of the game
 screen.
 ********************************************************************************/


/********************************************************************************
 * Constants
 ********************************************************************************/

var AI_FINISH_TIME = 5000;


/********************************************************************************
 * Global Variables
 ********************************************************************************/

var forfeitPlayers = [];
var forfeitInterrupt = false;


/********************************************************************************
 * Loser Mode Forfeiting Functions
 ********************************************************************************/

/**********************************************************************
 * Makes this player start their forfeit and updates behaviours.
 **/
function startForfeitLoserMode(params) 
{
    // fetch parameters
    var player = params[0];
 
    console.log("[startForfeitLoserMode] '" + player.ID + "' will forfeit");
    
    // add this player to the forfeit roster
    forfeitPlayers.push(player);
    player.firstTimer.current = player.firstTimer.max;
    player.stage += 1;
    player.updateStage();
    
    // update behaviour
    setTargetedSituation(eSituation.SELF_START_FORFEIT, 
                         player,
                         eSituation.OTHER_START_FORFEIT);
    updateAllBehaviours();
    
    // set up the next function in the chain
    stripChainFunction = postStartForfeitLoserMode;
}

/**********************************************************************
 * Handles post start forfeit events and updates behaviours.
 **/
function postStartForfeitLoserMode(params) 
{
    // fetch parameters
    var player = params[0];
    
    // update behaviour
    setTargetedSituation(eSituation.SELF_POST_START_FORFEIT, 
                         player,
                         eSituation.OTHER_POST_START_FORFEIT);
    updateAllBehaviours();
    
    // end of the chain, clean up
    stripChainFunction = null;
    stripChainParameters = [];
}


/********************************************************************************
 * Main Forfeiting Functions
 ********************************************************************************/

/**********************************************************************
 * Updates the timers of all currently forfeiting players, and fires
 * the event if needed.
 **/
function updateForfeits() 
{
    console.log("[updateForfeits] Updating timers...");
    
    // update timers
    for (var i = 0; i < forfeitPlayers.length; i++) {
        if (!forfeitPlayers[i].hasForfeit) {
            // this is their first time this match
            forfeitPlayers[i].firstTimer.current -= 1;
            
            // TODO: Handle human player differently?
            if (forfeitPlayers[i].firstTimer.current <= 0) {
                startEndFirstForfeit(forfeitPlayers[i], i);
            }
        }
        else {
            // this isn't their first time this match
            // TODO: Implement
        }
    }
}

/**********************************************************************
 * Handles the end of a player's forfeit. This will interrupt the game.
 **/
function startEndFirstForfeit(player, index) 
{
    console.log("[startEndFirstForfeit] '" + player.ID + "' is cumming!");
    
    // remove this player from the forfeit roster
    forfeitPlayers.splice(index, 1);
    
    // interrupt
    forfeitInterrupt = true;
    
    // update behaviour
    // TODO: hide all other dialogues
    setSingleSituation(eSituation.SELF_FORFEIT_END, player);
    updateBehaviour(player);
    
    // move them to their new stage
    player.stage += 1;
    player.updateStage();
    
    // give them some time
    window.setTimeout(function() {
        finishEndFirstForfeit(player);
    }, AI_FINISH_TIME);
}

/**********************************************************************
 * Updates behaviour and allows the game to continue.
 **/
function finishEndFirstForfeit(player) 
{
    console.log("[finishEndFirstForfeit] '" + player.ID + "' is done cumming");

    // stop interrupt
    forfeitInterrupt = false;
    allowAdvancement(true);
    
    // update behaviour
    setTargetedSituation(eSituation.SELF_POST_FORFEIT, 
                         player,
                         eSituation.OTHER_POST_FORFEIT);
    updateAllBehaviours();
}