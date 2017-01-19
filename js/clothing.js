/********************************************************************************
 This file contains the Clothing object, which contains information concerning
 articles of clothing.
 ********************************************************************************/


/**********************************************************************
 * Enumerations
 **********************************************************************/

/************************************************************
 * An enumeration for clothing position.
 **/
var eClothingPosition = {
    HEAD  : "head",
    CHEST : "chest",
    ARMS  : "arms",
    WAIST : "waist",
    FEET  : "feet"
};

/************************************************************
 * An enumeration for clothing type.
 **/
var eClothingType = {
    FINAL : "final",
    MAJOR : "major",
    MINOR : "minor",
    EXTRA : "extra"
};


/********************************************************************************
 * Clothing Object
 ********************************************************************************/

/**********************************************************************
 * (Object) An article of clothing. Image is optional, used for human
 * player"s clothing.
 **/
function Clothing(name, proper, position, type, image) 
{
    this.name = name;
    this.proper = proper;
    this.position = position;
    this.type = type;
    
    this.image = image;
}