package com.example.courseplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "courses") // MongoDB collection name
@Data
public class Course {
    @Id
    private String id;         // MongoDB uses String id
    private String title;
    private String description;
    private Double price;
}
