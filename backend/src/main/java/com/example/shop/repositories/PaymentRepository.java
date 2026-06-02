package com.example.shop.repositories;

import com.example.shop.models.Payment;
import com.example.shop.models.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    
    Optional<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByOrderUserUserId(Long userId);
}
