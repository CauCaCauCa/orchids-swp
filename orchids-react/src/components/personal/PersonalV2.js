import React, { useContext, useEffect, useState } from 'react'
// import { GetPersonalInfo, UpdateUsername, UpdateBackground, } from '../FunctionAPI.js';
import { GetPersonalInfo, GetPersonalInfoToken, UpdateBackground, UpdateUsername } from '../../api/accountAPI';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';


import './PersonalV2.scss';
import TeamDashboard from '../team/team_dashboard/TeamDashboard';
import IconImage from '../common/IconImage';
import { GetListPostByTimeAndEmailCreator, GetListPostByTimeAndEmailCreatorDefault } from '../../api/postAPI';
import WaitPost from '../home/WaitPost';
import PopupPost from '../home/PopupPost';
import { NotificationContext } from '../../context/NotificationContext';
import { getListTeamInfoByEmails } from '../../api/teamAPI';

export default function PersonalV2({ selectPage }) {
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
        const [display, setDisplay] = React.useState(`${selectPage ? selectPage : 'personalpage'}`);
        const [dataCur, setDataCur] = React.useState({});
        const [listPost, setListPost] = useState([]);
        const [listTeam, setListTeam] = useState([]);


        useEffect(() => {
            GetPersonalInfoToken(localStorage.getItem('token'))
                .then(res => {
                    // console.log('res: ', res);
                    handleData(res);
                });
        }, []);

        const handleData = (data) => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            localStorage.setItem('bground', data.bground);
            localStorage.setItem('avatar', data.avatar);
            localStorage.setItem('created_at', data.created_at);
            localStorage.setItem('role', data.role);
            localStorage.setItem('numberFollowers', data.ListEmailFollower.length);
            console.log('data.ListEmailFollowing.lenght: ', data.ListEmailFollowing.length);
            localStorage.setItem('numberFollowing', data.ListEmailFollowing.length);
            localStorage.setItem('numberPost', data.numberPost);
            localStorage.setItem('numberQuestion', data.numberQuestion);
            setDataCur(data);
            console.log(JSON.stringify(data));
        };

        // load data
        useEffect(() => {
            // scroll to top
            window.scrollTo(0, 0);
            GetListPostByTimeAndEmailCreatorDefault(localStorage.getItem('email')).then(res => {
                setListPost(res);
            })
            GetPersonalInfo(localStorage.getItem('username')).then(res => {
                setListTeamData(res);
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
                            GetListPostByTimeAndEmailCreator(lastElementId, localStorage.getItem('email')).then(res => {
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
                backgroundImage: `url(${localStorage.getItem('bground')})`,
            }
            const styleModal = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                pt: 2,
                px: 4,
                pb: 3
            };
            const [open, setOpen] = React.useState(false);
            const handleOpen = () => {
                setOpen(true);
            };
            const handleClose = () => {
                setOpen(false);
            };
            const handleUpdateBG = () => {
                var file = document.getElementById('file-bg').files[0];
                console.log('file: ', file);
                const reader = new FileReader();
                reader.onload = () => {
                    var type = reader.result.split('/')[0].split(':')[1];
                    // console.log(type);
                    if (type === 'image') {
                        localStorage.setItem('bground', reader.result);
                        UpdateBackground(reader.result)
                            .then(res => {
                                if (res.msg.acknowledged === true && res.msg.modifiedCount === 1) {
                                    showSuccess('Background updated successfully!');
                                } else {
                                    showError('Background update failed');
                                }
                            })
                    } else {
                        showError('That is not an image');
                    }
                };
                try {
                    reader.readAsDataURL(file);
                } catch (error) {
                    showError('That is not an image');
                }
            }


            // read data

            return (
                <div id='personalPage'>
                    <div className='personalPage-header' style={styleBG} onClick={handleOpen}>
                        <IconImage src={localStorage.getItem('avatar')} alt='#' />
                    </div>
                    <div className='personalPage-header-name'>
                        @{localStorage.getItem('username')}
                    </div>
                    <div className='personalPage-header-followers'>
                        {localStorage.getItem('numberFollowers')} người theo dõi
                    </div>
                    <div className='personalPage-body'>
                        <div className='personalPage-body-bio'>
                            <div className='personalPage-body-bio-sub'>
                                <div className='item'>
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span className='title'>Ngày tham gia: </span>
                                    {
                                        (new Date(parseInt(localStorage.getItem('created_at'))).toLocaleString()).split(',')[0]
                                    }
                                </div>
                                <div className='item'>
                                    <i className="fa-regular fa-rectangle-history"></i>
                                    <span className='title'>Số lượng bài viết:</span> {" " + localStorage.getItem('numberPost')}
                                </div>
                                <div className='item'>
                                    <i className="fa-solid fa-radar"></i>
                                    <span className='title'>Đang theo dõi:</span> {localStorage.getItem('numberFollowing')}
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
                                <Button variant="contained" style={{ marginLeft: '23rem', width: '5rem', backgroundColor: '#c91f1fb6' }} onClick={() => { navigate('/create-post') }}>
                                    Tạo
                                </Button>
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

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...styleModal, width: 400 }}>
                            <h2 id="parent-modal-title">Update background</h2>
                            <input type="file" id="file-bg" accept="image/*" />
                            <Button
                                onClick={handleUpdateBG}
                                variant="contained"
                                style={{ height: '1.5rem', width: '3rem', left: '6rem' }}>update</Button>
                        </Box>
                    </Modal>
                </div>
            )
        }

        function Info() {

            function handleClick() {
                var username = document.getElementById('username-textfield').value;
                console.log('username: ', username);
                console.log('dataCur.username: ', dataCur.username);
                if (username !== dataCur.username && username !== '') {
                    console.log('oke');
                    const fetchData = async () => {
                        try {
                            const res = await UpdateUsername(username.toLowerCase());
                            if (res.msg) {
                                showError(res.msg);
                            } else {
                                showSuccess('Cập nhật thành công');
                                localStorage.setItem('username', username.toLowerCase());
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    fetchData();
                } else {
                    showInfo('Không có gì thay đổi');
                }
            }
            return (
                <div className='info-person-tag'>
                    <h3>Thông tin cá nhân</h3>
                    <TextField
                        required
                        id="username-textfield"
                        label="Username"
                        defaultValue={dataCur.username}
                        style={{ width: '90%', marginLeft: '5%' }}
                        onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/\s/g, ''); // Loại bỏ khoảng trắng
                            const maxLength = 30;
                            const truncatedValue = value.substring(0, maxLength);
                            e.target.value = truncatedValue;
                        }}
                    />
                    <br />
                    <br />
                    <br />
                    <TextField disabled
                        id="outlined-disabled"
                        label="Email cá nhân"
                        defaultValue={dataCur.email}
                        style={{ width: '90%', marginLeft: '5%' }}
                    />
                    <br />
                    <br />
                    <br />
                    <Button
                        onClick={handleClick}
                        variant="outlined"
                        style={{ width: '90%', marginLeft: '5%' }}
                    >Update</Button>
                </div>
            )
        }

        function ManagerTeam() {
            return <TeamDashboard teams={dataCur} setTeams={setDataCur} />
        }

        return (
            <div className='PersonPage'>
                <div className='Container'>
                    {display === 'personalpage' && <PersonalPage />}
                    {display === 'infomation' && <Info />}
                    {display === 'manager-team' && <ManagerTeam />}
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