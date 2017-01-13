/********************************************************************************
 This file contains the Card object and related information. 
 
 This file should contain no code that directly interacts with the UI, that code 
 belongs to the Table class.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/**********************************************************************
 * An enumeration for playing card suit.
 **/
var eSuit = {
    SPADES   : {short: "spade", value: 0},
    HEARTS   : {short: "heart", value: 1},
    CLUBS    : {short: "clubs", value: 2},
    DIAMONDS : {short: "diamo", value: 3}
};

/**********************************************************************
 * An enumeration for playing card ranks/values.
 **/
var eRank = {
    TWO     : 2,
    THREE   : 3,
    FOUR    : 4,
    FIVE    : 5,
    SIX     : 6,
    SEVEN   : 7,
    EIGHT   : 8,
    NINE    : 9,
    TEN     : 10,
    JACK    : 11,
    QUEEN   : 12,
    KING    : 13,
    ACE     : 14
};


/********************************************************************************
 * Playing Card Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A standard playing card, with a suit and rank.
 **/
function Card(suit, rank) 
{
    this.suit = suit;
    this.rank = rank;
}