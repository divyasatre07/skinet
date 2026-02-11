import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private snack = inject(SnackbarService);

  baseUrl = environment.apiUrl;

  cart = signal<Cart | null>(null);

  itemCount = computed(() =>
    this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );

  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    };
  });

  // Fetch cart from backend
  getCart(id: string) {
    return this.http.get<Cart>(`${this.baseUrl}cart?id=${id}`).pipe(
      map(cart => {
        this.cart.set(cart);
        if (!cart.items || cart.items.length === 0) {
          this.snack.error('Your cart is empty!');
        }
        return cart;
      })
    );
  }

  // Save or update cart to backend
  setCart(cart: Cart) {
    this.http.post<Cart>(`${this.baseUrl}cart`, cart)
      .subscribe({
        next: updatedCart => {
          this.cart.set(updatedCart);
          if (!updatedCart.items || updatedCart.items.length === 0) {
            this.snack.error('Your cart is empty!');
          }
        },
        error: () => this.snack.error('Problem updating cart')
      });
  }

  // Add item to cart
  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();

    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  // Remove item from cart
  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const index = cart.items.findIndex(x => x.productId === productId);
    if (index === -1) return;

    if (cart.items[index].quantity > quantity) {
      cart.items[index].quantity -= quantity;
    } else {
      cart.items.splice(index, 1);
    }

    if (cart.items.length === 0) {
      this.deleteCart();
    } else {
      this.setCart(cart);
    }
  }

  // Delete entire cart
  deleteCart() {
    const cartId = this.cart()?.id;
    if (!cartId) return;

    this.http.delete(`${this.baseUrl}cart?id=${cartId}`).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
        this.snack.error('Your cart is empty!');
      },
      error: () => this.snack.error('Problem deleting cart')
    });
  }

  // Add or update item in cart
  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);

    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  // Map Product to CartItem
  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    };
  }

  // Type guard for Product
  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  // Create a new cart
  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}
