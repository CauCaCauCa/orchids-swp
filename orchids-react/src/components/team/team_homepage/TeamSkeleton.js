import React from 'react'
import { Box, Container, Grid, Skeleton, Typography, Stack } from '@mui/material';

const TeamSkeleton = () => {
    return (
        <>
            <Container id="team-home">
                <header className="header">
                    <Skeleton variant="rectangular" id='banner' sx={{boxShadow: "none !important"}} />
                    <Box className='floating'>
                        <Skeleton variant="circular" id='logo' sx={{border: "none !important"}} />
                        <Box id="details">
                            <Skeleton variant="text" className="name" width="20vw" />
                            <Skeleton variant="text" className="followers" />
                        </Box>
                    </Box>
                </header>
                <main className='main'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5} className='column-container'>
                            <Skeleton variant="rectangular" className='card' height="200px" />
                            <Skeleton variant="rectangular" className='card' height="200px" />
                        </Grid>
                        <Grid item xs={12} md={7} className='column-container'>
                            <Skeleton variant="rectangular" className='card' height="300px" />
                            <Skeleton variant="rectangular" className='card' height="300px" />
                            <Skeleton variant="rectangular" className='card' height="300px" />
                        </Grid>
                    </Grid>
                </main>
            </Container>
        </>
    )
}

export default TeamSkeleton