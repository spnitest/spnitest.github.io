/********************************************************************************
 This file contains all of the code relating to a player's state. This class is
 created from the Parser class, held by the Player class, and understood by the
 Behave class.
 
 It also contains the very simple token object and related functions.
 ********************************************************************************/


/**********************************************************************
 * Constants
 **********************************************************************/

var TOKEN_SEPERATOR = "~";


/**********************************************************************
 * Global Variables
 **********************************************************************/

// TODO: Make permentant tokens as well, like "human"
var dialogueTokens = [];


/********************************************************************************
 * State Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A single state of an opponent.
 **/
function State()
{
    this.dialogue = "";
    this.image = "";
}

/**********************************************************************
 * Constructs a state from an XML state.
 **/
// TODO: Remove the fucking space between function and (), everywhere
State.prototype.construct = function (state) 
{
    this.dialogue = state.html();
    this.image = state.attr("img");
    
    this.dialogue = replaceDialogueTokens(this.dialogue);
}


/**********************************************************************
 * Token Object and Elements
 **********************************************************************/

/**********************************************************************
 * (Object) A very simple token for replacing string elements.
 **/
function DialogueToken(match, display)
{
    this.match = match;
    this.display = display;
}



/**********************************************************************
 * Token Functions
 **********************************************************************/
// TODO: Consider moving all Token stuff to the Log or Ticket

/**********************************************************************
 * Makes and adds a token.
 **/
function makeDialogueToken(match, display) 
{
    addDialogueToken(new DialogueToken(match, display));
}

/**********************************************************************
 * Adds a token.
 **/
function addDialogueToken(token) 
{
    dialogueTokens.push(token);
}

/**********************************************************************
 * Clears the current tokens.
 **/
function clearDialogueTokens() 
{
    dialogueTokens = [];
}

/**********************************************************************
 * Replaces in the provided dialogue based on the current replace 
 * tokens.
 **/
function replaceDialogueTokens(dialogue) 
{
    for (var i = 0; i < dialogueTokens.length; i++) {
        dialogue = dialogue.replace(new RegExp(TOKEN_SEPERATOR + dialogueTokens[i].match + TOKEN_SEPERATOR, "g"), dialogueTokens[i].display);
    }
    return dialogue;
}