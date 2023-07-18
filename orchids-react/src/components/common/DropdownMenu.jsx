import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export class Option {
    constructor(name, onClick) {
        this.name = name || 'Option';
        this.onClick = onClick || (() => {});
    }
}

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
                {!!options[0].onClick ? options.map((option, index) => (
                    <MenuItem onClick={() => {
                        option.onClick();
                        handleClose();
                    }} key={index}>
                        {option.name}
                    </MenuItem>
                )) : (
                    options.map((option, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))
                )}
            </Menu>
        </Box>
    );
}
