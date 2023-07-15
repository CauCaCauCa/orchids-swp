import React, { useContext } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Paper } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { PostContext } from '../../context/providers/PostContext';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PostTeamVsAccountCard() {
    const { postStats: data } = useContext(PostContext).stats;

    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <Pie
                data={{
                    labels: ['Users', 'Teams'],
                    datasets: [
                        {
                            label: 'Posts',
                            data: [
                                data?.total - data?.teamPosts,
                                data?.teamPosts
                            ],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)'
                            ],
                            hoverOffset: 4
                        }
                    ]
                }}
            />
        </Paper>
    );
}
