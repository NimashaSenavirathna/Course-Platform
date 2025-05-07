// src/components/PostList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "./CommentSection";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios.get("http://localhost:8080/api/posts")
            .then(res => setPosts(res.data))
            .catch(err => console.log(err));
    };

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) return;
        try {
            await axios.post("http://localhost:8080/api/posts", {
                title,
                content,
                userId: "demo-user", // Replace with actual user ID
            });
            setTitle("");
            setContent("");
            fetchPosts();
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    // Filter posts based on search query
    const filteredPosts = posts.filter(
        post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h2>All Posts</h2>

            {/* 🔍 Search Input */}
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 20, borderRadius: 4 }}
            />

            {/* 📝 Create Post Section */}
            <div style={{ marginBottom: 20, padding: 15, border: "1px solid #ccc", borderRadius: 8 }}>
                <h3>Create a New Post</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 4 }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    style={{ width: "100%", padding: 8, borderRadius: 4, marginBottom: 10 }}
                />
                <button onClick={handleCreatePost} style={{ padding: "8px 16px", borderRadius: 4 }}>
                    Create Post
                </button>
            </div>

            {/* 📋 Filtered Post List */}
            {filteredPosts.map(post => (
                <div key={post.id} style={{ border: "1px solid gray", marginBottom: 15, padding: 15, borderRadius: 8 }}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <CommentSection postId={post.id} />
                </div>
            ))}
        </div>
    );
}
