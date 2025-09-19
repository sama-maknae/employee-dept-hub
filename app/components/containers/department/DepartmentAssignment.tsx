import React from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Loading from '@/components/common/Loading';
import ErrorAlert from '@/components/common/ErrorAlert';
import EmptyState from '@/components/common/EmptyState';
import {useDepartmentAssignment} from '@/hooks/employee-departments/useDepartmentAssignment';

interface Department {
    id: string;
    title: string;
    description: string | null;
}

interface Employee {
    id: string;
    name: string;
    email: string;
    departments?: Department[];
}

interface DepartmentAssignmentProps {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
    onAssignmentChange: () => void;
}

const DepartmentsAssignment: React.FC<DepartmentAssignmentProps> = ({
                                                                        open,
                                                                        onClose,
                                                                        employee,
                                                                        onAssignmentChange
                                                                    }) => {
    const {
        employeeDepartments,
        loading,
        error,
        actionLoading,
        availableDepartments,
        selectedDepartment,
        setSelectedDepartment,
        handleAssignDepartment,
        handleRemoveDepartment,
    } = useDepartmentAssignment({employee, open, onAssignmentChange});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Manage Department for {employee?.name}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Loading/>
                ) : (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, mt: 1}}>
                        {error && <ErrorAlert message={error}/>}

                        {/* Current Departments */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Current Departments ({employeeDepartments.length})
                            </Typography>
                            {employeeDepartments.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {employeeDepartments.map(department => (
                                        <Chip
                                            key={department.id}
                                            label={department.title}
                                            onDelete={() => handleRemoveDepartment(department.id)}
                                            disabled={actionLoading}
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <EmptyState
                                    message="No departments assigned yet"
                                    description="Start by assigning some departments to this employee"
                                    icon={<SchoolIcon fontSize="large"/>}
                                />
                            )}
                        </Box>

                        {/* Assign New Department */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Assign New Department
                            </Typography>
                            {availableDepartments.length > 0 ? (
                                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                                    <FormControl size="small" sx={{minWidth: 200}}>
                                        <InputLabel>Select Department</InputLabel>
                                        <Select
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            label="Select Department"
                                            disabled={actionLoading}
                                        >
                                            {availableDepartments.map(department => (
                                                <MenuItem key={department.id} value={department.id}>
                                                    {department.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignDepartment}
                                        disabled={!selectedDepartment || actionLoading}
                                        size="small"
                                    >
                                        {actionLoading ? 'Assigning...' : 'Assign'}
                                    </Button>
                                </Box>
                            ) : (
                                <EmptyState
                                    message="All departments assigned"
                                    description="This employee has been assigned to all available departments"
                                    icon={<AssignmentIcon fontSize="large"/>}
                                />
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={actionLoading}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DepartmentsAssignment;