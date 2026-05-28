package com.example.shop.payloads.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {
    private Integer pageNumber = 0;
    private Integer pageSize = 10;
}
