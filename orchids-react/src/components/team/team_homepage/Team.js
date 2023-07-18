import {
    Box,
    Grid,
    Typography,
    Button,
    Container,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.scss';
import IconImage from '../../common/IconImage';
import TeamSkeleton from './TeamSkeleton';
import CreateTeamPost from './CreateTeamPost';
import WaitPost from '../../home/WaitPost';
import { TeamHomepageContext } from '../../../context/team/TeamHomepageContext';
import { TeamPostContext } from '../../../context/team/TeamPostsContextProvider';
import { TeamPostDetailsContext } from '../../../context/team/TeamPostDetailsContextOLD';
import { ConfirmContext } from '../../../context/ConfirmContext';

function AdminOnly({ children, role }) {
    if (role === 'creator' || role === 'admin') return children;
    return null;
}

function WriterOnly({ children, role }) {
    if (role === 'creator' || role === 'admin' || role === 'writer')
        return children;
    return null;
}

function MemberOnly({ children, role }) {
    if (role === 'admin' || role === 'writer') return children;
    return null;
}

export default function Team() {
    const navigate = useNavigate();
    const {
        team: currentTeam,
        isLoadingTeams: isLoading,
        role
    } = useContext(TeamHomepageContext);
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const { openEditTeamModal, actions } = useContext(TeamHomepageContext);
    const { openConfirm } = useContext(ConfirmContext);
    const [isFollowing, setIsFollowing] = useState(
        currentTeam?.ListEmailFollower.includes(localStorage.getItem('email'))
    );
    const handleCreatePost = () => {
        setOpenCreatePost(true);
    };

    const handleEditTeam = () => {
        openEditTeamModal(currentTeam);
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        actions.follow();
    };

    const handleLeaveTeam = () => {
        actions.leave();
        navigate('/')
    }

    if (isLoading) return <TeamSkeleton />;
    if (!currentTeam) navigate('/404');

    return (
        <>
            <Container id="team-home">
                <header className="header">
                    <IconImage
                        component="img"
                        src={currentTeam.bground}
                        alt="team-image"
                        id="banner"
                    />
                    <Box className="floating">
                        <IconImage
                            src={currentTeam.avatar}
                            alt="team-logo"
                            id="logo"
                        />
                        <Box id="details">
                            <Box className="name">{currentTeam.teamname}</Box>
                            <Box className="followers">
                                {currentTeam.ListEmailFollower.length || 0}{' '}
                                người theo dõi
                            </Box>
                        </Box>
                    </Box>
                    <Box className="follow">
                        <Button
                            variant={isFollowing ? 'outlined' : 'contained'}
                            color="primary"
                            size="large"
                            className="follow-btn"
                            onClick={handleFollow}
                        >
                            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                        </Button>
                        <MemberOnly role={role}>
                            <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={() => openConfirm('Are you sure you want to leave the team?', () => handleLeaveTeam())}
                            >
                                Leave team
                            </Button>
                        </MemberOnly>
                    </Box>
                </header>
                <main className="main">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5} className="column-container">
                            <Box className="card">
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={1}
                                >
                                    <Typography variant="h5" fontWeight="700">
                                        Giới thiệu nhóm
                                    </Typography>
                                    <AdminOnly role={role}>
                                        <Tooltip title="Edit team details">
                                            <IconButton
                                                size="small"
                                                onClick={handleEditTeam}
                                            >
                                                <i class="fas fa-edit"></i>
                                            </IconButton>
                                        </Tooltip>
                                    </AdminOnly>
                                </Stack>
                                <Typography variant="body1" mb={2}>
                                    {currentTeam.description}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    mb={0.5}
                                    display="flex"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <i className="fa-solid fa-calendar-days"></i>
                                    <span>
                                        Tham gia từ:{' '}
                                        <strong>
                                            {
                                                new Date(
                                                    parseInt(
                                                        currentTeam.create_at
                                                    )
                                                )
                                                    .toLocaleString()
                                                    .split(',')[0]
                                            }
                                        </strong>
                                    </span>
                                </Typography>
                                <Typography
                                    variant="body1"
                                    mb={0.5}
                                    display="flex"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <i className="fa-regular fa-rectangle-history"></i>
                                    <span>
                                        Số lượng bài viết:{' '}
                                        <strong>
                                            {currentTeam.NumberPost || 0}
                                        </strong>
                                    </span>
                                </Typography>
                                <Typography
                                    variant="body1"
                                    mb={0.5}
                                    display="flex"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <i className="fa-regular fa-users"></i>
                                    <span>
                                        Số lượng thành viên:{' '}
                                        <strong>
                                            {currentTeam.ListEmailMember
                                                .length || 0}
                                        </strong>
                                    </span>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={7} className="column-container">
                            <WriterOnly role={role}>
                                <Box className="card create-post">
                                    <Typography variant="h5" fontWeight="700">
                                        Bài viết
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleCreatePost}
                                    >
                                        Tạo
                                    </Button>
                                </Box>
                            </WriterOnly>
                            <Feed />
                        </Grid>
                    </Grid>
                </main>
            </Container>
            <CreateTeamPost
                open={openCreatePost}
                setOpen={setOpenCreatePost}
                teamEmail={currentTeam.email}
            />
        </>
    );
}

