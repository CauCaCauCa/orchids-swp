import React, { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { AnswerQuestion } from '../../api/questionAPI';

export default function AnswerInput({ questionID, qcard, changeIsAnswerLoad }) {
  const [commentText, setCommentText] = useState('');


  const handleCommentSubmit = () => {
    if (commentText !== '') {
      var date = Date.now();
      AnswerQuestion(questionID, commentText, date).then(res => {
        if (res.acknowledged === true) {
          alert('successfully!');
          quillRef.current.root.innerHTML = '';
          qcard.answers = [{
            createDate: date,
            username: localStorage.getItem('username'),
            avatar: localStorage.getItem('avatar'),
            content: commentText,
            emailCreator: localStorage.getItem('email'),
            likes: []
          }, ...qcard.answers];
          qcard.answers = qcard.answers.sort((a, b) => -(b.createDate - a.createDate));
          setCommentText('');
          changeIsAnswerLoad();
        } else {
          alert('fail!');
        }
      })
    } else {
      alert('Please enter a comment');
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
      <div ref={editorRef}></div>
      <br />
      <button onClick={handleCommentSubmit}>Đăng</button>
    </div>
  );
}
