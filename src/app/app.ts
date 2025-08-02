import { Component, signal } from '@angular/core';
import {CardGridComponent} from './components/card-grid/card-grid.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [CardGridComponent, MatToolbar, MatIconModule, MatIconButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-learning-site');
}
