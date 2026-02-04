import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BusyService } from '../../core/services/busy.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true, // 🔴 REQUIRED
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressBarModule,
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartService = inject(CartService);
}
