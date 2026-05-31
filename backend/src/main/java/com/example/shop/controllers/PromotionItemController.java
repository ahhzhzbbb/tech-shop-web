package com.example.shop.controllers;

import com.example.shop.payloads.dto.PromotionItemDTO;
import com.example.shop.payloads.request.PromotionItemRequest;
import com.example.shop.payloads.response.PromotionItemsResponse;
import com.example.shop.services.PromotionItemService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PromotionItemController {

    private final PromotionItemService promotionItemService;

    @Operation(summary = "Lấy tất cả khuyến mãi", description = "API dùng để lấy danh sách tất cả các sản phẩm đang được khuyến mãi")
    @PermitAll
    @GetMapping("/promotions")
    public ResponseEntity<PromotionItemsResponse> getAllPromotionItems() {
        PromotionItemsResponse response = promotionItemService.getAllPromotionItems();
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy khuyến mãi theo ID", description = "API dùng để lấy thông tin khuyến mãi theo ID")
    @PermitAll
    @GetMapping("/promotion/{id}")
    public ResponseEntity<PromotionItemDTO> getPromotionItemById(@PathVariable Long id) {
        PromotionItemDTO response = promotionItemService.getPromotionItemById(id);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Thêm sản phẩm vào khuyến mãi", description = "API dùng để thêm một sản phẩm vào danh sách khuyến mãi")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/promotion")
    public ResponseEntity<PromotionItemDTO> createPromotionItem(@RequestBody PromotionItemRequest request) {
        PromotionItemDTO response = promotionItemService.createPromotionItem(request);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Cập nhật thông tin khuyến mãi", description = "API dùng để cập nhật thông tin khuyến mãi của sản phẩm")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/promotion/{id}")
    public ResponseEntity<PromotionItemDTO> updatePromotionItem(
            @PathVariable Long id,
            @RequestBody PromotionItemRequest request) {
        PromotionItemDTO response = promotionItemService.updatePromotionItem(id, request);
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Xóa sản phẩm khỏi khuyến mãi", description = "API dùng để xóa sản phẩm khỏi danh sách khuyến mãi")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/promotion/{id}")
    public ResponseEntity<PromotionItemDTO> deletePromotionItem(@PathVariable Long id) {
        PromotionItemDTO response = promotionItemService.deletePromotionItem(id);
        return ResponseEntity.ok().body(response);
    }
}
