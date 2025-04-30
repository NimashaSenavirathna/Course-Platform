package com.example.courseplatform.controller;

import com.example.courseplatform.model.Course;
import com.example.courseplatform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            if (courses.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content
            }
            return ResponseEntity.ok(courses); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 500 Internal Server Error
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
        try {
            if (!courseRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            course.setId(id); // Ensure the ID is set correctly
            Course updatedCourse = courseRepository.save(course);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
