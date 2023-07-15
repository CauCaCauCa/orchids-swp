import { createContext, useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import IconImage from '../../../components/common/IconImage';
import { formatDate } from '../util/Utility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { GetOnePost } from '../../../api/adminAPI';

export const PostDetailsContext = createContext();

export default function PostDetailsProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({});
    const navigate = useNavigate();

    function handleOpen(post) {
        setCurrent(post);
        setOpen(true);
    }

    function handleOpenFetch(postId) {
        setCurrent(null);
        const fetchByEmail = async () => {
            const response = await GetOnePost(postId);
            if (response) {
                setCurrent(response);
            } else {
                console.log('FAILURE');
            }
        };
        postId && fetchByEmail();
        setOpen(true);
    }

    return (
        <PostDetailsContext.Provider value={{ handleOpen, handleOpenFetch }}>
            {children}
            {current === null || current === undefined ? (
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
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
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
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
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="700">
                                        Likes
                                    </Typography>
                                    <Typography variant="h6" fontWeight="700">
                                        {current.ListEmailLiked?.length}
                                    </Typography>
                                </Paper>
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2, width: '100%' }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
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
                                    {current.ListComment?.map((comment) => (
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 2, width: '100%', mt: 2 }}
                                        >
                                            <Typography variant="caption">
                                                {comment.email} |{' '}
                                                {formatDate(comment.date)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                dangerouslySetInnerHTML={{
                                                    __html: comment.content
                                                }}
                                            />
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <FavoriteIcon />{' '}
                                                {comment.ListEmailLiked?.length}
                                            </Box>
                                        </Paper>
                                    ))}
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </PostDetailsContext.Provider>
    );
}
