import React from 'react';
import DataTable from "@/components/common/Table"
import {Department, useDepartmentTable} from '@/hooks/department/useDepartmentTable';
import StatusChip from '@/components/common/StatusChip';
import {formatRelativeTime} from '@/utils/dateFormat';
import {useRefresh} from '@/hooks/useRefresh';
import BusinessIcon from '@mui/icons-material/Business';
import ActionButtons, {createDeleteButton, createEditButton} from "@/components/common/ActionsButton";
import DepartmentTableToolbar from "@/components/containers/department/DepartmentTableToolbar";
import useDepartments from '@/hooks/department/useDepartment';
import {useSnackbar} from '@/hooks/useSnackBar';
import {useDepartmentActions} from '@/hooks/department/useDepartmentAction';
import FormDialog from '@/components/common/FormDialog';
import DepartmentForm from './DepartmentForm';
import ConfirmationDialog from '@/components/common/ConfirmDialog';
import NotificationSnackbar from '@/components/common/NotificationSnackBar';
import ErrorAlert from '@/components/common/ErrorAlert';

const DepartmentContainer: React.FC = () => {
    const {refreshCounter, refresh} = useRefresh();
    const {departments, loading, error} = useDepartments(refreshCounter);
    const {snackbar, showSnackbar, hideSnackbar} = useSnackbar();

    const {
        editDepartment,
        deleteDepartment,
        actionLoading,
        actionError,
        handleEdit,
        handleEditClose,
        handleEditSuccess,
        handleCreateSuccess,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    } = useDepartmentActions({
        onRefresh: refresh,
        onShowSnackbar: showSnackbar,
    });

    const {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        filteredDepartments,
        paginatedDepartments,
    } = useDepartmentTable(departments);


    if (error) return <ErrorAlert message={error}/>;

    const columns = [
        {key: 'title', label: 'Name', render: (department: Department) => <strong>{department.title}</strong>},
        {
            key: 'description',
            label: 'Description',
            render: (department: Department) => department.description || <em>No description</em>
        },
        {
            key: 'staffMembers',
            label: 'Staff Members',
            render: (department: Department) => (
                <StatusChip
                    count={department._count.employee}
                    singularLabel="employee"
                    size="small"
                    colorWhenEmpty="default"
                    colorWhenFilled="primary"
                />
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (department: Department) => department.createdAt && formatRelativeTime(department.createdAt),
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            render: (department: Department) => department.updatedAt && formatRelativeTime(department.updatedAt),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'center' as const,
            render: (department: Department) => (
                <ActionButtons
                    buttons={[
                        createEditButton(() => handleEdit(department)),
                        createDeleteButton(() => handleDelete(department)),
                    ]}
                />
            ),
        },
    ];
    return (
        <>
            <DataTable
                data={paginatedDepartments}
                columns={columns}
                page={page}
                loading={loading}
                rowsPerPage={rowsPerPage}
                totalCount={filteredDepartments.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowKey={(department) => department.id}
                emptyMessage="No department found"
                emptyDescription="Create your first department to get started"
                emptyIcon={<BusinessIcon fontSize="large"/>}
                tableProps={{'aria-label': 'department table'}}
                toolbar={
                    <DepartmentTableToolbar
                        search={search}
                        setSearch={setSearch}
                        onDepartmentCreated={handleCreateSuccess}
                        hasData={departments.length > 0}
                    />
                }
            />

            <FormDialog
                open={!!editDepartment}
                onClose={handleEditClose}
                title="Edit Department"
                maxWidth="sm"
                fullWidth
            >
                {editDepartment && (
                    <DepartmentForm
                        onDepartmentCreated={handleEditSuccess}
                        initialValues={editDepartment}
                        isEdit
                    />
                )}
            </FormDialog>

            <ConfirmationDialog
                open={!!deleteDepartment}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                title="Delete Department"
                message={<>Are you sure you want to delete department <b>{deleteDepartment?.title}</b>?</>}
                confirmText="Delete"
                confirmColor="error"
                loading={actionLoading}
                error={actionError}
                warning={
                    deleteDepartment && deleteDepartment._count.employee > 0 ? (
                        <>
                            This department has {deleteDepartment._count.employee} staff
                            member{deleteDepartment._count.employee !== 1 ? 's' : ''}.
                            Deleting it will remove all enrollments.
                        </>
                    ) : undefined
                }
            />

            <NotificationSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={hideSnackbar}
            />
        </>
    )
}

export default DepartmentContainer