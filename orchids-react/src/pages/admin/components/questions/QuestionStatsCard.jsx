import React, { useContext } from 'react';
import { QuestionContext } from '../../context/providers/QuestionContext';
import { QuestionDetailsContext } from '../../context/QuestionDetailsContext';
import { Box, Paper, Typography } from '@mui/material';
import { StatsCard as Card } from '../StatsCard';
import QuestionMark from '@mui/icons-material/QuestionMark';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export default function QuestionStatsCard() {
    const { questionStats: data } = useContext(QuestionContext).stats;
    const { handleOpenFetch } = useContext(QuestionDetailsContext);

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
                label="Total Questions"
                data={data?.total}
                unit="questions"
                Icon={() => (
                    <QuestionMark
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
                label="Total Answers"
                data={data?.totalAnswers}
                unit="answers"
                Icon={() => (
                    <QuestionAnswerIcon
                        sx={{
                            bgcolor: 'rgb(160, 153, 231)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(10, 13, 154)'
                        }}
                    />
                )}
            />
            <Card
                label="Created in last 7 days"
                data={data?.questionsCreatedInLast7Days}
                unit="questions"
                Icon={() => (
                    <CalendarMonthIcon
                        sx={{
                            bgcolor: 'rgb(144, 220, 163)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(18, 143, 34)'
                        }}
                    />
                )}
            />
            <Card
                label="Latest questions"
                data={data?.latestQuestion?.content.slice(0, 20)}
                onClick={() => handleOpenFetch(data?.latestQuestion._id)}
                Icon={() => (
                    <ContactSupportIcon
                        sx={{
                            bgcolor: 'rgb(227, 163, 210)',
                            height: '100%',
                            width: '100%',
                            p: 1,
                            borderRadius: 10,
                            color: 'rgb(108, 18, 95)'
                        }}
                    />
                )}
            />
        </Box>
    );
}
