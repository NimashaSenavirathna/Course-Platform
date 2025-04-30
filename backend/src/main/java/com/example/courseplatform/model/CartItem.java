package com.example.courseplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "cart_items") // collection name in MongoDB
@Data
public class CartItem {
    @Id
    private String id;        // MongoDB uses String _id
    private String userId;    // also change userId to String
    private String courseId;  // change courseId to String
    private Integer quantity;
}
