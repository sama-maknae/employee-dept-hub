import React from 'react';
import {Alert, Box, Button} from '@mui/material';
import {useEmployeeForm} from '@/hooks/employee/useEmployeeForm';
import FormField from '@/components/common/FornField';
import ErrorAlert from '@/components/common/ErrorAlert';
import {Employee} from '@/hooks/employee/useEmployeeTable';

interface EmployeeFormProps {
    onEmployeeCreated?: () => void;
    initialValues?: Employee;
    isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({onEmployeeCreated, initialValues, isEdit}) => {
    const {
        name,
        setName,
        email,
        setEmail,
        loading,
        error,
        success,
        handleSubmit,
    } = useEmployeeForm({initialValues, isEdit, onEmployeeCreated});

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            mb={3}
            pt={2}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={400}
        >
            {error && <ErrorAlert message={error}/>}
            {success && <Alert severity="success">Employee {isEdit ? 'updated' : 'created'} successfully!</Alert>}
            <FormField
                label="Name"
                value={name}
                onChange={setName}
                loading={loading}
                required
            />
            <FormField
                label="Email"
                value={email}
                onChange={setEmail}
                loading={loading}
                required
                type="email"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
            >
                {loading ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update Employee' : 'Add Employee'}
            </Button>
        </Box>
    );
};

export default EmployeeForm;