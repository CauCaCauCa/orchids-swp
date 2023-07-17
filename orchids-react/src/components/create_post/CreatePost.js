import React, { useState, useRef, useEffect, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';
import {CreatePost} from '../../api/postAPI';
import Login from '../personal/Login';
import { NotificationContext } from '../../context/NotificationContext';

export default function CreatePostPage() {

    const [isLogin, setIsLogin] = React.useState(localStorage.getItem('token') ? true : false);

    return (
        <>
            {isLogin ? <EditPost /> : <Login setIsLogin={setIsLogin} />}
        </>
    )

}

function EditPost() {
    const { showSuccess, showError, showInfo } = useContext(NotificationContext);

    const navigate = useNavigate();
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [content, setContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [title, setTitle] = useState('');


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
                } else {
                    showError('Not image');
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
                CreatePost(title, content, previewUrl).then(res => { 
                    if (res.acknowledged === true) {
                        showSuccess('Post created successfully');
                        navigate('/personal');
                    } else {
                        showError('Failed to create post');
                    }
                });
            } else {
                showInfo('Please enter title and content');
            }
        } else {
            showInfo('Please choose a image');
        }
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
            <button className='btn' id='save' onClick={handleSave}>Save</button>
        </div>
    );
}
