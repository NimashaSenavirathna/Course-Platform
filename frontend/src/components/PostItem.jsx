import React from 'react';

const PostItem = ({ post, onDelete }) => {
    return (
        <div style={{ border: '5px solid #aaa', padding: '5px', marginBottom: '5px' }}>
            <p>{post.text}</p>
            <button onClick={() => onDelete(post.id)}>Move to bin</button>
        </div>
    );
};

export default PostItem;
