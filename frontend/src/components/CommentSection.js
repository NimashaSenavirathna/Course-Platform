import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchComments();
        fetchLikeCount();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const fetchLikeCount = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/posts/${postId}/likes`);
            setLikeCount(res.data.count);
            setLiked(res.data.userLiked);
        } catch {
            console.log('Using local like state.');
        }
    };

    const handleLike = async () => {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        setLiked(!liked);
        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/like`, {
                userId: 'demo-user'
            });
        } catch (err) {
            console.error('Error liking the post:', err);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/social?postId=${postId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
            });
    };

    const handleAddComment = async () => {
        if (!newContent.trim()) return;
        try {
            await axios.post('http://localhost:8080/api/comments', {
                postId,
                content: newContent,
                userId: 'demo-user'
            });
            setNewContent('');
            fetchComments();
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleEditComment = (id, content) => {
        setEditingId(id);
        setEditedContent(content);
    };

    const handleUpdateComment = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/comments/${id}`, {
                content: editedContent,
            });
            setEditingId(null);
            fetchComments();
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${id}`);
            fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem', marginTop: '1rem' }}>
            {/* Like + Share Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '10px' }}>
                <button
                    onClick={handleLike}
                    style={{
                        background: liked ? '#e63946' : '#f1f1f1',
                        color: liked ? '#fff' : '#333',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {liked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <span style={{ fontWeight: 'bold' }}>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                </span>
                <button
                    onClick={handleShare}
                    style={{
                        backgroundColor: '#ffb703',
                        color: '#000',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🔗 Share
                </button>
                {copied && <span style={{ color: 'green' }}>Link copied!</span>}
            </div>

            {/* Add Comment */}
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write a comment..."
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginRight: '0.5rem'
                    }}
                />
                <button
                    onClick={handleAddComment}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2a9d8f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Post
                </button>
            </div>

            {/* Comments List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((comment) => (
                    <li key={comment.id} style={{
                        backgroundColor: '#f9f9f9',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '0.5rem',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {editingId === comment.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    style={{ flex: 1, marginRight: '0.5rem' }}
                                />
                                <button onClick={() => handleUpdateComment(comment.id)} style={{ marginRight: '0.25rem' }}>💾</button>
                                <button onClick={() => setEditingId(null)}>❌</button>
                            </>
                        ) : (
                            <>
                                <span style={{ flex: 1 }}>{comment.content}</span>
                                <div>
                                    <button
                                        onClick={() => handleEditComment(comment.id, comment.content)}
                                        style={{
                                            marginRight: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#0077cc',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#e63946',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentSection;
