import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';

export const emptyGuard: CanActivateFn = (route, state) => {
  const cartService=inject(CartService);
  const router=inject (Router);
  const snack =inject (SnackbarService);
  
  if(!cartService.cart()|| cartService.cart()?.items.length===0){
    snack.error('your cart is empty');
    router.navigateByUrl('/cart');
    return false;
    
  }
  return true;
};
