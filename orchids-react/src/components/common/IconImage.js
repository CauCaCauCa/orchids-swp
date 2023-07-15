import { Box } from '@mui/material';
import React from 'react'

export default function IconImage({ src = "/random-mfsdajfsdal", alt, defaultImage = "/img/user-placeholder.png", ...other }) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    }

    const handleError = () => {
        setIsLoading(false)
        setIsError(true)
    }

    if (src === null || isError) {
        return (
            <Box component="img" src={defaultImage} alt="user-placeholder" {...other} />
        )
    }

    return (
        <Box component="img" src={src} alt={alt} onLoad={handleLoad} onError={handleError} {...other} />
    )
}
