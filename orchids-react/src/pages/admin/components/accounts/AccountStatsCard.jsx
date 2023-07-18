import { Box, CssBaseline, Paper, Skeleton, Tooltip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AddBoxIcon from '@mui/icons-material/AddBox';
import GradeIcon from '@mui/icons-material/Grade';
import { useContext } from 'react';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { StatsCard as Card } from '../StatsCard';
import { AccountContext } from '../../context/providers/AccountContext';
import { AccountDetailsContext } from '../../context/AccountDetailsContext';
import { getDaysAgo } from '../../util/Utility';

export default function AccountStatsCard() {
    const { accountStats: data } = useContext(AccountContext).stats;
    const { handleOpenFetch } = useContext(AccountDetailsContext);

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
                label="Total users"
                data={data?.users}
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
                label="Most followed"
                data={data?.mostFollowedAccount?.username || 'N/A'}
                caption={`Followed by ${data?.mostFollowedAccount?.ListEmailFollowerCount} user(s)`}
                onClick={() =>
                    handleOpenFetch(data?.mostFollowedAccount?.email)
                }
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
                label="Most posts"
                data={data?.accountWithMostPosts?.username || 'N/A'}
                caption={`Posted ${data?.accountWithMostPosts?.numberPost} post(s)`}
                onClick={() =>
                    handleOpenFetch(data?.accountWithMostPosts?.email)
                }
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
                label="Most questions"
                data={data?.accountWithMostQuestions?.username || 'N/A'}
                caption={`Posted ${data?.accountWithMostQuestions?.numberQuestion} questions(s)`}
                onClick={() =>
                    handleOpenFetch(data?.accountWithMostQuestions?.email)
                }
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
                label="Created last 7 days"
                data={data?.accountsCreatedInLast7Days}
                unit="accounts"
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
            <Card
                label="Newest account"
                data={data?.latestAccountCreation?.username || 'N/A'}
                caption={`Created ${getDaysAgo(
                    data?.latestAccountCreation?.created_at
                )} days ago`}
                onClick={() =>
                    handleOpenFetch(data?.latestAccountCreation?.email)
                }
                Icon={() => (
                    <GradeIcon
                        sx={{
                            bgcolor: 'rgb(254, 145, 254)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(141, 0, 141)'
                        }}
                    />
                )}
            />
        </Box>
    );
}
