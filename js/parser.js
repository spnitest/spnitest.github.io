/********************************************************************************
 This file contains all of the code needed to load and parse character XML files.
 
 This file should not contain any visual updating code, that code belongs in the
 Behave class.
 ********************************************************************************/


/**********************************************************************
 * Loading Functions
 **********************************************************************/

/**********************************************************************
 * Loads the XML of this Player and sets up all of their basic info.
 * TODO: Migrate basic info to the meta file
 **/
function loadBehaviour(player, callbackMethod)
{
    $.ajax({
        type: "GET",
		url: OPP_DIR + player.ID + "behaviour.xml",
		dataType: "text",
		success: function(xml) {
            console.log("[loadBehaviour] Loading behaviour for '" + player.ID + "'");
            
            // save the XML
            player.xml = xml;
            
            // get a reference to the player's behaviour
            player.ticket.behaviour = $(xml).find("behaviour");
            if (player.ticket.behaviour.length === 0) {
                console.error("[findXMLState] Couldn't find the behaviour section for '" + player.ID + "'");
                return;
            }
            
            // TODO: parse the opponent info, to be moved to meta file
            
            // TODO: call the callback
        },
        error: function() {
            console.error("[loadBehaviour] '" + OPP_DIR + player.ID + "behaviour.xml' could not be found!");
        }
    });
}


/**********************************************************************
 * In Game Behaviour Functions
 **********************************************************************/

/**********************************************************************
 * Looks through the XML until it finds a matching state. Returns a
 * fully loaded State object, does not alter the Player or Log.
 **/
function findXMLState(player, log) 
{
    console.log("[findXMLState] Player '" + player.ID + "' is requesting a new state");
    
    // make some shortcuts
    var ticket = player.ticket;
    var xml = player.xml;
    var behaviour = ticket.behaviour;
    // TODO: Add stage shortcut
    
    // sanity check
    if (xml === null || behaviour === null) {
        console.error("[findXMLState] Player '" + player.ID + "' does not have XML loaded");
        return;
    }
    
    // find the correct situation
    var situation = null;
    $(behaviour).find("situation").each(function () {
       if ($(this).attr("id") === ticket.situation) {
           situation = $(this);
       } 
    });
    
    // find the best matching cases with the highest priorities
    var cases = [];
    var priority = 0;
    $(situation).find("case").each(function () {
        
    });
    
    // if no cases were found, or priority is 0, add the default case
    if (cases.length === 0 || priority === 0) {
        var defaultCase = $(situation).find("default");
        
        if (defaultCase.length === 0) {
            console.error("[findXMLState] Player '" + player.ID + "', situation '" + ticket.situation + "' has no default or matching case.");
            return;
        }
        
        cases.push(defaultCase);
    }
    
    // select a case a random from the collected set
    var random = getRandomNumber(0, cases.length);
    
    // TODO: Let State parse the case
    player.state.dialogue = cases[random].html();
}



// TODO: Replace this with that ^
function parserTest(player) 
{
    // make things simpler
    var ticket = player.ticket;
    var xml = player.xml;
    
    console.log("[parserTest] Player requesting dialogue for " + ticket.situation);
    
    // TODO: add some better fucking safety checks
    if (xml === null) {
        return;
    }
    
    // find the behaviour section
    var behaviour = $(xml).find("behaviour");
    if (!behaviour) {
        console.error("[parserTest] Couldn't find the behaviour section for '" + player.ID + "'");
        return;
    }
    
    // find a case with a matching situation
    $(xml).find("case").each(function () {
        if ($(this).attr("situation") === ticket.situation) {
            // TODO: move this code to State and let it parse it
            // it has to do something other than just sit there
            // also remember that STATES not CASES should be sent
            player.state.dialogue = $(this).html();
            player.state.image = $(this).attr("img");
        }                     
    });
}
