package com.example.shop.controllers;

import com.example.shop.payloads.dto.OrderDTO;
import com.example.shop.payloads.request.OrderRequest;
import com.example.shop.payloads.response.OrdersResponse;
import com.example.shop.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @Operation(summary = "Tạo đơn hàng mới", description = "API dùng để tạo một đơn hàng mới")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/order")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderDTO response = orderService.createOrder(orderRequest);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy tất cả đơn hàng", description = "API dùng để lấy tất cả đơn hàng")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public ResponseEntity<OrdersResponse> getAllOrders() {
        OrdersResponse response = orderService.getAllOrders();
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy đơn hàng theo ID", description = "API dùng để lấy thông tin một đơn hàng theo ID")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO response = orderService.getOrderById(orderId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy đơn hàng theo ID người dùng", description = "API dùng để lấy tất cả đơn hàng của một người dùng theo ID người dùng")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> response = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Cập nhật đơn hàng", description = "API dùng để cập nhật thông tin một đơn hàng")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable Long orderId,
            @RequestBody OrderRequest orderRequest) {
        OrderDTO response = orderService.updateOrder(orderId, orderRequest);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Xóa đơn hàng", description = "API dùng để xóa một đơn hàng")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> deleteOrder(@PathVariable Long orderId) {
        OrderDTO response = orderService.deleteOrder(orderId);
        return ResponseEntity.ok().body(response);
    }
}
