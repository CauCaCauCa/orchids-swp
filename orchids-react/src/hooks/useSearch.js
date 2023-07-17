import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { search } from '../api/searchAPI';
import SearchIcon from '@mui/icons-material/Search';
import IconImage from '../components/common/IconImage';
import FeedIcon from '@mui/icons-material/Feed';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useNavigate } from 'react-router-dom';

export default function useSearch() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [accountResults, setAccountResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [questionResults, setQuestionResults] = useState([]);
    const [teamResults, setTeamResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [orderedResults, noneFound, lengthFound] = useMemo(() => {
        const list = [
            accountResults,
            postResults,
            questionResults,
            teamResults
        ];
        list.sort((a, b) => b.length - a.length);

        const noneFound =
            accountResults.length === 0 &&
            postResults.length === 0 &&
            questionResults.length === 0 &&
            teamResults.length === 0;

        const length =
            accountResults.length +
            postResults.length +
            questionResults.length +
            teamResults.length;

        return [list, noneFound, length];
    });

    function handleOpen() {
        setOpen(true);
    }

    function handleChange(event) {
        setSearchTerm(event.target.value);
        const func = debounce(
            () => {
                const save = async () => {
                    const response = await search(searchTerm);
                    if (response) {
                        setAccountResults(response.accounts);
                        setPostResults(response.posts);
                        setQuestionResults(response.questions);
                        setTeamResults(response.teams);
                    }
                    setLoading(false);
                };

                save();
            },
            20000,
            true
        );

        func();
    }

    function debounce(func, wait, immediate) {
        var timeout;

        return function executedFunction() {
            var context = this;
            var args = arguments;

            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function goto(type, id) {
        switch (type) {
            case 'account': {
                navigate(`/view/user?username=${id}`)
                break;
            }
            case 'post': {
                navigate(`/post-page?id=${id}`);
                break;
            }
            case 'team': {
                navigate(`/teams/${id}`);
                break;
            }
            case 'question': {
                navigate(`/question-page?id=${id}`)
                break;
            }
            default: {
                navigate("/");
            }
        }
    }

    function getComponent() {
        return (
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-start'
                    },
                    '& .MuiDialog-paper': {
                        borderRadius: 4
                    }
                }}
            >
                <DialogContent>
                    <Box
                        sx={{
                            position: 'relative'
                        }}
                    >
                        <input
                            placeholder="Type to start searching"
                            style={{
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                            onChange={handleChange}
                        />
                        <SearchIcon
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '1rem',
                                transform: 'translateY(-50%)'
                            }}
                        />
                    </Box>
                    {searchTerm && (
                        <Box mt={2}>
                            {loading ? (
                                <>
                                    <Divider />
                                    <CircularProgress />
                                </>
                            ) : noneFound ? (
                                <Box>None found</Box>
                            ) : (
                                <>
                                    <Typography variant="caption">
                                        Found {lengthFound} result
                                        {lengthFound === 1 ? '' : 's'}
                                    </Typography>
                                    {orderedResults.map((resultList) =>
                                        resultList.map((result) => (
                                            <Paper
                                                key={result.id}
                                                sx={{
                                                    p: 1,
                                                    mt: 1,
                                                    height: '70px'
                                                }}
                                                onClick={() => goto(result.type, result.id)}
                                            >
                                                <Box
                                                    display="flex"
                                                    height="100%"
                                                    alignItems="center"
                                                    gap={2}
                                                >
                                                    {result.image ? (
                                                        <IconImage
                                                            src={result.image}
                                                            sx={{
                                                                height: '100%',
                                                                objectFit:
                                                                    'cover',
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    ) : (
                                                        (result.type ===
                                                            'post' && (
                                                            <FeedIcon
                                                                sx={{
                                                                    height: '100%',
                                                                    width: '55px',
                                                                    bgcolor:
                                                                        'rgb(232, 232, 232)',
                                                                    p: 1.5,
                                                                    borderRadius: 1,
                                                                    color: 'rgb(0, 195, 255)'
                                                                }}
                                                            />
                                                        )) ||
                                                        (result.type ===
                                                            'question' && (
                                                            <QuestionMarkIcon
                                                                sx={{
                                                                    height: '100%',
                                                                    width: '55px',
                                                                    bgcolor:
                                                                        'rgb(232, 232, 232)',
                                                                    p: 1.5,
                                                                    borderRadius: 1,
                                                                    color: 'rgb(91, 244, 26)'
                                                                }}
                                                            />
                                                        ))
                                                    )}
                                                    <Grid item xs={10}>
                                                        <Typography variant="caption">
                                                            {result.type}{' '}
                                                            {result.emailCreator && (
                                                                <span>
                                                                    by{' '}
                                                                    <strong>
                                                                        {
                                                                            result.emailCreator
                                                                        }
                                                                    </strong>
                                                                </span>
                                                            )}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {result.title}
                                                        </Typography>
                                                    </Grid>
                                                </Box>
                                            </Paper>
                                        ))
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    useEffect(() => {
        setAccountResults([]);
        setPostResults([]);
        setQuestionResults([]);
        setTeamResults([]);
        setLoading(true);
        setSearchTerm('');
    }, [open]);

    return [getComponent, handleOpen];
}
