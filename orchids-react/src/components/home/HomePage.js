import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss'
import Avatar from '@mui/material/Avatar';

import Login from '../personal/Login';
import { GetListPostByTime, GetListPostByTimeDefault } from '../../api/postAPI';
import PopupPost from './PopupPost';
import WaitPost from './WaitPost';
import QuestionPage from '../question_page/QuestionPage';
import { GetListQuestionByTimeDefault } from '../../api/questionAPI';
import { getAllTeams } from '../../api/teamAPI';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import IconImage from '../common/IconImage';



export default function HomePage({ isLogin, setIsLogin }) {
    const [listPost, setListPost] = useState([]);
    const [listQuestion, setListQuestion] = useState([]);
    const [allTeams, setAllTeams] = useState([])
    const [myTeam, setMyTeam] = useState([])
    const [popularTeams, setPopularTeams] = useState([])

    useEffect(() => {
        const fetchAllTeams = async () => {
            const response = await getAllTeams();
            setAllTeams(response);

            if (response) {

                // perform filtering of all teams to get my teams
                const currentEmail = localStorage.getItem('email');
                const mine = response.filter(team => {
                    return team.EmailOwner === currentEmail
                }).slice(0, 5)
                setMyTeam(mine);

                // perform sorting of all teams to get popular teams
                const popular = response.sort((obj1, obj2) => {
                    return obj2.ListEmailFollower.length - obj1.ListEmailFollower.length
                }).slice(0, 10);
                setPopularTeams(popular);
            }
        }

        fetchAllTeams();
    }, [])

    const navigate = useNavigate();

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
    function CardMini({ team }) {
        return (
            <Box className='card-mini' onClick={() => navigate(`/team/${team.email}`)}>
                <Box component="img" src={team.avatar} alt="avatar" sx={{ width: "50px", height: "50px" }} />
            </Box>
        )
    }

    // load data
    useEffect(() => {
        // scroll to top
        window.scrollTo(0, 0);
        GetListPostByTimeDefault().then(res => {
            setListPost(res);
        })
        GetListQuestionByTimeDefault().then(res => {
            if (res) {
                console.log(res);
                setListQuestion(res)
            }
        }
        )
    }, [])

    function HomeDesktop() {
        const [isPostLoad, setIsPostLoad] = useState(true);

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
                        GetListPostByTime(lastElementId).then(res => {
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
        }, [isPostLoad]);

        return (
            <div className='wrap-home'>
                {isLogin ?
                    <div className='home-left'>
                        <div className='go-to-page-btn' onClick={() => { navigate('/personal') }}>
                            <Avatar alt="Remy Sharp" src={localStorage.getItem('avatar')} style={{ marginLeft: '1rem' }} />
                            <p style={{ fontSize: '1rem', lineHeight: '10px', fontWeight: 'bold' }}>@{localStorage.getItem('username')}</p>
                        </div>

                        <hr style={{ width: '95%', color: 'gray' }} />
                        <div id='your-teams-board' style={{ overflow: 'hidden', marginLeft: "5px" }}>
                            <YourTeams teams={myTeam} />
                        </div>
                    </div>
                    : <div className='home-left'>
                        <br />
                        <h5 style={{ marginLeft: '2.3rem' }}>*Đăng nhập để có trải nghiệm tốt nhất</h5>
                        <Login setIsLogin={setIsLogin} getMini={'true'} />
                    </div>}
                <div className='home-center'>
                    {
                        window.location.pathname === '/' ?
                            (
                                <>
                                    <h3 style={{ marginBottom: '2rem' }}>
                                        Bài viết mới nhất
                                    </h3>
                                    {listPost.map((post, index) => (
                                        <CardPost post={post} key={index} />
                                    ))}
                                    <div id='wait-post'>
                                        <WaitPost />
                                    </div>
                                </>
                            )
                            :
                            <>
                                <QuestionPage listQuestion={listQuestion} setListQuestion={setListQuestion} />
                            </>
                    }
                </div>
                <div className='home-right'>
                    {isLogin ?
                        <>
                            <div className='hint' style={{ marginLeft: '2%', color: 'gray' }}>
                                <h3>Đề xuất</h3>
                            </div>
                            <hr></hr>
                            {
                                popularTeams.map((team, index) => {
                                    return (
                                        <CardMini team={team} />
                                    )
                                })
                            }
                        </>
                        : <></>}
                </div>
            </div >
        )
    }

    function HomeMobile() {
        return (
            <></>
        )
    }

    return (
        <>
            {window.innerWidth >= 1200 && <HomeDesktop />}
            {window.innerWidth < 1200 && <HomeMobile />}
        </>
    )
}

function YourTeams({ teams }) {
    const navigate = useNavigate();

    // function handleOnclickYourTeam() {
    //     var e = document.getElementById('your-teams-board');
    //     var e1 = document.getElementById('your-teams-expan');
    //     if (e.style.height === '1.8rem') {
    //         e.style.height = 'fit-content';
    //         e1.style.rotate = '0deg';
    //     } else {
    //         e.style.height = '1.8rem';
    //         e1.style.rotate = '180deg';
    //     }
    // }

    return (
        <>
            <Accordion defaultExpanded sx={{ bgcolor: "transparent" }} variant='outlined'>
                <AccordionSummary>
                    <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <Typography variant='h6' flexGrow={1} color='gray' fontWeight="bold" id='your-teams-expan'><i className="fa-duotone fa-people-group" /> Nhóm của bạn</Typography>
                        <i className="fa-solid fa-caret-down fa-lg"/>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' gap={1}>
                        {
                            teams.map((team) => (
                                <Card variant='outlined' sx={{ height: "70px", width: "100%", p: 0, bgcolor: "#f0f2f5" }}>
                                    <CardActionArea onClick={() => navigate(`/teams/${team.email}`)} sx={{ display: "flex", height: "100%", width: "100%", justifyContent: "flex-start" }}>
                                        <CardMedia image={team.avatar} sx={{ height: "100%", width: "35%", objectFit: "cover" }} />
                                        <CardContent sx={{ width: "70%" }}>
                                            <Typography fontSize=".9rem">{team.teamname}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        }
                        <Button variant='contained' onClick={() => navigate('/personal/teams')}>Xem thêm</Button>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* <h3 style={{ margin: '2%', color: 'gray' }}>
                <i className="fa-duotone fa-people-group"></i> Nhóm của bạn
                <i className="fa-solid fa-caret-down fa-lg" id='your-teams-expan' onClick={handleOnclickYourTeam} style={{ marginLeft: '.5rem', rotate: '180deg' }}></i>
            </h3>
            {
                teams.map((team, index) => (
                    <div className='go-to-page-btn' onClick={() => { navigate(`/teams/${team.email}`) }}>
                        <Avatar alt="Remy Sharp" src={team.avatar} style={{ marginLeft: '1rem' }} />
                        <p style={{ fontSize: '1rem', lineHeight: '10px', fontWeight: 'bold' }}>{team.teamname}</p>
                    </div>
                ))
            }
            <Button variant="contained" color="primary" style={{ margin: '2rem 0 0 2rem' }} onClick={() => { navigate('/personal/teams') }}>Show more</Button> */}
        </>
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
