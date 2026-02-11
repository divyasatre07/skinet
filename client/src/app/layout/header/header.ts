import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BusyService } from '../../core/services/busy.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { A11yModule } from "@angular/cdk/a11y";

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
    CommonModule,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    A11yModule
],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);

  logout(){
    this.accountService.logout().subscribe({
      next : () =>{
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    })
  }
}
