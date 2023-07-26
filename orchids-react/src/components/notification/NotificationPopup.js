import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
    deleteNotification,
    getNotifications,
    setHasSeen
} from '../../api/notificationAPI';
import { IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ConfirmContext } from '../../context/ConfirmContext';
import { NotificationContext } from '../../context/NotificationContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 500,
    overflowY: 'auto    ',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4
};

export default function NotificationPopup({ children }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { openConfirm } = React.useContext(ConfirmContext);
    const navigate = useNavigate();

    const { showSuccess, showInfo } = React.useContext(NotificationContext);

    const [listNotifications, setListNotifications] = React.useState([]);
    const [isHaveNotification, setIsHaveNotification] = React.useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotifications()
                .then((res) => {
                    res.forEach((item) => {
                        if (item.hasSeen === false) {
                            setIsHaveNotification(true);
                        }
                    });
                    setListNotifications(res.reverse());
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        // set interval to check notification every 5 seconds
        const interval = setInterval(() => {
            if (localStorage.getItem('token')) {
                getNotifications()
                    .then((res) => {
                        res.forEach((item) => {
                            if (item.hasSeen === false) {
                                setIsHaveNotification(true);
                            }
                        });
                        setListNotifications(res.reverse());
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    function handleDeleteNotification(item) {
        deleteNotification(item._id);
        setListNotifications(
            listNotifications.filter((noti) => noti._id !== item._id)
        );
        showSuccess('Delete notification successfully!');
    }

    return (
        <>
            <a
                className="nvb-notification"
                onClick={handleOpen}
                style={{ marginLeft: '1rem', cursor: 'pointer' }}
            >
                {children}
            </a>
            {isHaveNotification && (
                <div
                    style={{
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        width: '.6rem',
                        height: '.6rem',
                        position: 'relative',
                        top: '-1.5rem',
                        left: '-6.9rem'
                    }}
                ></div>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {!localStorage.getItem('token') && (
                        <h3
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            Xin hãy đăng nhập!
                        </h3>
                    )}
                    {localStorage.getItem('token') && (
                        <>
                            {listNotifications.length === 0
                                ? 'Bạn không có thông báo!'
                                : listNotifications.map((item, index) => {
                                      return (
                                          <div key={index}>
                                              <IconButton
                                                  style={{
                                                      position: 'relative',
                                                      left: '85%',
                                                      top: '4rem',
                                                      color: 'red',
                                                      cursor: 'pointer'
                                                  }}
                                              >
                                                  <i
                                                      className="fa-solid fa-trash-can-xmark"
                                                      onClick={() => {
                                                          if (
                                                              window.confirm(
                                                                  'Bạn có chắc chắn muốn xóa thông báo này?'
                                                              )
                                                          ) {
                                                              handleDeleteNotification(
                                                                  item
                                                              );
                                                          }
                                                      }}
                                                  ></i>
                                              </IconButton>
                                              <Paper
                                                  elevation={4}
                                                  style={{
                                                      padding: '1rem 2rem',
                                                      marginBottom: '1rem',
                                                      cursor: 'pointer'
                                                  }}
                                                  onClick={() => {
                                                      setHasSeen(item._id);
                                                      if (
                                                          item.type ===
                                                              'comment' ||
                                                          item.type ===
                                                              'has a new post'
                                                      ) {
                                                          navigate(
                                                              `/post-page?id=${item.id}`
                                                          );
                                                      } else if (
                                                          item.type === 'answer'
                                                      ) {
                                                          navigate(
                                                              `/question-page?id=${item.id}`
                                                          );
                                                      } else {
                                                          navigate(
                                                              `/teams/${item.from}`
                                                          );
                                                      }
                                                  }}
                                              >
                                                  <p>
                                                      {item.type ===
                                                      'comment' ? (
                                                          <>
                                                              Someone{' '}
                                                              {item.type} your
                                                              post
                                                          </>
                                                      ) : item.type ===
                                                        'has a new post' ? (
                                                          <>
                                                              Someone{' '}
                                                              {item.type}
                                                          </>
                                                      ) : item.type ===
                                                        'teamMember' ? (
                                                          <>
                                                              You have been
                                                              added to a team
                                                          </>
                                                      ) : (
                                                          <>
                                                              Someone{' '}
                                                              {item.type} your
                                                              question
                                                          </>
                                                      )}
                                                      <div
                                                          style={{
                                                              borderRadius:
                                                                  '50%',
                                                              backgroundColor:
                                                                  item.hasSeen
                                                                      ? 'gray'
                                                                      : 'aqua',
                                                              width: '.6rem',
                                                              height: '.6rem',
                                                              position:
                                                                  'relative',
                                                              top: '-1rem',
                                                              left: '16.9rem'
                                                          }}
                                                      ></div>
                                                  </p>

                                                  <p>{FormatDate(item.date)}</p>
                                              </Paper>
                                          </div>
                                      );
                                  })}
                        </>
                    )}
                </Box>
            </Modal>
        </>
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
        second: 'numeric'
    }).format(postDate);
    return formattedDate;
}
