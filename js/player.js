/********************************************************************************
 This file contains the Player object and related information.
 
 This file shouldn't contain any UI related code, that belongs in the Table class.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/************************************************************
 * An enumeration for gender.
 **/
var eGender = {
    MALE : "male",
    FEMALE : "female"
};

/************************************************************
 * An enumeration for player size.
 **/
var eSize = {
    SMALL : "small",
    MEDIUM : "medium",
    LARGE : "large"
};


/********************************************************************************
 * Player Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A player in a strip poker game.
 **/
function Player()
{
    // basics
    this.ID = "";           // directory name
    this.inGame = true;
    this.slot = 0;
    this.xml = null;
    
    
    //TODO: TEMPORARY, REPLACE WITH WARDROBE
    this.count = 2; 
    
    
    // behaviour stuff
    this.ticket = new Ticket();
    this.state = new State();
    
    // poker stuff
    this.hand = new Hand();
    this.outcome = eOutcome.BYSTANDER;
}


// TODO: Add some Ticket filling code, which is called from Table