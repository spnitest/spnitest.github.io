/********************************************************************************
 This file contains all of the code needed to update each opponent's visual state
 on the game screen. 
 
 This file should not contain any code that loads or parses XML, that belongs in
 the Parser file.
 ********************************************************************************/


/**********************************************************************
 * UI Elements
 **********************************************************************/

$dialogues = [$("#game-dialogue-1"),  
              $("#game-dialogue-2"), 
              $("#game-dialogue-3"), 
              $("#game-dialogue-4")];
$images = [$("#game-image-1"),  
           $("#game-image-2"), 
           $("#game-image-3"), 
           $("#game-image-4")];


/********************************************************************************
 * Update Functions
 ********************************************************************************/
// TODO: Properly implement this stuff

/**********************************************************************
 * Updates the behaviour of the chosen player. Calls the parser then
 * updates the visuals of the chosen player.
 **/
function updateBehaviour(player) 
{
    findXMLState(player, null);
    
    $dialogues[player.slot - 1].html(player.state.dialogue);
    $images[player.slot - 1].attr("src", OPP_DIR + player.ID + player.state.image);
}

/**********************************************************************
 * Updates the behaviour of all players.
 **/
function updateAllBehaviours() 
{
    for (var i = FIRST_AI; i < table.players.length; i++) {
        updateBehaviour(table.players[i]);
    }
}

// TODO: When situation is updated, clear the parser tokens?

/**********************************************************************
 * Sets the situation for the chosen player.
 **/
function setSingleSituation(situation, player) {
    player.ticket.situation = situation;
}

/**********************************************************************
 * Sets the situation for all players to be the chosen situation.
 **/
function setGlobalSituation(situation) {
    for (var i = FIRST_AI; i < table.players.length; i++) {
        table.players[i].ticket.situation = situation;
    }
}

/**********************************************************************
 * Sets the situation for the chosen player to be the chosen situation,
 * and the alternate situation for all other players.
 **/
function setTargetedSituation(situation, player, altSituation) {
    for (var i = FIRST_AI; i < table.players.length; i++) {
        table.players[i].ticket.situation = altSituation;
    }
    player.ticket.situation = situation;
}