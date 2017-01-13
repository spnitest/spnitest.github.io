/********************************************************************************
 This file contains the Hand object and related information. 
 
 This file should contain no code that directly interacts with the UI, that code 
 belongs to the Table class.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/**********************************************************************
 * An enumeration for poker hand stength.
 **/
var eHandStrength = {
    NOTHING         : {string: "nothing", value: 0},
    HIGH_CARD       : {string: "high card", value: 1},
    PAIR            : {string: "pair", value: 2},
    TWO_PAIR        : {string: "two pair", value: 3},
    THREE_OF_A_KIND	: {string: "three of a kind", value: 4},
    STRAIGHT        : {string: "straight", value: 5},
    FLUSH           : {string: "flush", value: 6},
    FULL_HOUSE      : {string: "full house", value: 7},
    FOUR_OF_A_KIND  : {string: "four of a kind", value: 8},
    STRAIGHT_FLUSH  : {string: "straight flush", value: 9},
    ROYAL_FLUSH     : {string: "royal flush", value: 10}
};


/**********************************************************************
 * Constants
 **********************************************************************/

var CARDS_PER_HAND = 5;


/********************************************************************************
 * Poker Hand Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A standard poker hand.
 **/
function Hand() 
{
    this.cards = [];
    this.strength = eHandStrength.NOTHING;
    this.value = [];
    this.trade = [];
    this.suits = [];
    this.ranks = [];
    
    for (var i = 0; i < CARDS_PER_HAND; i += 1) {
        this.cards.push(null);
        this.trade.push(false);
    }
    
    for (var suit in eSuit) {
        this.suits.push(0);
    }
    
    for (var rank in eRank) {
        this.ranks.push(0);
    }
    this.ranks.push(0);
}

/**********************************************************************
 * Draws a set number of cards from the provided deck and adds them to
 * this hand, returning any previously held cards.
 **/
Hand.prototype.fullDraw = function(deck) 
{
    // return the current cards
    for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i] !== null) {
            deck.returnCard(this.cards[i]);
        }
    }
    
    // draw new cards
    for (var i = 0; i < CARDS_PER_HAND; i++) {
        this.cards[i] = deck.drawCard();
    }
    
    this.sort();
};

/**********************************************************************
 * Swaps the cards selected in the trade array for new cards from the
 * provided deck.
 **/
Hand.prototype.swap = function(deck) 
{
    // return the traded cards
    for (var i = 0; i < this.cards.length; i++) {
        if (this.trade[i]) {
            deck.returnCard(this.cards[i]);
        }
    }
    
    // draw new cards
    for (var i = 0; i < this.cards.length; i++) {
        if (this.trade[i]) {
            this.cards[i] = deck.drawCard();
        }
    }
    
    this.sort();
};

/**********************************************************************
 * Collects the cards from this player's hand.
 **/
Hand.prototype.collect = function(deck) 
{
    for (var i = 0; i < this.cards.length; i++) {
        deck.returnCard(this.cards[i]);
    }
};

/**********************************************************************
 * Sorts the cards in this card by rank and suit.
 **/
Hand.prototype.sort = function()
{
    for (var i = 0; i < this.cards.length; i++) {
        for (var j = 0; j < this.cards.length - 1 - i; j++) {
            
            // first, sort by rank
            if (this.cards[j].rank < this.cards[j+1].rank) {
                // order is incorrect, swap positions
                var tempCard = this.cards[j];
                this.cards[j] = this.cards[j+1];
                this.cards[j+1] = tempCard;
            }
            else if (this.cards[j].rank === this.cards[j+1].rank) {
                // second, sort by suit
                if (this.cards[j].suit.value < this.cards[j+1].suit.value) {
                    // order is incorrect, swap positions
                    var tempCard = this.cards[j];
                    this.cards[j] = this.cards[j+1];
                    this.cards[j+1] = tempCard;
                }
            }
            
        }
    }
};

/**********************************************************************
 * Updates the array of the ranks of the cards in this hand.
 **/
Hand.prototype.updateRanks = function() 
{
    for (var i = 0; i < this.ranks.length; i++) {
        this.ranks[i] = 0;
    }
    
    for (var i = 0; i < this.cards.length; i++) {
        this.ranks[this.cards[i].rank - 1]++;
    }
    this.ranks[0] = this.ranks[this.ranks.length - 1];
};

/**********************************************************************
 * Updates the array of the suits of the cards in this hand.
 **/
Hand.prototype.updateSuits = function() 
{
    for (var i = 0; i < this.suits.length; i++) {
        this.suits[i] = 0;
    }
    
    for (var i = 0; i < this.cards.length; i++) {
        this.suits[this.cards[i].suit.value]++;
    }
};

/**********************************************************************
 * Determines the strength and value of this hand and records it within
 * the hand object.
 **/
