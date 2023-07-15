import React, { useContext, useEffect, useState } from 'react'
import './QuestionPage.scss'
import { Avatar, Box, Button, Modal, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { CreateQuestion, GetListQuestionByTime } from '../../api/questionAPI';
import PopupShowCard from './PopupShowCard';
import { NotificationContext } from '../../context/NotificationContext';


export default function QuestionPage({ listQuestion, setListQuestion }) {

    const { showInfo } = useContext(NotificationContext)

    // modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        if (localStorage.getItem('token')) {
            setOpen(true)
        } else {
            showInfo('Bạn cần đăng nhập để đặt câu hỏi!')
        }
    };
    const handleClose = () => setOpen(false);
    // load question
    const [isQuestionLoad, setIsQuestionLoad] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // get max value of scroll
            const element = document.documentElement;
            const maxScroll = element.scrollHeight - element.clientHeight;
            // get current value of scroll
            const scrollValue = document.documentElement.scrollTop;
            if (scrollValue >= maxScroll && isQuestionLoad) {
                const elements = document.getElementsByClassName('question-card');
                if (elements.length > 0) {
                    const lastElement = elements[elements.length - 1];
                    const lastElementId = lastElement.id;
                    // id have value is timestamp
                    if (isQuestionLoad) {
                        GetListQuestionByTime(lastElementId).then(res => {
                            // console.log(res);
                            if (res) {
                                if (res.length > 0) {
                                    console.log(res);
                                    setListQuestion([...listQuestion, ...res])
                                } else {
                                    console.log('end');
                                    setIsQuestionLoad(false)
                                }
                            }
                        }
                        )
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <h3>
                Câu hỏi mới nhất
                <Button variant="contained" onClick={handleOpen}
                    style={
                        {
                            float: 'right',
                            marginRight: '2%',
                            height: '2rem',
                            backgroundColor: '#c91f1fb6',
                        }
                    }>
                    <i className="fa-regular fa-circle-plus fa-xl"></i>
                </Button>
            </h3>
            <div id='question-page'>
                {
                    listQuestion.map((qcard, index) => {
                        return <QuestionCard qcard={qcard} key={index} listQuestion={listQuestion} setListQuestion={setIsQuestionLoad} />
                    }
                    )
                }
            </div>
            {isQuestionLoad && <WaitQuestion id='wait-question' />}
            <PopupCreateQuestion open={open} handleClose={handleClose} />
        </>
    )
}

function QuestionCard({ qcard, listQuestion, setListQuestion }) {
    const [isPopup, setIsPopup] = useState(false);

    return (
        <div className='question-card' id={qcard.createDate} onClick={() => { setIsPopup(true) }}>
            {isPopup && <PopupShowCard qcard={qcard} setIsPopup={setIsPopup} listQuestion={listQuestion} setListQuestion={setListQuestion} />}
            <div className='author'>
                <Avatar alt="Remy Sharp" src={qcard.avatar}
                    style={{ width: '2rem', height: '2rem', marginRight: '1rem' }}
                />
                <div className='text'>@{qcard.username} - {FormatDate(qcard.createDate)}</div>
            </div>
            <div className='content'>
                {qcard.content}
            </div>
            <hr />
            <div className='action'>
                <Button variant="outlined"
                    style={{ height: '2rem', width: 'fit-content', marginRight: '.5rem' }}
                ><i className="fa-duotone fa-comments-question-check fa-lg" style={{ marginRight: '.5rem' }} />{qcard.answers.length} câu trả lời
                </Button>
            </div>
        </div>
    )
}

function PopupCreateQuestion({ open, handleClose }) {

    const { showError, showSuccess, showWarning, showInfo } = useContext(NotificationContext)

    const style = {
        position: 'absolute',
        top: '30%',
        left: '23%',
        width: '50%',
        bgcolor: 'background.paper',
        borderRadius: '1.5rem',
        boxShadow: '0 0 0.5rem 0.1rem #00000050',
        p: '2%',
    };

    const [previewUrl, setPreviewUrl] = useState('');
    const [questionText, setQuestionText] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                var type = reader.result.split('/')[0].split(':')[1];
                if (type === 'image') {
                    console.log(reader.result);
                    setPreviewUrl(reader.result);

                } else {
                    showError('That is not an image. Please try again.');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleQuestionTextChange = (event) => {
        setQuestionText(event.target.value);
    };

    function createQuestion() {

        var token = localStorage.getItem('token');
        if (token) {
            if (questionText !== '') {
                CreateQuestion(previewUrl, questionText, token).then(res => {
                    if (res.acknowledged) {
                        handleClose();
                        showSuccess('Successfully created question.');
                    } else {
                        showError("Failed to create question. Please try again.")
                    }
                })
            } else {
                showWarning('Please enter a question');
            }
        } else {
            showInfo('Please login to create question.');
        }
    }

    return (
        <>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <p>Chọn hình minh họa (optional)</p>
                        <input type='file' id='create-question-img' accept="image/*" onChange={handleFileChange} />
                    </div>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <p>Nội dung câu hỏi.</p>
                        <TextField id='create-question-context' sx={{ width: '100%', color: '#c91f1fb6' }} onChange={handleQuestionTextChange} />
                    </Typography>
                    <Button variant="contained" style={{ float: 'right', marginTop: '1rem', backgroundColor: '#c91f1fb6' }}
                        onClick={createQuestion}
                    >Đăng</Button>
                </Box>
            </Modal>
        </>
    );
}

function WaitQuestion() {
    return (
        <Stack spacing={1}>
            <Skeleton variant="rectangular" height={100}
                style={
                    {
                        width: '100%',
                        borderRadius: '.5rem',
                        boxShadow: ' 0 0 0.5rem 0.1rem #0000001a'
                    }
                }
            />
        </Stack>
    );
}

function FormatDate(date) {
    const postDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).format(postDate);
    return formattedDate;
}
