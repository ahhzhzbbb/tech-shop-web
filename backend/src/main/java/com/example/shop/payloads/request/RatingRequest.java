package com.example.shop.payloads.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequest {
    @NotNull
    private Long productId;

    @Min(1)
    @Max(5)
    private int score;

    private String comment;
}
