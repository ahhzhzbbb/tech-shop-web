package com.example.shop.controllers;

import com.example.shop.payloads.dto.AttributeDTO;
import com.example.shop.payloads.request.AttributeRequest;
import com.example.shop.payloads.response.AttributesResponse;
import com.example.shop.services.AttributeService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttributeController {
    private final AttributeService attributeService;

    @PermitAll
    @GetMapping("/attributes")
    public ResponseEntity<AttributesResponse> getAllAttributes() {
        AttributesResponse response = attributeService.getAllAttributes();
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/attribute/{attributeId}")
    public ResponseEntity<AttributeDTO> getAttributeById(@PathVariable Long attributeId) {
        AttributeDTO response = attributeService.getAttributeById(attributeId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/attributes/category/{categoryId}")
    public ResponseEntity<AttributesResponse> getAttributesByCategory(@PathVariable Long categoryId) {
        AttributesResponse response = attributeService.getAttributesByCategory(categoryId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/attribute")
    public ResponseEntity<AttributeDTO> createAttribute(@RequestBody AttributeRequest attributeRequest) {
        AttributeDTO response = attributeService.createAttribute(attributeRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/attribute/{attributeId}")
    public ResponseEntity<AttributeDTO> updateAttribute(
            @PathVariable Long attributeId,
            @RequestBody AttributeRequest attributeRequest
    ) {
        AttributeDTO response = attributeService.updateAttribute(attributeId, attributeRequest);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/attribute/{attributeId}")
    public ResponseEntity<AttributeDTO> deleteAttribute(@PathVariable Long attributeId) {
        AttributeDTO response = attributeService.deleteAttribute(attributeId);
        return ResponseEntity.ok().body(response);
    }
}
