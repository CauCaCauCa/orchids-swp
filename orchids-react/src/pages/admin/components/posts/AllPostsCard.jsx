import { useContext } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PostContext } from '../../context/providers/PostContext';
import { ViewId, formatDate } from '../../util/Utility';
import DropdownMenu from '../../../../components/common/DropdownMenu';
import CustomTablePaginated from '../../../../components/common/CustomTablePaginated';
import { PostDetailsContext } from '../../context/PostDetailsContext';
import { AccountDetailsContext } from '../../context/AccountDetailsContext';
import { TableColumn } from '../../util/classes';

export default function AllPostsCard() {
    const { posts, changePage, isLoading, totalPosts } =
        useContext(PostContext).data;
    const { handleOpenFetch } = useContext(AccountDetailsContext);

    // #region data

    const columns = [
        new TableColumn('title', 'Title', 350, (row) => (
            <ViewId data={row.title} max={10} />
        )),
        new TableColumn(
            'creator',
            'Creator',
            100,
            (row) => row.emailCreator,
            (row) => handleOpenFetch(row.emailCreator)
        ),
        new TableColumn('createdAt', 'Created At', 100, (row) =>
            formatDate(row.date)
        ),
        new TableColumn('interaction', 'Interaction', 100, (row) => (
            <Box display="flex" alignItems="center" gap={1}>
                <Typography
                    sx={{
                        display: 'flex',
                        gap: 1,
                        bgcolor: 'rgb(202, 213, 255)',
                        p: 1,
                        borderRadius: 1,
                        fontWeight: 700,
                        color: 'rgb(17, 26, 164)'
                    }}
                >
                    <InsertCommentIcon />
                    {row.ListComment.length}
                </Typography>
                <Typography
                    sx={{
                        display: 'flex',
                        gap: 1,
                        bgcolor: 'rgb(255, 216, 216)',
                        p: 1,
                        borderRadius: 1,
                        fontWeight: 700,
                        color: 'rgb(211, 21, 21)'
                    }}
                >
                    <FavoriteIcon />
                    {row.ListEmailLiked.length}
                </Typography>
            </Box>
        ))
    ];

    function Actions({ row }) {
        const { handleOpen } = useContext(PostDetailsContext);

        return (
            <DropdownMenu
                Icon={MoreVertIcon}
                options={[
                    <Button
                        onClick={() => handleOpen(row)}
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="view"
                    >
                        <RemoveRedEyeIcon />
                        <Typography variant="body1">View</Typography>
                    </Button>
                ]}
            />
        );
    }

    // #endregion

    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h5" fontWeight="700">
                    All Posts
                </Typography>
            </Box>
            <CustomTablePaginated
                listOfObjects={posts}
                numberOfObjects={totalPosts}
                Actions={Actions}
                columns={columns}
                isLoading={isLoading}
                changePage={changePage}
            />
        </Paper>
    );
}
