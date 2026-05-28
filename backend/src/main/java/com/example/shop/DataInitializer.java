//package com.example.shop;
//
//import com.example.shop.models.AppRole;
//import com.example.shop.models.Attribute;
//import com.example.shop.models.Category;
//import com.example.shop.models.Product;
//import com.example.shop.models.ProductAttributeValue;
//import com.example.shop.models.Role;
//import com.example.shop.models.User;
//import com.example.shop.repositories.AttributeRepository;
//import com.example.shop.repositories.CategoryRepository;
//import com.example.shop.repositories.ProductAttributeValueRepository;
//import com.example.shop.repositories.ProductRepository;
//import com.example.shop.repositories.RoleRepository;
//import com.example.shop.repositories.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class DataInitializer implements CommandLineRunner {
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final CategoryRepository categoryRepository;
//    private final ProductRepository productRepository;
//    private final AttributeRepository attributeRepository;
//    private final ProductAttributeValueRepository productAttributeValueRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//
//        Role role1 = new Role();
//        role1.setRoleName(AppRole.ROLE_USER);
//
//        roleRepository.save(role1);
//
//        Role role2 = new Role();
//        role2.setRoleName(AppRole.ROLE_ADMIN);
//
//        roleRepository.save(role2);
//
//        User newUser = new User();
//        newUser.setUsername("admin");
//        newUser.setPassword(passwordEncoder.encode("admin"));
//        newUser.setPhoneNumber("0585424988");
//        newUser.setRole(role2);
//        userRepository.save(newUser);
//
//        Category laptopCategory = new Category();
//        laptopCategory.setName("Laptop");
//        laptopCategory.setActive(true);
//        categoryRepository.save(laptopCategory);
//
//        Attribute cpuAttribute = createAttribute("CPU", laptopCategory);
//        Attribute ramAttribute = createAttribute("RAM", laptopCategory);
//        Attribute storageAttribute = createAttribute("Storage", laptopCategory);
//        Attribute displayAttribute = createAttribute("Display", laptopCategory);
//        Attribute osAttribute = createAttribute("Operating System", laptopCategory);
//
//        Product laptop1 = new Product();
//        laptop1.setName("Dell XPS 13");
//        laptop1.setDescription("Premium ultrabook with Intel i7 processor, 16GB RAM, 512GB SSD");
//        laptop1.setPrice(1299.99);
//        laptop1.setQuantity(10);
//        laptop1.setImageUrl("https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/9345/media-gallery/touch/gray/xps-13-9345-laptop-gray-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full");
//        laptop1.setStatus("AVAILABLE");
//        laptop1.setAverageScore(4.8);
//        laptop1.setCategory(laptopCategory);
//        productRepository.save(laptop1);
//
//        createProductAttributeValue(laptop1, cpuAttribute, "Intel Core i7");
//        createProductAttributeValue(laptop1, ramAttribute, "16GB");
//        createProductAttributeValue(laptop1, storageAttribute, "512GB SSD");
//        createProductAttributeValue(laptop1, displayAttribute, "13.4-inch");
//        createProductAttributeValue(laptop1, osAttribute, "Windows 11");
//
//        Product laptop2 = new Product();
//        laptop2.setName("MacBook Air M2");
//        laptop2.setDescription("Apple MacBook Air with M2 chip, 8GB unified memory, 256GB SSD");
//        laptop2.setPrice(1199.99);
//        laptop2.setQuantity(8);
//        laptop2.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/n/vn0d33_1.jpg");
//        laptop2.setStatus("AVAILABLE");
//        laptop2.setAverageScore(4.9);
//        laptop2.setCategory(laptopCategory);
//        productRepository.save(laptop2);
//
//        createProductAttributeValue(laptop2, cpuAttribute, "Apple M2");
//        createProductAttributeValue(laptop2, ramAttribute, "8GB unified memory");
//        createProductAttributeValue(laptop2, storageAttribute, "256GB SSD");
//        createProductAttributeValue(laptop2, displayAttribute, "13.6-inch");
//        createProductAttributeValue(laptop2, osAttribute, "macOS");
//
//        Product laptop3 = new Product();
//        laptop3.setName("Lenovo ThinkPad X1 Carbon");
//        laptop3.setDescription("Business laptop with Intel i5, 8GB RAM, 512GB SSD, 14-inch FHD display");
//        laptop3.setPrice(899.99);
//        laptop3.setQuantity(15);
//        laptop3.setImageUrl("https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_4__1_65.png");
//        laptop3.setStatus("AVAILABLE");
//        laptop3.setAverageScore(4.7);
//        laptop3.setCategory(laptopCategory);
//        productRepository.save(laptop3);
//
//        createProductAttributeValue(laptop3, cpuAttribute, "Intel Core i5");
//        createProductAttributeValue(laptop3, ramAttribute, "8GB");
//        createProductAttributeValue(laptop3, storageAttribute, "512GB SSD");
//        createProductAttributeValue(laptop3, displayAttribute, "14-inch FHD");
//        createProductAttributeValue(laptop3, osAttribute, "Windows 11 Pro");
//    }
//
//    private Attribute createAttribute(String name, Category category) {
//        Attribute attribute = new Attribute();
//        attribute.setName(name);
//        attribute.setCategory(category);
//        return attributeRepository.save(attribute);
//    }
//
//    private void createProductAttributeValue(Product product, Attribute attribute, String value) {
//        ProductAttributeValue productAttributeValue = new ProductAttributeValue();
//        productAttributeValue.setProduct(product);
//        productAttributeValue.setAttribute(attribute);
//        productAttributeValue.setValue(value);
//        productAttributeValueRepository.save(productAttributeValue);
//    }
//}
