import { createContext, useState } from 'react';
import { GetOneQuestion } from '../../../api/adminAPI';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import IconImage from '../../../components/common/IconImage';
import { formatDate } from '../util/Utility';

export const QuestionDetailsContext = createContext({});

export default function QuestionDetailsProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(null);

    function handleOpen(question) {
        setCurrent(question);
        setOpen(true);
    }

    function handleOpenFetch(questionId) {
        setCurrent(null);
        const fetchQuestion = async () => {
            const response = await GetOneQuestion(questionId);
            if (response) {
                setCurrent(response);
            } else {
            }
        };

        questionId && fetchQuestion();
        setOpen(true);
    }

    return (
        <QuestionDetailsContext.Provider
            value={{ handleOpen, handleOpenFetch }}
        >
            {children}
            {current === null || current === undefined ? (
                <></>
            ) : (
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography fontWeight={900} flexGrow={1}>
                            Question details
                        </Typography>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <CustomCard sx={{ p: 3, width: '500px' }}>
                                <IconImage
                                    src={current.image}
                                    alt="Image"
                                    hideOnError
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        boxShadow:
                                            '0 2px 10px rgba(0, 0, 0, 0.34)',
                                        width: '100%'
                                    }}
                                />
                                <Typography variant="h6" fontWeight="700">
                                    {current.content}
                                </Typography>
                                <Typography variant="caption">
                                    {current.creatorEmail} |{' '}
                                    {formatDate(current.createDate)}
                                </Typography>
                            </CustomCard>
                            <Chip
                                label={`${current.answers.length} answer(s)`}
                                color='primary'
                                sx={{my: 1}}
                            />
                            {current.answers.map((answer) => (
                                <CustomCard>
                                    <Typography variant="subtitle2">
                                        {answer.emailCreator}
                                    </Typography>
                                    <Typography variant="caption">
                                        {formatDate(answer.createDate)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontSize="1.3rem"
                                        dangerouslySetInnerHTML={{
                                            __html: answer.content
                                        }}
                                    />
                                </CustomCard>
                            ))}
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </QuestionDetailsContext.Provider>
    );
}

function CustomCard({ children }) {
    return <Paper sx={{ p: 3, width: '500px' }}>{children}</Paper>;
}
