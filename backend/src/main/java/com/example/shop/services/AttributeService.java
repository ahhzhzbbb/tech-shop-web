package com.example.shop.services;

import com.example.shop.payloads.dto.AttributeDTO;
import com.example.shop.payloads.request.AttributeRequest;
import com.example.shop.payloads.response.AttributesResponse;

public interface AttributeService {
    AttributeDTO createAttribute(AttributeRequest attributeRequest);

    AttributesResponse getAllAttributes();

    AttributeDTO getAttributeById(Long attributeId);

    AttributesResponse getAttributesByCategory(Long categoryId);

    AttributeDTO updateAttribute(Long attributeId, AttributeRequest attributeRequest);

    AttributeDTO deleteAttribute(Long attributeId);
}