function CardPost({ post }) {
    const { handleOpen } = useContext(TeamPostDetailsContext);

    return (
        <Box
            className="card-post card"
            id={post.date}
            onClick={() => handleOpen(post)}
        >
            <Typography variant="h5" fontWeight="700" mb={0.5}>
                {post.title}
            </Typography>
            <Box display="flex" gap={3} mb={1.5}>
                <Typography variant="body1" mb={0.5}>
                    {post.emailCreator} - {FormatDate(post.date)}
                </Typography>
                <Typography variant="body1" mb={0.5}>
                    <i className="fa-regular fa-thumbs-up" />{' '}
                    {post.ListEmailLiked.length}
                </Typography>
                <Typography variant="body1" mb={0.5}>
                    <i className="fa-regular fa-comment-dots" />{' '}
                    {post.ListComment.length}
                </Typography>
            </Box>
            <Box
                component="img"
                src={post.bground}
                width="100%"
                height="20rem"
                borderRadius="10px"
                sx={{ objectFit: 'cover' }}
            />
        </Box>
    );
}

function Feed() {
    const [isPostLoad, setIsPostLoad] = useState(true);
    // const [listPosts, setListPosts] = useState();

    const { team } = useContext(TeamHomepageContext);
    const { listPosts, getNextPosts } = useContext(TeamPostContext);

    // useEffect(() => {
    //     const getPostsDefault = async () => {
    //         const response = await getTeamPostsByTimestampDefault(currentTeam.email);
    //         setListPosts(response);
    //     }

    //     getPostsDefault();
    // }, [currentTeam.email])

    useEffect(() => {
        const handleScroll = async () => {
            const element = document.documentElement;
            const maxScroll = element.scrollHeight - element.clientHeight;
            const scrollValue = element.scrollTop;

            if (scrollValue >= maxScroll - 10 && isPostLoad) {
                const elements = document.getElementsByClassName('card-post');
                if (elements.length > 0) {
                    const lastElement = elements[elements.length - 1];
                    const lastElementId = lastElement.id;

                    const nextPosts = await getNextPosts(lastElementId);
                    if (nextPosts === 0) {
                        var waitPost = document.getElementById('wait-post');
                        if (waitPost) {
                            waitPost.style.display = 'none';
                        }
                        setIsPostLoad(false);
                    }

                    // getTeamPostsByTimestamp(currentTeam.email, lastElementId).then(res => {
                    //     if (res) {
                    //         if (res.length === 0) {
                    //             var waitPost = document.getElementById('wait-post');
                    //             if (waitPost) {
                    //                 waitPost.style.display = 'none';
                    //             }
                    //             setIsPostLoad(false);
                    //         } else {
                    //             setListPosts([...listPosts, ...res]);
                    //         }
                    //     }
                    // })
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [team.email, isPostLoad, listPosts, getNextPosts]);

    if (listPosts === undefined) return <WaitPost />;

    return (
        <>
            {listPosts.map((post) => (
                <CardPost post={post} />
            ))}
            <div id="wait-post">
                <WaitPost />
            </div>
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
