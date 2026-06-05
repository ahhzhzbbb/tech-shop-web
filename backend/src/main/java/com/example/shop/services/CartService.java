package com.example.shop.services;

import com.example.shop.payloads.request.AddToCartRequest;
import com.example.shop.payloads.request.UpdateCartItemRequest;
import com.example.shop.payloads.response.CartResponse;

public interface CartService {

    CartResponse getCart();

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCartItem(
            Long cartItemId,
            UpdateCartItemRequest request
    );

    CartResponse removeCartItem(Long cartItemId);

    void clearCart();
}
