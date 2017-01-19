/********************************************************************************
 This file contains most of the operating code for the main game screen. 
 
 Code that directly interacts with the cards and UI will be in the Table class.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/************************************************************
 * An enumeration for the phases of the game.
 **/
var eGamePhase = {
    DEAL     : "Deal",
    AI       : "Wait",
    SWAP     : "Swap",
    REVEAL   : "Reveal",
    RETRIEVE : "Continue",
    STRIP    : "Strip",
    WAIT     : "Wait",
    END      : "The End"
};


/**********************************************************************
 * Constants
 **********************************************************************/

// pseudo game constants
var GAME_DEBUG = true;
var CARD_SUGGEST_MODE = true;
var AUTO_MODE = false;
var AUTO_MODE_TIMER = 200;
var AUTO_HIDE = true;

// ai pseudo constants
var AI_SWAP_DELAY = 1000;
var AI_END_TURN_DELAY = 500;
var AI_STRIP_DELAY = 1000;


/**********************************************************************
 * Global Variables
 **********************************************************************/

// main variables
var gamePhase = eGamePhase.DEAL;
var rankedPlayers = [];
var winners = [];
var bystanders = [];
var losers = [];
var advanceAllowed = true;

// Okay, this one seems complicated but I promise it makes sense.
// The chain of stripping or forfeiting events is a series of 
// highly connected functions. This function is updated by each
// function in the chain to point to the next point in the chain,
// which is called by the next phase of the game.
// The reason for this is avoid checking the strip rule and status
// every time you want to update the behaviours.
var stripChainFunction = null;
var stripChainParameters = [];

// debugging variables
var debugOutcomes = [eOutcome.BYSTANDER, 
                     eOutcome.BYSTANDER, 
                     eOutcome.BYSTANDER, 
                     eOutcome.BYSTANDER, 
                     eOutcome.BYSTANDER];


/**********************************************************************
 * UI Elements
 **********************************************************************/

$advanceButton = $("#game-advance-button");
$cardButtons = [$("#hc1"), $("#hc2"), $("#hc3"), $("#hc4"), $("#hc5")];


/********************************************************************************
 * Game Flow Functions
 ********************************************************************************/

/**********************************************************************
 * Loads and initializes the game screen.
 **/
function loadGameScreen() 
{
    console.log("[loadGameScreen] Game screen is loading...");
    
    // set default state
    autoMode = false;
    allowCardButtons(false);
    allowAdvancement(true);
    
    // attach the shortcut handler
    document.addEventListener('keyup', gameKeyUP, false);
    
    
    console.log("[loadGameScreen] Game screen has loaded");
}

/**********************************************************************
 * Unloads and resets the game screen.
 **/
function unloadGameScreen() 
{
    
}


/********************************************************************************
 * Deal Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the deal phase of the game.
 **/
function executeDealPhase() 
{
    console.log("[executeDealPhase] Deal phase has begun...");
    
    // show the table, if desired
    if (AUTO_HIDE) {
        table.showTable(true);
    }
    
    // unmark all players
    table.clearMarks();
    
    // deal out to all players in the game
    table.deal(finishDealPhase);
    table.showCards(eGroup.HUMAN);
    table.hideCards(eGroup.AI);
}

/**********************************************************************
 * Finishes the deal phase of the game.
 **/
function finishDealPhase() 
{
    console.log("[finishDealPhase] Deal phase is finishing...");
    
    // check the player card suggest
    if (CARD_SUGGEST_MODE) {
        table.players[HUMAN].decideCardSwap();
        table.dullCards(eGroup.HUMAN);
    }
    
    // update behaviour
    setGlobalSituation(eSituation.REVIEW_HAND);
    updateAllBehaviours();
    
    // force advancement
    allowAdvancement(true);
    advanceGame();
}


/********************************************************************************
 * AI Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the AI phase of the game.
 **/
