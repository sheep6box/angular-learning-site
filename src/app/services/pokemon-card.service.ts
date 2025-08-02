import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PokemonCard } from '../models/pokemon-card.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonCardService {

  // サンプルデータ（後で実際の画像に差し替え）
  private sampleCards: PokemonCard[] = [
    {
      id: 1,
      name: 'ピカチュウ',
      imageUrl: 'assets/cards/pikachu.jpg',
      type: ['電気'],
      rarity: 'Common',
      set: 'ベースセット',
      cardNumber: '025/102',
      description: 'でんきポケモン'
    },
    {
      id: 2,
      name: 'リザードン',
      imageUrl: 'assets/cards/charizard.jpg',
      type: ['炎'],
      rarity: 'Ultra Rare',
      set: 'ベースセット',
      cardNumber: '006/102',
      description: 'かえんポケモン'
    },
    {
      id: 3,
      name: 'フシギダネ',
      imageUrl: 'assets/cards/bulbasaur.jpg',
      type: ['草'],
      rarity: 'Common',
      set: 'ベースセット',
      cardNumber: '001/102',
      description: 'たねポケモン'
    }
  ];

  constructor() { }

  getCards(): Observable<PokemonCard[]> {
    return of(this.sampleCards);
  }

  getCardById(id: number): Observable<PokemonCard | undefined> {
    const card = this.sampleCards.find(c => c.id === id);
    return of(card);
  }

  filterCards(cards: PokemonCard[], searchTerm: string, types: string[], rarity: string): PokemonCard[] {
    return cards.filter(card => {
      const matchesSearch = !searchTerm ||
        card.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = types.length === 0 ||
        card.type.some(t => types.includes(t));

      const matchesRarity = !rarity || card.rarity === rarity;

      return matchesSearch && matchesType && matchesRarity;
    });
  }
}
