package com.example.shop.services;
import com.example.shop.models.Cart;
public interface CartService {
    Cart GetCartByUserId(Long userId);
    Cart AddToCart(Long userId, Long productId, Integer quantity);
    Cart RemoveFromCart(Long userId, Long productId);
    Cart UpdateCartItemQuantity(Long userId, Long productId, Integer quantity);
    void clearCart(Long userId);
}
