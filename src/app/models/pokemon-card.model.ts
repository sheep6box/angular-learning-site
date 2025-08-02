export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string;
  type: string[];
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Secret Rare';
  set: string;
  cardNumber: string;
  description?: string;
}

export interface CardFilter {
  searchTerm: string;
  selectedTypes: string[];
  selectedRarity: string;
}
