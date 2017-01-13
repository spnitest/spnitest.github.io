/********************************************************************************
 This file contains the Table object and related information. 
 
 Any code that controls the flow of the game screen will be in the Game file.
 Any code that controls playing cards with be in the Card, Hand, and Deck classes.
 Any code that controls the visuals of the players belongs to Player or Behaviour.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/************************************************************
 * An enumeration for stripping rules.
 **/
var eStripRule = {
    LOSER   : "loser",
    WINNER  : "winner",
    PARTY   : "party",
    SUDDEN  : "sudden"
};

/************************************************************
 * An enumeration for the different groups sitting at the
 * table.
 **/
var eGroup = {
    HUMAN  : 0,
    AI     : 1,
    ALL    : 2
};

/************************************************************
 * An enumeration for the different outcomes of a hand.
 **/
var eOutcome = {
    WINNER      : "winner",
    LOSER       : "loser",
    BYSTANDER   : "bystander"
};


/**********************************************************************
 * Constants
 **********************************************************************/

// card constants
var CARD_DIR = "img/cards/";
var CARD_EXT = ".png";
var UNKNOWN_CARD = "unknown";
var DULL_CARD = "dull";

// deal related psuedo constants
var DEAL_LOCATION = ["3%", "3%"];
var DEAL_ANIM_TIME = 500;
var DEAL_ANIM_SPACING = 100;


/**********************************************************************
 * Global Variables
 **********************************************************************/

// general status
var gameTableShown = true;

// deal related
var dealEnabled = true;
var dealLock = 0;
var dealCount = 0;


/**********************************************************************
 * UI Elements
 **********************************************************************/

$cardAreas = [$("#player-area"),  
              $("#opp-area-1"),  
              $("#opp-area-2"),  
              $("#opp-area-3"),  
              $("#opp-area-4")];
$labels = [$("#game-player-label"), 
           $("#game-opp-label-1"), 
           $("#game-opp-label-2"), 
           $("#game-opp-label-3"), 
           $("#game-opp-label-4")];
$cardCells = [
    [$("#hc1"),  $("#hc2"),  $("#hc3"),  $("#hc4"),  $("#hc5")],
    [$("#opp1c1"), $("#opp1c2"), $("#opp1c3"), $("#opp1c4"), $("#opp1c5")],
    [$("#opp2c1"), $("#opp2c2"), $("#opp2c3"), $("#opp2c4"), $("#opp2c5")],
    [$("#opp3c1"), $("#opp3c2"), $("#opp3c3"), $("#opp3c4"), $("#opp3c5")],
    [$("#opp4c1"), $("#opp4c2"), $("#opp4c3"), $("#opp4c4"), $("#opp4c5")]
];
$dealCards = [
    [$("#d0c1"),  $("#d0c2"),  $("#d0c3"),  $("#d0c4"),  $("#d0c5")],
    [$("#d1c1"),  $("#d1c2"),  $("#d1c3"),  $("#d1c4"),  $("#d1c5")],
    [$("#d2c1"),  $("#d2c2"),  $("#d2c3"),  $("#d2c4"),  $("#d2c5")],
    [$("#d3c1"),  $("#d3c2"),  $("#d3c3"),  $("#d3c4"),  $("#d3c5")],
    [$("#d4c1"),  $("#d4c2"),  $("#d4c3"),  $("#d4c4"),  $("#d4c5")]
];
$deckArea = $("#deck-area");
$deckCard = $("#deck-card");
$dockArea = $("#dock-area");


/********************************************************************************
 * Poker Table Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A poker table and everything involved in it.
 **/
function Table() 
{
    this.players = [];
    for (var i = 0; i < 5; i++) {
        this.players.push(new Player()); // TODO: Remove after core is done
        this.players[i].slot = i;
    }
    
    this.deck = new Deck();
    this.deck.shuffle();
    
    this.rule = eStripRule.LOSER;
}

/**********************************************************************
 * Returns an array of the players still in the game.
 **/
Table.prototype.getPlayersInGame = function () 
{
    var playersInGame = [];
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].inGame) {
            playersInGame.push(this.players[i]);
        }
    }
    return playersInGame;
};

/**********************************************************************
 * Deals cards out to all players still in the game.
 **/
Table.prototype.deal = function (callbackMethod) 
{
    // set state
    dealLock = CARDS_PER_HAND * this.getPlayersInGame().length;
    dealCount = 0;
    
    // get new hands for each player still in the game
    for (var i = 0; i < table.players.length; i++) {
        if (table.players[i].inGame) {
            table.players[i].hand.fullDraw(table.deck);
        }
    }
    
    // animate the cards
    for (var i = 0; i < table.players.length; i++) {
        if (table.players[i].inGame) {
            for (var j = 0; j < $cardCells[table.players[i].slot].length; j++) {
                helpAnimateCard(table.players[i].slot, j, true, callbackMethod);
            }
        }
    }
};

