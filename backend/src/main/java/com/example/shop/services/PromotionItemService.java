package com.example.shop.services;

import com.example.shop.payloads.dto.PromotionItemDTO;
import com.example.shop.payloads.request.PromotionItemRequest;
import com.example.shop.payloads.response.PromotionItemsResponse;

public interface PromotionItemService {
    
    PromotionItemDTO createPromotionItem(PromotionItemRequest request);
    
    PromotionItemsResponse getAllPromotionItems();
    
    PromotionItemDTO getPromotionItemById(Long promotionItemId);
    
    PromotionItemDTO updatePromotionItem(Long promotionItemId, PromotionItemRequest request);
    
    PromotionItemDTO deletePromotionItem(Long promotionItemId);
}
