package com.example.shop.controllers;

import com.example.shop.models.Cart;
import com.example.shop.services.CartService;


import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.PermitAll;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    @PermitAll
    @GetMapping("/cart")
    public ResponseEntity<Cart> getCartByUserId(
            @RequestParam Long userId
    ) {

        Cart response =
                cartService.GetCartByUserId(userId);

        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PostMapping("/cart/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity
    ) {

        Cart response =
                cartService.AddToCart(userId, productId, quantity);

        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @DeleteMapping("/cart/remove")
    public ResponseEntity<Cart> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {

        Cart response =
                cartService.RemoveFromCart(userId, productId);

        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PutMapping("/cart/update")
    public ResponseEntity<Cart> updateCartItemQuantity(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity
    ) {

        Cart response =
                cartService.UpdateCartItemQuantity(userId, productId, quantity);

        return ResponseEntity.ok().body(response);
    }    
}
