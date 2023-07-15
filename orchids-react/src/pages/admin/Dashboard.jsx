import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import Accounts from './Accounts';
import AccountContextProvider from './context/providers/AccountContext';
import PostContextProvider from './context/providers/PostContext';
import TeamContextProvider from './context/providers/TeamContext';
import Posts from './Posts';
import Teams from './Teams';
import AccountDetailsProvider from './context/AccountDetailsContext';
import PostDetailsProvider from './context/PostDetailsContext';
import DashboardIcon from '@mui/icons-material/Dashboard';

function DataProviders({ children }) {
    return (
        <TeamContextProvider>
            <PostContextProvider>
                <AccountContextProvider>{children}</AccountContextProvider>
            </PostContextProvider>
        </TeamContextProvider>
    );
}

function DialogProviders({ children }) {
    return (
        <PostDetailsProvider>
            <AccountDetailsProvider>{children}</AccountDetailsProvider>
        </PostDetailsProvider>
    );
}

function props(index) {
    return {
        id: `admin-tab-${index}`,
        'aria-controls': `admin-tabpanel-${index}`
    };
}

function TabPanel({ children, value, index, ...other }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            width="100%"
            px={2.5}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Box>
    );
}

function CustomTab({ label, value, icon: IconComponent, ...other }) {
    return (
        <Tab
            label={label}
            value={value}
            // icon={<IconComponent/>}
            sx={{
                textAlign: 'left'
            }}
            {...props(value)}
            {...other}
        />
    );
}

export default function Dashboard() {
    const [value, setValue] = useState('dashboard');

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <DataProviders>
            <DialogProviders>
                <Box pt={9} height="100%" display="flex">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            minWidth: 200,
                            minHeight: '100vh',
                            bgcolor: 'ButtonShadow'
                        }}
                    >
                        <CustomTab
                            label="Dashboard"
                            value="dashboard"
                            // icon={<DashboardIcon/>}
                            {...props}
                        />
                        <CustomTab
                            label="Accounts"
                            value="accounts"
                            {...props}
                        />
                        <CustomTab label="Posts" value="posts" {...props} />
                        <CustomTab label="Teams" value="teams" {...props} />
                    </Tabs>
                    <TabPanel value={value} index="dashboard">
                        1
                    </TabPanel>
                    <TabPanel value={value} index="accounts">
                        <Accounts />
                    </TabPanel>
                    <TabPanel value={value} index="posts">
                        <Posts />
                    </TabPanel>
                    <TabPanel value={value} index="teams">
                        <Teams />
                    </TabPanel>
                </Box>
            </DialogProviders>
        </DataProviders>
    );
}
