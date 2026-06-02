package com.example.shop.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

public enum PaymentMethod {
    COD,
    VNPAY
}