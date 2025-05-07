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

  return (
    <Router>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h2>      </h2>
        <PostForm onAdd={handleAdd} />
        <PostList posts={posts} onDelete={handleDelete} />
      </div>
  );
};

export default App;