/**********************************************************************
 * Animates taking back the cards from all players still in the game.
 **/
Table.prototype.retrieve = function (callbackMethod) 
{
    // set state
    dealLock = CARDS_PER_HAND * this.getPlayersInGame().length;
    dealCount = 0;
    
    // animate the cards
    for (var i = 0; i < table.players.length; i++) {
        if (table.players[i].inGame) {
            for (var j = 0; j < $cardCells[table.players[i].slot].length; j++) {
                helpAnimateCard(table.players[i].slot, j, false, callbackMethod);
            }
        }
    }
};

/**********************************************************************
 * Shows the cards of the chosen player.
 **/
Table.prototype.showCardsSingle = function (player) 
{
    for (var card = 0; card < player.hand.cards.length; card++) {
        $cardCells[player.slot][card].attr('src', CARD_DIR + player.hand.cards[card].suit.short + player.hand.cards[card].rank + CARD_EXT);
    }
};

/**********************************************************************
 * Shows the cards of the chosen group.
 **/
Table.prototype.showCards = function (group)
{
    if (group == eGroup.ALL || group == eGroup.HUMAN) {
        if (this.players[HUMAN].inGame) {
            this.showCardsSingle(this.players[HUMAN]);
        }
    }
    
    if (group == eGroup.ALL || group == eGroup.AI) {
        for (var i = FIRST_AI; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                this.showCardsSingle(this.players[i]);
            }
        }
    }
};

/**********************************************************************
 * Hides the cards of the chosen player.
 **/
Table.prototype.hideCardsSingle = function (player) 
{
    for (var card = 0; card < player.hand.cards.length; card++) {
        $cardCells[player.slot][card].attr('src', CARD_DIR + UNKNOWN_CARD + CARD_EXT);
    }
};

/**********************************************************************
 * Hides the cards of the chosen group.
 **/
Table.prototype.hideCards = function (group)
{
    if (group == eGroup.ALL || group == eGroup.HUMAN) {
        if (this.players[HUMAN].inGame) {
            this.hideCardsSingle(this.players[HUMAN]);
        }
    }
    
    if (group == eGroup.ALL || group == eGroup.AI) {
        for (var i = FIRST_AI; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                this.hideCardsSingle(this.players[i]);
            }
        }
    }
};

/**********************************************************************
 * Sets the opacity of the cards that the chosen player is going to
 * trade in.
 **/
Table.prototype.dullCardsSingle = function (player) 
{
    for (var card = 0; card < player.hand.cards.length; card++) {
        if (player.hand.trade[card]) {
            $cardCells[player.slot][card].addClass(DULL_CARD);
        }
        else {
            $cardCells[player.slot][card].removeClass(DULL_CARD);
        }
    }
};

/**********************************************************************
 * Sets the opacity of the cards that the chosen group is going to
 * trade in.
 **/
Table.prototype.dullCards = function (group)
{
    if (group == eGroup.ALL || group == eGroup.HUMAN) {
        if (this.players[HUMAN].inGame) {
            this.dullCardsSingle(this.players[HUMAN]);
        }
    }
    
    if (group == eGroup.ALL || group == eGroup.AI) {
        for (var i = FIRST_AI; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                this.dullCardsSingle(this.players[i]);
            }
        }
    }
};

/**********************************************************************
 * Returns all cards in the chosen player's hand to normal opacity.
 **/
Table.prototype.fillCardsSingle = function (player) 
{
    for (var card = 0; card < player.hand.cards.length; card++) {
        $cardCells[player.slot][card].removeClass(DULL_CARD);
    }
};

/**********************************************************************
 * Returns all cards in the chosen group's hands to normal opacity.
 **/
Table.prototype.fillCards = function (group)
{
    if (group == eGroup.ALL || group == eGroup.HUMAN) {
        if (this.players[HUMAN].inGame) {
            this.fillCardsSingle(this.players[HUMAN]);
        }
    }
    
    if (group == eGroup.ALL || group == eGroup.AI) {
        for (var i = FIRST_AI; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                this.fillCardsSingle(this.players[i]);
            }
        }
    }
};

/**********************************************************************
 * Ranks the hands of those players still in the game, and returns an
 * array of players, from best to worst. In the event of a tie, suit
 * will be used to break the tie. In the event of a perfect tie, an
 * error will be presented.
 **/
