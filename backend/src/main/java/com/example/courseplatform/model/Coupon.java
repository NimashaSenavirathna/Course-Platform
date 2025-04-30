package com.example.courseplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document  // Marks this as a MongoDB document
@Data
public class Coupon {
    @Id  // MongoDB will use this field as the unique identifier (primary key)
    private String id;  // Use String as the default ID type for MongoDB
    private String code;
    private Integer discount; // percentage, e.g., 10 means 10% off
}
