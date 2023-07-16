import React, { useContext } from 'react';
import { Box, Button, Paper, Tooltip, Typography } from '@mui/material';
import { QuestionContext } from '../../context/providers/QuestionContext';
import CustomTablePaginated from '../../../../components/common/CustomTablePaginated';
import { TableColumn } from '../../util/classes';
import { ViewId, formatDate } from '../../util/Utility';
import DropdownMenu from '../../../../components/common/DropdownMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { QuestionDetailsContext } from '../../context/QuestionDetailsContext';

export default function AllQuestionsCard() {
    const {
        questions,
        changePageQuestions,
        totalQuestions,
        isLoadingQuestions
    } = useContext(QuestionContext).AllQuestions;

    // #region data
    const columns = [
        new TableColumn('content', 'Content', 400, (row) => (
            <ViewId data={row.content} max={50} />
        )),
        new TableColumn('creator', 'Creator', 200, (row) => row.creatorEmail),
        new TableColumn('created', 'Created At', 100, (row) =>
            formatDate(row.createDate)
        ),
        new TableColumn('answers', 'Answers', 100, (row) => row.answers.length)
    ];

    function Actions({ row }) {
        const { handleOpen } = useContext(QuestionDetailsContext);

        return (
            <DropdownMenu
                Icon={MoreVertIcon}
                options={[
                    <Button
                        onClick={() => handleOpen(row)}
                        sx={{
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'none'
                        }}
                        key="view"
                    >
                        <RemoveRedEyeIcon />
                        <Typography variant="body1">View</Typography>
                    </Button>
                ]}
            />
        );
    }
    // #endregion

    return (
        <Paper component="section" variant="outlined" sx={{ p: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h5" fontWeight="bold">
                    Questions
                </Typography>
            </Box>
            <CustomTablePaginated
                listOfObjects={questions}
                numberOfObjects={totalQuestions}
                Actions={Actions}
                columns={columns}
                isLoading={isLoadingQuestions}
                changePage={changePageQuestions}
            />
        </Paper>
    );
}
