import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { CartService } from './core/services/cart.service';
import { BusyService } from './core/services/busy.service';
import { NgIf } from '@angular/common'; // <-- Import NgIf for *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NgIf], // <-- Add NgIf here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // <-- fix typo
})
export class AppComponent implements OnInit {
  private cartService = inject(CartService);
  public busyService = inject(BusyService); // <-- make public so template can access it

  ngOnInit(): void {
    const cartId = localStorage.getItem('cart_id');

    if (cartId) {
      this.cartService.getCart(cartId); // 🔥 triggers Network request
    }
  }
}
