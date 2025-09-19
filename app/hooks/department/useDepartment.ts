import {useEffect, useState} from 'react';
import {Department} from './useDepartmentTable';
import {ZERO} from '@/components/common/const';

const useDepartments = (refresh: number = ZERO) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDepartmentsList = () => {
        let ignore = false;

        setLoading(true);
        setError(null);

        const performFetch = async () => {
            try {
                const response = await fetch('/api/departments');
                const data = await response.json();
                if (!ignore) {
                    if (Array.isArray(data)) setDepartments(data);
                    else setError(data.error || 'Failed to fetch departments');
                }
            } catch (error: unknown) {
                if (!ignore) setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        performFetch();
        return () => {
            ignore = true;
        };
    };

    useEffect(loadDepartmentsList, [refresh]);

    return {
        departments,
        loading,
        error,
        refetch: loadDepartmentsList,
    };
};

export default useDepartments;