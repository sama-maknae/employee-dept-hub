import React from 'react';
import {Box, Button} from '@mui/material';
import FormField from '@/components/common/FornField';
import ErrorAlert from '@/components/common/ErrorAlert';
import {useDepartmentForm} from '@/hooks/department/useDepartmentForm';

interface Department {
    id: string;
    title: string;
    description: string | null;
}

interface DepartmnentFormProps {
    onDepartmentCreated?: () => void;
    initialValues?: Department;
    isEdit?: boolean;
}

const DepartmentForm: React.FC<DepartmnentFormProps> = ({onDepartmentCreated, initialValues, isEdit = false}) => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        loading,
        error,
        handleSubmit,
    } = useDepartmentForm({initialValues, isEdit, onDepartmentCreated});

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            {error && <ErrorAlert message={error}/>}

            <FormField
                label="Department Name"
                value={title}
                onChange={setTitle}
                required
                loading={loading}
                size="small"
                sx={{marginTop: 1}}
            />

            <FormField
                label="Description"
                value={description}
                onChange={setDescription}
                multiline
                rows={3}
                loading={loading}
                size="small"
            />

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{alignSelf: 'flex-start'}}
            >
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Department' : 'Create Department')}
            </Button>
        </Box>
    );
};

export default DepartmentForm;