Hand.prototype.determine = function() 
{
    // detection flags
    var pair = {state: false, value: 0};
    var two_pair = {state: false, value: 0};
    var three_kind = {state: false, value: 0};
    var four_kind = {state: false, value: 0};
    var straight = false;
    var flush = false;
    
    // update detection arrays
    this.updateSuits();
    this.updateRanks();
    
    
    // look for multiple rank hands
    for (var i = 1; i < this.ranks.length; i++) {
        if (this.ranks[i] == 4) {
            // four-of-a-kind
            four_kind = {state: true, value: i + 1};
        }
        else if (this.ranks[i] == 3) {
            // three-of-a-kind
            three_kind = {state: true, value: i + 1};
        }
        else if (this.ranks[i] == 2) {
            if (!pair.state) {
                // pair
                pair = {state: true, value: i + 1};
            }
            else {
                // two pair
                two_pair = {state: true, value: i + 1};
            }
        }
        
        if (this.ranks[i] > 1) {
            this.ranks[i] = 0;
        }
    }
    
    // look for straights and flushes
    if (!pair.state && !two_pair.state && !three_kind.state && !four_kind.state) {
        for (var i = 0; i < this.suits.length; i++) {
            if (this.suits[i] == 5) {
                // flush 
                flush = true;
                break;
            }
        }
        
        var sequence = 0;
        for (var i = 0; i < this.ranks.length; i++) {
            if (this.ranks[i] == 1) {
                sequence++;
            }
            else {
                sequence = 0;
            }
            
            if (sequence >= 5) {
                straight = true;
            }
        }
    }
    
    
    // reset the hand strength
    this.strength = eHandStrength.NOTHING;
    this.value = [];
    
    // determine hand strength and value
    if (four_kind.state) {
        this.strength = eHandStrength.FOUR_OF_A_KIND;
        this.value.push(four_kind.value);
    }
    else if (three_kind.state) {
        if (pair.state) {
            this.strength = eHandStrength.FULL_HOUSE;
            this.value.push(three_kind.value);
            this.value.push(pair.value);
        }
        else {
            this.strength = eHandStrength.THREE_OF_A_KIND;
            this.value.push(three_kind.value);
        }
    }
    else if (pair.state) {
        if (two_pair.state) {
            this.strength = eHandStrength.TWO_PAIR;
            this.value.push(two_pair.value);
            this.value.push(pair.value);
        }
        else {
            this.strength = eHandStrength.PAIR;
            this.value.push(pair.value);
        }
    }
    else if (flush) {
        if (straight) {
            this.strength = eHandStrength.STRAIGHT_FLUSH;
        }
        else {
            this.strength = eHandStrength.FLUSH;
        }
    }
    else if (straight) {
        this.strength = eHandStrength.STRAIGHT;
    }
    else {
        this.strength = eHandStrength.HIGH_CARD;
    }
    
    // fill in the missing values
    for (var i = this.ranks.length - 1; i > 0; i--) {
        if (this.ranks[i] > 0) {
            this.value.push(i + 1);
        }
    }
    
    // a fix for straights, the Ace-5 straight
    if (straight && this.value[0] == this.ranks.length - 1 && this.value[1] != this.ranks.length - 2) {
        this.value.shift();
        this.value.push(1);
    }
    
    console.log("[determine] Hand determined as " + this.strength.string + " with values: " + this.value);
}

/**********************************************************************
 * Returns whether another hand is greater than or less than this one.
 * 1 means this hand is better. -1 means the other hand is better.
 * 0 is an unresolvable tie.
 **/
Hand.prototype.compare = function(other) 
{
    if (this.strength.value > other.strength.value) {
        return 1;
    }
    else if (this.strength.value < other.strength.value) {
        return -1;
    }
    else {
        // strength tied
        for (var i = 0; i < this.value.length; i++) {
            if (this.value[i] > other.value[i]) {
                return 1;
            }
            else if (this.value[i] < other.value[i]) {
                return -1;
            }
        }
        
        // perfect tie
        var thisCard = 5;
        var otherCard = 5;
        
        for (var i = 0; i < this.cards; i++) {
            if (this.cards[i].rank == this.value[0]) {
                if (this.cards[i].suit.value < thisCard) {
                    thisCard = this.cards[i].suit.value;
                }
            }
            
            if (other.cards[i].rank == other.value[0]) {
                if (other.cards[i].suit.value < otherCard) {
                    otherCard = other.cards[i].suit.value;
                }
            }
        }
        
        if (thisCard > otherCard) {
            return 1;
        }
        else if (thisCard < otherCard) {
            return -1;
        }
        else {
            // unresolvable tie
            console.error("[compare] Encountered unresolvable tie.");
            return 0;
        }
    }
};

/**********************************************************************
 * Prints out the current contents of the hand.
 **/
Hand.prototype.print = function() 
{
    console.log("---------------------");
    console.log("    Hand Contents    ");
    console.log("---------------------");
    for (var i = 0; i < this.cards.length; i++) {
        console.log(i + ": " + this.cards[i].rank + " of " + this.cards[i].suit.short);
    }
    console.log("---------------------");
};