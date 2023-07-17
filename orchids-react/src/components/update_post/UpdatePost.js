import React, { useState, useRef, useEffect, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { DeletePost, GetPostInfo, UpdatePost } from '../../api/postAPI';
import Login from '../personal/Login';
import { NotificationContext } from '../../context/NotificationContext';
import { ConfirmContext } from '../../context/ConfirmContext';

export default function UpdatePostPage() {

    const [isLogin, setIsLogin] = React.useState(localStorage.getItem('token') ? true : false);

    return (
        <>
            {isLogin ? <EditPost /> : <Login setIsLogin={setIsLogin} />}
        </>
    )

}

function EditPost() {

    const { showError, showSuccess } = useContext(NotificationContext);
    const { openConfirm } = useContext(ConfirmContext);

    const navigate = useNavigate();
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [content, setContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [title, setTitle] = useState('');
    const [postId, setPostId] = useState('');

    // load comp editor
    useEffect(() => {
        if (editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Enter your text...',
            });
            quillRef.current.on('text-change', () => {
                setContent(quillRef.current.root.innerHTML);
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        setPostId(postId);
        if (postId) {
            GetPostInfo(postId).then(res => {
                setTitle(res.title);
                setContent(res.content);
                setPreviewUrl(res.bground);
                quillRef.current.root.innerHTML = res.content;
            });
        }
    }, []);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                var type = reader.result.split('/')[0].split(':')[1];
                // console.log(type);
                if (type === 'image') {
                    setPreviewUrl(reader.result);
                    showSuccess('Successfully uploaded image.');
                } else {
                    showError('That is not an image. Please try again.');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSave = () => {
        // console.log('Title:', title);
        // console.log('Content:', content);
        // console.log('Selected File:', previewUrl);

        if (previewUrl !== '') {
            if (title !== '' && content !== '') {
                UpdatePost(postId, title, content, previewUrl).then(res => {
                    console.log(res);
                    if (res.acknowledged === true && res.modifiedCount === 1 && res.matchedCount === 1) {
                        showSuccess("Post updated successfully.")
                        navigate('/personal');
                    } else {
                        showError("Failed to update post.")
                    }
                });
            } else {
                showError('Please enter title and content');
            }
        } else {
            showError('Please choose a image');
        }
    };

    const handleDelete = () => {
        openConfirm('Are you sure you want to delete this post?', () => {
            DeletePost(postId).then(res => {
                console.log(res);
                if (res.acknowledged === true && res.deletedCount === 1) {
                    showSuccess('Post deleted successfully.')
                    navigate('/personal');
                } else {
                    showError('Failed to delete post.')
                }
            });
        })
    };

    return (
        <div id='create-post-page'>
            {previewUrl && (
                <img src={previewUrl} alt='Preview' style={{ width: '100%', height: '20rem', objectFit: 'cover' }} />
            )}
            <input type='file' onChange={handleFileChange} />
            <br /><br />
            <br /><br />
            <input type='text' placeholder='Nhập tiêu đề' maxLength={100} value={title} onChange={handleTitleChange} />
            <br /><br />
            <div ref={editorRef} />
            <br /><br />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <button className='btn' style={{ marginLeft: '85%' }} onClick={handleSave}>Save</button>
                <button className='btn' style={{ marginLeft: '0', backgroundColor: 'red', color: 'white' }}
                    onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}
