import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  const defaultImage = 'https://placehold.co/600x400?text=Course+Image';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/courses');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
      setError('');
    } catch (error) {
      setError(`Failed to load courses: ${error.message}`);
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      // Validate course data
      if (!newCourse.title || !newCourse.description || !newCourse.price) {
        throw new Error('Please fill in all required fields');
      }

      const courseData = {
        ...newCourse,
        price: parseFloat(newCourse.price)
      };

      const response = await fetch('http://localhost:8080/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        throw new Error(typeof result === 'string' ? result : 'Failed to add course');
      }

      if (typeof result === 'string') {
        throw new Error(result);
      }

      setCourses([...courses, result]);
      setShowAddModal(false);
      setNewCourse({ title: '', description: '', price: '', imageUrl: '' });
      setError('');
    } catch (error) {
      setError(`Failed to add course: ${error.message}`);
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      // Validate course data
      if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.price) {
        throw new Error('Please fill in all required fields');
      }

      const courseData = {
        ...selectedCourse,
        price: parseFloat(selectedCourse.price)
      };

      const response = await fetch(`http://localhost:8080/api/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to update course';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const updatedCourse = await response.json();
      setCourses(courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      ));
      setShowEditModal(false);
      setSelectedCourse(null);
      setError('');
    } catch (error) {
      setError(`Failed to update course: ${error.message}`);
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/courses/${id}`, {
        method: 'DELETE',
      });

      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        throw new Error(typeof result === 'string' ? result : 'Failed to delete course');
      }

      setCourses(courses.filter(course => course.id !== id));
      setError('');
    } catch (error) {
      setError(`Failed to delete course: ${error.message}`);
      console.error('Error deleting course:', error);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedCourses = () => {
    return [...filteredCourses].sort((a, b) => {
      if (sortField === 'price') {
        return sortDirection === 'asc' 
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      }
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-left">
          <h1>Course Management</h1>
          <p className="subtitle">Manage your course catalog</p>
        </div>
        <div className="admin-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-course-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add New Course
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-controls">
        <div className="sort-controls">
          <span>Sort by:</span>
          <button 
            className={`sort-btn ${sortField === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            Title {sortField === 'title' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
          </button>
          <button 
            className={`sort-btn ${sortField === 'price' ? 'active' : ''}`}
            onClick={() => handleSort('price')}
          >
            Price {sortField === 'price' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
          </button>
        </div>
        <div className="course-count">
          {getSortedCourses().length} courses found
        </div>
      </div>

      <div className="courses-grid">
        {getSortedCourses().map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img 
                src={course.imageUrl || defaultImage} 
                alt={course.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-footer">
                <span className="price">${course.price}</span>
                <div className="course-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    title="Edit course"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCourse(course.id)}
                    title="Delete course"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content compact">
            <div className="modal-header">
              <h2>Add New Course</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                    placeholder="Course title"
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                  placeholder="Brief course description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <div className="image-input-container">
                  <input
                    type="url"
                    value={newCourse.imageUrl}
                    onChange={(e) => setNewCourse({ ...newCourse, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="image-preview small">
                    <img 
                      src={newCourse.imageUrl || defaultImage} 
                      alt="Preview" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Add Course</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="modal">
          <div className="modal-content compact">
            <div className="modal-header">
              <h2>Edit Course</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditCourse}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                    required
                    placeholder="Course title"
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={selectedCourse.price}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  required
                  placeholder="Brief course description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <div className="image-input-container">
                  <input
                    type="url"
                    value={selectedCourse.imageUrl}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="image-preview small">
                    <img 
                      src={selectedCourse.imageUrl || defaultImage} 
                      alt="Preview" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