function executeAIPhase() 
{
    console.log("[executeAIPhase] AI phase has begun...");
    
    if (table.players[HUMAN].inGame) {
        // enable the card buttons
        allowCardButtons(true);
    }
        
    // start the AI swap phase
    takeTurn(FIRST_AI);
}

/**********************************************************************
 * Executes an AI turn.
 **/
function takeTurn(turn) 
{
    console.log("[takeTurn] AI " + turn + " is taking their turn...");
    
    if (table.players[turn].inGame) {
        // determine which cards to swap
        table.players[turn].decideCardSwap();
        table.dullCardsSingle(table.players[turn]);
        
        // update behaviour
        // TODO: Set the number of card in the ticket?
        setSingleSituation(eSituation.SWAP_CARDS, table.players[turn]);
        updateBehaviour(table.players[turn]);
    }
    else {
        // update behaviour
        setSingleSituation(eSituation.IDLE_CHATTER, table.players[turn]);
        updateBehaviour(table.players[turn]);
    }
    
    // advance turn
    window.setTimeout(function() {
        advanceTurn(turn);
    }, AI_SWAP_DELAY);
}

/**********************************************************************
 * Advances the turn and checks for the end of the phase.
 **/
function advanceTurn(turn) 
{
    console.log("[advanceTurn] AI " + turn + " is finishing their turn...");
    
    if (table.players[turn].inGame) {
        // swap cards
        table.players[turn].hand.swap(table.deck);
        table.fillCardsSingle(table.players[turn]);
        
        // update behaviour
        setSingleSituation(eSituation.REVIEW_HAND, table.players[turn]);
        updateBehaviour(table.players[turn]);
    }
    else {
        // update behaviour
        setSingleSituation(eSituation.IDLE_CHATTER, table.players[turn]);
        updateBehaviour(table.players[turn]);
    }
    
    // determine if there are more AI to handle
    if (turn + 1 < table.players.length) {
        // take next turn
        window.setTimeout(function() {
            takeTurn(turn + 1);
        }, AI_END_TURN_DELAY);
    }
    else {
        // allow advancement
        allowAdvancement(true);
        
        // if human player is out, force advancement
        if (!table.players[HUMAN].inGame) {
            advanceGame();
        }
    }
}


/********************************************************************************
 * Swap Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the swap phase of the game.
 **/
function executeSwapPhase() 
{
    console.log("[executeSwapPhase] Swap phase has begun...");

    // disable the card buttons
    allowCardButtons(false);
    
    if (table.players[HUMAN].inGame) {
        // swap cards
        table.players[HUMAN].hand.swap(table.deck);
        table.fillCards(eGroup.HUMAN);
        table.showCards(eGroup.HUMAN);
    }
    
    // update behaviour
    setGlobalSituation(eSituation.PRE_REVEAL);
    updateAllBehaviours();
    
    // allow advancement
    allowAdvancement(true);
}


/********************************************************************************
 * Reveal Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the reveal phase of the game.
 **/
