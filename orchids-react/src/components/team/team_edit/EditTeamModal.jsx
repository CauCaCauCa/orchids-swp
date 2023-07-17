import { Modal, Paper, Tab, Tabs, TextField } from '@mui/material';
import React, { memo, useContext, useMemo } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import EditTeamDescription from './EditTeamDescription';
import EditTeamMembers from './EditTeamMembers';
import { TeamHomepageContext } from '../../../context/team/TeamHomepageContext';
import EditTeamSettings from './EditTeamSettings';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '1rem'
};

export default function EditTeamModal({ open, setOpen }) {
    const [value, setValue] = React.useState(0);
    const { team } = useContext(TeamHomepageContext);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    const closeEditTeamModal = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={closeEditTeamModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            component="div"
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open} component="div">
                <Box
                    component="div"
                    style={style}
                    display="flex"
                    flexGrow={1}
                    sx={{ width: '70%', height: '80%' }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            width: '20%'
                        }}
                    >
                        <Tab label="Thông tin nhóm" {...a11yProps(0)} />
                        <Tab label="Thành viên" {...a11yProps(1)} />
                        <Tab label="Cài đặt" {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <EditTeamDescription />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <EditTeamMembers />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <EditTeamSettings/>
                    </TabPanel>
                </Box>
            </Fade>
        </Modal>
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
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`
    };
}
