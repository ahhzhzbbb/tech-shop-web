package com.example.shop.services.impls;

import com.example.shop.models.Cart;
import com.example.shop.models.CartItem;
import com.example.shop.models.Product;
import com.example.shop.models.User;
import com.example.shop.repositories.CartItemRepository;
import com.example.shop.repositories.CartRepository;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.repositories.UserRepository;
import com.example.shop.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional // Đảm bảo tính toàn vẹn dữ liệu (Rollback nếu xảy ra lỗi giữa chừng)
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Cart GetCartByUserId(Long userId) {
        // Tìm giỏ hàng, nếu chưa có thì tự động tạo mới giỏ trống cho User đó
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart AddToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = GetCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // Kiểm tra xem sản phẩm này đã có trong giỏ hàng chưa
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Cộng dồn số lượng mới vào số lượng cũ
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getCartItems().add(newItem); 
        }

        return cartRepository.save(cart); // Lưu Cart tổng, các CartItem sẽ tự lưu theo nhờ CascadeType.ALL
    }

    @Override
    public Cart UpdateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        Cart cart = GetCartByUserId(userId);

        // Tìm item cần sửa số lượng trong giỏ
        CartItem item = cart.getCartItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng"));

        if (quantity <= 0) {
            // Nếu số lượng đưa về <= 0, coi như xóa sản phẩm khỏi giỏ
            cart.getCartItems().remove(item);
        } else {
            // Ngược lại thì cập nhật số lượng mới (Ví dụ: Thay hẳn từ 1 thành 5)
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart RemoveFromCart(Long userId, Long productId) {
        Cart cart = GetCartByUserId(userId);

        CartItem item = cart.getCartItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng"));

        // Xóa khỏi Set, Hibernate tự xóa bản ghi dưới DB nhờ orphanRemoval = true
        cart.getCartItems().remove(item); 
        
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = GetCartByUserId(userId);
        // Xóa sạch tất cả các phần tử trong Set
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}
