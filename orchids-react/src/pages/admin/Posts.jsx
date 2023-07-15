import { Box, Grid } from '@mui/material';
import AllPostsCard from './components/posts/AllPostsCard';
import PostStatsCard from './components/posts/PostStatsCard';
import PostTeamVsAccountCard from './components/posts/PostTeamVsAccountCard';

export default function Posts() {
    return (
        <Box id="posts">
            <h1>Post Management</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <AllPostsCard />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PostStatsCard />
                </Grid>
                <Grid item xs={12} md={3}>
                    <PostTeamVsAccountCard/>
                </Grid>
            </Grid>
        </Box>
    );
}
