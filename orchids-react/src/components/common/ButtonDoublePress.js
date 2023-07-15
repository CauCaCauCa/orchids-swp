import { Button } from '@mui/material';
import React from 'react'

export default function ButtonDoublePress({ children, onClick, ...props }) {

    const [isDoublePressed, setIsDoublePressed] = React.useState(false);

    const handleClick = () => {
        if (isDoublePressed) {
            onClick();
        }
        else {
            setIsDoublePressed(true);
            setTimeout(() => {
                setIsDoublePressed(false);
            }, 5000);
        }
    }

    return (
        <Button onClick={handleClick} color={!isDoublePressed ? 'primary' : 'warning'} {...props}>
            {!isDoublePressed ? children : "Sure?"}
        </Button>
    )
}
