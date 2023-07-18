import React, { useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { GetPersonalInfoToken } from '../../api/accountAPI';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { Box, Tooltip } from '@mui/material';

export default function Login({ setIsLogin, getMini }) {
    const { showError } = useContext(NotificationContext);
    const navigate = useNavigate();

    async function handleCredentialResponse(response) {
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: response.credential
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.msg) {
                    localStorage.setItem('token', data.token);
                    var obj = jwtDecode(response.credential);
                    localStorage.setItem('avatar', obj.picture);
                    GetPersonalInfoToken(data.token)
                        .then((res) => {
                            // console.log('res: ', res);
                            localStorage.setItem('username', res.username);
                            localStorage.setItem('email', res.email);
                            localStorage.setItem('bground', res.bground);
                            localStorage.setItem('created_at', res.created_at);
                            localStorage.setItem('role', res.role);
                            localStorage.setItem(
                                'numberFollowers',
                                res.ListEmailFollower.length
                            );
                            localStorage.setItem(
                                'numberFollowing',
                                res.ListEmailFollowing.length
                            );
                            localStorage.setItem('numberPost', res.numberPost);
                            localStorage.setItem(
                                'numberQuestion',
                                res.numberQuestion
                            );
                        })
                        .then(() => {
                            setIsLogin(true);
                            // navigate('/');
                        });
                } else {
                    showError(data.msg);
                }
            });
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id:
                '721133937478-2m8nenr610qpuabsgm9ffiu5peumi8vc.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(document.getElementById('SignIn'), {
            theme: 'outline',
            // size: "larger",
            shape: 'rectangular'
        });
    }, []);

    const style = {
        position: 'fixed',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '100'
    };

    const styleBox = {
        position: 'absolute',
        top: '30%',
        left: '40%',
        width: '20%',
        backgroundColor: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        height: '13rem',
        padding: '2rem 0'
    };
    return (
        <>
            {!getMini ? (
                <Box
                    sx={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: '100'
                    }}
                    onClick={() => navigate('/')}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'white',
                            borderRadius: '10px',
                            textAlign: 'center',
                            width: '350px',
                            height: 'max-content',
                            p: '2rem',
                            display: 'grid',
                            placeItems: 'center'
                        }}
                    >
                        <Tooltip title="Quay lại trang chủ" arrow placement="top">
                            <img
                                src="../img/logo_mobile.png"
                                alt="#"
                                onClick={() => {
                                    navigate('/');
                                }}
                                style={{
                                    width: '90%',
                                    borderRadius: '0.5rem',
                                    boxShadow:
                                        '0px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                                    cursor: 'pointer'
                                }}
                            />
                        </Tooltip>
                        <p>
                            Cộng đồng trực tuyến dành riêng cho những người yêu
                            thích và quan tâm đến hoa lan.
                        </p>
                        <div>
                            <div id="SignIn">Sign in with google</div>
                        </div>
                    </Box>
                </Box>
            ) : (
                <div id="SignIn" style={{ marginLeft: '2.3rem' }}>
                    Sign in with google
                </div>
            )}
        </>
    );
}
