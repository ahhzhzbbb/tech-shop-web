package com.example.shop.services.impls;

import com.example.shop.configs.VNPayConfig;
import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.exceptions.VNPayException;
import com.example.shop.models.Order;
import com.example.shop.models.Payment;
import com.example.shop.models.PaymentMethod;
import com.example.shop.payloads.dto.PaymentDTO;
import com.example.shop.payloads.request.PaymentRequest;
import com.example.shop.payloads.response.PaymentResponse;
import com.example.shop.repositories.OrderRepository;
import com.example.shop.repositories.PaymentRepository;
import com.example.shop.services.PaymentService;
import com.example.shop.utils.VNPayUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static com.example.shop.models.PaymentStatus.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final VNPayConfig vnPayConfig;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest paymentRequest) {
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", paymentRequest.getOrderId()));

        Optional<Payment> existedPayment = paymentRepository.findByOrderId(order.getId());

        Payment payment;

        if (existedPayment.isPresent()) {
            payment = existedPayment.get();

            if (payment.getStatus() == SUCCESS) {
                throw new RuntimeException("Đơn hàng này đã được thanh toán");
            }

            if (payment.getStatus() == PENDING) {
                throw new RuntimeException("Đơn hàng này đang trong giai đoạn thanh toán");
            }

            payment.setTransactionId(
                    "ORD" + order.getId() + System.currentTimeMillis()
            );
            payment.setStatus(PENDING);
            payment.setResponseCode(null);
            payment.setPaidAt(null);
            payment.setMethod(paymentRequest.getPaymentMethod());
        } else {
            String transactionId = "ORD" + order.getId() + System.currentTimeMillis();
            payment = Payment.builder()
                .transactionId(transactionId)
                .amount(BigDecimal.valueOf(order.getTotalAmount()))
                .method(paymentRequest.getPaymentMethod())
                .status(PENDING)
                .order(order)
                .build();

            payment = paymentRepository.save(payment);
        }

        String paymentUrl = "";

        if (paymentRequest.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentUrl = generateVNPayUrl(payment, paymentRequest.getBankCode());
        }

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .paymentUrl(paymentUrl)
                .message("Payment created successfully")
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        return modelMapper.map(payment, PaymentDTO.class);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));
        return modelMapper.map(payment, PaymentDTO.class);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByUserId(Long userId) {
        List<Payment> payments = paymentRepository.findByOrderUserUserId(userId);
        return payments.stream()
                .map(payment -> modelMapper.map(payment, PaymentDTO.class))
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(payment -> modelMapper.map(payment, PaymentDTO.class))
                .toList();
    }
    
    @Override
    @Transactional
    public PaymentDTO handleVNPayCallback(Map<String, String> params) {
        String transactionId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String secureHash = params.get("vnp_SecureHash");
        
        // Remove secure hash from params for hash verification
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        System.out.println("========== CALLBACK PARAMS ==========");
        params.forEach((k,v) ->
                System.out.println(k + " = " + v));

        // 1. Verify hash -> 97 Invalid Checksum
        String calculatedHash =
                VNPayUtil.hashAllFields(params,
                        vnPayConfig.getHashSecret());

        System.out.println("VNPay Hash      = " + secureHash);
        System.out.println("Calculated Hash = " + calculatedHash);
        System.out.println("=====================================");

        if (secureHash == null || !calculatedHash.equals(secureHash)) {
            log.warn("Invalid VNPay hash for transaction: {}", transactionId);
            throw new VNPayException("97", "Invalid Checksum");
        }

        // 2. Tìm payment theo transactionId -> 01 Order not Found
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new VNPayException("01", "Order not Found"));

        // 3. Đối chiếu số tiền (VNPay gửi vnp_Amount = số tiền * 100) -> 04 Invalid Amount
        long expectedAmount = payment.getAmount().multiply(new BigDecimal("100")).longValue();
        long vnpAmount;
        try {
            vnpAmount = Long.parseLong(params.getOrDefault("vnp_Amount", ""));
        } catch (NumberFormatException ex) {
            vnpAmount = -1;
        }
        if (vnpAmount != expectedAmount) {
            log.warn("VNPay amount mismatch for transaction {}: expected {}, got {}",
                    transactionId, expectedAmount, params.get("vnp_Amount"));
            throw new VNPayException("04", "Invalid Amount");
        }

        // 4. Chống xử lý trùng -> 02 Order already confirmed
        if (payment.getStatus() == SUCCESS) {
            throw new VNPayException("02", "Order already confirmed");
        }

        // 5. Cập nhật trạng thái theo vnp_ResponseCode
        if ("00".equals(responseCode)) {
            payment.setStatus(SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            payment.setResponseCode(responseCode);

            // Update order status
            Order order = payment.getOrder();
            order.setStatus("PAID");
            orderRepository.save(order);
        } else {
            payment.setStatus(FAILED);
            payment.setResponseCode(responseCode);
        }

        payment = paymentRepository.save(payment);
        return modelMapper.map(payment, PaymentDTO.class);
    }
    
    @Override
    @Transactional(readOnly = true)
    public String checkTransactionStatus(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));
        return payment.getStatus().toString();
    }
    
    @Override
    @Transactional
    public PaymentDTO cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        
        if (payment.getStatus() != PENDING) {
            throw new RuntimeException("Can only cancel PENDING payments");
        }
        
        payment.setStatus(FAILED);
        payment = paymentRepository.save(payment);
        
        return modelMapper.map(payment, PaymentDTO.class);
    }

    private String generateVNPayUrl(Payment payment, String bankCode) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(payment.getAmount().multiply(new BigDecimal("100")).longValue()));
        vnpParams.put("vnp_CreateDate", VNPayUtil.getVNPayDateTime());
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_IpAddr", "127.0.0.1");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_OrderInfo", "Order payment for transaction " + payment.getTransactionId());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_ExpireDate", VNPayUtil.getVNPayExpireDate(5));
        vnpParams.put("vnp_TxnRef", payment.getTransactionId());

        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParams.put("vnp_BankCode", bankCode);
        }
        
        return VNPayUtil.buildPaymentUrl(vnpParams, vnPayConfig.getPayUrl(), vnPayConfig.getHashSecret());
    }
}
