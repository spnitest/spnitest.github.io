/********************************************************************************
 This file contains code relating to AI actions. For now, it only contains the
 code that determines which cards the AI will swap.
 ********************************************************************************/


/********************************************************************************
 * Game AI Functions
 ********************************************************************************/

/**********************************************************************
 * Determines which cards in this player's hand should be swapped.
 **/
Player.prototype.decideCardSwap = function() 
{
    // determine the strength of the current hand
    this.hand.determine();
    
    // if the hand is good enough, skip the rest of this
    if (this.hand.strength.value >= eHandStrength.STRAIGHT.value) {
        for (var i = 0; i < this.hand.trade.length; i++) {
            this.hand.trade[i] = false;
        }
        console.log("[decideCardSwap] Hand is good, trading in nothing.");
        return;
    }
    
    // if we have a three-of-a-kind, ditch the other two cards
    if (this.hand.strength == eHandStrength.THREE_OF_A_KIND) {
        for (var i = 0; i < this.hand.cards.length; i++) {
            this.hand.trade[i] = (this.hand.cards[i].rank != this.hand.value[0]);
        }
        console.log("[decideCardSwap] Hand is okay, trading in two cards: " + this.hand.trade);
        return;
    }
    
    // if we have a two-pair, ditch the other card
    if (this.hand.strength === eHandStrength.TWO_PAIR) {
        for (var i = 0; i < this.hand.cards.length; i++) {
            this.hand.trade[i] = (this.hand.cards[i].rank == this.hand.value[2]);
        }
        console.log("[decideCardSwap] Hand is okay, trading in one card: " + this.hand.trade);
        return;
    }
    
    // if we have a pair, ditch the other three cards
    if (this.hand.strength === eHandStrength.PAIR) {
        for (var i = 0; i < this.hand.cards.length; i++) {
            this.hand.trade[i] = (this.hand.cards[i].rank != this.hand.value[0]);
        }
        console.log("[decideCardSwap] Hand is okay, trading in three cards: " + this.hand.trade);
        return;
    }
    
    // if we have high card, think about what we want
    if (this.hand.strength === eHandStrength.HIGH_CARD) {
        // if we are one away from a flush, go for it
        for (var i = 0; i < this.hand.suits.length; i++) {
            if (this.hand.suits[i] === CARDS_PER_HAND - 1) {
                for (var j = 0; j < this.hand.cards.length; j++) {
                    this.hand.trade[j] = (this.hand.cards[j].suit.value != i);
                }
                console.log("[decideCardSwap] Hand is bad, going for a flush: " + this.hand.trade);
                return;
            }
        }
        
        // if we are one away from a straight, go for it
        var count = 0;
        for (var i = this.hand.ranks.length - 1; i > 3; i--) {
            for (var j = 0; j < CARDS_PER_HAND; j++) {
                if (this.hand.ranks[i - j] === 1) {
                    count++;
                }
            }
            
            if (count === CARDS_PER_HAND - 1) {
                // straight potential
                for (var j = 0; j < this.hand.cards.length; j++) {
                    this.hand.trade[j] = ((this.hand.cards[j].rank - 1 > i || this.hand.cards[j].rank - 1 < i - 5) && !(this.hand.cards[j].rank === eRank.ACE && i - 5 <= 0));
                }
                
                console.log("[decideCardSwap] Hand is bad, going for a straight: " + this.hand.trade);
                return;
            }
            
            count = 0;
        }
        
        // otherwise, just keep the highest card
        for (var i = 0; i < this.hand.cards.length; i++) {
            this.hand.trade[i] = (this.hand.cards[i].rank !== this.hand.value[0]);
        }
        console.log("[decideCardSwap] Hand is bad, trading in four cards: " + this.hand.trade);
        return;
    }
    
    console.log("[decideCardSwap] Function was called mistakingly.");
}