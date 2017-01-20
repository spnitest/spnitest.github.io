/********************************************************************************
 This file contains the Wardrobe object, which contains information regarding a 
 player's state of dress. 
 
 It is mainly responsible for handling the stripping aspects of the game. It is 
 also allowed to modify the clothing images on the game screen.
 ********************************************************************************/


/********************************************************************************
 * Wardrobe Object
 ********************************************************************************/

/**********************************************************************
 * (Object) A wardrobe full (or empty) of clothes.
 **/
function Wardrobe() 
{
    this.clothes = [];
}

/**********************************************************************
 * Returns the number of articles of clothing are left.
 **/
Wardrobe.prototype.getCount = function ()
{
    return this.clothes.length;
}

/**********************************************************************
 * Returns true/false based on the wardrobe being empty.
 **/
Wardrobe.prototype.isEmpty = function ()
{
    return (this.clothes.length === 0);
}

/**********************************************************************
 * Returns the next article of clohing to be stripped.
 **/
Wardrobe.prototype.getNextArticle = function ()
{
    return this.clothes[this.clothes.length - 1];
}

/**********************************************************************
 * Removes and returns the next article of clothing to be stripped.
 **/
Wardrobe.prototype.removeNextArticle = function () 
{
    var article = this.clothes[this.clothes.length - 1];
    this.clothes.pop();
    return article;
}


/********************************************************************************
 * Loser Mode Stripping Functions
 ********************************************************************************/

/**********************************************************************
 * Starts the stripping chain of events for the LOSER strip mode.
 **/
function preDetermineLoserMode(player)
{
    console.log("[preDetermineLoserMode] '" + player.ID + "' is being determined...");
    
    if (!player.isNaked()) {
        // this player will strip
        if (player.slot != HUMAN) {
            stripChainFunction = stripPlayerLoserMode;
            stripChainParameters = [player];
        }
        // TODO: Handle human player
        
        // update behaviour
        setTargetedSituation(eSituation.SELF_PRE_STRIP, 
                         player, 
                         eSituation.OTHER_PRE_STRIP);
        updateAllBehaviours();
    }
    else if (player.inGame) {
        // this player will forfeit
        player.setLost();
        
        if (player.slot != HUMAN) {
            stripChainFunction = startForfeitLoserMode;
            stripChainParameters = [player];
        }
        // TODO: Handle human player
        
        // update behaviour
        setTargetedSituation(eSituation.SELF_PRE_FORFEIT, 
                         player, 
                         eSituation.OTHER_PRE_FORFEIT);
        updateAllBehaviours();
    }
    else {
        // this shouldn't happen
        console.error("[preDetermineLoserMode] Called on a player that's out of the game");
    }
}

/**********************************************************************
 * Strips this player and updates behaviours.
 **/
function stripPlayerLoserMode(params) 
{
    // fetch parameters
    var player = params[0];
    
    console.log("[stripPlayerLoserMode] '" + player.ID + "' is being stripped");
    
    // strip the player
    var clothing = player.removeNextArticle();
    
    // update the tokens in the parser
    // TODO: Add a function for this somewhere
    clearDialogueTokens();
    makeDialogueToken("clothing-name", clothing.name);
    makeDialogueToken("clothing-proper", clothing.proper);
    
    
    // update behaviour
    setTargetedSituation(eSituation.SELF_STRIP, 
                         player, 
                         eSituation.OTHER_STRIP);
    updateAllBehaviours();
    
    // set up the next function in the chain
    stripChainFunction = postStripLoserMode;
}

/**********************************************************************
 * Handles post strip events and updates behaviours.
 **/
function postStripLoserMode(params) 
{
    // fetch parameters
    var player = params[0];
    
    // update behaviour
    setTargetedSituation(eSituation.SELF_POST_STRIP, 
                         player, 
                         eSituation.OTHER_POST_STRIP);
    updateAllBehaviours();
    
    // end of the chain, clean up
    stripChainFunction = null;
    stripChainParameters = [];
}