Table.prototype.rankHands = function () 
{
    var rankedPlayers = [];
    
    // copy the players array
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].inGame) {
            rankedPlayers.push(this.players[i]);
        }
    }
    
    // use a classic bubble sort
    for (var i = 0; i < rankedPlayers.length; i++) {
        for (var j = 0; j < rankedPlayers.length - 1 - i; j++) {
            
            if (rankedPlayers[j].hand.compare(rankedPlayers[j+1].hand) < 0) {
                // order is incorrect, swap positions
                var tempPlayer = rankedPlayers[j];
                rankedPlayers[j] = rankedPlayers[j+1];
                rankedPlayers[j+1] = tempPlayer;
            }
            else if (rankedPlayers[j].hand.compare(rankedPlayers[j+1].hand) === 0) {
                // unresolvable tie
                // TODO: Do something about this
                console.error("[rankHands] The game has encountered a very rare, unresolvable tie.");
            }
            
        }
    }
    
    return rankedPlayers;
};

/**********************************************************************
 * Marks the chosen player's label as a winner, loser, or bystander.
 **/
Table.prototype.mark = function (player, outcome) 
{
    $labels[player.slot].addClass(outcome);
};

/**********************************************************************
 * Removes any mark on the chosen player's label.
 **/
Table.prototype.unmark = function (player) 
{
    for (var outcome in eOutcome) {
        $labels[player.slot].removeClass(eOutcome[outcome]);
    }
};

/**********************************************************************
 * Removes all marks from all players.
 **/
Table.prototype.clearMarks = function () 
{
    for (var i = 0; i < this.players.length; i++) {
        this.unmark(this.players[i]);
    }
};

/**********************************************************************
 * Forces the visual state of the table.
 **/
Table.prototype.showTable = function (state)
{
    gameTableShown = state;
    
    if (gameTableShown) {
        // show the table
        $dockArea.fadeIn();
        
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                $cardAreas[this.players[i].slot].fadeIn();
            }
        }
        
        dealEnabled = true;
    }
    else {
        // hide the table
        $dockArea.fadeOut();
        
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].inGame) {
                $cardAreas[this.players[i].slot].fadeOut();
            }
        }
        
        dealEnabled = false;
    }
}


/********************************************************************************
 * Utility and Helper Functions
 ********************************************************************************/

/**********************************************************************
 * Only exists to create local variables. Seriously, because otherwise
 * the loop counters get incremented after the timeout calls are set
 * and then no one is happy.
 **/
function helpAnimateCard (row, card, dealing, callbackMethod) 
{
    if (dealing) {
        window.setTimeout(function () {
            this.animateCardOut(row, card, callbackMethod);
        }, DEAL_ANIM_SPACING * dealCount);
        dealCount += 1;
    }
    else {
        window.setTimeout(function () {
            this.animateCardIn(row, card, callbackMethod);
        }, DEAL_ANIM_SPACING * dealCount);
    }
}

/**********************************************************************
 * Animates a card from the deck to a player's hand.
 **/
function animateCardOut (row, card, callbackMethod) 
{    
    // get targets
    var top = $cardCells[row][card].offset().top - $deckArea.offset().top;
    var left = $cardCells[row][card].offset().left - $deckArea.offset().left;
    var width = $cardCells[row][card].width();
    var height = $cardCells[row][card].height();
    
    // execute animation
    if (dealEnabled) {
        $dealCards[row][card].removeClass("clear");
    }
    
    $dealCards[row][card].animate({top:top, left:left, width:width, height:height}, 
                                  DEAL_ANIM_TIME, 
        function() {
            $dealCards[row][card].addClass("clear");
            $cardCells[row][card].removeClass("clear");
        
            dealLock -= 1;
            if (dealLock === 0) {
                callbackMethod();
            }
        });
}

/**********************************************************************
 * Animates a card from the player's hand to the deck.
 **/
function animateCardIn (row, card, callbackMethod) 
{
    // set start, if possible
    if (dealEnabled) {
        $dealCards[row][card].css({"top": $cardCells[row][card].offset().top - $deckArea.offset().top});
        $dealCards[row][card].css({"left": $cardCells[row][card].offset().left - $deckArea.offset().left});
        $dealCards[row][card].css({"width": $cardCells[row][card].width()});
        $dealCards[row][card].css({"height": $cardCells[row][card].height()});
    }
    
    // get targets
    var width = $deckCard.width();
    var height = $deckCard.height();
    
    // execute animation
    if (dealEnabled) {
        $dealCards[row][card].removeClass("clear");
    }
    $cardCells[row][card].addClass("clear");
    
    $dealCards[row][card].animate({top:DEAL_LOCATION[0], left:DEAL_LOCATION[1], width:width, height:height}, 
                                  DEAL_ANIM_TIME, 
        function() {
            $dealCards[row][card].addClass("clear");
        });
    
    // check lock (before animation ends)
    dealLock -= 1;
    if (dealLock === 0) {
        callbackMethod();
    }
}


/********************************************************************************
 * Player Driven Functions
 ********************************************************************************/

/**********************************************************************
 * The player clicked on the hide button.
 **/
function toggleGameTable() 
{
    table.showTable(!gameTableShown);
}
