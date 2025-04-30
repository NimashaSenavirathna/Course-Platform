package com.example.courseplatform.controller;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Long> request) {
        Stripe.apiKey = stripeApiKey;

        try {
            if (request == null || request.get("amount") == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Amount is required");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            Long amount = request.get("amount");
            if (amount <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Amount must be greater than 0");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amount)
                            .setCurrency("usd")
                            .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create payment intent");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
