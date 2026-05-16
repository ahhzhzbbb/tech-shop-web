package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.*;
import com.example.shop.payloads.dto.OrderDTO;
import com.example.shop.payloads.dto.OrderItemDTO;
import com.example.shop.payloads.request.OrderItemRequest;
import com.example.shop.payloads.request.OrderRequest;
import com.example.shop.payloads.response.OrdersResponse;
import com.example.shop.repositories.*;
import com.example.shop.services.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final ModelMapper modelMapper;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public OrderDTO createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", orderRequest.getUserId()));

        Order newOrder = new Order();
        newOrder.setOrderDate(orderRequest.getOrderDate());
        newOrder.setTotalAmount(orderRequest.getTotalAmount());
        newOrder.setStatus(orderRequest.getStatus());
        newOrder.setNotes(orderRequest.getNotes());
        newOrder.setUser(user);

        Order savedOrder = orderRepository.save(newOrder);

        Set<OrderItem> orderItems = new HashSet<>();
        if (orderRequest.getOrderItems() != null) {
            for (OrderItemRequest itemRequest : orderRequest.getOrderItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

                OrderItem orderItem = new OrderItem();
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setPrice(itemRequest.getPrice());
                orderItem.setProduct(product);
                orderItem.setOrder(savedOrder);

                orderItems.add(orderItem);
            }
            orderItemRepository.saveAll(orderItems);
            savedOrder.setOrderItems(orderItems);
        }

        return convertToDTO(savedOrder);
    }

    @Override
    public OrdersResponse getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderList = orders.stream()
                .map(this::convertToDTO)
                .toList();
        OrdersResponse response = new OrdersResponse();
        response.setOrders(orderList);
        return response;
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return convertToDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Order> orders = orderRepository.findByUserUserId(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional
    @Override
    public OrderDTO updateOrder(Long orderId, OrderRequest orderRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (orderRequest.getOrderDate() != null) {
            order.setOrderDate(orderRequest.getOrderDate());
        }

        if (orderRequest.getTotalAmount() != null) {
            order.setTotalAmount(orderRequest.getTotalAmount());
        }

        if (orderRequest.getStatus() != null) {
            order.setStatus(orderRequest.getStatus());
        }

        if (orderRequest.getNotes() != null) {
            order.setNotes(orderRequest.getNotes());
        }

        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    @Transactional
    @Override
    public OrderDTO deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        orderRepository.delete(order);
        return convertToDTO(order);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setNotes(order.getNotes());
        orderDTO.setUserId(order.getUser().getUserId());

        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getProduct().getId(),
                        item.getProduct().getName()
                ))
                .toList();

        orderDTO.setOrderItems(orderItemDTOs);
        return orderDTO;
    }
}
