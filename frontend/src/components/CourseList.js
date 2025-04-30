import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import { addToCart } from '../services/cartService';
import { Link } from 'react-router-dom';
import '../styles/CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (courseId, price) => {
    try {
      setAddingToCart(courseId);
      await addToCart({
        userId: 1, // This should be replaced with actual user ID from auth
        courseId,
        price,
        quantity: 1
      });
      alert('Course added to cart successfully!');
    } catch (error) {
      if (error.message === 'This course is already in your cart') {
        alert('This course is already in your cart');
      } else {
        alert('Failed to add course to cart. Please try again.');
      }
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchCourses} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <h1 className="course-list-title">Available Courses</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img 
                src={course.imageUrl || 'https://via.placeholder.com/300x200?text=Course+Image'} 
                alt={course.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                }}
              />
            </div>
            <div className="course-content">
              <h2 className="course-title">{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <div className="course-footer">
                <span className="course-price">${course.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(course.id, course.price)}
                  disabled={addingToCart === course.id}
                >
                  {addingToCart === course.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
