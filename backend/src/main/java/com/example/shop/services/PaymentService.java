package com.example.shop.services;

import com.example.shop.payloads.dto.PaymentDTO;
import com.example.shop.payloads.request.PaymentRequest;
import com.example.shop.payloads.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest paymentRequest);

    PaymentDTO getPaymentById(Long paymentId);

    PaymentDTO getPaymentByOrderId(Long orderId);

    List<PaymentDTO> getPaymentsByUserId(Long userId);

    List<PaymentDTO> getAllPayments();

    PaymentDTO handleVNPayCallback(java.util.Map<String, String> params);

    String checkTransactionStatus(String transactionId);

    PaymentDTO cancelPayment(Long paymentId);
}
