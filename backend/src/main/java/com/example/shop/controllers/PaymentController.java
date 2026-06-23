package com.example.shop.controllers;

import com.example.shop.payloads.dto.PaymentDTO;
import com.example.shop.payloads.request.PaymentRequest;
import com.example.shop.payloads.response.PaymentResponse;
import com.example.shop.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * Create payment
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentRequest paymentRequest) {
        PaymentResponse response = paymentService.createPayment(paymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    /**
     * Get payment by order ID
     */
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDTO payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }
    
    /**
     * Get all payments for a user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByUserId(@PathVariable Long userId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByUserId(userId);
        return ResponseEntity.ok(payments);
    }
    
    /**
     * Get all payments
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    /**
     * VNPay callback endpoint
     */
    @GetMapping("/vnpay-callback")
    public ResponseEntity<Map<String, Object>> vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            PaymentDTO payment = paymentService.handleVNPayCallback(params);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Payment processed successfully",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
    
    /**
     * VNPay notify endpoint (Nhánh ngầm IPN)
     * VNPAY gửi dữ liệu dạng Query Params thông qua phương thức GET
     */
    @GetMapping("/vnpay-notify")
    public ResponseEntity<Map<String, String>> vnpayNotify(@RequestParam Map<String, String> params) {
        try {
            paymentService.handleVNPayCallback(params);
            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown Error: " + e.getMessage()));
        }
    }
    
    /**
     * Check transaction status
     */
    @GetMapping("/status/{transactionId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable String transactionId) {
        String status = paymentService.checkTransactionStatus(transactionId);
        return ResponseEntity.ok(Map.of("status", status));
    }
    
    /**
     * Cancel payment
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> cancelPayment(@PathVariable Long id) {
        PaymentDTO payment = paymentService.cancelPayment(id);
        return ResponseEntity.ok(payment);
    }
}
