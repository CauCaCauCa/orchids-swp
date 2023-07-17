import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import AnswerInput from "./AnswerInput";
import { Avatar } from '@mui/material';
import { GetListUsernameByEmails } from '../../api/accountAPI';
import { DeleteAnswer, DeleteQuestion, LikeAnswer, UnlikeAnswer } from '../../api/questionAPI';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { ConfirmContext } from '../../context/ConfirmContext';

export default function PopupShowCard({ qcard, setIsPopup, listQuestion, setListQuestion }) {
    const [isAnswerLoad, setIsAnswerLoad] = React.useState(true);
    const navigate = useNavigate();
    const { showSuccess, showError, showInfo } = React.useContext(NotificationContext)
    const { openConfirm } = React.useContext(ConfirmContext)

    function changeIsAnswerLoad() {
        setIsAnswerLoad(!isAnswerLoad);
    }

    const styleShowPopupCard = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,.5)',
        zIndex: '1',
        overflowY: 'scroll',
    };

    const boardStyle = {
        position: 'absolute',
        top: '9%',
        left: '25%',
        width: '46%',
        backgroundColor: 'white',
        boxShadow: '0 0 0.5rem 0.1rem #00000050',
        padding: '2%',
        borderRadius: '0.5rem',
    };


    useEffect(() => {
        // Turn off scroll bar when the component is mounted
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0';

        document.getElementById('close').addEventListener('click', () => {
            if (setIsPopup) {
                setIsPopup(false);
            } else {
                navigate('/question');
            }
        });

        // get list email of answer
        const emails = new Set();
        qcard.answers.forEach(answer => {
            emails.add(answer.emailCreator);
        });
        // console.log([...emails]);
        // get username and avatar
        GetListUsernameByEmails([...emails]).then(res => {
            // console.log(res);
            qcard.answers.forEach(answer => {
                res.forEach(user => {
                    if (answer.emailCreator === user.email) {
                        answer.username = user.username;
                        answer.avatar = user.avatar;
                    }
                });
            });
        });

        // Restore scroll bar when the component is unmounted
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = null;
        };
    }, []);


    function deleteAnswer(questionId, answerTime) {
        DeleteAnswer(questionId, answerTime).then(res => {
            console.log(res);
            if (res.acknowledged === true && res.modifiedCount === 1) {
                showSuccess('Xóa câu trả lời thành công');
                setIsAnswerLoad(!isAnswerLoad);
                // delete in list answer
                qcard.answers.forEach((answer, index) => {
                    if (answer.createDate === answerTime && answer.emailCreator === localStorage.getItem('email')) {
                        qcard.answers.splice(index, 1);
                    }
                }
                );
            }
        }
        );
    }
    // emailCreator is email of owner answer
    function likeAnswer(questionId, emailCreator, answerTime) {
        LikeAnswer(questionId, emailCreator, answerTime).then(res => {
            console.log(res);
            if (res.acknowledged === true) {
                setIsAnswerLoad(!isAnswerLoad);
                // add in list like
                qcard.answers.forEach((answer) => {
                    if (answer.createDate === answerTime && answer.emailCreator === emailCreator) {
                        answer.likes.push(localStorage.getItem('email'));
                    }
                }
                );
            }
        }
        );
    }
    function unlikeAnswer(questionId, emailCreator, answerTime) {
        UnlikeAnswer(questionId, emailCreator, answerTime).then(res => {
            console.log(res);
            if (res.acknowledged === true) {
                setIsAnswerLoad(!isAnswerLoad);
                // delete in list like
                qcard.answers.forEach((answer, index) => {
                    if (answer.createDate === answerTime && answer.emailCreator === emailCreator) {
                        answer.likes.forEach((like, index) => {
                            if (like === localStorage.getItem('email')) {
                                answer.likes.splice(index, 1);
                            }
                        });
                    }
                }
                );
            }
        }
        );
    }

    return (
        <div style={styleShowPopupCard}>
            <i className="fa-solid fa-xmark fa-2xl" id="close"
                style={
                    {
                        position: 'fixed',
                        top: '8rem',
                        right: '21rem',
                        color: 'black',
                        cursor: 'pointer',
                    }
                }
            ></i>
            <div style={boardStyle}>
                {qcard.image &&
                    <img src={qcard.image} alt="qcard"
                        style={{
                            width: '100%',
                            height: '20rem',
                            objectFit: 'cover',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0 0.5rem 0.1rem #00000050',
                        }} />
                }
                <p style={{ color: 'gray' }}>
                    <Avatar src={qcard.avatar}
                        onClick={() => navigate(`/view/user?username=${qcard.username}`)}
                        sx={{ width: 45, height: 45, display: 'inline-block', position: 'relative', top: '.7rem' }} />
                    <b> @{qcard.username}</b> - {FormatDate(qcard.createDate)}
                    {
                        qcard.creatorEmail === localStorage.getItem('email') &&
                        <i className="fa-solid fa-trash-can-xmark"
                            onClick={() => {
                                openConfirm('Bạn chắc chắn muốn xóa câu hỏi này?', () => (
                                    DeleteQuestion(qcard._id).then(res => {
                                        console.log(res);
                                        if (res.acknowledged === true && res.deletedCount === 1) {
                                            showSuccess('Xóa câu hỏi thành công');
                                            setIsPopup(false);
                                            if (listQuestion) {
                                                // delete in list question
                                                listQuestion.forEach((question, index) => {
                                                    if (question._id === qcard._id) {
                                                        listQuestion.splice(index, 1);
                                                    }
                                                }
                                                );
                                                setListQuestion([...listQuestion]);
                                            }
                                        }
                                    })
                                ))
                            }}
                            style={{
                                marginLeft: '1rem',
                                color: 'red',
                            }}
                        ></i>
                    }
                </p>
                <h1 style={{
                    wordWrap: 'break-word'
                }}>{qcard.content}</h1>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Viết câu trả lời</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AnswerInput questionID={qcard._id} qcard={qcard} changeIsAnswerLoad={changeIsAnswerLoad} />
                    </AccordionDetails>
                </Accordion>
                <h4>Câu trả lời ({qcard.answers.length})</h4>
                {qcard.answers.reverse().map((answer, index) => {
                    return (
                        <div key={index} style={{ padding: '0 5%', border: '1px gray solid', marginBottom: '.5rem', borderRadius: '.2rem' }}>
                            <p style={{ color: 'gray' }}>
                                <Avatar src={answer.avatar} sx={{ width: 30, height: 30, display: 'inline-block', position: 'relative', top: '.7rem' }} />
                                <b> @{answer.username}</b> - {FormatDate(answer.createDate)}
                                {!answer.likes.includes(localStorage.getItem('email')) ?
                                    <i className="fa-regular fa-heart fa-lg"
                                        onClick={() => likeAnswer(qcard._id, answer.emailCreator, answer.createDate)}
                                        style={{
                                            color: 'black',
                                            marginLeft: '1rem',
                                            cursor: 'pointer',
                                        }}>
                                    </i>
                                    :
                                    <i className="fa-solid fa-heart fa-lg"
                                        onClick={() => unlikeAnswer(qcard._id, answer.emailCreator, answer.createDate)}
                                        style={{
                                            color: 'red',
                                            marginLeft: '1rem',
                                            cursor: 'pointer',
                                        }}
                                    ></i>
                                }
                                <span>{" " + answer.likes.length}</span>
                                {
                                    answer.emailCreator === localStorage.getItem('email') &&
                                    <span style={{ position: 'absolute', right: '3rem', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-pen-to-square fa-md" style={{ color: 'black' }}></i>
                                        <i class="fa-solid fa-trash" style={{ color: 'red', marginLeft: '1rem' }}
                                            onClick={() => deleteAnswer(qcard._id, answer.createDate)}
                                        ></i>
                                    </span>
                                }
                            </p>
                            <div>
                            </div>
                            <div id="content" dangerouslySetInnerHTML={{ __html: answer.content }}
                                style={{ marginBottom: '1rem', marginLeft: '1rem', wordWrap: 'break-word' }}
                            ></div>
                        </div>
                    );
                })
                }
            </div>
        </div >
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