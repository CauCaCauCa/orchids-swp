import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from '../notification/NotificationPopup';
import useSearch from '../../hooks/useSearch';

export default function Header({ isLogin, setIsLogin }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    var navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function Mobile() {
        return (
            <>
                <div id="navbar">
                    <Link to="/">
                        <img
                            className="logo"
                            src="./img/logo_mobile.png"
                            alt="logo"
                        />
                    </Link>
                    <Link className="nvb-alert" to="/notification">
                        <i className="fa-sharp fa-regular fa-bell fa-xl"></i>
                    </Link>
                </div>
                <div className="footer-header-mobile">
                    <Link id="-page-header" className="nvb-item" to="/">
                        <i className="fa-solid fa-house fa-xl"></i>
                        <i>
                            <img
                                src="./img/home_icon.png"
                                alt="#"
                                style={{
                                    position: 'absolute',
                                    width: '2.21rem',
                                    height: '2rem',
                                    top: '10px'
                                }}
                            ></img>
                        </i>
                    </Link>
                    <Link
                        id="people-page-header"
                        className="nvb-item"
                        to="/people"
                    >
                        <i className="fa-solid fa-user-group fa-xl"></i>
                    </Link>
                    <Link
                        id="hotnews-page-header"
                        className="nvb-item"
                        to="/hotnews"
                    >
                        <i className="fa-solid fa-flag fa-xl"></i>
                        <i className="fa-regular fa-flag fa-xl"></i>
                    </Link>
                    <Link
                        id="donate-page-header"
                        className="nvb-item"
                        to="/donate"
                    >
                        <i className="fa-solid fa-hand-holding-dollar fa-xl"></i>
                    </Link>
                    <Link
                        id="hotnews-page-header"
                        className="nvb-item"
                        to="/hotnews"
                    >
                        <i className="fa-regular fa-circle-user fa-xl"></i>
                        <i className="fa-solid fa-circle-user fa-xl"></i>
                    </Link>
                </div>
            </>
        );
    }

    function Desktop() {
        const [getComponent, handleOpen] = useSearch();
        const [curPage, setCurPage] = useState('home');

        useEffect(() => {
            turnPage();
        }, []);

        function turnPage() {
            const path = window.location.pathname;
            setCurPage(path);
            var arr = ['/', '/question', '/donate'];
            document.getElementById('-page-header').style.backgroundColor =
                'transparent';
            document.getElementById(
                'question-page-header'
            ).style.backgroundColor = 'transparent';
            document.getElementById(
                'donate-page-header'
            ).style.backgroundColor = 'transparent';
            // console.log(path.split('/')[1] + '-page-header');
            if (arr.includes('/' + path.split('/')[1])) {
                document.getElementById(
                    path.split('/')[1] + '-page-header'
                ).style.backgroundColor = '#e6e6e6cf';
            }
        }
        function showMenuOnmouse() {
            var e = document.getElementById('menu-avatar');
            var e1 = document.getElementById('avatar');
            if (e.style.display === 'none') {
                e.style.display = 'block';
                e1.focus();
                // animation
                e.style.animation = 'showMenu 0.3s ease-in-out';
            } else {
                e.style.display = 'none';
            }
        }

        const [isOnMenu, setIsOnMenu] = useState(false);
        function blurMenuAvatar() {
            var e = document.getElementById('menu-avatar');
            if (isOnMenu) {
                setTimeout(() => {
                    e.style.display = 'none';
                }, 300);
            } else {
                e.style.display = 'none';
            }
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('username');
            // localStorage.removeItem('avatar');
            localStorage.removeItem('bground');
            localStorage.removeItem('created_at');
            localStorage.removeItem('numberFollowers');
            localStorage.removeItem('numberFollowing');
            localStorage.removeItem('numberPost');
            localStorage.removeItem('numberQuestion');
            localStorage.removeItem('role');
            setIsLogin(false);
        }
        return (
            <div id="navbar">
                <div className="left">
                    <Link to="/">
                        <img
                            className="logo"
                            src="../img/logo2.png"
                            alt="logo"
                        />
                    </Link>
                </div>
                <div className="right">
                    <div>
                        <Link id="-page-header" className="nvb-item" to="/">
                            {curPage == '/' ? (
                                <i className="fa-solid fa-blog fa-xl"></i>
                            ) : (
                                <i className="fa-duotone fa-blog fa-xl"></i>
                            )}
                        </Link>
                        <Link
                            id="question-page-header"
                            className="nvb-item"
                            to="/question"
                        >
                            {curPage == '/question' ? (
                                <i className="fa-solid fa-messages-question fa-xl"></i>
                            ) : (
                                <i className="fa-regular fa-messages-question fa-xl"></i>
                            )}
                        </Link>
                        <Link
                            id="donate-page-header"
                            className="nvb-item"
                            to="/donate"
                        >
                            {curPage == '/donate' ? (
                                <i className="fa-solid fa-hand-holding-heart fa-xl"></i>
                            ) : (
                                <i className="fa-regular fa-hand-holding-heart fa-xl"></i>
                            )}
                        </Link>
                    </div>

                    <form className="search">
                        <i className="fa-solid fa-magnifying-glass fa-lg" onClick={handleOpen}
                        style={{
                            cursor: 'pointer',
                            marginTop: '-1.2rem',
                        }}></i>
                        <NotificationPopup>
                            <i className="fa-solid fa-bell fa-xl"></i>
                        </NotificationPopup>
                        <div className="nvb-avatar">
                            {isLogin ? (
                                <Avatar
                                    src={localStorage.getItem('avatar')}
                                    alt={localStorage.getItem('username')}
                                    id="avatar"
                                    style={{
                                        height: '2.6rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer'
                                    }}
                                    onClick={showMenuOnmouse}
                                    onBlur={blurMenuAvatar}
                                    tabIndex="0"
                                />
                            ) : (
                                <Link to="/personal">
                                    <i
                                        className="fa-solid fa-user-circle fa-2xl"
                                        style={{
                                            color: 'gray',
                                            fontSize: '2.7rem',
                                            marginTop: '1.35rem'
                                        }}
                                    ></i>
                                </Link>
                            )}
                            <List
                                id="menu-avatar"
                                onMouseMove={() => {
                                    setIsOnMenu(true);
                                }}
                                onMouseLeave={() => {
                                    setIsOnMenu(false);
                                }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    boxShadow:
                                        '0px 0px 0px 2px rgba(0, 0, 0, 0.20)',
                                    display: 'none',
                                    position: 'absolute',
                                    width: '11rem',
                                    right: '0'
                                }}
                            >
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate('/personal');
                                        }}
                                    >
                                        <ListItemText primary="Trang cá nhân" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate('/personal/info');
                                        }}
                                    >
                                        <ListItemText primary="Thông tin cá nhân" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate('/personal/teams');
                                        }}
                                    >
                                        <ListItemText primary="Nhóm" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={logout}>
                                        <ListItemText primary="Đăng xuất" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </div>
                    </form>
                </div>
                {getComponent()}
            </div>
        );
    }

    return (
        <>
            {windowWidth >= 1200 && <Desktop />}
            {windowWidth < 1200 && <Mobile />}
        </>
    );
}
