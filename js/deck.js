/********************************************************************************
 This file contains the Deck object and related information. 
 
 This file should contain no code that directly interacts with the UI, that code 
 belongs to the Table class.
 ********************************************************************************/


/********************************************************************************
 * Playing Card Deck Object and Elements
 ********************************************************************************/

/**********************************************************************
 * (Object) A standard playing card deck of 52 cards.
 **/
function Deck() 
{
    this.in = [];
    this.out = [];
    
    for (var suit in eSuit) {
        for (var rank in eRank) {
            this.in.push(new Card(eSuit[suit], eRank[rank]));
        }
    }
}

/**********************************************************************
 * Randomly shuffles the deck.
 **/
Deck.prototype.shuffle = function() 
{
    var temp, random;
    
    // move all cards into the 'in' pile
    for (var i = 0; i < this.out.length; i += 1) {
        this.in.push(this.out[i]);
    }
    this.out = [];
    
    // randomly shuffle
    for (var i = this.in.length - 1; i !== 0; i -= 1) {
        random = Math.floor(Math.random() * i);

        temp = this.in[i];
        this.in[i] = this.in[random];
        this.in[random] = temp;
    }
};

/**********************************************************************
 * Draws and returns the top card off of the deck, will shuffle the
 * deck if there are no available cards.
 **/
Deck.prototype.drawCard = function() 
{
    if (this.in.length <= 0) {
        this.shuffle();
    }

    return this.in.pop();
};

/**********************************************************************
 * Returns a card to the deck, if not done then the missing card will
 * never be drawn again from this deck.
 **/
Deck.prototype.returnCard = function(card) 
{
    this.out.push(card);
};

/**********************************************************************
 * Prints out the current contents of the deck.
 **/
Deck.prototype.print = function() 
{
    console.log("--------------------- ---------------------");
    console.log("    in         Deck Contents       out     ");
    console.log("--------------------- ---------------------");
    
    var debug = "";
    for (var i = 0; i < this.in.length || i < this.out.length; i += 1) {
        if (i < this.in.length) {
            debug = this.in[i].rank + " of " + this.in[i].suit.short;
        }

        debug = (debug + "                      ").substring(0, 22);
        
        if (i < this.out.length) {
            debug += this.out[i].rank + " of " + this.out[i].suit.short;
        }
        
        console.log(debug);
    }
    
    console.log("---------- ---------- ---------- ----------");
};