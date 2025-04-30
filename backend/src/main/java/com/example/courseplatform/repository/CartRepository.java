package com.example.courseplatform.repository;

import com.example.courseplatform.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CartRepository extends MongoRepository<CartItem, String> {
    List<CartItem> findByUserId(String userId);
    List<CartItem> findByUserIdAndCourseId(String userId, String courseId);
    void deleteByUserIdAndCourseId(String userId, String courseId);
}
