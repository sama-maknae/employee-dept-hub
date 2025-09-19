import {useEffect, useState} from 'react';

interface Department {
    id: string;
    title: string;
    description: string | null;
}

interface Employee {
    id: string;
    name: string;
    email: string;
    employees?: Department[];
}

interface UseDepartmentAssignmentProps {
    employee: Employee | null;
    open: boolean;
    onAssignmentChange: () => void;
}

export const useDepartmentAssignment = ({employee, open, onAssignmentChange}: UseDepartmentAssignmentProps) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employeeDepartments, setEmployeeDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        if (!employee) return;

        setLoading(true);
        setError(null);
        try {
            const [departmentsRes, employeeDepartmentsRes] = await Promise.all([
                fetch('/api/departments'),
                fetch(`/api/employee-departments?employeeId=${employee.id}`)
            ]);

            if (!departmentsRes.ok || !employeeDepartmentsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [departmentsData, employeeDepartmentsData] = await Promise.all([
                departmentsRes.json(),
                employeeDepartmentsRes.json()
            ]);

            setDepartments(departmentsData);
            setEmployeeDepartments(employeeDepartmentsData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDepartment = async () => {
        if (!selectedDepartment || !employee) return;

        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/employee-departments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({employeeId: employee.id, departmentId: selectedDepartment}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to assign department');
            }

            setSelectedDepartment('');
            await fetchData();
            onAssignmentChange();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveDepartment = async (departmentId: string) => {
        if (!employee) return;

        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/employee-departments', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({employeeId: employee.id, departmentId}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to remove department');
            }

            await fetchData();
            onAssignmentChange();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    // Fetch data when dialog opens and employee changes
    const fetchDataWhenDialogOpens = () => {
        if (open && employee) {
            fetchData();
        }
    };

    useEffect(fetchDataWhenDialogOpens, [open, employee]);

    const availableDepartments = departments.filter(
        department => !employeeDepartments.some(employeeDepartment => employeeDepartment.id === department.id)
    );

    return {
        // State
        departments,
        employeeDepartments,
        selectedDepartment,
        loading,
        error,
        actionLoading,
        availableDepartments,

        // Actions
        setSelectedDepartment,
        handleAssignDepartment,
        handleRemoveDepartment,
        fetchData,
    };
}; 