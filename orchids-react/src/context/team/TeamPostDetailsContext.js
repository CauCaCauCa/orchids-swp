import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    CircularProgress,
    TextField,
    IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import IconImage from '../../components/common/IconImage';
import { formatDate } from '../../pages/admin/util/Utility';
import IosShareIcon from '@mui/icons-material/IosShare';
import { TeamPostContext } from './TeamPostsContextProvider';

export const TeamPostDetailsContext = createContext();

export default function TeamPostDetailsContextProvider({ children }) {
    const { listPosts, addComment, toggleLikeComment } =
        useContext(TeamPostContext);
    const [id, setId] = useState(null);
    const current = useMemo(() => {
        return listPosts?.find((post) => post._id === id);
    }, [listPosts, id]);

    const [open, setOpen] = useState(false);
    const [listComments, setListComments] = useState(undefined);
    const [commentTextField, setCommentTextField] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setListComments(current?.ListComment);
    }, [current]);

    const comments = useMemo(() => {
        return listComments
            ?.sort((a, b) => {
                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;
                return 0;
            })
            .map((comment) => (
                <Paper variant="outlined" sx={{ p: 2, width: '100%', mt: 2 }}>
                    <Typography variant="caption">
                        {comment.email} | {formatDate(comment.date)}
                    </Typography>
                    <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                            __html: comment.content
                        }}
                        mb={2}
                    />
                    <Chip
                        icon={<FavoriteIcon />}
                        label={comment.ListEmailLiked?.length}
                        onClick={() =>
                            handleLikeComment(comment.date, comment.email)
                        }
                    />
                </Paper>
            ));
    }, [listComments]);

    function handleOpen(post) {
        setId(post._id);
        setOpen(true);
    }

    async function handleCreateComment() {
        const response = await addComment(id, commentTextField);
        if (response) {
            setCommentTextField('');
            setListComments((prev) => {
                return [response, ...prev];
            });
        }
    }

    async function handleLikeComment(commentDate, commentCreator) {
        const response = await toggleLikeComment(
            id,
            commentDate,
            commentCreator
        );
        console.log(response);
        if (response) {
            const email = localStorage.getItem('email');
            setListComments((prev) => {
                return prev.map((comment) => {
                    if (
                        comment.date === commentDate &&
                        comment.email === commentCreator
                    ) {
                        if (comment.ListEmailLiked.includes(email)) {
                            console.log(comment);
                            comment.ListEmailLiked =
                                comment.ListEmailLiked.filter(
                                    (item) => item !== email
                                );
                            console.log(comment.ListEmailLiked);
                        } else {
                            comment.ListEmailLiked.push(email);
                        }
                    }
                    return comment;
                });
            });
        }
    }

    return (
        <TeamPostDetailsContext.Provider value={{ handleOpen }}>
            {children}
            {current === null || current === undefined ? (
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                    <DialogTitle>Post Details</DialogTitle>
                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3
                        }}
                    >
                        <CircularProgress />
                        <Typography component="div" variant="body1">
                            Loading...
                        </Typography>
                    </DialogContent>
                </Dialog>
            ) : (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{ sx: { width: '90vw' } }}
                    maxWidth={false}
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" flexGrow={1}>
                                {current.title}
                            </Typography>
                            <Button
                                onClick={() =>
                                    navigate(`/post-page?id=${current._id}`)
                                }
                            >
                                View
                            </Button>
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={8}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                            >
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2, width: '100%' }}
                                >
                                    <IconImage
                                        src={current.bground}
                                        alt="background"
                                        sx={{
                                            width: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '1rem',
                                            mb: 2
                                        }}
                                    />
                                    <Typography variant="h4">
                                        {current.title}
                                    </Typography>
                                    <Typography variant="caption">
                                        {formatDate(current.date)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        dangerouslySetInnerHTML={{
                                            __html: current.content
                                        }}
                                    />
                                    <Typography variant="subtitle2">
                                        - Created by {current.emailCreator}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={4}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                            >
                                <Box display="flex" gap={2}>
                                    <Paper
                                        variant="outlined"
                                        component={Button}
                                        sx={{
                                            p: 2,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textTransform: 'none'
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight="700"
                                        >
                                            Likes
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight="700"
                                        >
                                            {current.ListEmailLiked?.length}
                                        </Typography>
                                    </Paper>
                                    <Paper
                                        variant="outlined"
                                        component={Button}
                                        sx={{
                                            p: 2,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textTransform: 'none'
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight="700"
                                        >
                                            Share
                                        </Typography>
                                    </Paper>
                                </Box>
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2, width: '100%' }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={2}
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight="700"
                                        >
                                            Comments
                                        </Typography>
                                        <Chip
                                            label={`${current.ListComment?.length} comment(s)`}
                                        />
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <TextField
                                            variant="standard"
                                            fullWidth
                                            label="Add a comment"
                                            value={commentTextField}
                                            onChange={(e) =>
                                                setCommentTextField(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <IconButton
                                            onClick={handleCreateComment}
                                        >
                                            <IosShareIcon />
                                        </IconButton>
                                    </Box>
                                    {comments}
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </TeamPostDetailsContext.Provider>
    );
}
