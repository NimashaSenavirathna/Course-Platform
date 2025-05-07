package com.example.socialmedia.repository;

import com.example.socialmedia.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}
