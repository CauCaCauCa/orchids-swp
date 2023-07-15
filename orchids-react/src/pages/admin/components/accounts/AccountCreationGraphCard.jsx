import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { AccountContext } from '../../context/providers/AccountContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AccountCreationGraphCard() {
    const { accountStats: data } = useContext(AccountContext).stats;

    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <Typography variant='h5' fontWeight="700" mb={2}>Account creation</Typography>
            <Grid container>
                <Grid item xs={12} md={4}>
                    <Pie
                        data={{
                            labels: ['Users', 'Admins'],
                            datasets: [
                                {
                                    label: 'Count',
                                    data: [data?.users, data?.admins],
                                    backgroundColor: [
                                        'rgb(255, 99, 132)',
                                        'rgb(54, 162, 235)'
                                    ],
                                    hoverOffset: 4
                                }
                            ]
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Pie
                        data={{
                            labels: ['Active', 'Inactive'],
                            datasets: [
                                {
                                    label: 'Count',
                                    data: [data?.active, data?.inactive],
                                    backgroundColor: [
                                        'rgb(255, 99, 132)',
                                        'rgb(54, 162, 235)'
                                    ],
                                    hoverOffset: 4
                                }
                            ]
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>

                </Grid>
            </Grid>
        </Paper>
    );
}
