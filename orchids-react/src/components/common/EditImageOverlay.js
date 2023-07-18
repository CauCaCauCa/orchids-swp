import React from 'react'
import { Box } from '@mui/material';

export default function EditImageOverlay({ children, handle, ...other }) {
    return (
        <Box position="relative" onClick={handle} {...other}>
            {children}
            <Box position="absolute" top={0} left={0} width="100%" height="98.5%" bgcolor="#00000055" borderRadius="10px" display="grid" alignItems="center" justifyContent="center" fontSize="3rem" color="white" sx={{ opacity: 0, transition: "all 0.1s linear", cursor: "pointer", "&:hover": { opacity: 1 }, "*": { opacity: 0.7} }}>
                <i class="fas fa-edit"></i>
            </Box>
        </Box>
    )
}
