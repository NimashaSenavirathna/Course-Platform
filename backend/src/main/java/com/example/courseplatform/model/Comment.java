package com.example.postmanage.model;

import lombok.Data;

import java.util.Date;

@Data
public class Comment {
    private String userId;
    private String message;
    private Date commentedAt = new Date();
}
