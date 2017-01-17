/********************************************************************************
 This file contains the code that forms the core of the game. Anything that is
 needed all over the place or applies to the game in general belongs here.
 ********************************************************************************/

/**********************************************************************
 * Game Wide Constants
 **********************************************************************/

// general constants
var DEBUG = true;
var KEYBINDINGS_ENABLED = true;

// directory constants
var OPP_DIR = "opp/";

// screen constants
var BASE_SCREEN_WIDTH = 1000;
var BASE_FONT_SIZE = 14;
var BASE_BORDER_SIZE = 2

// positional constants
var HUMAN = 0;
var FIRST_AI = 1;

// keyboard constants
var KEY_SPACE = 32;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;


/**********************************************************************
 * Game Wide Global Variables
 **********************************************************************/

var table = new Table();


/********************************************************************************
 * Game Wide Utility Functions
 ********************************************************************************/

/**********************************************************************
 * Returns a random number in a range.
 **/
function getRandomNumber (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

/**********************************************************************
 * Returns the width of the visible screen in pixels.
 **/
function getScreenWidth () 
{
	// fetch all screens
	var screens = document.getElementsByClassName("screen");
	
	// figure out which screen is visible
	for (var i = 0; i < screens.length; i++) {
		if (screens[i].offsetWidth > 0) {
			// this screen is currently visible
			return screens[i].offsetWidth;
		}
	}
}

/**********************************************************************
 * Automatically adjusts the size of elements based on screen width.
 **/
function autoResize () 
{
	// resize elements
	var screenWidth = getScreenWidth();
	document.body.style.fontSize = (BASE_FONT_SIZE*(screenWidth/BASE_SCREEN_WIDTH))+"px";
    $(".trimmed").css({"border-width" : (BASE_BORDER_SIZE*(screenWidth/BASE_SCREEN_WIDTH))+"px"});
    
	// set up future resizing
	window.onresize = autoResize;
}


/********************************************************************************
 * Game Wide Player Driven Functions
 ********************************************************************************/

/**********************************************************************
 * The very first function call upon the game being loaded,
 * this loads all of the initial content in the game.
 **/
function initCore () 
{
    // initialization
    // TODO: Implement screens to do this shit
    for (var i = FIRST_AI; i < table.players.length; i++) {
        table.players[i].ID = "testing/";
        loadBehaviour(table.players[i]);
    }
    
    // post initialization
    autoResize();
    console.log("Core initialized");
    
    // TODO: Temporary game launch
    loadGameScreen();
}