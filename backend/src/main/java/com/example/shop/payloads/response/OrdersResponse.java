package com.example.shop.payloads.response;

import com.example.shop.payloads.dto.OrderDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersResponse {
    private List<OrderDTO> orders;
}
