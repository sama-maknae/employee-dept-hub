import {useMemo, useState} from 'react';
import {DEFAULT_ROWS_PER_PAGE, ZERO} from '@/components/common/const';

export interface Department {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    _count: {
        employee: number;
    };
}

export function useDepartmentTable(departments: Department[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(ZERO);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

    // Filtered and searched department
    const calculateFilteredDepartments = () => {
        const filtered = departments.filter(department => {
            const searchLower = search.toLowerCase();
            return (
                department.title.toLowerCase().includes(searchLower) ||
                (department.description && department.description.toLowerCase().includes(searchLower))
            );
        });
        // Reset to first page when search changes
        setPage(ZERO);
        return filtered;
    };

    const filteredDepartments = useMemo(calculateFilteredDepartments, [departments, search]);

    // Paginated departments
    const calculatePaginatedDepartments = () => {
        const start = page * rowsPerPage;
        return filteredDepartments.slice(start, start + rowsPerPage);
    };

    const paginatedDepartments = useMemo(calculatePaginatedDepartments, [filteredDepartments, page, rowsPerPage]);

    // Handler for changing rows per page
    const handleRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setPage(ZERO);
    };

    return {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage: handleRowsPerPageChange,
        filteredDepartments,
        paginatedDepartments,
    };
}