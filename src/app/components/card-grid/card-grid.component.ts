import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PokemonCard, CardFilter } from '../../models/pokemon-card.model';
import { PokemonCardService } from '../../services/pokemon-card.service';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <!-- フィルター部分 -->
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filter-row">
            <mat-form-field appearance="outline">
              <mat-label>カード名で検索</mat-label>
              <input matInput [(ngModel)]="filter.searchTerm" (input)="applyFilters()" placeholder="ピカチュウ">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>レアリティ</mat-label>
              <mat-select [(ngModel)]="filter.selectedRarity" (selectionChange)="applyFilters()">
                <mat-option value="">すべて</mat-option>
                <mat-option value="Common">Common</mat-option>
                <mat-option value="Uncommon">Uncommon</mat-option>
                <mat-option value="Rare">Rare</mat-option>
                <mat-option value="Ultra Rare">Ultra Rare</mat-option>
                <mat-option value="Secret Rare">Secret Rare</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              フィルタークリア
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- カードグリッド -->
      <div class="cards-grid">
        <mat-card
          *ngFor="let card of filteredCards; trackBy: trackByCardId"
          class="card-item"
          [class.rare-card]="card.rarity === 'Ultra Rare' || card.rarity === 'Secret Rare'"
        >
          <div class="card-image-container">
            <img
              mat-card-image
              [src]="card.imageUrl"
              [alt]="card.name"
              (error)="onImageError($event)"
              loading="lazy"
            >
            <div class="rarity-badge" [ngClass]="getRarityClass(card.rarity)">
              {{ card.rarity }}
            </div>
          </div>

          <mat-card-content>
            <h3>{{ card.name }}</h3>
            <div class="card-info">
              <div class="types">
                <mat-chip-set>
                  <mat-chip *ngFor="let type of card.type">{{ type }}</mat-chip>
                </mat-chip-set>
              </div>
              <p class="card-number">{{ card.cardNumber }}</p>
              <p class="set-name">{{ card.set }}</p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary">詳細を見る</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="filteredCards.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <p>該当するカードが見つかりませんでした</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .filter-card {
      margin-bottom: 24px;
    }

    .filter-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-row mat-form-field {
      min-width: 200px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .card-item {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      cursor: pointer;
    }

    .card-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .rare-card {
      border: 2px solid gold;
      box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
    }

    .card-image-container {
      position: relative;
      overflow: hidden;
    }

    .card-image-container img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .rarity-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }

    .rarity-common { background-color: #6c757d; }
    .rarity-uncommon { background-color: #28a745; }
    .rarity-rare { background-color: #007bff; }
    .rarity-ultra-rare { background-color: #6f42c1; }
    .rarity-secret-rare { background-color: #fd7e14; }

    .card-info h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: bold;
    }

    .types {
      margin-bottom: 8px;
    }

    .card-number, .set-name {
      margin: 4px 0;
      font-size: 14px;
      color: #666;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }

      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }

      .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }
    }
  `]
})
export class CardGridComponent implements OnInit {
  allCards: PokemonCard[] = [];
  filteredCards: PokemonCard[] = [];

  filter: CardFilter = {
    searchTerm: '',
    selectedTypes: [],
    selectedRarity: ''
  };

  constructor(private cardService: PokemonCardService) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.cardService.getCards().subscribe(cards => {
      this.allCards = cards;
      this.filteredCards = cards;
    });
  }

  applyFilters() {
    this.filteredCards = this.cardService.filterCards(
      this.allCards,
      this.filter.searchTerm,
      this.filter.selectedTypes,
      this.filter.selectedRarity
    );
  }

  clearFilters() {
    this.filter = {
      searchTerm: '',
      selectedTypes: [],
      selectedRarity: ''
    };
    this.filteredCards = this.allCards;
  }

  trackByCardId(index: number, card: PokemonCard): number {
    return card.id;
  }

  getRarityClass(rarity: string): string {
    return `rarity-${rarity.toLowerCase().replace(/\s+/g, '-')}`;
  }

  onImageError(event: any) {
    // 画像読み込みエラー時のフォールバック
    event.target.src = 'assets/cards/placeholder.png';
  }
}
