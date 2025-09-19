import {useEffect, useState} from 'react';

interface Department {
    id: string;
    title: string;
    description: string | null;
}

interface UseDepartmentFormProps {
    initialValues?: Department;
    isEdit?: boolean;
    onDepartmentCreated?: () => void;
}

export function useDepartmentForm({initialValues, isEdit, onDepartmentCreated}: UseDepartmentFormProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const updateFormWithInitialValues = () => {
        if (initialValues) {
            setTitle(initialValues.title || '');
            setDescription(initialValues.description || '');
        }
    };

    useEffect(updateFormWithInitialValues, [initialValues]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const method = isEdit ? 'PATCH' : 'POST';
            const body = isEdit
                ? JSON.stringify({id: initialValues?.id, title: title.trim(), description: description.trim() || null})
                : JSON.stringify({title: title.trim(), description: description.trim() || null});

            const res = await fetch('/api/departments', {
                method,
                headers: {'Content-Type': 'application/json'},
                body,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} department`);
            }

            if (!isEdit) {
                setTitle('');
                setDescription('');
            }
            onDepartmentCreated?.();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Form state
        title,
        setTitle,
        description,
        setDescription,
        loading,
        error,

        // Form actions
        handleSubmit,
    };
} 