import { Box, CssBaseline, ScopedCssBaseline, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import Accounts from './Accounts';
import AccountContextProvider from './context/providers/AccountContext';
import PostContextProvider from './context/providers/PostContext';
import TeamContextProvider from './context/providers/TeamContext';
import Posts from './Posts';
import Teams from './Teams';
import AccountDetailsProvider from './context/AccountDetailsContext';
import PostDetailsProvider from './context/PostDetailsContext';
import Questions from './Questions';
import QuestionContextProvider from './context/providers/QuestionContext';
import QuestionDetailsProvider from './context/QuestionDetailsContext';

function DataProviders({ children }) {
    return (
        <TeamContextProvider>
            <PostContextProvider>
                <QuestionContextProvider>
                    <AccountContextProvider>{children}</AccountContextProvider>
                </QuestionContextProvider>
            </PostContextProvider>
        </TeamContextProvider>
    );
}

function DialogProviders({ children }) {
    return (
        <QuestionDetailsProvider>
            <PostDetailsProvider>
                <AccountDetailsProvider>{children}</AccountDetailsProvider>
            </PostDetailsProvider>
        </QuestionDetailsProvider>
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
    const [value, setValue] = useState('accounts');

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <CssBaseline/>
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
                            {/* <CustomTab label="Dashboard" value="dashboard" /> */}
                            <CustomTab label="Accounts" value="accounts" />
                            <CustomTab label="Posts" value="posts" />
                            <CustomTab label="Questions" value="questions" />
                            <CustomTab label="Teams" value="teams" />
                            {/* <CustomTab label="Reports" value="reports" /> */}
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
                        <TabPanel value={value} index="questions">
                            <Questions />
                        </TabPanel>
                        <TabPanel value={value} index="teams">
                            <Teams />
                        </TabPanel>
                        <TabPanel value={value} index="reports">
                            <h1>Reports</h1>
                        </TabPanel>
                    </Box>
                </DialogProviders>
            </DataProviders>
        </>
    );
}
