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
    this.slot = 0;
    this.inGame = true;
    this.hasForfeit = false;   // set after first forfeit has ended
    this.xml = null;
    
    // player info
    this.name = "";
    this.gender = eGender.FEMALE;

    // behaviour stuff
    this.stage = 0;
    this.ticket = new Ticket();
    this.state = new State();
    this.wardrobe = new Wardrobe();
    
    // poker stuff
    this.hand = new Hand();
    this.outcome = eOutcome.BYSTANDER;
    
    // forfeit stuff
    this.firstTimer = {max: 20, current: 0};
    this.repeatTimer = {max: 30, current: 0};
}


// TODO: Add some Ticket filling code, which is called from Table


/**********************************************************************
 * Removes and returns the next article of clothing to be stripped.
 **/
Player.prototype.isNaked = function () 
{
    return this.wardrobe.isEmpty();
}

/**********************************************************************
 * Removes and returns the next article of clothing to be stripped.
 **/
Player.prototype.removeNextArticle = function () 
{
    this.stage += 1;
    this.updateStage();
    
    // return the article of clothing
    return this.wardrobe.removeNextArticle();
}

/**********************************************************************
 * Updates the player's stage reference.
 **/
Player.prototype.updateStage = function() 
{
    var player = this;
    $(this.ticket.behaviour).find("stage").each(function () {
       if ($(this).attr("id") === ("" + player.stage)) {
           player.ticket.stage = $(this);
           return;
       } 
    });
    if (!this.ticket.stage) {
        console.error("[removeNextArticle] Couldn't find stage " + stage + " for '" + player.ID + "'");
        return;
    }
}

/**********************************************************************
 * Sets the player to be out of the game.
 **/
Player.prototype.setLost = function () 
{
    this.inGame = false;
    this.hand.collect(table.deck);
}
