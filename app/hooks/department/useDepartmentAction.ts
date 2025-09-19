import {useState} from 'react';
import {Department} from './useDepartmentTable';

interface UseDepartmentActionsProps {
    onRefresh: () => void;
    onShowSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export const useDepartmentActions = ({onRefresh, onShowSnackbar}: UseDepartmentActionsProps) => {
    const [editDepartment, setEditDepartment] = useState<Department | null>(null);
    const [deleteDepartment, setDeleteDepartment] = useState<Department | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleEdit = (department: Department) => setEditDepartment(department);
    const handleEditClose = () => setEditDepartment(null);

    const handleEditSuccess = () => {
        onRefresh();
        handleEditClose();
        onShowSnackbar('Department updated successfully!', 'success');
    };

    const handleCreateSuccess = () => {
        onRefresh();
        onShowSnackbar('Department created successfully!', 'success');
    };

    const handleDelete = (department: Department) => setDeleteDepartment(department);
    const handleDeleteClose = () => setDeleteDepartment(null);

    const handleDeleteConfirm = async () => {
        if (!deleteDepartment) return;
        setActionLoading(true);
        setActionError(null);
        try {
            const res = await fetch('/api/departments', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: deleteDepartment.id}),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete department');
            }
            onRefresh();
            handleDeleteClose();
            onShowSnackbar('Department deleted successfully!', 'success');
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    return {
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
    };
};