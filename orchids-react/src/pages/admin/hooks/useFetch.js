import { useEffect, useState } from "react";

export default function useFetch(loader, filter) {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [refresher, setRefresher] = useState(false);

    function refresh() {
        setIsLoading(true);
        setRefresher(value => !value);
    }

    useEffect(() => {
        const fetch = async () => {
            const response = await loader(filter);
            if(response) {
                setData(response);
            } else {}
        }

        fetch();
        setIsLoading(false);

        return () => {
            setIsLoading(true);
        }
    }, [filter, loader, refresher]);

    return { data, isLoading, refresh };
}