import { useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../config/pageConfig";

export default function usePage(loader, filters, projections) {

    const [refresher, setRefresher] = useState(false);

    const [list, setList] = useState([]);
    const [leadingPage, setLeadingPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // const [filter, setFilter] = useState(filters || {});
    // const [projection, setProjection] = useState(projections || {});

    function changePage(page) {
        if (page > leadingPage) {
            setLeadingPage(page);
        }
    }

    function refresh() {
        console.log("refreshing");
        setLeadingPage(0);
        setList([]);
        setTotal(0)
        setIsLoading(true)
        setRefresher(value => !value);
        return true;
    }

    // useEffect(() => {
    //     refresh();
    // }, [filter, projection]);

    useEffect(() => {
        const fetchPage = async () => {
            const response = await loader(leadingPage, DEFAULT_PAGE_SIZE, filters, projections);
            if (response) {
                setList(current => [...current, ...response.list]);
                setLeadingPage(response.currentPage);
                setTotal(response.total)
            } else {
                // console.log(response);
            }
            setIsLoading(false);
        }

        fetchPage();

        return () => {
            setIsLoading(true);
        }
        // I might suck at coding here, but this is a chained useEffect. If you have a better way to do this, please do tell me.
        // What happens is if filter or projection change, then the useEffect above this one runs, and then this one runs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadingPage, loader, refresher]);


    return { list, setList, changePage, total, isLoading, refresh };
}