function executeRevealPhase() 
{
    console.log("[executeRevealPhase] Reveal phase has begun...");

    // reveal all cards
    table.showCards(eGroup.ALL);
    
    // rank the hands
    rankedPlayers = table.rankHands();
    
    // reorder based on debugging tools
    if (GAME_DEBUG) {
        var temp = [];
        
        for (var i = 0; i < rankedPlayers.length; i++) {
            if (debugOutcomes[rankedPlayers[i].slot] === eOutcome.BYSTANDER) {
                temp.push(rankedPlayers[i]);
            }
        }
        
        for (var i = 0; i < rankedPlayers.length; i++) {
            if (debugOutcomes[rankedPlayers[i].slot] === eOutcome.WINNER) {
                temp.unshift(rankedPlayers[i]);
            }
            else if (debugOutcomes[rankedPlayers[i].slot] === eOutcome.LOSER) {
                temp.push(rankedPlayers[i]);
            }
        }
        
        rankedPlayers = temp;
    }
    
    // update based on strip rule
    switch (table.rule) 
    {
        case eStripRule.LOSER: {
            // update the outcome arrays
            winners = [];
            
            bystanders = [];
            for (var i = 0; i < rankedPlayers.length - 1; i++) {
                bystanders.push(rankedPlayers[i]);
                rankedPlayers[i].outcome = eOutcome.BYSTANDER;
            }
            
            losers = [];
            losers.push(rankedPlayers[rankedPlayers.length - 1]);
            rankedPlayers[rankedPlayers.length - 1].outcome = eOutcome.LOSER;
            
            // mark the winners and losers
            table.setMarks();
            
            // update behaviour
            setTargetedSituation(eSituation.SELF_LOST, 
                                 rankedPlayers[rankedPlayers.length - 1], 
                                 eSituation.OTHER_LOST);
            updateAllBehaviours();
            
            break;
        }
    
            
        // TODO: Adjust all cases below
        case eStripRule.WINNER: {
            table.mark(rankedPlayers[0], eOutcome.WINNER);
            break;
        }
            
        case eStripRule.PARTY: {
            table.mark(rankedPlayers[0], eOutcome.WINNER);
            for (var i = 1; i < rankedPlayers.length; i++) {
                table.mark(rankedPlayers[i], eOutcome.LOSER);
            }
            break;
        }
            
        case eStripRule.SUDDEN: {
            for (var i = 0; i < rankedPlayers.length - 1; i++) {
                table.mark(rankedPlayers[i], eOutcome.BYSTANDER);
            }
            table.mark(rankedPlayers[rankedPlayers.length - 1], eOutcome.LOSER);
            break;
        }
    }
    
    // allow advancement
    allowAdvancement(true);
}


/********************************************************************************
 * Retrieve Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the retrieve phase of the game.
 **/
function executeRetrievePhase() 
{
    console.log("[executeRetrievePhase] Retrieve phase has begun...");

    // retrieve cards
    table.hideCards(eGroup.ALL);
    table.retrieve(finishRetrievePhase);
}

/**********************************************************************
 * Finishes the retrieve phase of the game.
 **/
function finishRetrievePhase() 
{
    console.log("[finishRetrievePhase] Retrieve phase is finishing...");
    
    // hide the table, if desired
    if (AUTO_HIDE) {
        table.showTable(false);
    }

    // determine what to do based on strip rule
    switch (table.rule) 
    {
        case eStripRule.LOSER: {
            if (losers.length === 1) {
                preDetermineLoserMode(losers[0]);
            }
            else {
                console.error("[finishRetrievePhase] LOSER strip rule violation, there are '" + losers.length + "' losers");
            }
            break;
        }
    
            
        // TODO: Adjust all cases below
        case eStripRule.WINNER: {
            break;
        }
            
        case eStripRule.PARTY: {
            break;
        }
            
        case eStripRule.SUDDEN: {
            break;
        }
    }
    
    // update behaviour
    // TODO: Set this up in the wardrobe class (strip or forfeit?)
    //setTargetedSituation(eSituation.SELF_PRE_STRIP, 
    //                     rankedPlayers[rankedPlayers.length - 1], 
    //                     eSituation.OTHER_PRE_STRIP);
    //updateAllBehaviours();
    
    // allow advancement
    allowAdvancement(true);
}


/********************************************************************************
 * Strip Phase Functions
 ********************************************************************************/

/**********************************************************************
 * Executes the strip phase of the game.
 **/
function executeStripPhase() 
{
    console.log("[executeStripPhase] Strip phase has begun...");

    // call the next function in the chain
    if (stripChainFunction !== null) {
        stripChainFunction(stripChainParameters);
    }
    else {
        console.error("[executeStripPhase] Strip chain undetermined");
        return;
    }
    
    
    // TODO: Everything here is temporary and kind of weak
    // TODO: Start by reinforcing this area of the code

    // give the character time to strip
    window.setTimeout(function() {
        finishStripPhase();
    }, AI_STRIP_DELAY);
}

