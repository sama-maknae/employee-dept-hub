import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import EmployeeForm from "./EmployeeForm";
import FormDialog from '@/components/common/FormDialog';

interface EmployeeTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    onEmployeeCreated?: () => void;
    hasData?: boolean;
}

const EmployeeTableToolbar: React.FC<EmployeeTableToolbarProps> = ({
                                                                       search,
                                                                       setSearch,
                                                                       onEmployeeCreated,
                                                                       hasData = false,
                                                                   }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEmployeeCreatedLocal = () => {
        if (onEmployeeCreated) onEmployeeCreated();
        handleClose();
    };

    // Named function for search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    return (
        <Box
            mb={2}
            display="flex"
            flexDirection={{xs: 'column', sm: 'row'}}
            alignItems="center"
            gap={2}
            justifyContent="flex-end"
        >
            <FormDialog
                open={open}
                onClose={handleClose}
                title="Add Employee"
                maxWidth="xs"
                fullWidth
            >
                <EmployeeForm onEmployeeCreated={handleEmployeeCreatedLocal}/>
            </FormDialog>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
            >
                Add Employee
            </Button>
            {hasData && (
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by name"
                    value={search}
                    onChange={handleSearchChange}
                    sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
                    inputProps={{"aria-label": "search employee by name"}}
                />
            )}
        </Box>
    );
};

export default EmployeeTableToolbar;
