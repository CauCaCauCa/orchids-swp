import { Modal, Paper, Tab, Tabs, TextField } from '@mui/material';
import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import EditTeamDescription from './EditTeamDescription';
import EditTeamMembers from './EditTeamMembers';

export const EditTeamContext = React.createContext();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: "3rem",
    borderRadius: "1rem"
}

export default function EditTeamProvider({ children }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [team, setTeam] = React.useState({});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const openDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    return (
        <EditTeamContext.Provider value={{ open, openDialog, closeDialog, setTeam, team }}>
            <Modal
                open={open}
                onClose={closeDialog}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                component="div"
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}>
                <Fade in={open} component="div">
                    <Box component="div" style={style} display="flex" flexGrow={1} sx={{ width: "70%", height: "80%"}}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider', width: "20%" }}
                        >
                            <Tab label="Thông tin nhóm" {...a11yProps(0)} />
                            <Tab label="Thành viên" {...a11yProps(1)} />
                            <Tab label="Cài đặt" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <EditTeamDescription team={team} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <EditTeamMembers team={team}/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Typography variant="h5" fontWeight={900}>Cài đặt</Typography>
                            <Paper elevation={3} sx={{ width: "100%", height: "100%", p: 2 }}>
                                <Typography variant="h6" fontWeight={900}>Xóa nhóm</Typography>
                            </Paper>
                        </TabPanel>
                    </Box>
                </Fade>
            </Modal>
            {children}
        </EditTeamContext.Provider>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            width="80%"
            {...other}
        >
            {value === index && (
                <Box p="0 2rem" component="div">
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}