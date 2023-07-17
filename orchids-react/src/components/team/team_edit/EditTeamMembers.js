import React, { useContext, useMemo, useState } from 'react'
import { Box, Button, Typography, Dialog, DialogContent, TextField, Select, MenuItem, DialogActions, Table, TableRow, TableHead, TableCell, TableBody } from '@mui/material';
import { TeamHomepageContext } from '../../../context/team/TeamHomepageContext';
import { formatDate } from '../../../pages/admin/util/Utility';
import DropdownMenu, { Option } from '../../common/DropdownMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function EditTeamMembers() {

    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [openCreateMember, setOpenCreateMember] = useState(false);
    const [updateRoleTarget, setUpdateRoleTarget] = useState({});
    const { team, setTeam, members: memberList } = useContext(TeamHomepageContext);

    const members = useMemo(() => {
        return [{
            email: team.EmailOwner.email,
            role: "owner",
            create_at: team.create_at
        }, ...team.ListEmailMember];
    }, [team.ListEmailMember, team.EmailOwner, team.create_at]);

    function handleRemoveMember(memberEmail) {
        memberList.remove(memberEmail);
    }

    function handleOpenUpdateRoleModal(member) {
        setUpdateRoleTarget(member);
        setOpenUpdateRole(true);
    }

    return (
        <>
            <Box display="flex" mb={3}>
                <Typography variant="h5" fontWeight={900} flexGrow={1}>Thành viên nhóm</Typography>
                <Button variant="contained" color="primary" size="small" onClick={() => setOpenCreateMember(true)}>Thêm thành viên</Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        members && members.map((member) => (
                            <TableRow key={member.email}>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{formatDate(member.create_at)}</TableCell>
                                <TableCell>
                                    <DropdownMenu Icon={MoreVertIcon} options={[
                                        new Option("Edit role", () => handleOpenUpdateRoleModal(member)),
                                        new Option("Remove", () => handleRemoveMember(member.email))
                                    ]} />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <UpdateMemberModal open={openUpdateRole} setOpen={setOpenUpdateRole} currentMember={updateRoleTarget} />
            <CreateMemberModal open={openCreateMember} setOpen={setOpenCreateMember} teamEmail={team.email} setTeam={setTeam} team={team} />
        </>
    )
}

function CreateMemberModal({ open, setOpen }) {

    const { members } = useContext(TeamHomepageContext);

    const [email, setEmail] = React.useState();
    const [role, setRole] = React.useState("writer");

    const handleSubmit = () => {
        members.add(email, role);
        setOpen(false)
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

function UpdateMemberModal({ open, setOpen, currentMember }) {

    const [role, setRole] = useState(currentMember?.role);
    const { members } = useContext(TeamHomepageContext);

    if(!currentMember) return null;

    const handleSubmit = () => {
        setOpen(false)
        members.update(currentMember.email, role)
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