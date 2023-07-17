import React, { useState, useRef, useEffect, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { CommentPost } from '../../api/postAPI';
import { NotificationContext } from '../../context/NotificationContext';

export default function Comment({ postId, setPost, post }) {
  const [commentText, setCommentText] = useState('');
  const { showSuccess, showError, showInfo } = useContext(NotificationContext);

  const handleCommentSubmit = () => {
    if (commentText !== '') {
      CommentPost(postId, commentText).then(res => {
        if (res.acknowledged === true) {
          showSuccess('Comment successfully!');
          setCommentText('');
          quillRef.current.root.innerHTML = '';
          post.ListComment.push({ date: Date.now(), email: localStorage.getItem('email'), content: commentText, ListEmailLiked: [] })
          // sort comment
          post.ListComment.sort((a, b) => {
            return b.date - a.date;
          });
          setPost({ ...post });
        } else {
          showError('Comment fail!');
        }
      })
    } else {
      showInfo('Please enter a comment');
    }
  };

  const editorRef = useRef(null);
  const quillRef = useRef(null);


  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Enter your text...',
      });
      quillRef.current.on('text-change', () => {
        setCommentText(quillRef.current.root.innerHTML);
      });
    }
  }, []);


  const styleComment = {
    width: '80%',
    marginLeft: '10%',
  }
  return (
    <div style={styleComment}>
      <h3>Bình luận</h3>
      <div ref={editorRef}></div>
      <br />
      <button onClick={handleCommentSubmit}>Submit Comment</button>
    </div>
  );
}
