import React, { useContext, useEffect, useState } from 'react'
// import { GetPersonalInfo, UpdateUsername, UpdateBackground, } from '../FunctionAPI.js';
import { FollowUser, GetPersonalInfo, GetPersonalInfoToken, UnfollowUser, UpdateBackground, UpdateUsername } from '../../api/accountAPI';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';


import './PersonalV2.scss';
import IconImage from '../common/IconImage';
import { GetListPostByTimeAndEmailCreator, GetListPostByTimeAndEmailCreatorDefault } from '../../api/postAPI';
import WaitPost from '../home/WaitPost';
import PopupPost from '../home/PopupPost';
import { NotificationContext } from '../../context/NotificationContext';
import { getListTeamInfoByEmails } from '../../api/teamAPI';

export default function ViewPersonal() {
    const navigate = useNavigate();
    const { showSuccess, showError, showInfo } = useContext(NotificationContext);


    function CardPost(post, key) {
        const [isPopup, setIsPopup] = useState(false);
        function handlePopup() {
            setIsPopup(true);
        }

        return (
            <div className='card-post' id={post.post.date} key={key}>
                {isPopup && <PopupPost PostData={post.post} setIsPopup={setIsPopup} />}
                <div>
                    {/* <Link target="_blank" to={'/post-page?id=' + post.post._id}> */}
                    <div className='title' onClick={handlePopup}>{post.post.title}</div>
                    {/* </Link> */}
                    <div className='author'>
                        @{post.post.username} - {FormatDate(post.post.date)}
                        <span style={{ margin: '0 .5rem 0 1rem' }}><i className="fa-regular fa-thumbs-up" /> {post.post.ListEmailLiked.length}</span>
                        <span style={{ margin: '0 .5rem' }}><i className="fa-regular fa-comment" /> {post.post.ListComment.length}</span>
                    </div>
                </div>
                <img src={post.post.bground} alt='#' onClick={handlePopup} />
                <hr />
                <div id='comment'>

                </div>
            </div>
        )
    }

    function Logged() {
        const [dataCur, setDataCur] = React.useState({});
        const [listPost, setListPost] = useState([]);
        const [listTeam, setListTeam] = useState([]);

        // load data
        useEffect(() => {
            // scroll to top
            window.scrollTo(0, 0);

            // get personal info by id in path url
            const params = new URLSearchParams(window.location.search);
            const username = params.get('username');
            GetPersonalInfo(username).then(res => {
                if (localStorage.getItem('email') === res.email) {
                    navigate('/personal');
                } else {
                    setDataCur(res);
                    setListTeamData(res);
                    GetListPostByTimeAndEmailCreatorDefault(res.email).then(res => {
                        setListPost(res);
                    })
                }
            })
        }, [])

        // set data
        function setListTeamData(data) {
            var list = [...data.ListEmailTeamOwner, ...data.ListEmailTeamAttend];
            getListTeamInfoByEmails(list).then(res => {
                setListTeam(res);
            }
            )
        }


        function PersonalPage() {
            const [isPostLoad, setIsPostLoad] = useState(true);
            // handle scroll
            useEffect(() => {
                const handleScroll = () => {
                    // get max value of scroll
                    const element = document.documentElement;
                    const maxScroll = element.scrollHeight - element.clientHeight;
                    // get current value of scroll
                    const scrollValue = document.documentElement.scrollTop;

                    if (scrollValue >= maxScroll && isPostLoad) {
                        const elements = document.getElementsByClassName('card-post');
                        if (elements.length > 0) {
                            const lastElement = elements[elements.length - 1];
                            const lastElementId = lastElement.id;
                            // id have value is timestamp
                            GetListPostByTimeAndEmailCreator(lastElementId, dataCur).then(res => {
                                if (res.length === 0) {
                                    var waitPost = document.getElementById('wait-post');
                                    if (waitPost) {
                                        waitPost.style.display = 'none';
                                    }
                                    setIsPostLoad(false);
                                } else {
                                    setListPost([...listPost, ...res]);
                                }
                            })
                        }
                    }
                };

                window.addEventListener('scroll', handleScroll);

                // get post list default when page load

                return () => {
                    window.removeEventListener('scroll', handleScroll);
                };
            }, []);


            const styleBG = {
                backgroundImage: `url(${dataCur.bground})`,
            }

            function handleFollow() {
                if (dataCur.ListEmailFollower?.includes(localStorage.getItem('email'))) {
                    // remove email in list follower
                    var newList = dataCur.ListEmailFollower.filter(email => email !== localStorage.getItem('email'));
                    setDataCur({ ...dataCur, ListEmailFollower: newList });
                    UnfollowUser(dataCur.email).then(res => {
                        showSuccess('Bỏ theo dõi thành công');
                    });

                } else {
                    // add email in list follower
                    var newList = [...dataCur.ListEmailFollower, localStorage.getItem('email')];
                    setDataCur({ ...dataCur, ListEmailFollower: newList });
                    FollowUser(dataCur.email).then(res => {
                        showSuccess('Theo dõi thành công');
                    });
                }
            }

            return (
                <div id='personalPage'>
                    <div className='personalPage-header' style={styleBG}>
                        <IconImage src={dataCur.avatar} alt='#' />
                    </div>
                    <div className='personalPage-header-name'>
                        @{dataCur.username}
                        {
                            dataCur.ListEmailFollower?.includes(localStorage.getItem('email'))
                                ?
                                <Button
                                    style={{
                                        height: '2rem',
                                        marginLeft: '1rem',
                                    }}
                                    onClick={handleFollow}
                                >Bỏ theo dõi</Button>
                                :
                                <Button
                                    style={{
                                        height: '2rem',
                                        marginLeft: '1rem',
                                    }}
                                    onClick={handleFollow}
                                >Theo dõi</Button>
                        }
                    </div>
                    <div className='personalPage-header-followers'>
                        {dataCur.ListEmailFollower?.length} người theo dõi
                    </div>
                    <div className='personalPage-body'>
                        <div className='personalPage-body-bio'>
                            <div className='personalPage-body-bio-sub'>
                                <div className='item'>
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span className='title'>Ngày tham gia: </span>
                                    {
                                        (new Date(parseInt(dataCur.created_at)).toLocaleString()).split(',')[0]
                                    }
                                </div>
                                <div className='item'>
                                    <i className="fa-regular fa-rectangle-history"></i>
                                    <span className='title'>Số lượng bài viết:</span> {" " + dataCur.numberPost}
                                </div>
                                <div className='item'>
                                    <i className="fa-solid fa-radar"></i>
                                    <span className='title'>Đang theo dõi:</span> {dataCur.ListEmailFollowing?.length}
                                </div>
                                <hr />
                                <h3>Nhóm</h3>
                                <div className='list-team'>
                                    {
                                        listTeam.map((team, index) => (
                                            <div className='team' key={index}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                                onClick={() => {
                                                    navigate(`/teams/${team.email}`)
                                                }}
                                            >
                                                <img src={team.avatar} alt='#' />
                                                <div className='name'>{team.teamname}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='personalPage-body-list-post-scroll'>
                            <div className='personalPage-body-list-post-scroll-sub' style={{ height: 'fit-content', padding: '1rem 0' }}>
                                <span style={{ marginLeft: '2rem', fontSize: '1.6rem', fontWeight: 'bold' }}>Bài viết</span>
                            </div>
                            <div >
                                {listPost.map((post, index) => (
                                    <CardPost post={post} key={index} />
                                ))}
                                <div id='wait-post'>
                                    <WaitPost />
                                </div>
                            </div >
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className='PersonPage'>
                <div className='Container'>
                    <PersonalPage />
                </div>
            </div>
        )
    }

    return (
        <Logged />
    )
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