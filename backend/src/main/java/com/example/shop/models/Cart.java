package com.example.shop.models;

//import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.security.Timestamp;
import java.util.HashSet;
import java.util.Set;
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Timestamp createdAt;
    private Timestamp updatedAt;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    //private CartItem cartItems;
    @JsonManagedReference
    private Set<CartItem> cartItems = new HashSet<>();

    public void addCartItem(CartItem item) {
        this.cartItems.add(item);
        item.setCart(this); // 
    }
    public void removeCartItem(CartItem item) {
        this.cartItems.remove(item);
        item.setCart(null);
    }
}
