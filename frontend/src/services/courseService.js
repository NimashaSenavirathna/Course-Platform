import axios from 'axios';

export const getCourses = () => {
  return axios.get('http://localhost:8080/api/courses');
};
