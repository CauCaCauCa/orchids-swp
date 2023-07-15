import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import IconImage from '../../common/IconImage';

export default function TeamCard({ team }) {

    const navigate = useNavigate();

    const [currentTeam, setCurrentTeam] = React.useState(team);

    if(!currentTeam) return null;

    return (
        <Card variant='outlined' sx={{ height: "200px", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1, height: "100%" }}>
                <Box display="flex" alignItems="end" gap={2} height="100%">
                    <IconImage src={currentTeam.avatar} alt="team-logo" height="100%" width="120px" sx={{ cursor: "pointer", objectFit: "cover", borderRadius: "10px" }} onClick={() => navigate(`/teams/${team}`)} />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant='h7' fontWeight="700" lineHeight={1}>{currentTeam.teamname}</Typography>
                        <Typography variant='caption' fontWeight="200" lineHeight={1}>
                            {currentTeam.description.length < 50 ? currentTeam.description : `${currentTeam.description.slice(0, 50)}...`}</Typography>
                    </Box>
                </Box>
            </CardContent>
            <CardActions display="flex" >
                <Button variant="contained" size="small" color="primary" onClick={() => navigate(`/teams/${team.email}`)} fullWidth>Chi tiết</Button>
                <Button variant="outlined" size="small" color="primary">...</Button>
            </CardActions>
        </Card>
    )
}
