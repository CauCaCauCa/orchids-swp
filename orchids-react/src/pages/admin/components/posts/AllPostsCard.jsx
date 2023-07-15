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

export default function AllPostsCard() {
    const { posts, changePage, isLoading, totalPosts } =
        useContext(PostContext).data;
    const { handleOpenFetch } = useContext(AccountDetailsContext);

    // #region data

    const columns = [
        {
            id: 'title',
            label: 'Title',
            minWidth: 350,
            component: (row) => <ViewId data={row.title} max={10} />
        },
        {
            id: 'creator',
            label: 'Creator',
            minWidth: 100,
            component: (row) => row.emailCreator,
            handleClick: (row) => handleOpenFetch(row.emailCreator)
        },
        {
            id: 'createdAt',
            label: 'Created At',
            minWidth: 100,
            component: (row) => formatDate(row.date)
        },
        {
            id: 'interaction',
            label: 'Interaction',
            minWidth: 100,
            component: (row) => {
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                            sx={{
                                display: 'flex',
                                gap: 1,
                                bgcolor: 'rgb(202, 213, 255)',
                                p: 1,
                                borderRadius: 1,
                                fontWeight: 700,
                                color: 'rgb(17, 26, 164)',
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
                );
            }
        }
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
