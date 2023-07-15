import React, { useContext } from 'react'
import { Box, Card, CardActionArea, CardContent, Button, CardActions, CardMedia, Grid, Typography, Dialog, DialogContent, TextField, Select, MenuItem, DialogActions } from '@mui/material';
import IconImage from '../../common/IconImage';
import { EditTeamContext } from './EditTeamContext';
import { AddMemberToTeam, RemoveMemberFromTeam, UpdateMemberFromTeam } from '../../../api/teamAPI';
import ButtonDoublePress from '../../common/ButtonDoublePress';
import { NotificationContext } from '../../../context/NotificationContext';

function parseTitle(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + "s";
}

function MemberCard({ member, isOwner }) {

    const { showSuccess, showError } = useContext(NotificationContext)

    const { setTeam, team } = React.useContext(EditTeamContext);
    const [openUpdateMember, setOpenUpdateMember] = React.useState(false);

    const handleGotoProfile = () => {
        alert(`Goto profile with email ${member.details.email}`)
    }

    const handleDelete = () => {
        const deleteMemberFromDB = async () => {
            const response = await RemoveMemberFromTeam(team.email, member.details.email);
            if (response) {
                team.ListEmailMember = team.ListEmailMember.filter((mem) => mem.details.email !== member.details.email);
                setTeam({ ...team });
                showSuccess("Xóa thành công");
            }
            else {
                showError("Xóa thất bại");
            }
        }

        deleteMemberFromDB();
    }

    return (
        <>
            <Card variant='outlined' sx={{ display: "flex", p: ".5rem", "*": { boxSizing: "border-box" }, height: "100px" }}>
                <CardMedia>
                    <CardActionArea sx={{ borderRadius: "10px" }} onClick={handleGotoProfile}>
                        <IconImage component="img" src={member.details.avatar} sx={{ borderRadius: "10px", objectFit: "cover", height: "100%", width: "100px" }} />
                    </CardActionArea>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography fontSize="16px" fontWeight={700}>{member.details.username}</Typography>
                    <Typography fontSize="10px" >{member.details.email}</Typography>
                </CardContent>
                {!isOwner && <CardActions>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Button variant="contained" color="primary" size="small" onClick={() => setOpenUpdateMember(true)}>Edit</Button>
                        <ButtonDoublePress variant="contained" size="small" onClick={handleDelete}>Xóa</ButtonDoublePress>
                    </Box>
                </CardActions>}
            </Card>
            <UpdateMember open={openUpdateMember} setOpen={setOpenUpdateMember} teamEmail={team.email} email={member.details.email} setTeam={setTeam} team={team} />
        </>
    );
}

function CreateMember({ open, setOpen, teamEmail, setTeam, team }) {

    const { showSuccess, showError } = useContext(NotificationContext)

    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState("writer");

    const handleSubmit = () => {
        const addMemberToDB = async () => {
            const response = await AddMemberToTeam(teamEmail, email, role);
            if (response) {

                team.ListEmailMember.push(response)
                setTeam({ ...team })

                showSuccess("Thêm thành công");
            }
            else {
                showError("Thêm thất bại");
            }
            setOpen(false)
        }

        addMemberToDB();
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Thêm thành viên</Typography>
                    <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Select labelId="role" variant="outlined" value={role} fullWidth onChange={(e) => setRole(e.target.value)}>
                        <MenuItem value="writer">Writer</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Thêm</Button>
            </DialogActions>
        </Dialog>
    )
}

function UpdateMember({ open, setOpen, teamEmail, email, setTeam, team }) {

    const { showSuccess, showError } = useContext(NotificationContext);
    const [role, setRole] = React.useState("writer");

    const handleSubmit = () => {
        const updateMemberInDB = async () => {
            const response = await UpdateMemberFromTeam(teamEmail, email, role);
            if (response) {
                team.ListEmailMember = team.ListEmailMember.map((member) => {
                    if (member.details.email === email) {
                        member.role = role;
                    }
                    return member;
                })
                setTeam({ ...team })
                showSuccess("Cập nhật thành công");
            } else {
                showError("Cập nhật thất bại");
            }
        }

        updateMemberInDB();
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Cập nhật thành viên</Typography>
                    <Select labelId="role" variant="outlined" value={role} fullWidth onChange={(e) => setRole(e.target.value)}>
                        <MenuItem value="writer">Writer</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Cập nhật</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function EditTeamMembers({ team: teamObject }) {

    const [openCreateMember, setOpenCreateMember] = React.useState(false);

    const { team, setTeam } = React.useContext(EditTeamContext);

    const teamRoles = teamObject && [...new Set(teamObject.ListEmailMember
        .map((member) => member.role))]

    return (
        <>
            <Box display="flex" mb={3}>
                <Typography variant="h5" fontWeight={900} flexGrow={1}>Thành viên nhóm</Typography>
                <Button variant="contained" color="primary" size="small" onClick={() => setOpenCreateMember(true)}>Thêm thành viên</Button>
            </Box>
            <Box sx={{ overflowY: "auto", maxHeight: "500px" }}>
                {teamObject && (
                    <Box>
                        <Typography variant="h6" fontWeight={700} mt={3}>Owner</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <MemberCard member={teamObject.EmailOwner} isOwner />
                            </Grid>
                        </Grid>
                        {
                            teamRoles && teamRoles.map((role) => (
                                <Box>
                                    <Typography variant="h6" fontWeight={700} mt={3}>{parseTitle(role)}</Typography>
                                    <Grid container spacing={2}>
                                        {
                                            teamObject.ListEmailMember
                                            && teamObject.ListEmailMember
                                                .map((member) => (
                                                    member.role === role && (
                                                        <Grid item xs={12} md={6}>
                                                            <MemberCard member={member} sx={{ width: "100%" }} />
                                                        </Grid>
                                                    )
                                                ))
                                        }
                                    </Grid>
                                </Box>
                            ))
                        }
                    </Box>
                )}
            </Box>
            <CreateMember open={openCreateMember} setOpen={setOpenCreateMember} teamEmail={teamObject.email} setTeam={setTeam} team={team} />
        </>
    )
}