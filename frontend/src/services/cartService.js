import axios from 'axios';
import { getCourses } from './courseService';

const API_BASE_URL = 'http://localhost:8080/api';

export const addToCart = async (cartItem) => {
  console.log('Sending cart item to backend:', {
    ...cartItem,
    price: Number(cartItem.price) || 0,
    quantity: Number(cartItem.quantity) || 1
  });

  try {
    // First check if the course is already in the cart
    const cartResponse = await axios.get(`${API_BASE_URL}/cart/view/${cartItem.userId}`);
    const existingItem = cartResponse.data.find(item => item.courseId === cartItem.courseId);

    if (existingItem) {
      throw new Error('This course is already in your cart');
    }

    // If not in cart, add it
    return await axios.post(`${API_BASE_URL}/cart/add`, cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const viewCart = async (userId) => {
  console.log('Fetching cart for user:', userId);
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/view/${userId}`);
    console.log('Raw cart response:', response);
    
    if (!response.data) {
      console.log('No data in response');
      return { data: [] };
    }

    // Get all available courses
    const coursesResponse = await axios.get(`${API_BASE_URL}/courses`);
    const courses = coursesResponse.data || [];
    console.log('Available courses:', courses);

    // Process cart items and enrich with course details
    const cartItems = response.data.map(cartItem => {
      const course = courses.find(c => c.id === cartItem.courseId);
      console.log('Matching course for cart item:', { cartItem, course });
      
      if (!course) {
        console.warn(`Course not found for cart item: ${cartItem.courseId}`);
        return null;
      }

      return {
        ...cartItem,
        courseTitle: course.title,
        price: Number(course.price) || 0,
        description: course.description || '',
        quantity: Number(cartItem.quantity) || 1
      };
    }).filter(item => item !== null); // Remove any null items

    console.log('Processed cart items:', cartItems);
    return { data: cartItems };
  } catch (error) {
    console.error('Error in viewCart:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const removeFromCart = async (userId, courseId) => {
  console.log('Removing item from cart:', { userId, courseId });
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/remove`, {
      userId: userId.toString(),
      courseId: courseId.toString()
    });
    console.log('Remove response:', response);
    return response;
  } catch (error) {
    console.error('Error removing from cart:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};