/**********************************************************************
 * Finishes the strip phase of the game.
 **/
function finishStripPhase() {
    console.log("[finishStripPhase] Strip phase is finishing...");
    
    // call the next function in the chain
    if (stripChainFunction !== null) {
        stripChainFunction(stripChainParameters);
    }
    else {
        console.error("[executeStripPhase] Strip chain undetermined");
        return;
    }
    
    // allow advancement
    allowAdvancement(true);
}


/********************************************************************************
 * Game Screen Utility Functions
 ********************************************************************************/

/**********************************************************************
 * Allows or disallows the game to advance to the next phase.
 **/
function allowAdvancement(allow) 
{
    if (AUTO_MODE) {
        // auto mode is on, player cannot manually advance
        console.log("[allowAdvancement] Auto advancing to next phase...");
        
        $advanceButton.attr("disabled", true);
        $advanceButton.html(gamePhase);
        
        if (allow) {
            window.setTimeout(function() {
                advanceGame();
            }, AUTO_MODE_TIMER);
        }
    }
    else {
        // auto mode is off, player can manually advance
        $advanceButton.attr("disabled", !allow);
        $advanceButton.html(gamePhase);
    }
    
    // update the flag
    advanceAllowed = allow;
}

/**********************************************************************
 * Enables or disables the card buttons.
 **/
function allowCardButtons(allow) 
{
    for (var i = 0; i < $cardButtons.length; i++) {
        $cardButtons[i].attr("disabled", !allow);
    }
}


/********************************************************************************
 * Game Screen Player Driven Functions
 ********************************************************************************/

/**********************************************************************
 * The player clicked on one of thier cards.
 **/
function selectCard(card) 
{
    table.players[HUMAN].hand.trade[card] = !table.players[HUMAN].hand.trade[card];
    table.dullCards(eGroup.HUMAN);
}

/**********************************************************************
 * The player clicked on the auto button.
 **/
function toggleAutoMode() 
{
    AUTO_MODE = !AUTO_MODE;
}

/**********************************************************************
 * The player clicked on a winner button.
 **/
function setDebugWinner(player) 
{
    setDebugOutcome(player, eOutcome.WINNER);
}

/**********************************************************************
 * The player clicked on a loser button.
 **/
function setDebugLoser(player) 
{
    setDebugOutcome(player, eOutcome.LOSER);
}

/**********************************************************************
 * Sets the winner and loser debug variables based on the game type.
 **/
function setDebugOutcome(player, outcome) 
{
    // update this player
    if (debugOutcomes[player] != outcome) {
        debugOutcomes[player] = outcome;
    }
    else {
        debugOutcomes[player] = eOutcome.BYSTANDER;
    }
    
    // get the count of players still in the game
    var n = table.getPlayersInGame().length;
    
    // update other players
    switch (table.rule) 
    {
        case eStripRule.LOSER: {
            // there can only be 1 loser
            if (outcome === eOutcome.LOSER) {
                for (var i = 0; i < debugOutcomes.length; i++) {
                    if (i !== player && debugOutcomes[i] === eOutcome.LOSER) {
                        debugOutcomes[i] = eOutcome.BYSTANDER;
                    }
                }
            }
            break;
        }
    
        case eStripRule.WINNER: {
            // there can only be 1 winner
            if (outcome === eOutcome.WINNER) {
                for (var i = 0; i < debugOutcomes.length; i++) {
                    if (i !== player && debugOutcomes[i] === eOutcome.WINNER) {
                        debugOutcomes[i] = eOutcome.BYSTANDER;
                    }
                }
            }
            break;
        }
            
        case eStripRule.PARTY: {
            // there can only be 1 winner
            if (outcome === eOutcome.WINNER) {
                for (var i = 0; i < debugOutcomes.length; i++) {
                    if (i !== player && debugOutcomes[i] === eOutcome.WINNER) {
                        debugOutcomes[i] = eOutcome.BYSTANDER;
                    }
                }
            }
            break;
        }
            
        case eStripRule.SUDDEN: {
            // there can only be 1 loser
            if (outcome === eOutcome.LOSER) {
                for (var i = 0; i < debugOutcomes.length; i++) {
                    if (i !== player && debugOutcomes[i] === eOutcome.LOSER) {
                        debugOutcomes[i] = eOutcome.BYSTANDER;
                    }
                }
            }
            break;
        }
    }
    
    // update the visuals
    for (var i = 0; i < table.players.length; i++) {
        if (debugOutcomes[i] === eOutcome.WINNER) {
            $("#winner-"+i).addClass("active");
        }
        else {
            $("#winner-"+i).removeClass("active");
        }
        
        if (debugOutcomes[i] === eOutcome.LOSER) {
            $("#loser-"+i).addClass("active");
        }
        else {
            $("#loser-"+i).removeClass("active");
        }
    }
}

