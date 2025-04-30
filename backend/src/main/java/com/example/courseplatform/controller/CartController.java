package com.example.courseplatform.controller;

import com.example.courseplatform.model.CartItem;
import com.example.courseplatform.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        try {
            CartItem savedCartItem = cartRepository.save(cartItem);
            return new ResponseEntity<>(savedCartItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/view/{userId}")
    public ResponseEntity<List<CartItem>> viewCart(@PathVariable String userId) {
        try {
            List<CartItem> cartItems = cartRepository.findByUserId(userId);
            if (cartItems == null || cartItems.isEmpty()) {
                return new ResponseEntity<>(List.of(), HttpStatus.OK);
            }
            return new ResponseEntity<>(cartItems, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error fetching cart items: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(List.of(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestBody CartItem cartItem) {
        try {
            cartRepository.deleteByUserIdAndCourseId(cartItem.getUserId(), cartItem.getCourseId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error removing from cart: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
