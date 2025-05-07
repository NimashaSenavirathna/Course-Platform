// src/components/CreatePost.js
import React, { useState } from "react";
import axios from "axios";

export default function CreatePost() {
    const [post, setPost] = useState({ title: "", content: "", userId: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/posts", post)
            .then(res => alert("Post created"))
            .catch(err => alert("Error creating post"));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Post</h2>
            <input placeholder="Title" onChange={e => setPost({...post, title: e.target.value})} />
            <textarea placeholder="Content" onChange={e => setPost({...post, content: e.target.value})} />
            <input placeholder="User ID" onChange={e => setPost({...post, userId: e.target.value})} />
            <button type="submit">Submit</button>
        </form>
    );
}
