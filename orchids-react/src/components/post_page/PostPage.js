import React, { useContext, useEffect, useState } from 'react';
import {
    DeleteCommentPost,
    GetPostInfo,
    LikeCommentPost,
    UnlikeCommentPost
} from '../../api/postAPI';
import { LikePost, UnlikePost } from '../../api/postAPI';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';

import './PostPage.scss';
import Skeleton from '@mui/material/Skeleton';
import { Avatar } from '@mui/material';
import Comment from './Comment';
import { GetListUsernameByEmails } from '../../api/accountAPI';
import { ConfirmContext } from '../../context/ConfirmContext';

export default function PostPage({ PostData, isAllowedEdits = false }) {
    const [post, setPost] = useState(null);
    const [likeAmount, setLikeAmount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [usernameList, setUsernameList] = useState(null);

    const { openConfirm } = useContext(ConfirmContext);

    const { showSuccess, showError } = useContext(NotificationContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!PostData) {
            // get id from url
            const urlParams = new URLSearchParams(window.location.search);
            window.scrollTo(0, 0);
            const id = urlParams.get('id');
            // get post by id
            GetPostInfo(id).then((res) => {
                // check if user liked this post
                if (
                    res.ListEmailLiked.includes(localStorage.getItem('email'))
                ) {
                    setIsLiked(true);
                }
                setPost(res);
                // get list username by emails
                var list = res.ListComment.map((comment) => comment.email);
                var uniqueList = [...new Set(list)];
                GetListUsernameByEmails(uniqueList).then((res) => {
                    setUsernameList(res);
                });
            });
        } else {
            setPost(PostData);
            setLikeAmount(PostData.ListEmailLiked.length);
            // check if user liked this post
            if (
                PostData.ListEmailLiked.includes(localStorage.getItem('email'))
            ) {
                setIsLiked(true);
            }
            // get list username by emails
            var list = PostData.ListComment.map((comment) => comment.email);
            var uniqueList = [...new Set(list)];
            GetListUsernameByEmails(uniqueList).then((res) => {
                setUsernameList(res);
            });
        }
    }, []);

    function like() {
        if (isLiked == false) {
            setIsLiked(true);
            LikePost(post._id).then((res) => {
                if (res.acknowledged == true) {
                    post.ListEmailLiked.push(localStorage.getItem('email'));
                    setLikeAmount(likeAmount + 1);
                    showSuccess('Liked successfully!');
                } else {
                    showError('Failed to like post. Please try again later.');
                }
            });
        } else {
            UnlikePost(post._id).then((res) => {
                setIsLiked(false);
                if (res.acknowledged == true) {
                    post.ListEmailLiked.pop(localStorage.getItem('email'));
                    setLikeAmount(likeAmount - 1);
                    showSuccess('Unliked successfully!');
                } else {
                    showError('Failed to unlike post. Please try again later.');
                }
            });
        }
    }

    function likeComment(postId, dateComment, emailCommentor) {
        LikeCommentPost(postId, dateComment, emailCommentor).then((res) => {
            if (res.acknowledged == true) {
                post.ListComment.find(
                    (comment) =>
                        comment.date == dateComment &&
                        comment.email == emailCommentor
                ).ListEmailLiked.push(localStorage.getItem('email'));
                setPost({ ...post });
            } else {
                showError('like fail');
            }
        });
    }

    function unlikeComment(postId, dateComment, emailCommentor) {
        UnlikeCommentPost(postId, dateComment, emailCommentor).then((res) => {
            if (res.acknowledged == true) {
                post.ListComment.find(
                    (comment) =>
                        comment.date == dateComment &&
                        comment.email == emailCommentor
                ).ListEmailLiked.pop(localStorage.getItem('email'));
                setPost({ ...post });
            } else {
                showError('unlike fail');
            }
        });
    }

    return (
        <>
            {post != null ? (
                <div id="post-page">
                    <div id="bground">
                        <img src={post.bground} alt="#" />
                    </div>
                    <div id="head">
                        <div id="title">{post.title}</div>
                        <div id="author">
                            <Avatar
                                id="avatar"
                                src={post.avatar}
                                alt="#"
                                onClick={() => {
                                    if (post.isTeam) {
                                        navigate(`/teams/${post.emailCreator}`);
                                    } else {
                                        navigate(
                                            `/view/user?username=${post.username}`
                                        );
                                    }
                                }}
                            />
                            <span style={{ marginRight: '.5rem' }}>
                                @{post.username}
                            </span>{' '}
                            {FormatDate(post.date)}
                            {(post.emailCreator ==
                                localStorage.getItem('email') ||
                                isAllowedEdits) && (
                                <button
                                    style={{ marginLeft: '2rem' }}
                                    onClick={() =>
                                        openConfirm(
                                            'Bạn muốn chỉnh sửa bài viết này?',
                                            () =>
                                                navigate(
                                                    `/edit-post?id=${post._id}`
                                                )
                                        )
                                    }
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                            )}
                            <button
                                style={{ position: 'absolute', right: '13rem' }}
                                onClick={like}
                            >
                                {isLiked ? (
                                    <i className="fa-solid fa-thumbs-up">
                                        {' ' + post.ListEmailLiked.length}
                                    </i>
                                ) : (
                                    <i className="fa-regular fa-thumbs-up">
                                        {' ' + post.ListEmailLiked.length}
                                    </i>
                                )}
                            </button>
                            <button
                                id="share"
                                style={{ position: 'absolute', right: '7rem' }}
                                onClick={() =>
                                    copyToClipboard(
                                        `http://localhost:3000/post-page?id=${post._id}`
                                    )
                                }
                            >
                                <i className="fa-regular fa-share">
                                    {' ' + 'Share'}
                                </i>
                                <div id="msg-share">Copy to clipboard</div>
                            </button>
                        </div>
                    </div>
                    <hr style={{ width: '80%' }} />
                    <div
                        id="content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>
                    <hr style={{ width: '80%' }} />
                    <Comment postId={post._id} setPost={setPost} post={post} />
                    <hr style={{ width: '80%' }} />
                    <div id="comment-list">
                        {usernameList != null ? (
                            post.ListComment.map((comment, index) => {
                                var user = usernameList.find(
                                    (username) =>
                                        username.email === comment.email
                                );
                                if (user) {
                                    comment.username = user.username;
                                    comment.avatar = user.avatar;
                                } else {
                                    comment.username =
                                        localStorage.getItem('username');
                                    comment.avatar =
                                        localStorage.getItem('avatar');
                                }
                                return (
                                    <>
                                        <div className="comment">
                                            <div id="author">
                                                <Avatar
                                                    id="avatar"
                                                    src={comment.avatar}
                                                    alt="#"
                                                />
                                                <span
                                                    style={{
                                                        marginRight: '.5rem'
                                                    }}
                                                >
                                                    @{comment.username}
                                                </span>{' '}
                                                {FormatDate(comment.date)}
                                                {!comment.ListEmailLiked.includes(
                                                    localStorage.getItem(
                                                        'email'
                                                    )
                                                ) ? (
                                                    <i
                                                        className="fa-regular fa-heart fa-lg"
                                                        onClick={() =>
                                                            likeComment(
                                                                post._id,
                                                                comment.date,
                                                                comment.email
                                                            )
                                                        }
                                                        style={{
                                                            color: 'black',
                                                            marginLeft: '1rem',
                                                            cursor: 'pointer'
                                                        }}
                                                    ></i>
                                                ) : (
                                                    <i
                                                        className="fa-solid fa-heart fa-lg"
                                                        onClick={() =>
                                                            unlikeComment(
                                                                post._id,
                                                                comment.date,
                                                                comment.email
                                                            )
                                                        }
                                                        style={{
                                                            color: 'red',
                                                            marginLeft: '1rem',
                                                            cursor: 'pointer'
                                                        }}
                                                    ></i>
                                                )}
                                                {' ' +
                                                    comment.ListEmailLiked
                                                        .length}
                                                {comment.email ==
                                                    localStorage.getItem(
                                                        'email'
                                                    ) && (
                                                    <i
                                                        className="fa-solid fa-trash"
                                                        style={{
                                                            color: '#ff0000',
                                                            position:
                                                                'absolute',
                                                            right: '10rem',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() =>
                                                            openConfirm(
                                                                'Bạn muốn xóa bình luận này?',
                                                                () => {
                                                                    var date =
                                                                        comment.date;
                                                                    var postId =
                                                                        post._id;
                                                                    var email =
                                                                        comment.email;
                                                                    DeleteCommentPost(
                                                                        postId,
                                                                        date
                                                                    ).then(
                                                                        (
                                                                            res
                                                                        ) => {
                                                                            if (
                                                                                res.acknowledged ==
                                                                                true
                                                                            ) {
                                                                                showSuccess(
                                                                                    'Comment deleted successfully.'
                                                                                );
                                                                                var newCommentList =
                                                                                    post.ListComment.filter(
                                                                                        (
                                                                                            commentfilter
                                                                                        ) =>
                                                                                            commentfilter.date !=
                                                                                                comment.date ||
                                                                                            commentfilter.email !=
                                                                                                comment.email
                                                                                    );
                                                                                post.ListComment =
                                                                                    newCommentList;
                                                                                setPost(
                                                                                    {
                                                                                        ...post
                                                                                    }
                                                                                );
                                                                            } else {
                                                                                showError(
                                                                                    'Failed to delete comment. Please try again.'
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div
                                                id="content"
                                                dangerouslySetInnerHTML={{
                                                    __html: comment.content
                                                }}
                                            ></div>
                                        </div>
                                        <hr style={{ width: '80%' }} />
                                    </>
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <Waiting />
            )}
            {/* // <Waiting /> */}
        </>
    );
}

function Waiting() {
    const styleWaiting = {
        width: '100%',
        height: '100vh'
    };
    return (
        <div style={styleWaiting}>
            {/* <Skeleton variant="circular" width={1000} height={100} /> */}
            {/* <Skeleton variant="rectangular" width={210} height={60} /> */}
            <Skeleton
                variant="rounded"
                style={{
                    width: '70%',
                    height: '40rem',
                    marginLeft: '15%'
                }}
            />
        </div>
    );
}

function copyToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            console.log('Text copied to clipboard');
            // You can show a success message or perform any additional actions here
        })
        .catch((error) => {
            console.error('Failed to copy text to clipboard:', error);
            // You can show an error message or handle the error as needed
        });
}

function FormatDate(date) {
    const postDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(postDate);
    return formattedDate;
}
