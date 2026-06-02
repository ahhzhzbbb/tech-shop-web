package com.example.shop.models;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã giao dịch của hệ thống hoặc VNPay
    @Column(unique = true)
    private String transactionId;

    // Số tiền thanh toán
    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    // Mã phản hồi từ cổng thanh toán
    private String responseCode;

    // Thời điểm tạo payment
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Thời điểm thanh toán thành công
    private LocalDateTime paidAt;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}