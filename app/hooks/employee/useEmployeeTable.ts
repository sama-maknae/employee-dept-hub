import {useCallback, useEffect, useMemo, useState} from 'react';
import {useRefresh} from '../useRefresh';
import {DEFAULT_ROWS_PER_PAGE, ZERO} from '@/components/common/const';

export interface Department {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    department?: Department[];
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

export function useEmployeeTable(employees: Employee[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(ZERO);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

    // Filtered and searched employees
    const calculateFilteredEmployees = () => {
        return employees.filter(employee =>
            employee.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const filteredEmployees = useMemo(calculateFilteredEmployees, [employees, search]);

    // Paginated employees
    const calculatePaginatedEmployees = () => {
        const start = page * rowsPerPage;
        return filteredEmployees.slice(start, start + rowsPerPage);
    };

    const paginatedEmployees = useMemo(calculatePaginatedEmployees, [filteredEmployees, page, rowsPerPage]);

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
        filteredEmployees,
        paginatedEmployees,
    };
}

// New comprehensive hook for employee table management
export function useEmployeeTableActions() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
    const [departmentAssignEmployee, setDepartmentAssignEmployee] = useState<Employee | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const {refreshCounter, refresh} = useRefresh();
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Load employees function
    const loadEmployees = useCallback(() => {
        let ignore = false;

        setLoading(true);
        setError(null);

        const performFetch = async () => {
            try {
                const response = await fetch('/api/employee-departments');
                const data = await response.json();
                if (!ignore) {
                    if (Array.isArray(data)) {
                        setEmployees(data);
                    } else {
                        setError(data.error || 'Failed to fetch employees');
                    }
                }
            } catch (error: unknown) {
                if (!ignore) {
                    setError(error instanceof Error ? error.message : 'An error occurred');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        performFetch();
        return () => {
            ignore = true;
        };
    }, []);

    // Load employees on mount and refresh
    const setupLoadEmployess = () => {
        const cleanup = loadEmployees();
        return cleanup;
    };

    useEffect(setupLoadEmployess, [loadEmployees, refreshCounter]);

    // Dialog handlers
    const handleEdit = useCallback((employee: Employee) => setEditEmployee(employee), []);
    const handleEditClose = useCallback(() => setEditEmployee(null), []);
    const handleDepartmentAssign = useCallback((employee: Employee) => setDepartmentAssignEmployee(employee), []);
    const handleDepartmentAssignClose = useCallback(() => setDepartmentAssignEmployee(null), []);
    const handleDelete = useCallback((employee: Employee) => setDeleteEmployee(employee), []);
    const handleDeleteClose = useCallback(() => setDeleteEmployee(null), []);

    // Snackbar handlers
    const handleShowSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    }, []);

    const handleSnackbarClose = useCallback(() => {
        setSnackbar({open: false, message: '', severity: 'success'});
    }, []);

    // Success handlers
    const handleEditSuccess = useCallback(() => {
        refresh();
        handleEditClose();
        handleShowSnackbar('Employee updated successfully!', 'success');
    }, [refresh, handleEditClose, handleShowSnackbar]);

    const handleEmployeeCreationSuccess = useCallback(() => {
        refresh();
        handleShowSnackbar('Employeee created successfully!', 'success');
    }, [refresh, handleShowSnackbar]);

    const handleAssignmentChange = useCallback(() => {
        refresh();
    }, [refresh]);

    // Delete confirmation handler
    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteEmployee) return;

        setActionLoading(true);
        setActionError(null);

        try {
            const res = await fetch('/api/employees', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: deleteEmployee.id}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete employee');
            }

            refresh();
            handleDeleteClose();
            handleShowSnackbar('Employee deleted successfully!', 'error');
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    }, [deleteEmployee, refresh, handleDeleteClose, handleShowSnackbar]);

    // Button handler creators
    const createDepartmentAssignHandler = useCallback((employee: Employee) => () => handleDepartmentAssign(employee), [handleDepartmentAssign]);
    const createEditHandler = useCallback((employee: Employee) => () => handleEdit(employee), [handleEdit]);
    const createDeleteHandler = useCallback((employee: Employee) => () => handleDelete(employee), [handleDelete]);

    return {
        // Data state
        employees,
        loading,
        error,

        // Dialog state
        editEmployee,
        deleteEmployee,
        departmentAssignEmployee,

        // Action state
        actionLoading,
        actionError,

        // Snackbar state
        snackbar,

        // Handlers
        handleEdit,
        handleEditClose,
        handleDepartmentAssign,
        handleDepartmentAssignClose,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
        handleEditSuccess,
        handleEmployeeCreationSuccess,
        handleAssignmentChange,
        handleShowSnackbar,
        handleSnackbarClose,

        // Button handler creators
        createDepartmentAssignHandler,
        createEditHandler,
        createDeleteHandler,
    };
} 