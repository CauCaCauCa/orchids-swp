import { Box, Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ConfirmContext } from '../../../context/ConfirmContext';
import { useNavigate } from 'react-router-dom';
import { TeamHomepageContext } from '../../../context/team/TeamHomepageContext';

export default function EditTeamSettings() {
    const { openConfirm } = useContext(ConfirmContext);
    const { actions } = useContext(TeamHomepageContext);
    const navigate = useNavigate();

    function handleDeleteTeam() {
        actions.deleteTeam();
        navigate('/personal/teams');
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={900} mb={3}>
                Cài đặt nhóm
            </Typography>
            <Button
                variant="contained"
                color="error"
                onClick={() =>
                    openConfirm('Bạn có muốn xóa nhóm không?', handleDeleteTeam)
                }
            >
                Xóa nhóm
            </Button>
        </Box>
    );
}
