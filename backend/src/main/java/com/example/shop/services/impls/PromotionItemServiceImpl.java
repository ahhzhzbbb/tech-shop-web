package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.Product;
import com.example.shop.models.PromotionItem;
import com.example.shop.payloads.dto.PromotionItemDTO;
import com.example.shop.payloads.request.PromotionItemRequest;
import com.example.shop.payloads.response.PromotionItemsResponse;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.repositories.PromotionItemRepository;
import com.example.shop.services.PromotionItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionItemServiceImpl implements PromotionItemService {

    private final PromotionItemRepository promotionItemRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public PromotionItemDTO createPromotionItem(PromotionItemRequest request) {
        
        // Check if product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));
        
        // Check if product already has a promotion
        if (promotionItemRepository.findByProductId(request.getProductId()).isPresent()) {
            throw new RuntimeException("Sản phẩm này đã có khuyến mãi");
        }
        
        PromotionItem promotionItem = new PromotionItem();
        promotionItem.setProduct(product);
        promotionItem.setDiscountPercent(request.getDiscountPercent());
        promotionItem.setStartDate(request.getStartDate());
        promotionItem.setEndDate(request.getEndDate());
        
        PromotionItem savedPromotionItem = promotionItemRepository.save(promotionItem);
        
        return convertToDTO(savedPromotionItem);
    }

    @Override
    public PromotionItemsResponse getAllPromotionItems() {

        List<PromotionItem> promotionItems = promotionItemRepository.findAll();
        
        List<PromotionItemDTO> promotionItemDTOs = promotionItems.stream()
                .map(this::convertToDTO)
                .toList();
        
        PromotionItemsResponse response = new PromotionItemsResponse();
        response.setPromotionItems(promotionItemDTOs);
        response.setTotalItems(promotionItemDTOs.size());
        
        return response;
    }

    @Override
    public PromotionItemDTO getPromotionItemById(Long promotionItemId) {

        PromotionItem promotionItem = promotionItemRepository.findById(promotionItemId)
                .orElseThrow(() -> new ResourceNotFoundException("PromotionItem", "id", promotionItemId));
        
        return convertToDTO(promotionItem);
    }

    @Override
    public PromotionItemDTO updatePromotionItem(Long promotionItemId, PromotionItemRequest request) {

        PromotionItem promotionItem = promotionItemRepository.findById(promotionItemId)
                .orElseThrow(() -> new ResourceNotFoundException("PromotionItem", "id", promotionItemId));

        // If product is being changed, check if new product exists and doesn't have another promotion
        if (!promotionItem.getProduct().getId().equals(request.getProductId())) {
            Product newProduct = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));
            
            if (promotionItemRepository.findByProductId(request.getProductId()).isPresent()) {
                throw new RuntimeException("Sản phẩm này đã có khuyến mãi");
            }
            
            promotionItem.setProduct(newProduct);
        }
        
        promotionItem.setDiscountPercent(request.getDiscountPercent());
        promotionItem.setStartDate(request.getStartDate());
        promotionItem.setEndDate(request.getEndDate());
        
        PromotionItem updatedPromotionItem = promotionItemRepository.save(promotionItem);
        
        return convertToDTO(updatedPromotionItem);
    }

    @Override
    public PromotionItemDTO deletePromotionItem(Long promotionItemId) {

        PromotionItem promotionItem = promotionItemRepository.findById(promotionItemId)
                .orElseThrow(() -> new ResourceNotFoundException("PromotionItem", "id", promotionItemId));
        
        PromotionItemDTO dto = convertToDTO(promotionItem);
        
        promotionItemRepository.delete(promotionItem);
        
        return dto;
    }

    private PromotionItemDTO convertToDTO(PromotionItem promotionItem) {
        PromotionItemDTO dto = new PromotionItemDTO();
        dto.setId(promotionItem.getId());
        Product product = promotionItem.getProduct();
        if (product != null) {
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
        }
        dto.setDiscountPercent(promotionItem.getDiscountPercent());
        dto.setStartDate(promotionItem.getStartDate());
        dto.setEndDate(promotionItem.getEndDate());
        return dto;
    }
}
