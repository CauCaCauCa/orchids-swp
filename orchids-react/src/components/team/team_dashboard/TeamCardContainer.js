import { Box, Typography, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import React from 'react'
import TeamCard from './TeamCard';

const TeamContainer = React.memo(({ id = '', title = '', teams: currentTeams = [] }) => {

    const hasItems = currentTeams.length === 0;

    return (
        <Accordion disabled={hasItems} defaultExpanded={!hasItems} id={id} >
            <AccordionSummary>
                <Box width="100%" gap={1} alignItems="center" display="flex">
                    <Typography variant='h5' fontWeight="700" flexGrow={1}>{title}</Typography>
                    <Typography variant='button' fontWeight="700">{currentTeams.length} Nhóm</Typography>
                    <i className="fa-solid fa-chevron-down"></i>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} width="100%">
                    {
                        !hasItems && currentTeams.map((team) => (
                            <Grid item xs={12} md={4}>
                                <TeamCard team={team} />
                            </Grid>
                        ))
                    }
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
})

export default TeamContainer