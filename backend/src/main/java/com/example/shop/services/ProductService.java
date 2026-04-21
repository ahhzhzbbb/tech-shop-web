package com.example.shop.services;
import com.example.shop.models.Product;
import java.util.List;

public interface ProductService {
    Product create(Product product);
    List<Product> getAll();
    Product getById(Long id);
    Product update(Long id, Product product);
    void delete(Long id);
}
