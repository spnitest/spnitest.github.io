/********************************************************************************
 This file contains all of the code needed to load and parse character XML files.
 
 This file should not contain any visual updating code, that code belongs in the
 Behave class.
 ********************************************************************************/


 // TODO: Migrate basic info to the meta file

/**********************************************************************
 * Loading Functions
 **********************************************************************/

/**********************************************************************
 * Loads the XML of this Player and sets up all of their basic info.
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
                console.error("[loadBehaviour] Couldn't find the behaviour section for '" + player.ID + "'");
                return;
            }
            
            // get a reference to the first stage for this player
            $(player.ticket.behaviour).find("stage").each(function () {
               if ($(this).attr("id") === "0") {
                   player.ticket.stage = $(this);
                   return;
               } 
            });
            if (!player.ticket.stage) {
                console.error("[loadBehaviour] Couldn't find stage 0 for '" + player.ID + "'");
                return;
            }
            
            // parse the wardrobe
            loadWardrobe(player, xml);
            
            // TODO: call the callback
        },
        error: function() {
            console.error("[loadBehaviour] '" + OPP_DIR + player.ID + "behaviour.xml' could not be found!");
        }
    });
}

/**********************************************************************
 * Loads the wardrobe of this player from XML.
 **/
function loadWardrobe(player, xml) 
{
    var wardrobe = $(xml).find("wardrobe");
    if (wardrobe.length === 0) {
        console.error("[loadWardrobe] Couldn't find the wardrobe section for '" + player.ID + "'");
        return;
    }
    else {
        $(wardrobe).find("article").each(function () {
            var name = $(this).attr("name");
            var proper = $(this).attr("proper");
            var position = $(this).attr("position");
            var type = $(this).attr("reveal");
            
            // TODO: Add a basic check and error message
            var clothing = new Clothing(name, proper, position, type);
            
            player.wardrobe.clothes.unshift(clothing);
        });
    }
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
    console.log("[findXMLState] Player '" + player.ID + "' is requesting state for '" + player.ticket.situation + "'");
    
    // make some shortcuts
    var ticket = player.ticket;
    var xml = player.xml;
    var behaviour = ticket.behaviour;
    var stage = ticket.stage;
    
    // sanity check
    if (xml === null || behaviour === null || stage === null) {
        console.error("[findXMLState] Player '" + player.ID + "' does not have XML loaded");
        return;
    }
    
    // find the correct situation
    var situation = null;
    $(stage).find("situation").each(function () {
       if ($(this).attr("id") === ticket.situation) {
           situation = $(this);
       } 
    });
    
    // quick check for completeness
    if (situation === null) {
        console.error("[findXMLState] Player '" + player.ID + "', is missing situation for '" + ticket.situation + "'");
        return;
    }
    
    // find the best matching cases with the highest priorities
    var cases = collectCases(situation, ticket);

    // if no cases were found, or priority is 0, add the default case
    if (cases.length === 0 || priority === 0) {
        var defaultCase = $(situation).find("default");
        
        if (defaultCase.length === 0) {
            console.error("[findXMLState] Player '" + player.ID + "', situation '" + ticket.situation + "' has no default or matching case");
            return;
        }
        
        cases.push(defaultCase);
    }
    
    // select a case a random from the collected set
    var random = getRandomNumber(0, cases.length);
    
    // let state parse the case
    player.state.construct(cases[random]);
}

/**********************************************************************
 * Collects and returns a set of cases based on the provided data.
 **/
function collectCases(situation, ticket) 
{
    var cases = [];
    var priority = 0;
    
    $(situation).find("case").each(function () {
        // TODO: Implement
        // TODO: First get cases with data specific to this situation
        // TODO: Then expand to the general data
    });
    
    return cases;
}