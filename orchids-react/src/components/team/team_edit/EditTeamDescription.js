import React, { useContext, useState } from 'react'
import { TextField, Typography, Button, Box, Paper, Dialog, DialogActions } from '@mui/material';
import { FileUploader } from "react-drag-drop-files";
import EditImageOverlay from '../../common/EditImageOverlay';
import { TeamHomepageContext } from '../../../context/team/TeamHomepageContext';
import IconImage from '../../common/IconImage';

export default function EditTeamDescription() {
    const { team, teamDetails } = useContext(TeamHomepageContext);

    const [open, setOpen] = useState(false); // for file uploader
    const [fileUsing, setFileUsing] = useState(null) // can be 'avatar' or 'bground'

    // changeable team information
    const [name, setName] = useState(team.teamname);
    const [description, setDescription] = useState(team.description);
    const [bground, setBground] = useState(team.bground)
    const [avatar, setAvatar] = useState(team.avatar)

    // original team information

    var handleFileChange = (files) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (fileUsing === 'avatar') setAvatar(reader.result);
            if (fileUsing === 'bground') setBground(reader.result);
        }
        reader.readAsDataURL(files);
    };

    const handleSetAvatar = () => {
        setOpen(true);
        setFileUsing('avatar')
    }

    const handleSetBground = () => {
        setOpen(true);
        setFileUsing('bground')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        teamDetails.update(name, description, bground, avatar);
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={900} mb={1}>Thông tin nhóm</Typography>
            <Box component="form" onSubmit={handleSubmit} width="100%" height="100%" >
                <Paper variant='outlined' square sx={{ overflowY: "auto", height: "420px", mb: "1rem", p: "3rem", display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "10px" }}>
                    <TextField variant="outlined" id="outlined-basic" label="Tên nhóm" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                    <TextField id="outlined-basic" label="Mô tả" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={5} />
                    <Box>
                        <Typography variant="body1" fontWeight={900} mb={1}>Hình đại diện</Typography>
                        <EditImageOverlay handle={handleSetAvatar} width="10rem" height="10rem" >
                            <IconImage src={avatar} alt="team-logo" borderRadius="10px" width="100%" height="100%" sx={{ objectFit: "cover" }} />
                            {/* <Box component="img" src={avatar} alt="team-logo" borderRadius="10px" width="100%" height="100%" sx={{ objectFit: "cover" }} /> */}
                        </EditImageOverlay>
                    </Box>
                    <Box>
                        <Typography variant="body1" fontWeight={900} mb={1}>Hình nền</Typography>
                        <EditImageOverlay handle={handleSetBground} width="100%" height="20rem">
                            <IconImage src={bground} alt="team-logo" borderRadius="10px" width="100%" height="100%" sx={{ objectFit: "cover" }} />
                            {/* <Box component="img" src={bground} alt="team-logo" borderRadius="10px" width="100%" height="100%" sx={{ objectFit: "cover" }} /> */}
                        </EditImageOverlay>
                    </Box>
                </Paper>
                <Button type='submit' variant="contained" color="primary">Chỉnh sửa</Button>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: "100%", height: "100%" }}>
                    <FileUploader
                        multiple={false}
                        handleChange={handleFileChange}
                        types={['png', 'jpg', 'jpeg']}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Finish</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
