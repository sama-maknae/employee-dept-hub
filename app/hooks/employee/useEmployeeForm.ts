import {useEffect, useState} from 'react';
import {validateEmployeeForm} from '@/utils/validation';
import {Employee} from './useEmployeeTable';

interface UseEmployeeFormProps {
    initialValues?: Employee;
    isEdit?: boolean;
    onEmployeeCreated?: () => void;
}

export function useEmployeeForm({initialValues, isEdit, onEmployeeCreated}: UseEmployeeFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [email, setEmail] = useState(initialValues?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateFormWithInitialValues = () => {
        if (initialValues) {
            setName(initialValues.name || '');
            setEmail(initialValues.email || '');
        }
    };

    useEffect(updateFormWithInitialValues, [initialValues]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        const validationError = validateEmployeeForm(name, email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEdit && initialValues) {
                response = await fetch('/api/employees', {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: initialValues.id, name, email}),
                });
            } else {
                response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, email}),
                });
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save employee');
            }

            setSuccess(true);
            if (!isEdit) {
                setName('');
                setEmail('');
            }

            if (onEmployeeCreated) onEmployeeCreated();
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Form state
        name,
        setName,
        email,
        setEmail,
        loading,
        error,
        success,

        // Form actions
        handleSubmit,
    };
}