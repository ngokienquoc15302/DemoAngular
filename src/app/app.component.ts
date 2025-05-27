import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent],
  template: `
    <div class="app-container">
      <app-product-list></app-product-list>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px 0;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 0;
    }
  `]
})
export class AppComponent {
  title = 'Product Management';
}