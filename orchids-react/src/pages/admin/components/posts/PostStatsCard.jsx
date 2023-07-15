import { Box, Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AddBoxIcon from '@mui/icons-material/AddBox';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { StatsCard as Card } from '../StatsCard';
import { getDaysAgo } from '../../util/Utility';
import { PostContext } from '../../context/providers/PostContext';
import { PostDetailsContext } from '../../context/PostDetailsContext';

export default function PostStatsCard() {

    const { postStats: data } = useContext(PostContext).stats;
    const { handleOpenFetch } = useContext(PostDetailsContext);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Paper
                component="section"
                variant="outlined"
                sx={{ p: 1, px: 2, display: 'flex', alignItems: 'center' }}
            >
                <Typography variant="h5" fontWeight="700">
                    Statistics
                </Typography>
            </Paper>
            <Card
                label="Total posts"
                data={data?.total}
                unit={'post(s)'}
                Icon={() => (
                    <PersonIcon
                        sx={{
                            bgcolor: 'rgb(254, 145, 145)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(141, 0, 0)'
                        }}
                    />
                )}
            />
            <Card
                label="Latest post"
                data={data?.latestPost?.title || 'N/A'}
                caption={`Posted ${getDaysAgo(data?.latestPost?.date)} day(s) ago`}
                onClick={() => handleOpenFetch(data?.latestPost?._id)}
                Icon={() => (
                    <AdminPanelSettingsIcon
                        sx={{
                            bgcolor: 'rgb(145, 254, 145)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(0, 141, 0)'
                        }}
                    />
                )}
            />
            <Card
                label="Posts in last 7 days"
                data={data?.postCreatedInLast7Days}
                unit="post(s)"
                Icon={() => (
                    <PersonOffIcon
                        sx={{
                            bgcolor: 'rgb(145, 145, 254)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(0, 0, 141)'
                        }}
                    />
                )}
            />
            <Card
                label="Most liked"
                data={data?.mostLikedPost?.title || 'N/A'}
                caption={`Posted ${data?.mostLikedPost?.NumberLikes} questions(s)`}
                onClick={() => handleOpenFetch(data?.mostLikedPost?._id)}
                Icon={() => (
                    <QuestionMarkIcon
                        sx={{
                            bgcolor: 'rgb(100, 100, 100)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(0, 0, 0)'
                        }}
                    />
                )}
            />
            <Card
                label="Most commented"
                data={data?.mostCommentedPost?.title}
                caption={`Posted ${data?.mostCommentedPost?.NumberComments} comment(s)`}
                onClick={() => handleOpenFetch(data?.mostCommentedPost?._id)}
                Icon={() => (
                    <AddBoxIcon
                        sx={{
                            bgcolor: 'rgb(254, 254, 145)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(141, 141, 0)'
                        }}
                    />
                )}
            />
        </Box>
    );
}