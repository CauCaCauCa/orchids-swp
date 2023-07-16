import { Box } from '@mui/material';
import React from 'react'

export default function IconImage({ src = "/random-mfsdajfsdal", alt, defaultImage = "/img/user-placeholder.png", hideOnError = false, ...other }) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    }

    const handleError = () => {
        setIsLoading(false)
        setIsError(true)
    }

    if (!hideOnError && (src === null || isError)) {
        return (
            <Box component="img" src={defaultImage} alt="user-placeholder" {...other} />
        )
    }

    if (hideOnError && (src === null || isError)) {
        return null;
    }

    return (
        <Box component="img" src={src} alt={alt} onLoad={handleLoad} onError={handleError} {...other} />
    )
}
