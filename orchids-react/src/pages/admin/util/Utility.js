import { Tooltip } from "@mui/material";

export function convertId(data, max = 5) {
    return data.length > max ? `${data.substring(0, max)}...` : data;
}

export function ViewId({ data, max }) {
    return (
        <Tooltip title={data}>
            <span>{convertId(data, max)}</span>
        </Tooltip>
    )
}

export function formatDate(date) {
    var formattedDate;
    try {
        const postDate = new Date(date);
        formattedDate = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }).format(postDate);
    } catch (error) {
        formattedDate = null;
    }
    return formattedDate;
}

export function getDaysAgo(epochTimeString) {
    if (!epochTimeString) return null;

    const postDate = new Date(epochTimeString);
    const epochTime = postDate.getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - epochTime;
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return daysAgo;
}