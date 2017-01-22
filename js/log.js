/********************************************************************************
 This file contains all of the enumerations and basics required to build a Log,
 which will then be used to find a state in a character's behaviour file.
 
 Logs contain relatively static, long term information. Only one needs to exit 
 and it is held by the Table.
 ********************************************************************************/


/********************************************************************************
 * Log Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) Used to query the XML of an opponent. Most of the info
 * contined in this object is already stored in other classes, but here
 * it is stored in a manor that is easily accesible for the Parser.
 **/
function Log () 
{
    // static information
    this.IDs = [];
    this.names = [];
    this.genders = [];
    
    // major events
    this.chestRevealed = [];
    this.crotchRevealed = [];
    this.firstForfeit = [];
    
    // one major event per gender
    for (var gender in eGender) {
        this.chestRevealed.push(false);
        this.crotchRevealed.push(false);
        this.firstForfeit.push(false);
    }
}