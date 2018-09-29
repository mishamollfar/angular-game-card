import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'agc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  startGame = false;
  tableCards: any [] = [];
  cards: any [] = [];
  previewDeck: any [] = [];
  prew: any [] = [];
  previewCards: any [] = [];
  ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  suits = ['♥', '♦', '♠', '♣'];
  suitColor = {
    '♠': 'black',
    '♣': 'black',
    '♦': 'red',
    '♥': 'red',
  };

  deckOfCards;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
  }

  toStart() {
    this.initCards();
    this.initPreviewCards();
    this.initDeckOfCards();
    this.initTableCards();
    this.startGame = true;
  }

  exitGame() {
    this.clearVariable();
    this.startGame = false;
  }

  initCards() {
    let id = 1;
    for (let i = 0; i < this.suits.length; i++) {
      for (let j = 0; j < this.ranks.length; j++) {
        const card = {
          id: id,
          suit: this.suits[i],
          rank: this.ranks[j],
        };
        this.cards.push(card);
        id++;
      }
    }

    this.shuffleCard();
  }

  initPreviewCards() {
    this.prew = Object.assign([], this.cards.slice(0, 24));
    this.previewDeck = Object.assign([], this.cards.slice(0, 24));
  }

  initTableCards() {
    this.tableCards = Object.assign([], this.cards.slice(24, this.cards.length));
  }

  initDeckOfCards() {
    this.deckOfCards = {
      '♠': [],
      '♣': [],
      '♦': [],
      '♥': [],
    };
  }

  shuffleCard() {
    const newCards: any [] = Object.assign([], this.cards);
    for (let i = 0; i < this.cards.length; i++) {
      const newIndex = Math.floor(Math.random() * this.cards.length) + 1;
      newCards.splice(newIndex, 0, newCards.splice(i, 1)[0]);
    }
    this.cards = newCards;
  }

  clearVariable() {
    this.cards = [];
    this.tableCards = [];
    this.previewCards = [];
    this.deckOfCards = null;
    this.prew = [];
    this.previewDeck = [];
  }

  resetCards() {
    this.clearVariable();
    this.toStart();
  }

  showPreviewCard() {
    if (this.prew.length > 0) {
      this.previewCards = this.prew.splice(0, 3);
    } else {
      this.previewCards = [];
      // this.initPreviewCards();
      this.prew = Object.assign([], this.previewDeck);
    }
    this.cd.detectChanges();
  }

  selectCard(event) {
    if (this.verifyOrderOfCard(event.card)) {
      const selectFinal = Object.assign([], this[event.where]);
      const indexClickedCard = selectFinal.findIndex(item => item.id === event.card.id);
      this.deckOfCards[event.card.suit].push(selectFinal.splice(indexClickedCard, 1)[0]);
      this[event.where] = selectFinal;
    }

    if (event.where === 'previewCards') {
      const indexPreviewDeck = this.previewDeck.findIndex(item => item.id === event.card.id);
      this.previewDeck.splice(indexPreviewDeck, 1);
    }
  }

  verifyOrderOfCard(card) {
    const originIndex = this.ranks.findIndex(item => item === card.rank);
    const deckIndex =  this.deckOfCards[card.suit].length ;

    return originIndex === deckIndex;
  }
}
