import React from 'react';
import EmployeeTableToolbar from './EmployeeTableToolbar';
import {Employee, useEmployeeTable, useEmployeeTableActions} from '@/hooks/employee/useEmployeeTable';
import EmployeeForm from './EmployeeForm';
import DepartmentsAssignment from '../department/DepartmentAssignment';
import {formatRelativeTime} from '@/utils/dateFormat';
import DataTable from '@/components/common/Table';
import FormDialog from '@/components/common/FormDialog';
import ConfirmationDialog from '@/components/common/ConfirmDialog';
import NotificationSnackbar from '@/components/common/NotificationSnackBar';
import ActionButtons, {
    createDeleteButton,
    createDepartmentButton,
    createEditButton
} from '@/components/common/ActionsButton';
import ErrorAlert from '@/components/common/ErrorAlert';
import ChipList from '@/components/common/Chiplist';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

const EmployeeContainer: React.FC = () => {
    const {
        employees,
        loading,
        error,
        editEmployee,
        deleteEmployee,
        departmentAssignEmployee,
        actionLoading,
        actionError,
        snackbar,
        handleEditClose,
        handleDepartmentAssignClose,
        handleDeleteClose,
        handleDeleteConfirm,
        handleEditSuccess,
        handleEmployeeCreationSuccess,
        handleAssignmentChange,
        handleSnackbarClose,
        createDepartmentAssignHandler,
        createEditHandler,
        createDeleteHandler,
    } = useEmployeeTableActions();

    const {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        filteredEmployees,
        paginatedEmployees,
    } = useEmployeeTable(employees);

    if (error) return <ErrorAlert message={error}/>;

    const columns = [
        {key: 'name', label: 'Name'},
        {key: 'email', label: 'Email'},
        {
            key: 'department',
            label: 'Department',
            render: (employee: Employee) => (
                <ChipList
                    items={employee.department?.map(emp => ({
                        id: emp.id,
                        label: emp.title,
                    })) || []}
                    color="primary"
                    variant="outlined"
                    size="small"
                    emptyText="No department assigned"
                    emptyDescription="Click the department icon to assign departments"
                    emptyIcon={<BusinessIcon/>}
                    useCompactEmptyState={true}
                />
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (employee: Employee) => employee.createdAt && formatRelativeTime(employee.createdAt),
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            render: (employee: Employee) => employee.updatedAt && formatRelativeTime(employee.updatedAt),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'center' as const,
            render: (employee: Employee) => (
                <ActionButtons
                    buttons={[
                        createDepartmentButton(createDepartmentAssignHandler(employee)),
                        createEditButton(createEditHandler(employee)),
                        createDeleteButton(createDeleteHandler(employee)),
                    ]}
                />
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={paginatedEmployees}
                columns={columns}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredEmployees.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowKey={(employee) => employee.id}
                emptyMessage="No employees found"
                emptyDescription="Create your first Employee to get started"
                emptyIcon={<PersonIcon fontSize="large"/>}
                tableProps={{'aria-label': 'employees table'}}
                toolbar={
                    <EmployeeTableToolbar
                        search={search}
                        setSearch={setSearch}
                        onEmployeeCreated={handleEmployeeCreationSuccess}
                        hasData={employees.length > 0}
                    />
                }
            />

            <FormDialog
                open={!!editEmployee}
                onClose={handleEditClose}
                title="Edit Employee"
                maxWidth="xs"
                fullWidth
            >
                {editEmployee && (
                    <EmployeeForm
                        onEmployeeCreated={handleEditSuccess}
                        initialValues={editEmployee}
                        isEdit
                    />
                )}
            </FormDialog>

            <ConfirmationDialog
                open={!!deleteEmployee}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                title="Delete Employee"
                message={<>Are you sure you want to delete employee <b>{deleteEmployee?.name}</b>?</>}
                confirmText="Delete"
                confirmColor="error"
                loading={actionLoading}
                error={actionError}
            />

            <DepartmentsAssignment
                open={!!departmentAssignEmployee}
                onClose={handleDepartmentAssignClose}
                employee={departmentAssignEmployee}
                onAssignmentChange={handleAssignmentChange}
            />

            <NotificationSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default EmployeeContainer; 