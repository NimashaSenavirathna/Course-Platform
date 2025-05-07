package com.example.socialmedia.controller;

import com.example.socialmedia.model.Comment;
import com.example.socialmedia.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable String postId) {
        return commentRepository.findByPostId(postId);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable String id, @RequestBody Comment updated) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(updated.getContent());
            return commentRepository.save(comment);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable String id) {
        commentRepository.deleteById(id);
    }
}
