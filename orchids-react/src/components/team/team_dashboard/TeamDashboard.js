import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import TeamContainer from './TeamCardContainer';
import EditImageOverlay from '../../common/EditImageOverlay';
import IconImage from '../../common/IconImage';
import { FileUploader } from 'react-drag-drop-files';
import { CreateTeam as CreateTeamInDB, getSpecificTeamsByAccount } from '../../../api/teamAPI';
import { NotificationContext } from '../../../context/NotificationContext';

export default function TeamDashboard({ teams: account, setTeams: setAccount }) {

    const [openCreateTeam, setOpenCreateTeam] = React.useState(false);
    const [teamList, setTeamList] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTeams = async () => {
            const response = await getSpecificTeamsByAccount();
            setTeamList(response);
            setIsLoading(false);
        }

        fetchTeams();

        return () => {
            setTeamList({});
            setIsLoading(true);
        }
    }, [])

    const handleCreateTeam = () => {
        setOpenCreateTeam(true);
    }

    if (isLoading) {
        return (
            <>
                <Box id='team-dashboard' mt={5}>
                    <Skeleton variant="rounded" color='primary' sx={{ width: '467px', height: "69px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '454px', height: "72px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '684px', height: "66px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '795px', height: "57px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '634px', height: "54px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '254px', height: "73px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '387px', height: "51px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '908px', height: "68px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '831px', height: "63px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '628px', height: "74px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '512px', height: "73px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '667px', height: "75px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '795px', height: "67px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '423px', height: "57px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '887px', height: "65px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '306px', height: "63px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '456px', height: "51px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '767px', height: "59px", mb: 2 }} />
                    <Skeleton variant="rounded" color='primary' sx={{ width: '998px', height: "58px", mb: 2 }} />
                    
                </Box>
            </>
        )
    }

    return (
        <>
            <Box id='team-dashboard' mt={5}>
                <Button variant='contained' color='primary' sx={{ width: 'fit-content', mb: 2 }} onClick={handleCreateTeam}>Tạo nhóm mới</Button>
                <TeamContainer id='owning-teams' title='Nhóm của bạn' teams={teamList.ListEmailTeamOwner} />
                <TeamContainer id='member-teams' title='Nhóm bạn tham gia' teams={teamList.ListEmailTeamAttend} />
            </Box>
            <CreateTeam open={openCreateTeam} setOpen={setOpenCreateTeam} setAccount={setAccount} account={account} />
        </>
    )
}

function CreateTeam({ open, setOpen, setAccount, account }) {

    const {showSuccess, showError} = useContext(NotificationContext);

    const [openFileUploader, setOpenFileUploader] = React.useState(false);
    const [currentlyUploading, setCurrentlyUploading] = React.useState(null) // can be 'avatar' or 'bground'

    const [teamname, setTeamname] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [bground, setBground] = React.useState(null);
    const [avatar, setAvatar] = React.useState(null);

    const handleFileChange = (files) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (currentlyUploading === 'avatar') setAvatar(reader.result);
            if (currentlyUploading === 'bground') setBground(reader.result);
        }
        reader.readAsDataURL(files);
    }

    const handleSetAvatar = () => {
        setOpenFileUploader(true);
        setCurrentlyUploading('avatar');
    }

    const handleSetBground = () => {
        setOpenFileUploader(true);
        setCurrentlyUploading('bground');
    }

    const handleSubmit = () => {

        const addTeamToDB = async () => {
            const response = await CreateTeamInDB(teamname, description, bground, avatar);
            if (response) {
                account.ListEmailTeamOwner.push(response.insertedEmail);
                setAccount({ ...account });
                showSuccess('Tạo nhóm thành công');
            } else {
                showError('Tạo nhóm thất bại');
            }

        }

        addTeamToDB();

    }

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Tạo nhóm mới</DialogTitle>
                <DialogContent>
                    <br />
                    <TextField label='Tên nhóm' variant='outlined' fullWidth mb={2} value={teamname} onChange={(e) => setTeamname(e.target.value)} required />
                    <TextField label='Mô tả' variant='outlined' fullWidth multiline minRows={5} mb={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Box>
                        <Typography variant="body1" fontWeight={900} mb={1}>Hình đại diện</Typography>
                        <EditImageOverlay handle={handleSetAvatar} width="10rem" height="10rem">
                            <IconImage width='100%' height='100%' src={avatar} alt="Avatar" sx={{ objectFit: "cover" }} />
                        </EditImageOverlay>
                    </Box>
                    <Box>
                        <Typography variant="body1" fontWeight={900} mb={1}>Hình nền</Typography>
                        <EditImageOverlay handle={handleSetBground} width="100%" height="20rem">
                            <IconImage width='100%' height='100%' src={bground} alt="Avatar" sx={{ objectFit: "cover" }} />
                        </EditImageOverlay>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={handleSubmit}>Tạo</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openFileUploader} onClose={() => setOpenFileUploader(false)}>
                <Box sx={{ width: "100%", height: "100%" }}>
                    <FileUploader
                        multiple={false}
                        handleChange={handleFileChange}
                        types={['png', 'jpg', 'jpeg']}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={() => setOpenFileUploader(false)}>Finish</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}
