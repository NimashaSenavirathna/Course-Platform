import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CourseList from './components/CourseList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Success from './components/Success';
import AdminPage from './components/AdminPage';
import React, { useEffect, useState } from 'react';
import { getPosts, createPost, deletePost } from './services/api';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(res => setPosts(res.data));
  }, []);

  const handleAdd = (post) => {
    createPost(post).then(res => {
      setPosts([res.data, ...posts]);
    });
  };

  const handleDelete = (id) => {
    deletePost(id).then(() => {
      setPosts(posts.filter(post => post.id !== id));
    });
  };

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h2>      </h2>
        <PostForm onAdd={handleAdd} />
        <PostList posts={posts} onDelete={handleDelete} />
      </div>
  );
}
};

export default App;
