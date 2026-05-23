package com.example.shop.services;

import com.example.shop.payloads.dto.OrderDTO;
import com.example.shop.payloads.request.OrderRequest;
import com.example.shop.payloads.response.OrdersResponse;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderRequest orderRequest);

    OrdersResponse getAllOrders();

    OrderDTO getOrderById(Long orderId);

    List<OrderDTO> getOrdersByUserId(Long userId);

    OrderDTO updateOrder(Long orderId, OrderRequest orderRequest);

    OrderDTO deleteOrder(Long orderId);
}
