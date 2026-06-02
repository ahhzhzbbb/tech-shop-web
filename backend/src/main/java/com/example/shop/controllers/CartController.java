package com.example.shop.controllers;

import com.example.shop.payloads.request.AddToCartRequest;
import com.example.shop.payloads.request.UpdateCartItemRequest;
import com.example.shop.payloads.response.CartResponse;
import com.example.shop.services.CartService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Lấy giỏ hàng hiện tại")
    @GetMapping
    public ResponseEntity<CartResponse> getCart() {

        return ResponseEntity.ok(
                cartService.getCart()
        );
    }

    @Operation(summary = "Thêm sản phẩm vào giỏ hàng")
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request
    ) {

        return ResponseEntity.ok(
                cartService.addToCart(request)
        );
    }

    @Operation(summary = "Cập nhật số lượng sản phẩm")
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        cartItemId,
                        request
                )
        );
    }

    @Operation(summary = "Xóa sản phẩm khỏi giỏ hàng")
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long cartItemId
    ) {

        return ResponseEntity.ok(
                cartService.removeCartItem(cartItemId)
        );
    }

    @Operation(summary = "Xóa toàn bộ giỏ hàng")
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {

        cartService.clearCart();

        return ResponseEntity.ok(
                "Cart cleared successfully"
        );
    }
}
