package com.example.shop.payloads.response;

import com.example.shop.payloads.dto.PromotionItemDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionItemsResponse {
    private List<PromotionItemDTO> promotionItems;
    private Integer totalItems;
}
