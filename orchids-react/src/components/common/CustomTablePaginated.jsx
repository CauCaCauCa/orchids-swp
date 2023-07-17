import {
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import { DEFAULT_PAGE_SIZE } from '../../pages/admin/config/pageConfig';
import { useEffect, useState } from 'react';

export default function CustomTablePaginated({
    listOfObjects,
    numberOfObjects,
    Actions,
    columns,
    isLoading,
    changePage
}) {
    const [page, setPage] = useState(0);

    const handlePageChange = (_event, page) => {
        changePage(page);
        setPage(page);
    };

    // Reset page to 0 when number of objects changes (low IQ solution)
    // useEffect(() => {
    //     setPage(0);
    // }, [numberOfObjects]);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        {columns.map((column) => (
                            <TableCell key={column.id} width={column.minWidth}>
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell key="actions"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!listOfObjects ? (
                        <>
                            {[...Array(DEFAULT_PAGE_SIZE)].map((_, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell width={10}>
                                            <Skeleton />
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                width={column.minWidth}
                                            >
                                                <Skeleton />
                                            </TableCell>
                                        ))}
                                        <TableCell width={200}>
                                            <Skeleton />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {listOfObjects
                                .slice(
                                    page * DEFAULT_PAGE_SIZE,
                                    page * DEFAULT_PAGE_SIZE + DEFAULT_PAGE_SIZE
                                )
                                .map((row, index) => (
                                    <TableRow key={row._id}>
                                        <TableCell width={10}>
                                            {index +
                                                1 +
                                                page * DEFAULT_PAGE_SIZE}
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                width={column.minWidth}
                                                onClick={
                                                    column.handleClick
                                                        ? () =>
                                                              column.handleClick(
                                                                  row
                                                              )
                                                        : null
                                                }
                                                sx={{
                                                    cursor: column.handleClick
                                                        ? 'pointer'
                                                        : 'default'
                                                }}
                                            >
                                                {column.component(row)}
                                            </TableCell>
                                        ))}
                                        <TableCell width="50">
                                            <Actions row={row} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={numberOfObjects}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPageOptions={[]}
                rowsPerPage={DEFAULT_PAGE_SIZE}
            />
        </TableContainer>
    );
}
