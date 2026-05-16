package com.example.shop.controllers;

import com.example.shop.payloads.dto.OrderDTO;
import com.example.shop.payloads.request.OrderRequest;
import com.example.shop.payloads.response.OrdersResponse;
import com.example.shop.services.OrderService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/order")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderDTO response = orderService.createOrder(orderRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public ResponseEntity<OrdersResponse> getAllOrders() {
        OrdersResponse response = orderService.getAllOrders();
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO response = orderService.getOrderById(orderId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> response = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable Long orderId,
            @RequestBody OrderRequest orderRequest
    ) {
        OrderDTO response = orderService.updateOrder(orderId, orderRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<OrderDTO> deleteOrder(@PathVariable Long orderId) {
        OrderDTO response = orderService.deleteOrder(orderId);
        return ResponseEntity.ok().body(response);
    }
}
