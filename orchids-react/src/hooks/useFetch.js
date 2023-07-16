import { useEffect, useState } from "react";

export default function useFetch(loader, params) {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    function refreshData() {
        setRefresh((prev) => !prev)
    }

    useEffect(() => {
        async function fetch() {
            const response = await loader(params);
            setData(response);
            setIsLoading(false);
        }
        fetch();
    }, [loader, refresh, params])

    return [data, isLoading, refreshData, setData];
} 