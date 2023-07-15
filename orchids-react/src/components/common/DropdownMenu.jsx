import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function DropdownMenu({ Icon, options }) {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    function handleClick(e) {
        setAnchor(e.currentTarget);
    }

    function handleClose() {
        setAnchor(null);
    }

    return (
        <Box>
            <IconButton
                aria-label="more"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup
                onClick={handleClick}
            >
                <Icon />
            </IconButton>
            <Menu
                MenuListProps={{ 'aria-labelledby': 'long-button' }}
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
            >
                {options.map((option, index) => (
                    <MenuItem onClick={handleClose} key={index}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
