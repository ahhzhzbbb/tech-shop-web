package com.example.shop.services.impls;

import com.example.shop.models.*;
import com.example.shop.payloads.dto.CartItemDTO;
import com.example.shop.payloads.request.AddToCartRequest;
import com.example.shop.payloads.request.UpdateCartItemRequest;
import com.example.shop.payloads.response.CartResponse;
import com.example.shop.repositories.*;
import com.example.shop.services.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {

        return cartRepository
                .findByUserUserId(user.getUserId())
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }

    private CartResponse buildResponse(Cart cart) {

        List<CartItemDTO> items =
                cart.getCartItems()
                        .stream()
                        .map(item -> CartItemDTO.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .imageUrl(item.getProduct().getImageUrl())
                                .price(item.getProduct().getPrice())
                                .quantity(item.getQuantity())
                                .subTotal(
                                        item.getQuantity()
                                                * item.getProduct().getPrice()
                                )
                                .build())
                        .collect(Collectors.toList());

        double totalAmount =
                items.stream()
                        .mapToDouble(CartItemDTO::getSubTotal)
                        .sum();

        int totalItems =
                items.stream()
                        .mapToInt(CartItemDTO::getQuantity)
                        .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getUserId())
                .items(items)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    @Override
    public CartResponse getCart() {

        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        return buildResponse(cart);
    }

    @Override
    public CartResponse addToCart(AddToCartRequest request) {

        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException("Product not found"));

        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        CartItem item =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                product.getId()
                        )
                        .orElse(null);

        if (item == null) {

            item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();

        } else {

            item.setQuantity(
                    item.getQuantity()
                            + request.getQuantity()
            );
        }

        cartItemRepository.save(item);

        return buildResponse(cart);
    }

    @Override
    public CartResponse updateCartItem(
            Long cartItemId,
            UpdateCartItemRequest request
    ) {

        CartItem item =
                cartItemRepository
                        .findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart item not found"));

        if (item.getProduct().getQuantity()
                < request.getQuantity()) {

            throw new RuntimeException("Not enough stock");
        }

        item.setQuantity(request.getQuantity());

        cartItemRepository.save(item);

        return buildResponse(item.getCart());
    }

    @Override
    public CartResponse removeCartItem(Long cartItemId) {

        CartItem item =
                cartItemRepository
                        .findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException("Cart item not found"));

        Cart cart = item.getCart();

        cartItemRepository.delete(item);

        return buildResponse(cart);
    }

    @Override
    public void clearCart() {

        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        cart.getCartItems().clear();

        cartRepository.save(cart);
    }
}
