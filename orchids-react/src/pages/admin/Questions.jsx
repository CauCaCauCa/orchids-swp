import { Box, Grid } from '@mui/material'
import React from 'react'
import AllQuestionsCard from './components/questions/AllQuestionsCard'
import QuestionStatsCard from './components/questions/QuestionStatsCard'

export default function Questions() {
  return (
    <Box id="questions" width="100%">
        <h1>Questions Management</h1>
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <AllQuestionsCard/>
            </Grid>
            <Grid item xs={12} md={4}>
              <QuestionStatsCard/>
            </Grid>
        </Grid>
    </Box>
  )
}
