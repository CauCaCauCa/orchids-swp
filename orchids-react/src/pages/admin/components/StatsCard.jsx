import { Box, Paper, Skeleton, Typography } from "@mui/material";

export function StatsCard({ label, data, caption, Icon, unit, onClick }) {
    return (
        <Paper
            component="section"
            variant="outlined"
            sx={{ p: 1, px: 2, display: 'flex', alignItems: 'center', cursor: onClick && 'pointer' }}
            onClick={onClick}
        >
            <Box flexGrow={1}>
                <Typography
                    fontSize="12px"
                    color="rgb(116, 116, 116)"
                    textTransform="uppercase"
                >
                    {label}
                </Typography>
                {!data && data !== 0 ? (
                    <Skeleton variant="text" width="100px" />
                ) : (
                    <>
                        <Typography variant="h6" fontWeight="700">
                            {data} <Typography component="span" color="rgb(116, 116, 116)" fontSize="12px">{unit}</Typography>
                        </Typography>
                        {caption ? (
                            <Typography variant="caption" fontSize="12px">
                                {caption}
                            </Typography>
                        ) : null}
                    </>
                )}
            </Box>
            <Box height="50px">
                <Icon />
            </Box>
        </Paper>
    );
}