/**********************************************************************
 * The player clicked on the advance button. This will handle the 
 * current phase of the game by calling the appropriate function.
 **/
function advanceGame() 
{
    console.log("[advanceGame] Advancing to the next game phase...");
    
    // make sure there isn't a double action
    if (!advanceAllowed) {
        console.log("[advanceGame] Blocked double action");
        
        // retry, if in auto mode
        if (AUTO_MODE) {
            window.setTimeout(function() {
                advanceGame();
            }, AUTO_MODE_TIMER);
        }
        
        return; // this action isn't allowed yet
    }
    
    // disable advance until the next phase allows it
    allowAdvancement(false);
    
    // update the forfeit timers
    // TODO: It gets caught at the forced advance between DEAL and AI
    updateForfeits();
    if (forfeitInterrupt) {
        return;
    }
    
    // execute game phase
    switch (gamePhase) 
    {
        case eGamePhase.DEAL: {
            gamePhase = eGamePhase.AI;
            executeDealPhase();
            break;
        }
            
        case eGamePhase.AI: {
            gamePhase = eGamePhase.SWAP;
            executeAIPhase();
            break;
        }
            
        case eGamePhase.SWAP: {
            gamePhase = eGamePhase.REVEAL;
            executeSwapPhase();
            break;
        }
            
        case eGamePhase.REVEAL: {
            gamePhase = eGamePhase.RETRIEVE;
            executeRevealPhase();
            break;
        }
            
        case eGamePhase.RETRIEVE: {
            gamePhase = eGamePhase.STRIP;
            executeRetrievePhase();
            break;
        }
            
        case eGamePhase.STRIP: {
            gamePhase = eGamePhase.DEAL;
            executeStripPhase();
            break;
        }
            
        default: {
            console.error("[advanceGame] Fatal Error: Game is in an undefined state.");
        }
    }
}


/********************************************************************************
 * Game Screen Key Binding Functions
 ********************************************************************************/

/**********************************************************************
 * Binds to the keyboard to handle hotkeys.
 **/
function gameKeyUP(e) 
{
    if (KEYBINDINGS_ENABLED) {
        if (e.keyCode === KEY_SPACE && advanceAllowed) {
            advanceGame();
        }
        else if (e.keyCode === KEY_1 && !$cardButtons[0].prop('disabled')) {
            selectCard(0);
        }
        else if (e.keyCode === KEY_2 && !$cardButtons[1].prop('disabled')) {
            selectCard(1);
        }
        else if (e.keyCode === KEY_3 && !$cardButtons[2].prop('disabled')) {
            selectCard(2);
        }
        else if (e.keyCode === KEY_4 && !$cardButtons[3].prop('disabled')) {
            selectCard(3);
        }
        else if (e.keyCode === KEY_5 && !$cardButtons[4].prop('disabled')) {
            selectCard(4);
        }
    }
}