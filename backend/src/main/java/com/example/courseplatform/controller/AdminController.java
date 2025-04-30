package com.example.courseplatform.controller;

import com.example.courseplatform.model.Course;
import com.example.courseplatform.model.Coupon;
import com.example.courseplatform.repository.CourseRepository;
import com.example.courseplatform.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CouponRepository couponRepository;

    // Add Course
    @PostMapping("/courses")
    public ResponseEntity<?> addCourse(@RequestBody Course course) {
        try {
            // Validate required fields
            if (course.getTitle() == null || course.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Course title is required");
            }
            if (course.getDescription() == null || course.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Course description is required");
            }
            if (course.getPrice() == null || course.getPrice() <= 0) {
                return ResponseEntity.badRequest().body("Course price must be greater than 0");
            }

            Course savedCourse = courseRepository.save(course);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add course: " + e.getMessage());
        }
    }

    // Delete Course
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        try {
            Optional<Course> course = courseRepository.findById(id);
            if (course.isPresent()) {
                courseRepository.deleteById(id);
                return ResponseEntity.ok("Course deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Course not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete course: " + e.getMessage());
        }
    }

    // Add Coupon
    @PostMapping("/coupons")
    public ResponseEntity<Coupon> addCoupon(@RequestBody Coupon coupon) {
        Coupon savedCoupon = couponRepository.save(coupon);
        return new ResponseEntity<>(savedCoupon, HttpStatus.CREATED);
    }

    // Delete Coupon
    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable String id) {
        Optional<Coupon> coupon = couponRepository.findById(id);
        if (coupon.isPresent()) {
            couponRepository.deleteById(id);
            return new ResponseEntity<>("Coupon deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Coupon not found", HttpStatus.NOT_FOUND);
        }
    }

    // View all Coupons
    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getCoupons() {
        List<Coupon> coupons = couponRepository.findAll();
        if (coupons.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(coupons, HttpStatus.OK);
    }
}
